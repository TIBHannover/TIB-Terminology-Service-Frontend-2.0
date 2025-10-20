import { useContext } from "react";
import Modal from "react-bootstrap/Modal";
import { OntologyPageContext } from "../../../../context/OntologyPageContext";

const Row = ({ label, children }) => (
  <div className="mb-2 pb-2" style={{ borderBottom: "1px dotted #e5e7eb" }}>
    {label && <strong className="text-capitalize">{label}: </strong>}
    {children}
  </div>
);

const asArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

const LinkList = ({ urls }) => {
  const list = asArray(urls).filter(Boolean);
  if (!list.length) return null;
  return (
    <>
      {list.map((u, i) => (
        <span key={u}>
          <a href={u} target="_blank" rel="noopener noreferrer">
            {u}
          </a>
          {i < list.length - 1 ? ", " : ""}
        </span>
      ))}
    </>
  );
};

const ProviderList = ({ providers }) => {
  const list = asArray(providers);
  if (!list.length) return null;
  return (
    <>
      {list.map((p, i) => {
        const label = p?.label || "";
        const id = p?.identifier;
        return (
          <span key={`${label}-${i}`}>
            {label}
            {id ? (
              <>
                {", "}links to{" "}
                <a href={id} target="_blank" rel="noopener noreferrer">
                  {id}
                </a>
              </>
            ) : null}
            {i < list.length - 1 ? "; " : ""}
          </span>
        );
      })}
    </>
  );
};

const ContactList = ({ contacts }) => {
  const list = asArray(contacts);
  if (!list.length) return null;
  return (
    <>
      {list.map((c, i) => {
        const mail = c?.mail;
        return (
          <span key={`${mail || i}`}>
            {mail}
            {i < list.length - 1 ? ", " : ""}
          </span>
        );
      })}
    </>
  );
};

const UsageBlock = ({ useEntry }) => {
  const usedBy = useEntry?.usedBy || {};
  const usedByName = usedBy.label || "";
  const alt = usedBy.altLabel ? ` (${usedBy.altLabel})` : "";

  const identifiers = usedBy.identifier;
  const homepage = usedBy.homepage;
  const providers = usedBy.provider;
  const contacts = usedBy.contact;

  const usageDesc = useEntry?.usageDescription?.description;
  const created = useEntry?.usageReportMetadata?.created;

  return (
    <div className="p-3 border rounded bg-white mb-3">
      {/* usage description at the top if present */}
      {usageDesc && <Row label={null}>{usageDesc}</Row>}

      {/* used by */}
      {(usedByName || alt) && (
        <Row label="used by">
          {usedByName}
          {alt}
        </Row>
      )}

      {/* identifiers */}
      {asArray(identifiers).length > 0 && (
        <Row label="identifiers">
          <LinkList urls={identifiers} />
        </Row>
      )}

      {/* homepage – show only the link, no “link to” text */}
      {homepage && (
        <Row label={null}>
          <a href={homepage} target="_blank" rel="noopener noreferrer">
            {homepage}
          </a>
        </Row>
      )}

      {/* provider */}
      {asArray(providers).length > 0 && (
        <Row label="provider">
          <ProviderList providers={providers} />
        </Row>
      )}

      {/* contact */}
      {asArray(contacts).length > 0 && (
        <Row label="contact">
          <ContactList contacts={contacts} />
        </Row>
      )}

      {/* created */}
      {created && (
        <Row label="created">
          {created}
        </Row>
      )}
    </div>
  );
};

const OntologyAdopters = ({ showModal, setShowModal }) => {
  const onto = useContext(OntologyPageContext)?.ontology;
  const uses = asArray(onto?.ontology_use);

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <h5 className="modal-title">Ontology adopters</h5>
      </Modal.Header>
      <Modal.Body>
        {!uses.length && <div>No adopters information available yet.</div>}
        {uses.map((u, i) => (
          <UsageBlock key={i} useEntry={u} />
        ))}
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