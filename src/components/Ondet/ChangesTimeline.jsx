import { Button, Card, Modal, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import * as Diff2Html from "diff2html";
import "diff2html/bundles/css/diff2html.min.css";
import "../layout/diff2html_table_row_fixed.css"
import DOMPurify from "dompurify";
import PropTypes from 'prop-types';
import OndetApi from "../../api/ondet";
import { OntologyPageContext } from "../../context/OntologyPageContext";
import { useContext } from "react";

const ROBOT_DIFF_STATIC_HEADER_REGEX = /# Ontology comparison\n\n## Left\n- Ontology IRI: .+\n- Version IRI: .+\n- Loaded from: .+\n\n## Right\n- Ontology IRI: .+\n- Version IRI: .+\n- Loaded from: .+\n\n/;

const ondetApi = new OndetApi({});

const customMarkdownComponents = {
    h3: 'h6',
    h4: 'p',
    a(props) {
        const { node, ...rest } = props
        return <a href style={{ 'font-size': '14px' }} {...rest} />
    }
};

const ChangesTimeline = ({ ontologyRawUrl }) => {
    const ontologyPageContext = useContext(OntologyPageContext);
    const [ontologyCommits, setOntologyCommits] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [contoMarkdown, setContoMarkdown] = useState("");
    const [robotMarkdown, setRobotMarkdown] = useState("");
    const [gitDiffHtml, setGitDiffHtml] = useState("");
    const [commitsFetched, setCommitsFetched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        async function fetchOntology() {
            setCommitsFetched(true);
            const data = await ondetApi.fetchOntologyCommits(ontologyRawUrl);
            setOntologyCommits(data);
            setCommitsFetched(false);
        }

        fetchOntology();
    }, [ontologyRawUrl]);

    const handleItemClick = async (item, index) => {
        setLoading(true);
        setSelectedItem(item);
        setSelectedIndex(index);
        const data = await ondetApi.fetchOntologyVersion(item.sha);

        setContoMarkdown(getContoDiff(data.difference));
        setRobotMarkdown(getRobotDiff(data.markdown));
        setGitDiffHtml(getSanitisiedGitDiff(data.gitDiff));

        setLoading(false);
    };

    const getContoDiff = (diffArray) => {
        if (diffArray.hasOwnProperty("error")) {
            return diffArray.error;
        }
        if (diffArray.changes.length !== 0) {
            return formatDataForMarkdown(diffArray);
        } else {
            return "### COnto was not able to calculate the differences";
        }
    }

    const getRobotDiff = (markdown) => {
        if (markdown.hasOwnProperty("file")) {
            return markdown.file.split(ROBOT_DIFF_STATIC_HEADER_REGEX)[1];
        } else {
            return "### Robot was not able to calculate the differences";
        }
    }

    const getSanitisiedGitDiff = (gitDiff) => {
        const diff2Html = Diff2Html.html(gitDiff, {});
        return DOMPurify.sanitize(diff2Html);
    }

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

            const ppLabel = parts[0];
            const s = formatUriFragment(parts[1]);
            const p = formatUriFragment(parts[2]);
            const o = formatUriFragment(parts[3]);

            if (!groupedChanges[ppLabel]) {
                groupedChanges[ppLabel] = [];
            }

            groupedChanges[ppLabel].push({ s, p, o });
        });

        Object.entries(groupedChanges).forEach(([ppLabel, triples]) => {
            markdownContent += `### ${ppLabel}\n`;

            triples.forEach((triple) => {
                markdownContent += `- ${triple.s} ${triple.p} ${triple.o}\n`;
            });

            markdownContent += "\n";
        });

        return markdownContent;
    };

    const handleOpen = () => {
        ontologyPageContext.handleFullScreen();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="tree-view-container resizable-container">
            {commitsFetched && <Spinner animation="border" variant="primary" />}
            {!commitsFetched && ontologyCommits.length <= 1 && (
                <>
                    <h5>Ontology was not added into OnDeT even though it is in supported GIT-repository.
                        <br />
                        We are currently investigating the cause.
                    </h5>
                </>
            )}
            {!commitsFetched && ontologyCommits.length !== 1 && (
                <>
                    <div className='node-table-container'>
                        <ul>
                            {ontologyCommits.map((diff, index, arr) => {
                                if (arr[index - 1] === undefined) return null;

                                const item = arr[index - 1];
                                const date = item.commit?.committer.date || item.date;
                                const message = item.commit?.message || item.message;

                                return (
                                    <li key={item.sha}>
                                        <button
                                            onClick={() => handleItemClick(item, index)}
                                            style={{
                                                cursor: "pointer",
                                                border: "none",
                                                background: "transparent",
                                                textAlign: "left",
                                                padding: 0
                                            }}
                                        >
                                            <span>{new Date(date).toLocaleString()}</span>
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
                    <div className='col-sm-9'>
                        {selectedItem && loading && (
                            <div className="isLoading"></div>
                        )}
                        {!selectedItem && (
                            <div>
                                <p>
                                    After you choose one of the items from the timeline on the left
                                    <br />
                                    You will see it's value here.
                                </p>
                            </div>
                        )}
                        {selectedItem && !loading && (
                            <>
                                <div className='sticky-top text-center'>
                                    This view displays semantic differences calculated by
                                    COntoDiff and ROBOT DIFF.
                                    <br />
                                    If you want
                                    <Button variant="link" onClick={handleOpen}>
                                        {" "}
                                        see syntax differences
                                    </Button>
                                </div>
                                <div className="d-flex">
                                    <div className="col-sm-6">
                                        <div className='row sticky-top text-center'>
                                            <h3>ROBOT Diff</h3>
                                        </div>
                                        <div className='node-table-container'>
                                            <ReactMarkdown
                                                components={customMarkdownComponents}
                                            >{robotMarkdown}</ReactMarkdown>
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className='row sticky-top text-center'>
                                            <h3>COnto Diff</h3>
                                        </div>
                                        <div className='node-table-container'>
                                            <ReactMarkdown
                                                components={customMarkdownComponents}>{contoMarkdown}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <Modal show={open} onHide={handleClose} size="xl" centered scrollable fullscreen>
                        <Modal.Header closeButton>
                            <Modal.Title>Git Diff</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div dangerouslySetInnerHTML={{ __html: gitDiffHtml }} />
                        </Modal.Body>
                    </Modal>
                </>
            )}
        </div>
    );
};

ChangesTimeline.propTypes = {
    ontologyRawUrl: PropTypes.string.isRequired,
};

export default ChangesTimeline;
