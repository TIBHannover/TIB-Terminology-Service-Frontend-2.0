import { Button, Modal, Spinner } from "react-bootstrap";
import { useContext, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import * as Diff2Html from "diff2html";
import "diff2html/bundles/css/diff2html.min.css";
import "../layout/diff2html_table_row_fixed.css";
import "../layout/ondet.css";
import OndetApi from "../../api/ondet";
import {
  DiffAvailability,
  ProcessedDiffTimelineItem,
} from "../../api/types/ondetTypes";
import { OntologyPageContext } from "../../context/OntologyPageContext";
import Toolkit from "../../Libs/Toolkit";

const MAX_INLINE_GIT_DIFF_BYTES = 1000000;

const ROBOT_DIFF_STATIC_HEADER_REGEX =
  /# Ontology comparison\n\n## Left\n- Ontology IRI: .+\n- Version IRI: .+\n- Loaded from: .+\n\n## Right\n- Ontology IRI: .+\n- Version IRI: .+\n- Loaded from: .+\n\n/;

const ondetApi = new (OndetApi as any)({});

const customMarkdownComponents: any = {
  h1: "h4",
  h2: "h5",
  h3: "h6",
  h4: "h6",
  p(props) {
    const { node, children, ...rest } = props;
    return <p className="ondet-markdown-paragraph" {...rest}>{children}</p>;
  },
  a(props) {
    const { node, children, ...rest } = props;
    return (
      <a className="ondet-markdown-link" target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  },
};

const formatDateTime = (date?: string) => {
  if (!date) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const shortSha = (sha?: string) => sha ? sha.substring(0, 7) : "unknown";

const statusTone = (status?: string) => {
  switch (status) {
    case "AVAILABLE":
      return "success";
    case "EXTERNAL_URL":
      return "info";
    case "NOT_APPLICABLE":
      return "muted";
    case "NOT_AVAILABLE":
      return "warning";
    default:
      return "neutral";
  }
};

const normalizeStatusLabel = (status?: string) => {
  if (!status) {
    return "Unknown";
  }
  return status.replace(/_/g, " ").toLowerCase();
};

const StatusPill = ({ label, availability }: { label: string; availability?: DiffAvailability | null }) => (
  <span className={`ondet-status-pill ondet-status-${statusTone(availability?.status)}`} title={availability?.message || label}>
    <span className="ondet-status-dot" />
    {label}: {normalizeStatusLabel(availability?.status)}
  </span>
);

const EmptyState = ({ icon, title, message }: { icon: string; title: string; message: string }) => (
  <div className="ondet-empty-state">
    <i className={`bi ${icon}`} aria-hidden="true" />
    <h5>{title}</h5>
    <p>{message}</p>
  </div>
);

const DiffPanel = ({
  title,
  subtitle,
  icon,
  availability,
  markdown,
}: {
  title: string;
  subtitle: string;
  icon: string;
  availability?: DiffAvailability | null;
  markdown: string;
}) => (
  <section className="ondet-diff-panel">
    <header className="ondet-panel-header">
      <div className="ondet-panel-title-wrap">
        <span className="ondet-panel-icon"><i className={`bi ${icon}`} aria-hidden="true" /></span>
        <div>
          <h5>{title}</h5>
          <span>{subtitle}</span>
        </div>
      </div>
      <StatusPill label={title} availability={availability} />
    </header>
    {availability?.message && availability.status !== "AVAILABLE" && (
      <div className={`ondet-message ondet-message-${statusTone(availability.status)}`}>
        {availability.message}
      </div>
    )}
    <div className="ondet-markdown-surface">
      <ReactMarkdown components={customMarkdownComponents}>{markdown}</ReactMarkdown>
    </div>
  </section>
);

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
  const [robotStatus, setRobotStatus] = useState<DiffAvailability | null>(null);
  const [contoStatus, setContoStatus] = useState<DiffAvailability | null>(null);
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

  const selectedMessage = selectedItem?.message || "Ontology file version";
  const timelineCountLabel = useMemo(() => {
    if (ontologyCommits.length === 1) {
      return "1 comparable version";
    }
    return `${ontologyCommits.length} comparable versions`;
  }, [ontologyCommits.length]);

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
    setRobotStatus(null);
    setContoStatus(null);
    setGitDiffError("");
    setLoadedGitDiffSha("");

    try {
      const data = await ondetApi.fetchOntologyVersion(item.sha, false);

      setContoMarkdown(getContoDiff(data?.difference));
      setRobotMarkdown(getRobotDiff(data?.markdown, data?.status?.robot));
      setRobotStatus(data?.status?.robot || null);
      setContoStatus(data?.status?.conto || null);
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
    <div className="ondet-workspace">
      <aside className="ondet-sidebar">
        <div className="ondet-sidebar-header">
          <div>
            <span className="ondet-eyebrow">OnDeT history</span>
            <h4>Ontology changes</h4>
          </div>
          <span className="ondet-count">{timelineCountLabel}</span>
        </div>

        {commitsFetched && (
          <div className="ondet-loading-block">
            <Spinner animation="border" variant="primary" />
            <span>Loading ontology history</span>
          </div>
        )}

        {!commitsFetched && timelineError && (
          <EmptyState icon="bi-exclamation-triangle" title="History unavailable" message={timelineError} />
        )}

        {!commitsFetched && !timelineError && ontologyCommits.length === 0 && (
          <EmptyState
            icon="bi-clock-history"
            title="No comparable versions"
            message="This ontology needs to be processed before adjacent version differences can be shown."
          />
        )}

        {!commitsFetched && !timelineError && ontologyCommits.length > 0 && (
          <ol className="ondet-timeline-list">
            {ontologyCommits.map((item, index) => {
              const message = item.message || "Ontology file version";
              const selected = selectedIndex === index;

              return (
                <li key={item.sha || `${item.parentSha}-${index}`}>
                  <button
                    className={`ondet-timeline-item ${selected ? "is-selected" : ""}`}
                    onClick={() => handleItemClick(item, index)}
                    type="button"
                    title={message}
                  >
                    <span className="ondet-timeline-marker" />
                    <span className="ondet-timeline-date">{formatDateTime(item.date)}</span>
                    <span className="ondet-timeline-message">{message}</span>
                    <span className="ondet-timeline-sha">{shortSha(item.parentSha || item.sha)}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </aside>

      <main className="ondet-detail-pane">
        {selectedItem && loading && (
          <div className="ondet-detail-loading">
            <Spinner animation="border" variant="primary" />
            <span>Loading diff details</span>
          </div>
        )}

        {selectedItem && detailsError && !loading && (
          <EmptyState icon="bi-exclamation-circle" title="Diff details unavailable" message={detailsError} />
        )}

        {!selectedItem && !loading && (
          <EmptyState
            icon="bi-diagram-3"
            title="Select a version"
            message="Choose a commit from the timeline to compare ROBOT, COnto, and syntax diff results."
          />
        )}

        {selectedItem && !loading && !detailsError && (
          <>
            <section className="ondet-commit-summary">
              <div className="ondet-summary-main">
                <span className="ondet-eyebrow">Selected comparison</span>
                <h4>{selectedMessage}</h4>
                <div className="ondet-summary-meta">
                  <span><i className="bi bi-calendar-event" aria-hidden="true" /> {formatDateTime(selectedItem.date)}</span>
                  <span><i className="bi bi-git" aria-hidden="true" /> {shortSha(selectedItem.parentSha || selectedItem.sha)}</span>
                </div>
              </div>
              <div className="ondet-summary-actions">
                {ontologyRawUrl && (
                  <a className="ondet-link-button" href={ontologyRawUrl} target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-box-arrow-up-right" aria-hidden="true" /> Versioned URL
                  </a>
                )}
                <Button className="ondet-primary-action" onClick={handleOpen}>
                  <i className="bi bi-code-slash" aria-hidden="true" /> Syntax diff
                </Button>
              </div>
            </section>

            <div className="ondet-status-row">
              <StatusPill label="ROBOT" availability={robotStatus} />
              <StatusPill label="COnto" availability={contoStatus} />
              <StatusPill label="Git" availability={gitDiffStatus} />
            </div>

            <div className="ondet-diff-grid">
              <DiffPanel
                title="ROBOT"
                subtitle="Axiom-oriented semantic diff"
                icon="bi-braces"
                availability={robotStatus}
                markdown={robotMarkdown}
              />
              <DiffPanel
                title="COnto"
                subtitle="Change-model semantic diff"
                icon="bi-diagram-2"
                availability={contoStatus}
                markdown={contoMarkdown}
              />
            </div>
          </>
        )}
      </main>

      <Modal
        show={open}
        onHide={handleClose}
        size="xl"
        centered
        scrollable
        fullscreen
        dialogClassName="ondet-git-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-code-square" aria-hidden="true" /> Syntax diff
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {gitDiffLoading && (
            <div className="ondet-detail-loading">
              <Spinner animation="border" variant="primary" />
              <span>Loading syntax diff</span>
            </div>
          )}
          {!gitDiffLoading && gitDiffError && (
            <EmptyState icon="bi-file-earmark-x" title="Syntax diff unavailable" message={gitDiffError} />
          )}
          {!gitDiffLoading && !gitDiffError && Toolkit.renderDangerousHtml(gitDiffHtml)}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ChangesTimeline;
