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
      {/* data repository */}
      <div style={{ padding: "8px 0", borderBottom: "1px dotted #e5e7eb" }}>
        <span style={{ fontWeight: 600 }}>data repository:</span>{" "}
        <span>
          {data.usedBy?.label || "—"}
          {data.usedBy?.altLabel ? ` (${data.usedBy.altLabel})` : ""}
        </span>
      </div>

      {/* identifiers */}
      {Array.isArray(data.usedBy?.identifier) && data.usedBy.identifier.length > 0 && (
        <div style={{ padding: "8px 0", borderBottom: "1px dotted #e5e7eb" }}>
          <span style={{ fontWeight: 600 }}>identifiers:</span>{" "}
          {data.usedBy.identifier.map((id, i) => (
            <span key={id}>
              <a href={id} target="_blank" rel="noopener noreferrer">{id}</a>
              {i < data.usedBy.identifier.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      )}

      {/* description + homepage (no "homepage:" label) */}
      {data.usedBy?.homepage && (
        <div style={{ padding: "8px 0", borderBottom: "1px dotted #e5e7eb" }}>
          {data.usedBy?.description || ""}
          {" ("}
          <a href={data.usedBy.homepage} target="_blank" rel="noopener noreferrer">
            link to {data.usedBy.homepage}
          </a>
          {")"}
        </div>
      )}

      {/* provider */}
      {Array.isArray(data.usedBy?.provider) && data.usedBy.provider.length > 0 && (
        <div style={{ padding: "8px 0", borderBottom: "1px dotted #e5e7eb" }}>
          <span style={{ fontWeight: 600 }}>provider:</span>{" "}
          {data.usedBy.provider.map((p, i) => (
            <span key={i}>
              {p.label}
              {p.identifier ? (
                <>
                  {", links to "}
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

      {/* contact */}
      {Array.isArray(data.usedBy?.contact) && data.usedBy.contact.length > 0 && (
        <div style={{ padding: "8px 0", borderBottom: "1px dotted #e5e7eb" }}>
          <span style={{ fontWeight: 600 }}>contact:</span>{" "}
          {data.usedBy.contact.map((c, i) => (
            <span key={i}>
              <a href={`mailto:${c.mail}`}>{c.mail}</a>
              {i < data.usedBy.contact.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      )}

      {/* usage paragraph (no label) */}
      {data.usageDescription?.description && (
        <div style={{ padding: "8px 0", borderBottom: "1px dotted #e5e7eb" }}>
          {data.usageDescription.description}
        </div>
      )}

      {/* created */}
      {data.usageReportMetadata?.created && (
        <div style={{ padding: "8px 0" }}>
          <span style={{ fontWeight: 600 }}>created:</span>{" "}
          {data.usageReportMetadata.created}
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
