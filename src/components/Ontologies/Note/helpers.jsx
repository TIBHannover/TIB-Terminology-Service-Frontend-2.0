import { useState } from "react";
import { pinnNote } from "../../../api/note";



export function buildNoteAboutPart(note) {
  let url = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + note['ontology_id'];
  let label = "";
  if (note['semantic_component_type'] === "ontology") {
    label = note['ontology_id'];
  }
  else if (note['semantic_component_type'] === "class") {
    url += ('/terms?iri=' + encodeURIComponent(note['semantic_component_iri']))
    label = note['semantic_component_label'];
  }
  else if (note['semantic_component_type'] === "property") {
    url += ('/props?iri=' + encodeURIComponent(note['semantic_component_iri']))
    label = note['semantic_component_label'];
  }
  else {
    url += ('/individuals?iri=' + encodeURIComponent(note['semantic_component_iri']))
    label = note['semantic_component_label'];
  }

  return (
    <a href={url} target="_blank">
      <b>{label}</b>
    </a>
  );
}


export const PinnModalBtn = (props) => {

  if (!props.isAdminForOntology) {
    return "";
  }

  if (props.note['visibility'] === "me") {
    return "";
  }

  if (parseInt(props.numberOfpinned) === parseInt(process.env.REACT_APP_MAX_PIN_NOTES) && !props.note['pinned']) {
    return "";
  }

  return (
    <button type="button"
      class="btn btn-sm borderless-btn note-action-menu-btn"
      data-toggle="modal"
      data-target={"#pinModal" + props.modalId}
      data-backdrop="static"
    >
      {props.note['pinned'] ? "Unpin" : "Pin"}
    </button>
  );

}



export const PinnModal = (props) => {
  const [submited, setSubmited] = useState(false);

  let data = {};
  data["ontology"] = props.note['ontology_id'];
  data["note_id"] = props.note['id'];
  data["pinned"] = `${!Boolean(props.note['pinned'])}`;


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
      <div class="modal fade" id={"pinModal" + props.modalId} tabIndex="-1" role="dialog" aria-labelledby={"pinModalLabel" + props.modalId} aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id={"pinModalLabel" + props.modalId}>Confirmation</h5>
              {!submited &&
                <button type="button" class="close close-btn-message-modal" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              }
            </div>
            <div class="modal-body">
              {!submited &&
                <span>
                  Are you sure you want to {props.note['pinned'] ? "Unpin" : "Pin"} this note?
                </span>
              }
            </div>
            <div class="modal-footer justify-content-center">
              {!submited && <button type="button" class="btn btn-secondary" onClick={pinNote}>
                {props.note['pinned'] ? "Unpin" : "Pin"}
              </button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
