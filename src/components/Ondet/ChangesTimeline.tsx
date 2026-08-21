import { Button, Card, Modal, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import * as Diff2Html from "diff2html";
import "diff2html/bundles/css/diff2html.min.css";
import "../layout/diff2html_table_row_fixed.css";
import OndetApi from "../../api/ondet";
import {
  DiffAvailability,
  ProcessedDiffTimelineItem,
} from "../../api/types/ondetTypes";
import { OntologyPageContext } from "../../context/OntologyPageContext";
import { useContext } from "react";
import Toolkit from "../../Libs/Toolkit";

const MAX_INLINE_GIT_DIFF_BYTES = 1000000;

const ROBOT_DIFF_STATIC_HEADER_REGEX =
  /# Ontology comparison\n\n## Left\n- Ontology IRI: .+\n- Version IRI: .+\n- Loaded from: .+\n\n## Right\n- Ontology IRI: .+\n- Version IRI: .+\n- Loaded from: .+\n\n/;

const ondetApi = new (OndetApi as any)({});

const customMarkdownComponents: any = {
  h3: "h6",
  h4: "p",
  a(props) {
    const { node, children, ...rest } = props;
    return (
      <a style={{ fontSize: "14px" }} {...rest}>
        {children}
      </a>
    );
  },
};

const ChangesTimeline = () => {
  const ontologyPageContext = useContext(OntologyPageContext);
  const ontologyRawUrl =
    ontologyPageContext.ontology.versionedUrl?.startsWith("labs.etsi.org/")
      ? `https://${ontologyPageContext.ontology.versionedUrl}`
      : ontologyPageContext.ontology.versionedUrl;
  const [ontologyCommits, setOntologyCommits] = useState<ProcessedDiffTimelineItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ProcessedDiffTimelineItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [contoMarkdown, setContoMarkdown] = useState("");
  const [robotMarkdown, setRobotMarkdown] = useState("");
  const [gitDiffHtml, setGitDiffHtml] = useState("");
  const [gitDiffUrl, setGitDiffUrl] = useState("");
  const [gitDiffStatus, setGitDiffStatus] = useState<DiffAvailability | null>(null);
  const [commitsFetched, setCommitsFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gitDiffLoading, setGitDiffLoading] = useState(false);
  const [gitDiffError, setGitDiffError] = useState("");
  const [loadedGitDiffSha, setLoadedGitDiffSha] = useState("");
  const [timelineError, setTimelineError] = useState("");
  const [detailsError, setDetailsError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchOntology() {
      setCommitsFetched(true);
      setTimelineError("");
      setOntologyCommits([]);
      try {
        const data = await ondetApi.fetchOntologyCommits(ontologyRawUrl);
        setOntologyCommits(Array.isArray(data) ? data : []);
      } catch (error) {
        setTimelineError("Ontology history could not be loaded.");
      } finally {
        setCommitsFetched(false);
      }
    }

    if (ontologyRawUrl) {
      fetchOntology();
    } else {
      setTimelineError("No versioned ontology URL is available.");
    }
  }, [ontologyRawUrl]);

  const handleItemClick = async (item: ProcessedDiffTimelineItem, index: number) => {
    setLoading(true);
    setSelectedItem(item);
    setSelectedIndex(index);
    setDetailsError("");
    setGitDiffHtml("");
    setGitDiffUrl("");
    setGitDiffStatus(null);
    setGitDiffError("");
    setLoadedGitDiffSha("");

    try {
      const data = await ondetApi.fetchOntologyVersion(item.sha, false);

      setContoMarkdown(getContoDiff(data?.difference));
      setRobotMarkdown(getRobotDiff(data?.markdown, data?.status?.robot));
      setGitDiffUrl(data?.status?.git?.url || data?.gitDiffUrl || "");
      setGitDiffStatus(data?.status?.git || null);
    } catch (error) {
      setDetailsError("Diff details could not be loaded for this commit.");
      setContoMarkdown("### COnto diff could not be loaded for this commit");
      setRobotMarkdown("### ROBOT diff could not be loaded for this commit");
    } finally {
      setLoading(false);
    }
  };

  const getContoDiff = (diffArray) => {
    if (!diffArray) {
      return "### COnto diff is not available for this commit";
    }
    if (diffArray.error) {
      return diffArray.error;
    }
    if (Array.isArray(diffArray.changes) && diffArray.changes.length !== 0) {
      return formatDataForMarkdown(diffArray);
    }
    return "### COnto diff is not available for this commit";
  };

  const getRobotDiff = (markdown, robotStatus?: DiffAvailability) => {
    if (markdown?.file) {
      const splitMarkdown = markdown.file.split(ROBOT_DIFF_STATIC_HEADER_REGEX);
      return splitMarkdown[1] || markdown.file;
    }
    if (robotStatus?.message) {
      return `### ROBOT diff is not available for this commit\n\n${robotStatus.message}`;
    }
    return "### ROBOT diff is not available for this commit";
  };

  const formatUriFragment = (uri) => {
    const fragments = uri.split("/");
    let lastFragment = fragments[fragments.length - 1];
    if (lastFragment.includes("#")) {
      lastFragment = lastFragment.split("#")[1];
    }

    return `[${lastFragment}](${uri})`;
  };

  const formatDataForMarkdown = (data) => {
    let markdownContent = "";
    const groupedChanges = {};

    data.changes.forEach((change) => {
      const parts = change.split(" ");
      if (parts.length < 4) {
        return;
      }

      const ppLabel = parts[0];
      const s = formatUriFragment(parts[1]);
      const p = formatUriFragment(parts[2]);
      const o = formatUriFragment(parts[3]);

      if (!groupedChanges[ppLabel]) {
        groupedChanges[ppLabel] = [];
      }

      groupedChanges[ppLabel].push({ s, p, o });
    });

    Object.entries(groupedChanges).forEach(([ppLabel, triples]: any) => {
      markdownContent += `### ${ppLabel}\n`;

      triples.forEach((triple) => {
        markdownContent += `- ${triple.s} ${triple.p} ${triple.o}\n`;
      });

      markdownContent += "\n";
    });

    return markdownContent;
  };

  const loadGitDiff = async () => {
    if (!selectedItem || gitDiffLoading || loadedGitDiffSha === selectedItem.sha) {
      return;
    }

    setGitDiffLoading(true);
    setGitDiffError("");
    try {
      const data = await ondetApi.fetchOntologyVersion(
        selectedItem.sha,
        true,
        MAX_INLINE_GIT_DIFF_BYTES
      );
      setGitDiffUrl(data?.status?.git?.url || data?.gitDiffUrl || gitDiffUrl);
      setGitDiffStatus(data?.status?.git || gitDiffStatus);
      if (data?.gitDiff) {
        setGitDiffHtml(Diff2Html.html(data.gitDiff, {}));
        setLoadedGitDiffSha(selectedItem.sha);
      } else if (data?.status?.git?.status === "EXTERNAL_URL" && (data.status.git.url || data.gitDiffUrl)) {
        setOpen(false);
        window.open(data.status.git.url || data.gitDiffUrl, "_blank", "noopener,noreferrer");
      } else {
        setGitDiffHtml("");
        setGitDiffError(data?.status?.git?.message || "Git diff is not available for this commit.");
      }
    } catch (error) {
      setGitDiffError("Git diff could not be loaded for this commit.");
      setGitDiffHtml("");
    } finally {
      setGitDiffLoading(false);
    }
  };

  const handleOpen = () => {
    if (
      gitDiffStatus?.inlineRecommended === false &&
      (gitDiffStatus?.url || gitDiffUrl)
    ) {
      window.open(gitDiffStatus.url || gitDiffUrl, "_blank", "noopener,noreferrer");
      return;
    }

    ontologyPageContext.handleFullScreen();
    setOpen(true);
    loadGitDiff();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="tree-view-container resizable-container">
      {commitsFetched && <Spinner animation="border" variant="primary" />}
      {!commitsFetched && timelineError && (
        <h5>{timelineError}</h5>
      )}
      {!commitsFetched && !timelineError && ontologyCommits.length === 0 && (
        <>
          <h5>
            No comparable ontology versions are available in OnDeT for this
            ontology.
            <br />
            The ontology must be processed before differences can be shown.
          </h5>
        </>
      )}
      {!commitsFetched && !timelineError && ontologyCommits.length > 0 && (
        <>
          <div className="node-table-container">
            <ul>
              {ontologyCommits.map((item, index) => {
                const date = item.date;
                const message = item.message || "Ontology file version";

                return (
                  <li key={item.sha || `${item.parentSha}-${index}`}>
                    <button
                      onClick={() => handleItemClick(item, index)}
                      style={{
                        cursor: "pointer",
                        border: "none",
                        background: "transparent",
                        textAlign: "left",
                        padding: 0,
                      }}
                    >
                      <span>{date ? new Date(date).toLocaleString() : ""}</span>
                      <Card
                        style={{
                          padding: "20px",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          borderRadius: "8px",
                          backgroundColor:
                            selectedIndex === index ? "lightblue" : "",
                        }}
                      >
                        <div className="card-body">
                          <h6 className="commit-message">{message}</h6>
                        </div>
                      </Card>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="col-sm-9">
            {selectedItem && loading && <div className="isLoading"></div>}
            {selectedItem && detailsError && !loading && (
              <h5>{detailsError}</h5>
            )}
            {!selectedItem && (
              <div>
                <p>
                  After you choose one of the items from the timeline on the
                  left
                  <br />
                  You will see it's value here.
                </p>
              </div>
            )}
            {selectedItem && !loading && !detailsError && (
              <>
                <div className="sticky-top text-center">
                  This view displays available semantic differences calculated
                  by ROBOT DIFF and COntoDiff.
                  <br />
                  {ontologyRawUrl && (
                    <>
                      <a
                        href={ontologyRawUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Versioned URL
                      </a>
                      <br />
                    </>
                  )}
                  <Button variant="link" onClick={handleOpen}>
                    {" "}
                    Open syntax diff
                  </Button>
                </div>
                <div className="d-flex">
                  <div className="col-sm-6">
                    <div className="row sticky-top text-center">
                      <h3>ROBOT Diff</h3>
                    </div>
                    <div className="node-table-container">
                      <ReactMarkdown components={customMarkdownComponents}>
                        {robotMarkdown}
                      </ReactMarkdown>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="row sticky-top text-center">
                      <h3>COnto Diff</h3>
                    </div>
                    <div className="node-table-container">
                      <ReactMarkdown components={customMarkdownComponents}>
                        {contoMarkdown}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <Modal
            show={open}
            onHide={handleClose}
            size="xl"
            centered
            scrollable
            fullscreen
          >
            <Modal.Header closeButton>
              <Modal.Title>Git Diff</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {gitDiffLoading && <Spinner animation="border" variant="primary" />}
              {!gitDiffLoading && gitDiffError && <h5>{gitDiffError}</h5>}
              {!gitDiffLoading &&
                !gitDiffError &&
                Toolkit.renderDangerousHtml(gitDiffHtml)}
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  );
};

export default ChangesTimeline;
