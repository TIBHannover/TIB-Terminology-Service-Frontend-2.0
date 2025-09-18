import { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { OntologyPageContext } from "../../../../context/OntologyPageContext";

const OntologyAdopters = ({ showModal, setShowModal }) => {
  const onto = useContext(OntologyPageContext)?.ontology;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const ontologyId = (onto?.ontologyId || "").toLowerCase();

  // fetch only when the modal opens
  useEffect(() => {
    if (!showModal) return;
    if (!ontologyId) {
      setData(null);
      return;
    }
    setLoading(true);
    fetch(`${process.env.PUBLIC_URL}/ontology-use/${ontologyId}.json`, { cache: "no-store" })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [ontologyId, showModal]);

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      centered
      size="lg"
      scrollable
      contentClassName="adopters-modal"
    >
      <Modal.Header closeButton>
        <h5 className="modal-title">Ontology adopters</h5>
      </Modal.Header>

      <Modal.Body>
        {loading && <div>Loading…</div>}
        {!loading && !data && <div>No adopters information available for this ontology yet.</div>}

        {!loading && data && (
          <div className="adopters-panel">
            {/* used by */}
            <div className="adopters-row">
              <span className="adopters-key">used by:</span>{" "}
              {data.usedBy?.label}
              {data.usedBy?.altLabel ? ` (${data.usedBy.altLabel})` : ""}
            </div>

            {/* identifiers */}
            {Array.isArray(data.usedBy?.identifier) && data.usedBy.identifier.length > 0 && (
              <div className="adopters-row">
                <span className="adopters-key">identifiers:</span>{" "}
                {data.usedBy.identifier
                  .map(href => (
                    <a key={href} href={href} target="_blank" rel="noopener noreferrer">
                      {href}
                    </a>
                  ))
                  .reduce((prev, curr) => (prev === null ? [curr] : [prev, ", ", curr]), null)}
              </div>
            )}

            {/* the “DKRZ (link to …)” line (no “homepage:”/“description:” labels) */}
            {(data.usedBy?.description || data.usedBy?.homepage) && (
              <div className="adopters-row">
                {data.usedBy.description}{" "}
                {data.usedBy.homepage && (
                  <>
                    (link to{" "}
                    <a href={data.usedBy.homepage} target="_blank" rel="noopener noreferrer">
                      {data.usedBy.homepage}
                    </a>
                    )
                  </>
                )}
              </div>
            )}

            {/* provider */}
            {Array.isArray(data.usedBy?.provider) && data.usedBy.provider.length > 0 && (
              <div className="adopters-row">
                <span className="adopters-key">provider:</span>{" "}
                {data.usedBy.provider
                  .map((p, i) => (
                    <span key={i}>
                      {p.label}
                      {p.identifier && (
                        <>
                          , links to{" "}
                          <a href={p.identifier} target="_blank" rel="noopener noreferrer">
                            {p.identifier}
                          </a>
                        </>
                      )}
                    </span>
                  ))
                  .reduce((prev, curr) => (prev === null ? [curr] : [prev, "; ", curr]), null)}
              </div>
            )}

            {/* contact */}
            {Array.isArray(data.usedBy?.contact) && data.usedBy.contact.length > 0 && (
              <div className="adopters-row">
                <span className="adopters-key">contact:</span>{" "}
                {data.usedBy.contact.map(c => c.mail).join(", ")}
              </div>
            )}

            {/* usage (no “description:” label) */}
            {data.usageDescription?.description && (
              <div className="adopters-row">{data.usageDescription.description}</div>
            )}

            {/* created */}
            {data.usageReportMetadata?.created && (
              <div className="adopters-row">
                <span className="adopters-key">created:</span> {data.usageReportMetadata.created}
              </div>
            )}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default OntologyAdopters;
