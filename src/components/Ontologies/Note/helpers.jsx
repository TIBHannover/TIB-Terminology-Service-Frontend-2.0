import {useState, useContext} from "react";
import {pinnNote} from "../../../api/note";
import Modal from "react-bootstrap/Modal";
import {Link} from "react-router-dom";
import {NoteContext} from "../../../context/NoteContext";


export function buildNoteAboutPart(note) {
  let url = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + note['ontology_id'];
  let label = "";
  if (note['semantic_component_type'] === "ontology") {
    label = note['ontology_id'];
  } else if (note['semantic_component_type'] === "class") {
    url += ('/terms?iri=' + encodeURIComponent(note['semantic_component_iri']))
    label = note['semantic_component_label'];
  } else if (note['semantic_component_type'] === "property") {
    url += ('/props?iri=' + encodeURIComponent(note['semantic_component_iri']))
    label = note['semantic_component_label'];
  } else {
    url += ('/individuals?iri=' + encodeURIComponent(note['semantic_component_iri']))
    label = note['semantic_component_label'];
  }
  
  return (
    <Link to={url} target="_blank">
      <b>{label}</b>
    </Link>
  );
}


export const PinnModalBtn = (props) => {
  
  const noteContext = useContext(NoteContext);
  
  if (!noteContext.isAdminForOntology) {
    return "";
  }
  
  if (props.note['visibility'] === "me") {
    return "";
  }
  
  if (parseInt(noteContext.numberOfpinned) === parseInt(process.env.REACT_APP_MAX_PIN_NOTES) && !props.note['pinned']) {
    return "";
  }
  
  return (
    <button type="button"
            className="btn btn-sm borderless-btn note-action-menu-btn"
            onClick={props.setShowModal}
    >
      {props.note['pinned'] ? "Unpin" : "Pin"}
    </button>
  );
  
}


export const PinnModal = (props) => {
  const [submited, setSubmited] = useState(false);
  const [showModal, setShowModal] = useState(false);
  let data = {};
  const note = props.note;
  data["ontology"] = note['ontology_id'];
  data["note_id"] = note['id'];
  data["pinned"] = `${!Boolean(note['pinned'])}`;
  
  
  async function pinNote() {
    await pinnNote(data);
    setSubmited(true);
    redirectAfterPin();
  }
  
  const redirectAfterPin = () => {
    window.location.replace(window.location.href);
  }
  
  return (
    <div>
      <PinnModalBtn
        key={"pinBtnNode" + note['id']}
        note={note}
        setShowModal={setShowModal}
      />
      <Modal show={showModal} id={"pinModal" + props.modalId}>
        <Modal.Header className="row">
          <div className="col-sm-6">
            <h5 className="modal-title" id={"pinModalLabel" + props.modalId}>Confirmation</h5>
          </div>
          <div className="col-sm-6 text-end">
            {!submited &&
              <button type="button" className="close close-btn-message-modal" onClick={() => setShowModal(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            }
          </div>
        </Modal.Header>
        <Modal.Body>
          {!submited &&
            <span>
                  Are you sure you want to {props.note['pinned'] ? "Unpin" : "Pin"} this note?
                </span>
          }
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          {!submited && <button type="button" className="btn btn-secondary" onClick={pinNote}>
            {props.note['pinned'] ? "Unpin" : "Pin"}
          </button>}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
