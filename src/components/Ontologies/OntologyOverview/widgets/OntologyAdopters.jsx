import { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { OntologyPageContext } from "../../../../context/OntologyPageContext";

const OntologyAdopters = ({ showModal, setShowModal }) => {
  const onto = useContext(OntologyPageContext)?.ontology;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const ontologyId = (onto?.ontologyId || "").toLowerCase();

  useEffect(() => {
    if (!ontologyId) return;
    setLoading(true);
    fetch(`${process.env.PUBLIC_URL}/ontology-use/${ontologyId}.json`, { cache: "no-store" })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [ontologyId, showModal]);

  return (
    <Modal show={showModal} fullscreen onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <h5 className="modal-title">Ontology adopters</h5>
      </Modal.Header>

      <Modal.Body>
        {loading && <div>Loading…</div>}
        {!loading && !data && <div>No adopters info available for this ontology yet.</div>}
        {!loading && data && (
          <div className="p-3 border rounded bg-white">
            <div style={{ padding: "8px 0", borderBottom: "1px dotted #e5e7eb" }}>
              <strong>Used by:</strong>{" "}
              {data.usedBy?.label} {data.usedBy?.altLabel ? `(${data.usedBy.altLabel})` : ""}
            </div>

            <div style={{ padding: "8px 0", borderBottom: "1px dotted #e5e7eb" }}>
              <strong>Type:</strong> {data.usedBy?.type}
            </div>

            {Array.isArray(data.usedBy?.identifier) && data.usedBy.identifier.length > 0 && (
              <div style={{ padding: "8px 0", borderBottom: "1px dotted #e5e7eb" }}>
                <strong>Identifiers:</strong>{" "}
                {data.usedBy.identifier.map((id, i) => (
                  <span key={id}>
                    <a href={id} target="_blank" rel="noopener noreferrer">{id}</a>
                    {i < data.usedBy.identifier.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            )}

            {data.usedBy?.homepage && (
              <div style={{ padding: "8px 0", borderBottom: "1px dotted #e5e7eb" }}>
                <strong>Homepage:</strong>{" "}
                <a href={data.usedBy.homepage} target="_blank" rel="noopener noreferrer">
                  {data.usedBy.homepage}
                </a>
              </div>
            )}

            {Array.isArray(data.usedBy?.provider) && data.usedBy.provider.length > 0 && (
              <div style={{ padding: "8px 0", borderBottom: "1px dotted #e5e7eb" }}>
                <strong>Provider:</strong>{" "}
                {data.usedBy.provider.map((p, i) => (
                  <span key={i}>
                    {p.label}
                    {p.identifier ? (
                      <>
                        {" — "}
                        <a href={p.identifier} target="_blank" rel="noopener noreferrer">
                          {p.identifier}
                        </a>
                      </>
                    ) : null}
                    {i < data.usedBy.provider.length - 1 ? "; " : ""}
                  </span>
                ))}
              </div>
            )}

            {Array.isArray(data.usedBy?.contact) && data.usedBy.contact.length > 0 && (
              <div style={{ padding: "8px 0", borderBottom: "1px dotted #e5e7eb" }}>
                <strong>Contact:</strong>{" "}
                {data.usedBy.contact.map((c, i) => (
                  <span key={i}>
                    {c.mail}
                    {i < data.usedBy.contact.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            )}

            {data.usageDescription?.description && (
              <div style={{ padding: "8px 0", borderBottom: "1px dotted #e5e7eb" }}>
                <strong>Usage:</strong> {data.usageDescription.description}
              </div>
            )}

            {data.usageReportMetadata?.created && (
              <div style={{ padding: "8px 0" }}>
                <strong>Reported:</strong> {data.usageReportMetadata.created}
              </div>
            )}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
      </Modal.Footer>
    </Modal>
  );
};

export default OntologyAdopters;
