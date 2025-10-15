import { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { OntologyPageContext } from "../../../../context/OntologyPageContext";

const OntologyAdopters = ({ showModal, setShowModal }) => {
  const onto = useContext(OntologyPageContext)?.ontology;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // feature flag  ichrak 
  const showAdopters = process.env.REACT_APP_SHOW_ONTOLOGY_ADOPTERS === "true";  

  const ontologyId = (onto?.ontologyId || "").toLowerCase();

  useEffect(() => { 
    // if not true no fetch 
    if (!showAdopters) return;  
    if (!ontologyId) return;
    setLoading(true);
    fetch(`${process.env.PUBLIC_URL}/ontology-use/${ontologyId}.json`, { cache: "no-store" })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [ontologyId, showModal,showAdopters]);

    if (!showAdopters) return null;  
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <h5 className="modal-title">Ontology adopters</h5>
      </Modal.Header>

      <Modal.Body>
        {loading && <div>Loading…</div>}
        {!loading && !data && <div>No adopters info available for this ontology yet.</div>}
        {!loading && data && (
          <div className="p-3 border rounded bg-white">

            {/* --- Usage description at top --- */}
            {data.usageDescription?.description && (
              <div style={{ padding: "8px 0", borderBottom: "1px dotted #e5e7eb" }}>
                {data.usageDescription.description}
              </div>
            )}

            {/* --- Used by --- */}
            <div style={{ padding: "8px 0", borderBottom: "1px dotted #e5e7eb" }}>
              <strong>used by:</strong>{" "}
              {data.usedBy?.homepage ? (
                <a href={data.usedBy.homepage} target="_blank" rel="noopener noreferrer">
                  {data.usedBy?.label} {data.usedBy?.altLabel ? `(${data.usedBy.altLabel})` : ""}
                </a>
              ) : (
                <>
                  {data.usedBy?.label} {data.usedBy?.altLabel ? `(${data.usedBy.altLabel})` : ""}
                </>
              )}
            </div>

            {/* --- Identifiers --- */}
            {Array.isArray(data.usedBy?.identifier) && data.usedBy.identifier.length > 0 && (
              <div style={{ padding: "8px 0", borderBottom: "1px dotted #e5e7eb" }}>
                <strong>identifiers:</strong>{" "}
                {data.usedBy.identifier.map((id, i) => (
                  <span key={id}>
                    <a href={id} target="_blank" rel="noopener noreferrer">{id}</a>
                    {i < data.usedBy.identifier.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            )}

            {/* --- Provider --- */}
            {Array.isArray(data.usedBy?.provider) && data.usedBy.provider.length > 0 && (
              <div style={{ padding: "8px 0", borderBottom: "1px dotted #e5e7eb" }}>
                <strong>provider:</strong>{" "}
                {data.usedBy.provider.map((p, i) => (
                  <span key={i}>
                    {p.identifier ? (
                      <a href={p.identifier} target="_blank" rel="noopener noreferrer">
                        {p.label}
                      </a>
                    ) : (
                      p.label
                    )}
                    {i < data.usedBy.provider.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            )}

            {/* --- Contact --- */}
            {Array.isArray(data.usedBy?.contact) && data.usedBy.contact.length > 0 && (
              <div style={{ padding: "8px 0", borderBottom: "1px dotted #e5e7eb" }}>
                <strong>contact:</strong>{" "}
                {data.usedBy.contact.map((c, i) => (
                  <span key={i}>
                    {c.mail}
                    {i < data.usedBy.contact.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            )}

            {/* --- Created --- */}
            {data.usageReportMetadata?.created && (
              <div style={{ padding: "8px 0" }}>
                <strong>created:</strong> {data.usageReportMetadata.created}
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
