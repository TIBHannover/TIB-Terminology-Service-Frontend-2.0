import { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import AlertBox from "../../../common/Alerts/Alerts";
import FormLib from "../../../../Libs/FormLib";
import TextEditor from "../../../common/TextEditor/TextEditor";
import draftToMarkdown from "draftjs-to-markdown";
import { convertToRaw } from "draft-js";
import { OntologyPageContext } from "../../../../context/OntologyPageContext";
// import { submitOntologySuggestion } from "../../../../api/ontology";
import { submitAdopterRequest } from "../../../../api/ontology";

const ADOPTER_TYPES = [
  "project",
  "institution",
  "service",
  "software",
  "standard",
  "repository/portal",
  "data standard",
  "application",
];

const OntologyAdoptRequest = (props) => {
  const ontoPageContext = useContext(OntologyPageContext);

  const [editorState, setEditorState] = useState(null);
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
  const [adopterDescription, setAdopterDescription] = useState("");
  const [providerName, setProviderName] = useState("");
  const [providerPid, setProviderPid] = useState("");
  const [usageDescription, setUsageDescription] = useState("");
  const [usageChannel, setUsageChannel] = useState("");

  function onTextEditorChange(newEditorState) {
    const editor = document.getElementsByClassName("rdw-editor-main")[0];
    if (editor) editor.style.border = "";
    setEditorState(newEditorState);
  }

  function submit() {
    console.log("SUBMIT CLICKED");
    let username = FormLib.getFieldByIdIfValid("adopt-username");
    let email = FormLib.getFieldByIdIfValid("adopt-email");
    console.log({
  username,
  email,
  adopterType,
  adopterName,
  usageDescription,
  usageChannel
});
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
      collection_ids: "", // not used for adopt request
      collection_suggestion: true,

      adopter_type: adopterType,
      adopter_name: adopterName,
      adopter_alt_name: adopterAltName,
      adopter_pid: adopterPid,
      adopter_homepage: adopterHomepage,
      adopter_description: adopterDescription,
      provider_name: providerName,
      provider_pid: providerPid,
      usage_description: usageDescription,
      usage_channel: usageChannel,
    };

    console.log("CALLING API...");
submitAdopterRequest(form).then((result) => {
  console.log("API RESULT:", result);
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
                <label className="required_input">Name of the terminology adopter</label>
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
                <label>Alternative/short name (if applicable)</label>
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
                <label>PID of the terminology adopter (e.g., ROR, DOI; if available)</label>
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
                <label>Homepage of the terminology adopter (if available)</label>
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
                <label>Description of the terminology adopter (in English)</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={adopterDescription}
                  onChange={(e) => setAdopterDescription(e.target.value)}
                />
              </div>
            </div>
            <br />

            <div className="row">
              <div className="col-sm-8">
                <label>Name of the provider or affiliation of the terminology adopter</label>
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
                <label>PID of the provider/affiliation (e.g., ROR; if available)</label>
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
                <label className="required_input">How is the terminology used? (in English)</label>
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
                <label className="required_input">The terminology will be used via</label>
                <select
                  className="form-control"
                  value={usageChannel}
                  onChange={(e) => setUsageChannel(e.target.value)}
                >
                  <option value="">Select…</option>
                  <option value="UI">TIB Terminology Service UI</option>
                  <option value="API">API</option>
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
