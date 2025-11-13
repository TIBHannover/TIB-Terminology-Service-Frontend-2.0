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
  const onto = useContext(OntologyPageContext)?.ontology.ontologyJsonData;

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

          // identifiers from ANY possible fields (string or array) ➜ flattened & deduped
          const idSources = [
            used?.identifier,
            used?.identifiers,
            used?.extraIdentifier,
            used?.extraIdentifiers,
            u?.identifier,
            u?.identifiers,
          ];
          const ids = idSources
            .flatMap((x) => (Array.isArray(x) ? x : x ? [x] : []))
            .map(String)
            .filter(Boolean)
            .filter((v, i, arr) => arr.indexOf(v) === i);

          // gather usage descriptions from both places
          const usageDescs = [u?.usageDescription, used?.usageDescription]
            .filter(Boolean)
            .filter((x) => x.description)
            .map((x) => ({ description: x.description, language: x.language }));

          return (
            <div key={idx} className="border rounded p-3 mb-3 bg-white">
              {/* Usage descriptions (all sources) */}
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

              {/* Identifiers: first one as "Identifier", extras as "Additional Identifier" */}
              {ids.length > 0 && (
                <>
                  <Row label="Identifier">
                    <LinkOrText href={ids[0]}>{ids[0]}</LinkOrText>
                  </Row>

                  {ids.slice(1).map((d, i) => (
                    <Row key={i} label="Additional Identifier">
                      <LinkOrText href={d}>{d}</LinkOrText>
                    </Row>
                  ))}
                </>
              )}

              {used.homepage && (
                <div className="mb-2">
                  <LinkOrText href={used.homepage}>{used.homepage}</LinkOrText>
                </div>
              )}

              {prov.length > 0 && (
                <Row label="Provider">
                  {listWithCommas(
                    prov.map((p, i) => {
                      // provider identifiers (any field name), flattened & deduped
                      const pIdSources = [
                        p?.identifier,
                        p?.identifiers,
                        p?.extraIdentifier,
                        p?.extraIdentifiers,
                      ];
                      const pIds = pIdSources
                        .flatMap((x) => (Array.isArray(x) ? x : x ? [x] : []))
                        .map(String)
                        .filter(Boolean)
                        .filter((v, j, arr) => arr.indexOf(v) === j);

                      return (
                        <span key={`${p.label}-${i}`}>
                          {p.label}
                          {pIds.length > 0 && (
                            <>
                              {" "}
                              {listWithCommas(
                                pIds.map((id) => (
                                  <LinkOrText key={id} href={id}>
                                    {id}
                                  </LinkOrText>
                                ))
                              )}
                            </>
                          )}
                        </span>
                      );
                    })
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
