import React, { useContext, useEffect, useState } from "react";
import { OntologyPageContext } from "../../context/OntologyPageContext";
import { readOntologyIriStatus, Ontology, OntologyDetail } from "../../api/iriChecker";
import "../layout/iriChecker.css";

const formatNumber = (value?: number) => new Intl.NumberFormat().format(value ?? 0);

const formatPercent = (value: number) =>
    `${new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 1,
        minimumFractionDigits: value > 0 && value < 1 ? 1 : 0,
    }).format(value)}%`;

const getStatusClass = (status?: string) =>
    status?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "unknown";

const getStatusLabel = (status?: string) => {
    switch (status) {
        case "blocked_by_challenge":
            return "Blocked by challenge";
        case "client_error":
            return "Client error";
        case "redirect_loop":
            return "Redirect loop";
        case "too_many_redirects":
            return "Too many redirects";
        case "redirected_up":
            return "Redirected";
        case "down":
            return "Down";
        case "timeout":
            return "Timeout";
        case "rate_limited":
            return "Rate limited";
        case "host_unreachable":
            return "Host unreachable";
        case "up":
            return "Up";
        default:
            return status || "Unknown";
    }
};

const getHealthTone = (down: number, total: number) => {
    if (total === 0 || down === 0) {
        return "success";
    }
    if ((down / total) * 100 <= 5) {
        return "warning";
    }
    return "danger";
};

const StatusBadge = ({ detail }: { detail: OntologyDetail }) => (
    <span className={`iri-checker-status-badge iri-checker-status-${getStatusClass(detail.status)}`}>
        <span className="iri-checker-status-dot" />
        {getStatusLabel(detail.status)}
    </span>
);

const formatDateTime = (value?: string) => {
    if (!value) {
        return "N/A";
    }

    return new Date(value).toLocaleString();
};

const getTermTreeUrl = (ontologyId?: string, iri?: string) => {
    if (!ontologyId || !iri) {
        return "";
    }

    const baseUrl = (process.env.REACT_APP_PUBLIC_URL || process.env.REACT_APP_PROJECT_SUB_PATH || "").replace(/\/$/, "");
    return `${baseUrl}/ontologies/${encodeURIComponent(ontologyId)}/terms?iri=${encodeURIComponent(iri)}`;
};

const escapeCSVValue = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;

const TermTreeLink = ({
    ontologyId,
    detail,
}: {
    ontologyId?: string;
    detail: OntologyDetail;
}) => {
    const termUrl = getTermTreeUrl(ontologyId, detail.iri);
    const termName = detail.termName ?? "Unknown term";

    if (!termUrl) {
        return <>{termName}</>;
    }

    return (
        <a
            className="iri-checker-term-link"
            href={termUrl}
            rel="noreferrer"
            target="_blank"
        >
            {termName}
        </a>
    );
};

const StatusExplanationModal = ({ onClose }: { onClose: () => void }) => (
    <div className="iri-checker-modal-backdrop" role="presentation">
        <section
            aria-labelledby="iri-checker-status-help-title"
            aria-modal="true"
            className="iri-checker-modal"
            role="dialog"
        >
            <header className="iri-checker-modal-header">
                <div>
                    <span className="iri-checker-eyebrow">IRI checker guide</span>
                    <h5 id="iri-checker-status-help-title">How to read these statuses</h5>
                </div>
                <button
                    aria-label="Close status explanation"
                    className="iri-checker-modal-close"
                    onClick={onClose}
                    type="button"
                >
                    x
                </button>
            </header>
            <div className="iri-checker-modal-body">
                <div className="iri-checker-status-guide-grid">
                    <article>
                        <h6>Down</h6>
                        <p>The remote server responded, but the IRI did not resolve successfully, for example with a 404 response.</p>
                    </article>
                    <article>
                        <h6>Blocked by challenge</h6>
                        <p>The host returned an automated-client challenge, such as a Cloudflare challenge, so the checker could not verify the IRI like a normal browser user.</p>
                    </article>
                    <article>
                        <h6>Timeout</h6>
                        <p>The host did not respond within the checker timeout.</p>
                    </article>
                    <article>
                        <h6>Rate limited</h6>
                        <p>The host returned HTTP 429 or asked the checker to slow down before sending more requests.</p>
                    </article>
                    <article>
                        <h6>Redirect issues</h6>
                        <p>Redirect loop and too many redirects mean the IRI never reached a final resolvable target.</p>
                    </article>
                    <article>
                        <h6>Client or host error</h6>
                        <p>Client error and host unreachable are connection-level failures while contacting the remote host.</p>
                    </article>
                </div>
                <div className="iri-checker-modal-note">
                    <h6>Host circuit breaker</h6>
                    <p>The backend checks an IRI with HEAD first, then retries with GET when needed, and may try an HTML fallback for some 404 responses. When you see "Host circuit breaker is open", the backend has temporarily stopped sending more requests to that host after repeated timeout or client errors. This protects the scan from spending too much time on a failing host and avoids overloading remote services.</p>
                </div>
            </div>
        </section>
    </div>
);

const IriChecker: React.FC = () => {
    const ontologyPageContext: any = useContext(OntologyPageContext);
    const ontologyId = ontologyPageContext?.ontology?.ontologyId;
    const [data, setData] = useState<Ontology[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusHelpOpen, setStatusHelpOpen] = useState(false);

    useEffect(() => {
        if (!ontologyId) return;
        setLoading(true);
        setError(null);
        readOntologyIriStatus(ontologyId)
            .then((res) => {
                if (!res) {
                    setError("Failed to load IRI checker data.");
                    setData(null);
                    return;
                }
                setData(res);
            })
            .catch((e) => {
                console.error(e);
                setError("Failed to load IRI checker data.");
                setData(null);
            })
            .finally(() => setLoading(false));
    }, [ontologyId, ontologyPageContext?.ontoLang]);

    if (loading) {
        return (
            <div className="iri-checker-empty-state">
                <div className="isLoading"></div>
                <h5>Checking IRI health</h5>
                <p>The latest resolver status is being loaded.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="iri-checker-empty-state iri-checker-empty-state-danger">
                <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
                <h5>IRI checker could not be loaded</h5>
                <p>{error}</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="iri-checker-empty-state">
                <i className="fa fa-info-circle" aria-hidden="true"></i>
                <h5>No IRI checker data available</h5>
                <p>This ontology does not have resolver results yet.</p>
            </div>
        );
    }

    const primary = data[0];
    const details = primary.ontologyDetails ?? [];
    const up = primary.numberOfUpIRI ?? 0;
    const down = primary.numberOfDownIRI ?? 0;
    const challenged = primary.numberOfChallengedIRI ?? 0;
    const timeout = primary.numberOfTimeoutIRI ?? 0;
    const errors = primary.numberOfErrorIRI ?? 0;
    const rateLimited = primary.numberOfRateLimitedIRI ?? 0;
    const total = primary.totalNumberOfIRI ?? (up + down);
    const denominator = Math.max(1, total);
    const pctDown = Math.round(((down / denominator) * 100) * 100) / 100;
    const pctUp = Math.max(0, Math.round(((up / denominator) * 100) * 100) / 100);
    const pidPatterns = primary.pidPatterns;
    const healthTone = getHealthTone(down, total);
    const attentionCount = down + challenged + rateLimited + timeout + errors;
    const healthLabel = attentionCount === 0
        ? "All checked IRIs resolve"
        : `${formatNumber(attentionCount)} IRI${attentionCount === 1 ? "" : "s"} need review`;

    const downloadCSV = () => {
        const rows = details.map((detail) => [
            primary.ontologyId,
            detail.iri,
            detail.termName ?? "",
            getStatusLabel(detail.status),
            detail.serverStatus ?? "",
            formatDateTime(detail.unresolvableSince),
            detail.reason ?? "",
            detail.checkedUrl ?? "",
            detail.finalUrl ?? "",
            getTermTreeUrl(primary.ontologyId, detail.iri),
        ]);
        const header = [
            "Ontology ID",
            "IRI",
            "Term",
            "Status",
            "HTTP",
            "Unresolvable Since",
            "Reason",
            "Checked URL",
            "Final URL",
            "Term Tree URL",
        ];
        const csvContent = [header, ...rows]
            .map((row) => row.map(escapeCSVValue).join(","))
            .join("\n");
        const csvData = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
        const link = document.createElement("a");
        link.setAttribute("href", csvData);
        link.setAttribute("download", `${primary.ontologyId}_iri_checker_details.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="iri-checker-workspace">
            <section className={`iri-checker-overview iri-checker-overview-${healthTone}`}>
                <div className="iri-checker-overview-main">
                    <span className="iri-checker-eyebrow">IRI checker</span>
                    <h4>{healthLabel}</h4>
                    <p title={primary.ontologyFileLocation}>
                        {primary.ontologyFileLocation || "No ontology IRI location was reported."}
                    </p>
                </div>

                <div className="iri-checker-score-card">
                    <span className="iri-checker-score">{formatPercent(pctDown)}</span>
                    <span className="iri-checker-score-label">unresolved</span>
                    <div className="iri-checker-bar" title={`Resolvable ${formatPercent(pctUp)}; unresolved ${formatPercent(pctDown)}`}>
                        <div className="iri-checker-bar-up" style={{ width: `${pctUp}%` }} />
                        <div className="iri-checker-bar-down" style={{ width: `${pctDown}%` }} />
                    </div>
                </div>
            </section>

            <section className="iri-checker-metrics" aria-label="IRI checker summary">
                <div className="iri-checker-metric">
                    <span>Total IRIs</span>
                    <strong>{formatNumber(total)}</strong>
                </div>
                <div className="iri-checker-metric iri-checker-metric-success">
                    <span>Resolvable</span>
                    <strong>{formatNumber(up)}</strong>
                </div>
                <div className="iri-checker-metric iri-checker-metric-danger">
                    <span>Unresolved</span>
                    <strong>{formatNumber(down)}</strong>
                </div>
                <div className="iri-checker-metric iri-checker-metric-warning">
                    <span>Challenged</span>
                    <strong>{formatNumber(challenged)}</strong>
                </div>
                <div className="iri-checker-metric iri-checker-metric-warning">
                    <span>Rate limited</span>
                    <strong>{formatNumber(rateLimited)}</strong>
                </div>
                <div className="iri-checker-metric">
                    <span>Timeout/Error</span>
                    <strong>{formatNumber(timeout + errors)}</strong>
                </div>
                <div className="iri-checker-metric">
                    <span>PID patterns</span>
                    <strong>{pidPatterns && Object.entries(pidPatterns).length > 0 ? formatNumber(Object.entries(pidPatterns).length) : "-"}</strong>
                </div>
            </section>

            {pidPatterns && Object.entries(pidPatterns).length > 0 && (
                <section className="iri-checker-patterns" aria-label="PID patterns">
                    <span className="iri-checker-eyebrow">Detected PID patterns</span>
                    <div className="iri-checker-pattern-list">
                        {Object.entries(pidPatterns).map(([key, value]) => (
                            <span className="iri-checker-pattern" key={key}>
                                {key}
                                <strong>{formatNumber(value)}</strong>
                            </span>
                        ))}
                    </div>
                </section>
            )}

            <section className="iri-checker-details-panel">
                <header className="iri-checker-panel-header">
                    <div>
                        <span className="iri-checker-eyebrow">Attention needed</span>
                        <h5>IRI status details</h5>
                    </div>
                    <div className="iri-checker-panel-actions">
                        <button
                            className="iri-checker-secondary-button"
                            type="button"
                            onClick={() => setStatusHelpOpen(true)}
                        >
                            Status meanings
                        </button>
                        <button
                            className="iri-checker-export-button"
                            type="button"
                            onClick={downloadCSV}
                            disabled={details.length === 0}
                        >
                            Download CSV
                        </button>
                        <span className="iri-checker-count">{formatNumber(details.length)} listed</span>
                    </div>
                </header>

                {details.length === 0 ? (
                    <div className="iri-checker-empty-state iri-checker-empty-state-compact">
                        <i className="fa fa-check-circle" aria-hidden="true"></i>
                        <h5>No IRI issues reported</h5>
                        <p>The checker did not return any problematic IRI records.</p>
                    </div>
                ) : (
                    <div className="table-responsive iri-checker-table-scroll">
                        <table className="table iri-checker-details-table">
                        <colgroup>
                            <col className="iri-checker-col-iri" />
                            <col className="iri-checker-col-term" />
                            <col className="iri-checker-col-status" />
                            <col className="iri-checker-col-http" />
                            <col className="iri-checker-col-date" />
                            <col className="iri-checker-col-reason" />
                            <col className="iri-checker-col-url" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>IRI</th>
                                <th>Term</th>
                                <th>Status</th>
                                <th>HTTP</th>
                                <th>Unresolvable Since</th>
                                <th>Reason</th>
                                <th>Checked URL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details.map((d, i) => (
                                <tr key={`${d.iri}-${i}`}>
                                    <td className="iri-checker-iri-cell">
                                        <div className="iri-checker-iri-inner">
                                            <a
                                                className="iri-checker-iri-text"
                                                href={d.iri}
                                                rel="noreferrer"
                                                target="_blank"
                                                title={d.iri}
                                            >
                                                {d.iri}
                                            </a>
                                        </div>
                                    </td>
                                    <td className="iri-checker-term-cell" title={d.termName}>
                                        <TermTreeLink ontologyId={primary.ontologyId} detail={d} />
                                    </td>
                                    <td><StatusBadge detail={d} /></td>
                                    <td><span className="iri-checker-http-code">{d.serverStatus ?? "-"}</span></td>
                                    <td className="iri-checker-term-cell" title={formatDateTime(d.unresolvableSince)}>{formatDateTime(d.unresolvableSince)}</td>
                                    <td className="iri-checker-term-cell" title={d.reason}>{d.reason ?? "-"}</td>
                                    <td className="iri-checker-iri-cell">
                                        <div className="iri-checker-iri-inner">
                                            <a
                                                className="iri-checker-iri-text"
                                                href={d.finalUrl || d.checkedUrl || d.iri}
                                                rel="noreferrer"
                                                target="_blank"
                                                title={d.finalUrl || d.checkedUrl || d.iri}
                                            >
                                                {d.finalUrl || d.checkedUrl || "-"}
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                )}
            </section>
            {statusHelpOpen && <StatusExplanationModal onClose={() => setStatusHelpOpen(false)} />}
        </div>
    );
};

export default IriChecker;
