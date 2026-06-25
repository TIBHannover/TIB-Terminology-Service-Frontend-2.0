import { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import AlertBox from "../../../common/Alerts/Alerts";
import FormLib from "../../../../Libs/FormLib";
import { OntologyPageContext } from "../../../../context/OntologyPageContext";
import { submitAdopterRequest } from "../../../../api/ontology";

const ADOPTER_TYPES = [
  "project",
  "institution",
  "service",
  "software",
  "standard",
  "repository/portal",
  "application",
];

const HelpIcon = ({ text }) => {
  const [show, setShow] = useState(false);

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        marginLeft: "6px",
      }}
    >
      <span
        onClick={() => setShow(!show)}
        style={{
          color: "#0d6efd",
          cursor: "pointer",
          fontWeight: "bold",
          border: "1px solid #0d6efd",
          borderRadius: "50%",
          width: "16px",
          height: "16px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
        }}
      >
        ?
      </span>

      {show && (
        <div
          style={{
            position: "absolute",
            top: "22px",
            left: "0",
            zIndex: 9999,
            width: "280px",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "10px",
            fontSize: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          {text}
        </div>
      )}
    </span>
  );
};

const OntologyAdoptRequest = (props) => {
  const ontoPageContext = useContext(OntologyPageContext);

  const [submitWait, setSubmitWait] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitSuccess, setFormSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // adopter fields
  const [adopterType, setAdopterType] = useState("");
  const [adopterName, setAdopterName] = useState("");
  const [adopterAltName, setAdopterAltName] = useState("");
  const [adopterPid, setAdopterPid] = useState("");
  const [adopterHomepage, setAdopterHomepage] = useState("");
  const [providerName, setProviderName] = useState("");
  const [providerPid, setProviderPid] = useState("");
  const [usageDescription, setUsageDescription] = useState("");
  const [usageChannel, setUsageChannel] = useState("");

  function submit() {
    let username = FormLib.getFieldByIdIfValid("adopt-username");
    let email = FormLib.getFieldByIdIfValid("adopt-email");

    if (
      !username ||
      !email ||
      !adopterType ||
      !adopterName ||
      !usageDescription ||
      !usageChannel
    ) {
      return;
    }

    setLoading(true);

    const form = {
      username,
      email,
      name: ontoPageContext.ontology?.ontologyId,
      purl: ontoPageContext.ontology?.iri,

      // IMPORTANT: keep using existing endpoint for now
      // colleague wants separate endpoint later, but this keeps UI working today
      collection_ids: "",
      collection_suggestion: true,

      adopter_type: adopterType,
      adopter_name: adopterName,
      adopter_alt_name: adopterAltName,
      adopter_pid: adopterPid,
      adopter_homepage: adopterHomepage,
      provider_name: providerName,
      provider_pid: providerPid,
      usage_description: usageDescription,
      usage_channel: usageChannel,
    };

    submitAdopterRequest(form).then((result) => {
      setFormSubmitSuccess(result);
      setFormSubmitted(true);
      setSubmitWait(false);
      setLoading(false);
    });
  }

  return (
    <Modal show={props.showModal} fullscreen={true}>
      <Modal.Header>
        <h5 className="modal-title">Ontology adoption request</h5>
      </Modal.Header>

      <Modal.Body>
        <div className="text-danger mb-2" style={{ fontSize: "12px" }}>
          * Required fields
        </div>

        {!submitWait && formSubmitSuccess && formSubmitted && (
          <AlertBox
            type="success"
            message="Thank you! Your query has been submitted successfully. We will inform you about our decision via email."
          />
        )}

        {!submitWait && !formSubmitSuccess && formSubmitted && (
          <AlertBox
            type="danger"
            message="Sorry! Something went wrong. Please try again later."
          />
        )}

        {!submitWait && !formSubmitted && (
          <>
            <div className="row">
              <div className="col-sm-8">
                <label className="required_input" htmlFor="adopt-username">
                  Your name
                </label>

                <input
                  type="text"
                  className="form-control"
                  id="adopt-username"
                  placeholder="Enter your fullname. E.g., John Doe"
                />
              </div>
            </div>

            <br />

            <div className="row">
              <div className="col-sm-8">
                <label className="required_input" htmlFor="adopt-email">
                  Email
                </label>

                <input
                  type="text"
                  className="form-control"
                  id="adopt-email"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <br />
            <br />

            <div className="row">
              <div className="col-sm-8">
                <h6>Ontology adopter information</h6>
              </div>
            </div>

            <br />

            <div className="row">
              <div className="col-sm-8">
                <label className="required_input">
                  Type of adopter using the terminology
                  <HelpIcon text="Please tell us as specifically as possible whether the ontology is used in an institution, an application, a service, etc. (see the list). For example, if the terminology is used in a repository belonging to an institution, choose 'repository' from the list and specify the institution later. If you only want to inform us that the terminology is used by an institution, skip questions 6 and 7." />
                </label>

                <select
                  className="form-control"
                  value={adopterType}
                  onChange={(e) => setAdopterType(e.target.value)}
                >
                  <option value="">Select…</option>

                  {ADOPTER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <br />

            <div className="row">
              <div className="col-sm-8">
                <label className="required_input">
                  Name of the terminology adopter
                  <HelpIcon text="Please add the official name of the adopter, e.g. 'Repository of the Unknown University'." />
                </label>

                <input
                  className="form-control"
                  value={adopterName}
                  onChange={(e) => setAdopterName(e.target.value)}
                />
              </div>
            </div>

            <br />

            <div className="row">
              <div className="col-sm-8">
                <label>
                  Alternative/short name (if applicable)
                  <HelpIcon text=" If applicable, please add any commonly known abbreviations for the adopter’s name, e.g. 'Repo_UU'." />
                </label>

                <input
                  className="form-control"
                  value={adopterAltName}
                  onChange={(e) => setAdopterAltName(e.target.value)}
                />
              </div>
            </div>

            <br />

            <div className="row">
              <div className="col-sm-8">
                <label>
                  PID of the terminology adopter (e.g., ROR, DOI; if available)
                  <HelpIcon text="If your adopter has a Persistent Identifier such as a DOI or a ROR then please add it, e.g.  https://ror.org/000xx000." />
                </label>

                <input
                  className="form-control"
                  value={adopterPid}
                  onChange={(e) => setAdopterPid(e.target.value)}
                />
              </div>
            </div>

            <br />

            <div className="row">
              <div className="col-sm-8">
                <label>
                  Homepage of the terminology adopter (if available)
                  <HelpIcon text="If your adopter has a homepage  then please add it, e.g. https://Repo_UU.org" />
                </label>

                <input
                  className="form-control"
                  value={adopterHomepage}
                  onChange={(e) => setAdopterHomepage(e.target.value)}
                />
              </div>
            </div>

            <br />

            <div className="row">
              <div className="col-sm-8">
                <label>
                  Name of the provider or affiliation of the terminology adopter
                  <HelpIcon text="If your adopter is not an institution, then add the name of the provider or affiliation of the adopter, e.g. 'Unknown University'." />
                </label>

                <input
                  className="form-control"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                />
              </div>
            </div>

            <br />

            <div className="row">
              <div className="col-sm-8">
                <label>
                  PID of the provider/affiliation (e.g., ROR; if available)
                  <HelpIcon text="If your adopter’s provider  or affiliation has a Persistent Identifier such as a DOI or a ROR then please add it, e.g. https://ror.org999xx000" />
                </label>

                <input
                  className="form-control"
                  value={providerPid}
                  onChange={(e) => setProviderPid(e.target.value)}
                />
              </div>
            </div>

            <br />

            <div className="row">
              <div className="col-sm-8">
                <label className="required_input">
                  How is the terminology used? (in English)
                  <HelpIcon text="Please provide a short explanation  such as ‘This terminology will be used to annotate descriptions of datasets in the repository of the Unknown University. This will facilitate the search for datasets…'." />
                </label>

                <textarea
                  className="form-control"
                  rows={3}
                  value={usageDescription}
                  onChange={(e) => setUsageDescription(e.target.value)}
                />
              </div>
            </div>

            <br />

            <div className="row">
              <div className="col-sm-8">
                <label className="required_input">
                  The terminology will be used via
                  <HelpIcon text="Will  you use TIB TS’s API to access the terminology? If you do so,  please choose TIB Terminology Service API (API) or Terminology Service User Interface (UI), otherwise choose  both (UI and API)." />
                </label>

                <select
                  className="form-control"
                  value={usageChannel}
                  onChange={(e) => setUsageChannel(e.target.value)}
                >
                  <option value="">Select…</option>
                  <option value="API">API</option>
                  <option value="UI">TIB Terminology Service UI</option>
                  <option value="UI+API">UI and API</option>
                </select>
              </div>
            </div>

            <br />
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <div className="col-auto mr-auto">
          <button
            type="button"
            className="btn btn-secondary close-btn-message-modal float-right"
            onClick={() => props.setShowModal(false)}
          >
            Close
          </button>
        </div>

        {!submitWait && !formSubmitted && (
          <button type="button" className="btn btn-secondary" onClick={submit}>
            {loading && <div className="isLoading-btn"></div>}
            {!loading && "Submit"}
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default OntologyAdoptRequest;
