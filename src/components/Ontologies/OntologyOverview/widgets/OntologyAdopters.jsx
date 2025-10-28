import { useContext, useMemo } from "react";
import Modal from "react-bootstrap/Modal";
import { OntologyPageContext } from "../../../../context/OntologyPageContext";

const LinkOrText = ({ href, children }) =>
  href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children ?? href}
    </a>
  ) : (
    <>{children}</>
  );

const Row = ({ label, children }) => (
  <div className="mb-2">
    <strong>{label}: </strong>
    <span>{children}</span>
  </div>
);

const listWithCommas = (arr) =>
  arr.map((el, i) => (
    <span key={i}>
      {el}
      {i < arr.length - 1 ? ", " : ""}
    </span>
  ));

export default function OntologyAdopters({ showModal, setShowModal }) {
  const onto = useContext(OntologyPageContext)?.ontology;

  // debug
  console.log("[Adopters] ontologyId =", onto?.ontologyId);
  console.log("[Adopters] ontology_use =", JSON.stringify(onto?.ontology_use, null, 2));

  const adopters = useMemo(() => {
    if (!Array.isArray(onto?.ontology_use)) return [];
    return onto.ontology_use.filter((u) => u && (u.usedBy || u.usageDescription));
  }, [onto]);

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <h5 className="modal-title">Ontology adopters</h5>
      </Modal.Header>

      <Modal.Body>
        {!adopters.length && (
          <div>No adopters information available for this ontology yet.</div>
        )}

        {adopters.map((u, idx) => {
          const used = u.usedBy || {};
          const prov = Array.isArray(used.provider) ? used.provider : [];
          const contacts = Array.isArray(used.contact)
            ? used.contact.map((c) => c?.mail).filter(Boolean)
            : [];
          const ids = Array.isArray(used.identifier) ? used.identifier : [];

          // --- NEW: gather usage descriptions from both possible places
          const usageDescs = [
            u?.usageDescription,
            used?.usageDescription, // just in case some records put it here
          ]
            .filter(Boolean)
            .filter((x) => x.description) // only show if we actually have text
            .map((x) => ({ description: x.description, language: x.language }));

          return (
            <div key={idx} className="border rounded p-3 mb-3 bg-white">
              {/* Usage descriptions at the TOP of each block (all sources) */}
              {usageDescs.length > 0 && (
                <div className="mb-2">
                  {usageDescs.map((ud, i) => (
                    <div key={i}>
                      {ud.description}
                      {ud.language ? <span className="ms-1">({ud.language})</span> : null}
                    </div>
                  ))}
                </div>
              )}

              {(used.label || used.altLabel) && (
                <Row label="Used By">
                  {used.label}
                  {used.altLabel ? ` (${used.altLabel})` : ""}
                </Row>
              )}

              {ids.length > 0 && (
                <Row label="Identifiers">
                  {listWithCommas(
                    ids.map((d) => (
                      <LinkOrText key={d} href={d}>
                        {d}
                      </LinkOrText>
                    ))
                  )}
                </Row>
              )}

              {used.homepage && (
                <div className="mb-2">
                  <LinkOrText href={used.homepage}>{used.homepage}</LinkOrText>
                </div>
              )}

              {prov.length > 0 && (
                <Row label="Provider">
                  {listWithCommas(
                    prov.map((p, i) => (
                      <span key={`${p.label}-${i}`}>
                        {p.label}
                        {p.identifier ? (
                          <>
                            {", links to "}
                            <LinkOrText href={p.identifier}>{p.identifier}</LinkOrText>
                          </>
                        ) : null}
                      </span>
                    ))
                  )}
                </Row>
              )}

              {contacts.length > 0 && (
                <Row label="Contact">{listWithCommas(contacts)}</Row>
              )}

              {u.usageReportMetadata?.created && (
                <Row label="Created">{u.usageReportMetadata.created}</Row>
              )}
            </div>
          );
        })}
      </Modal.Body>

      <Modal.Footer>
        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}
