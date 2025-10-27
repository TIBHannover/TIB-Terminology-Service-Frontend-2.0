// src/components/Ontologies/OntologyOverview/widgets/OntologyAdopters.jsx
import { useContext } from "react";
import Modal from "react-bootstrap/Modal";
import { OntologyPageContext } from "../../../../context/OntologyPageContext";

/* ---------- helpers ---------- */
const asArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

const Row = ({ label, children }) => (
  <div style={{ padding: "6px 0", borderBottom: "1px dotted #e5e7eb" }}>
    {label ? <strong>{label}: </strong> : null}
    {children}
  </div>
);

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

/* ---------- one adopter block ---------- */
const UsageBlock = ({ useEntry }) => {
  const usedBy = useEntry?.usedBy || {};

  const title = usedBy.label || "";
  const alt = usedBy.altLabel ? ` (${usedBy.altLabel})` : "";

  const identifiers = usedBy.identifier;
  const homepage = usedBy.homepage;
  const providers = usedBy.provider;
  const contacts = usedBy.contact;

  // Some configs store the free text under usageDescription.description,
  // others directly under description. Support both.
  const usageDesc =
    useEntry?.usageDescription?.description ||
    useEntry?.description ||
    "";

  const created =
    useEntry?.usageReportMetadata?.created ||
    useEntry?.created ||
    "";

  return (
    <div className="p-3 border rounded bg-white mb-3">
      {/* free text on top */}
      {usageDesc && (
        <div
          style={{
            padding: "6px 0",
            borderBottom: "1px dotted #e5e7eb",
            color: "#374151",
            lineHeight: 1.4,
          }}
        >
          {usageDesc}
        </div>
      )}

      {(title || alt) && (
        <Row label="Used By">
          {title}
          {alt}
        </Row>
      )}

      {asArray(identifiers).length > 0 && (
        <Row label="Identifiers">
          <LinkList urls={identifiers} />
        </Row>
      )}

      {/* show homepage plainly (no 'link to' wording) */}
      {homepage && (
        <Row label={null}>
          <a href={homepage} target="_blank" rel="noopener noreferrer">
            {homepage}
          </a>
        </Row>
      )}

      {asArray(providers).length > 0 && (
        <Row label="Provider">
          <ProviderList providers={providers} />
        </Row>
      )}

      {asArray(contacts).length > 0 && (
        <Row label="Contact">
          <ContactList contacts={contacts} />
        </Row>
      )}

      {created && <Row label="Created">{created}</Row>}
    </div>
  );
};

/* ---------- modal ---------- */
const OntologyAdopters = ({ showModal, setShowModal }) => {
  const onto = useContext(OntologyPageContext)?.ontology;

  // keep only items that really have a 'usedBy' object
  const uses = asArray(onto?.ontology_use).filter((u) => u?.usedBy);

  // If there is nothing to show, do not render the modal at all.
  if (!uses.length) return null;

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <h5 className="modal-title">Ontology adopters</h5>
      </Modal.Header>

      <Modal.Body>
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
