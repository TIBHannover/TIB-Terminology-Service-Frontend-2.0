import { useState, useEffect, useContext } from "react";
import { buildNoteAboutPart, PinnModalBtn, PinnModal } from "./helpers";
import { Link } from 'react-router-dom';
import Auth from "../../../Libs/AuthLib";
import { DeleteModal, DeleteModalBtn } from "../../common/DeleteModal/DeleteModal";
import { ReportModalBtn, ReportModal } from "../../common/ReportModal/ReportModal";
import NoteEdit from "./NoteEdit";
import { CopiedSuccessAlert } from "../../common/Alerts/Alerts";
import { NoteContext } from "../../../context/NoteContext";
import { AppContext } from "../../../context/AppContext";
import { OntologyPageContext } from "../../../context/OntologyPageContext";
import NoteUrlFactory from "../../../UrlFactory/NoteUrlFactory";
import Login from "../../User/Login/TS/Login";
import Toolkit from "../../../Libs/Toolkit";
import { getTsPluginHeaders } from "../../../api/header";


const VISIBILITY_HELP = {
  "me": "Only you can see this Note.",
  "internal": "Only the registered users in TS can see this Note.",
  "public": "Everyone on the Internet can see this Note."
}

const deleteEndpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/delete';
const reportEndpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/report/create_report';




export const NoteCard = (props) => {
  /*
      This component is responsible for rendering the note card.        
  */

  const noteContext = useContext(NoteContext);

  const noteUrlFactory = new NoteUrlFactory();

  let noteUrl = noteUrlFactory.getCurrentNoteLink({ noteId: props.note['id'] });

  return (
    <div className="row" key={props.note['id']}>
      <div className="col-sm-12">
        <div className="card note-list-card stour-onto-note-list-card">
          <div class="card-header">
            <NoteCardHeader
              note={props.note}
            />
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-6">
                <h6 className="card-title stour-onto-note-list-card-title">
                  <Link to={noteUrl}
                    className="note-list-title custom-truncate"
                    value={props.note['id']}
                    onClick={noteContext.noteSelectHandler}
                  >
                    {props.note['title']}
                  </Link>
                </h6>
              </div>
              <div className="col-sm-5 stour-onto-note-list-card-about">
                <small>
                  About ({props.note['semantic_component_type']}): {buildNoteAboutPart(props.note)}
                </small>
              </div>
              <div className="col-sm-1 text-right">
                <i class="fa fa-comment" aria-hidden="true"><small>{props.note['comments_count']}</small></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




export const NoteCardHeader = (props) => {
  /*
      This component is responsible for rendering the note card header.        
  */

  const ontologyPageContext = useContext(OntologyPageContext);

  const noteUrlFactory = new NoteUrlFactory();

  const [note, setNote] = useState({});
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    setNote(props.note)
  }
    , [props.note]);


  let deleteFormData = {};
  deleteFormData["objectId"] = note['id'];
  deleteFormData["objectType"] = 'note';
  deleteFormData["ontology_id"] = ontologyPageContext.ontology.ontologyId;

  let reportFormData = new FormData();
  reportFormData.append("objectId", note['id']);
  reportFormData.append("objectType", 'note');
  reportFormData.append("ontology", ontologyPageContext.ontology.ontologyId);

  let redirectAfterDeleteEndpoint = noteUrlFactory.getNoteListLink({ page: 1, size: 10 });

  return [
    <div className="row" key={"note-" + note['id']}>
      <div className="col-sm-9 stour-onto-note-list-card-meta">
        <small>
          {"Opened on " + Toolkit.formatDateTime(note['created_at']) + " by "} <b>{Auth.getUserName(note['created_by'])}</b>
        </small>
        {note['pinned'] && !note['imported'] &&
          // Pinned Imported notes from child should not be pinned in parent
          <div className="pinned-message-icon">Pinned</div>
        }
        {note['imported'] &&
          // if the current ontology is not equal to the note ontology, then the note is imported.
          <div className="note-imported-message-icon">Imported from {note['ontology_id']}</div>
        }
        {linkCopied && <CopiedSuccessAlert message="link copied" />}
      </div>
      <div className="col-sm-3">
        <div className="row">
          <div className="col-sm-12 text-right note-header-container">
            <NoteActionDropDown
              note={note}
              setLinkCopied={setLinkCopied}
            />
          </div>
        </div>
      </div>
      <NoteEdit
        note={note}
        key={"editNode" + note['id']}
      />
      <DeleteModal
        modalId={note['id']}
        formData={JSON.stringify(deleteFormData)}
        callHeaders={getTsPluginHeaders({ withAccessToken: true, isJson: true })}
        deleteEndpoint={deleteEndpoint}
        afterDeleteRedirectUrl={redirectAfterDeleteEndpoint}
        key={"deleteNode" + note['id']}
      />
      <PinnModal
        note={note}
        modalId={note['id']}
        callHeaders={getTsPluginHeaders({ withAccessToken: true, isJson: true })}
        key={"pinnModal" + note['id']}
      />
      <ReportModal
        modalId={note['id']}
        formData={reportFormData}
        callHeaders={getTsPluginHeaders({ withAccessToken: true })}
        reportEndpoint={reportEndpoint}
        key={"reportNote" + note['id']}
      />
      <Login isModal={true} customModalId="loginModalReport" withoutButton={true} />
    </div>
  ];
}




const NoteActionDropDown = ({ note, setLinkCopied }) => {

  const noteContext = useContext(NoteContext);
  const appContext = useContext(AppContext);

  const noteUrlFactory = new NoteUrlFactory();

  return (
    <div class="dropdown custom-dropdown">
      <button class="btn btn-secondary note-dropdown-toggle dropdown-toggle btn-sm note-dropdown-btn borderless-btn" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="fa fa-ellipsis-h"></i>
      </button>
      <div class="dropdown-menu note-dropdown-menu" aria-labelledby="dropdownMenu2">
        <div class="dropdown-item note-dropdown-item" data-toggle="tooltip" data-placement="top" title={VISIBILITY_HELP[note['visibility']]}>
          <small><i class="fa fa-solid fa-eye"></i>{note['visibility']}</small>
        </div>
        <div class="dropdown-item note-dropdown-item">
          <button
            type="button"
            class="btn btn-sm note-action-menu-btn borderless-btn"
            onClick={() => {
              let noteLink = noteUrlFactory.getCurrentNoteLink({ noteId: note['id'], fullLink: true });
              navigator.clipboard.writeText(noteLink);
              setLinkCopied(true);
              setTimeout(() => {
                setLinkCopied(false);
              }, 2000);
            }}
          >
            <i class="fa fa-solid fa-copy"></i> Link
          </button>
        </div>
        <div class="dropdown-item note-dropdown-item">
          <ReportModalBtn
            modalId={note['id']}
            key={"reportBtnNote" + note['id']}
          />
        </div>
        {note['can_edit'] && !note['imported'] &&
          <span>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item note-dropdown-item">
              <PinnModalBtn
                modalId={note['id']}
                key={"pinBtnNode" + note['id']}
                note={note}
                isAdminForOntology={noteContext.isAdminForOntology}
                numberOfpinned={noteContext.numberOfPinned}
              />
            </div>
            <div class="dropdown-item note-dropdown-item">
              <button type="button"
                class="btn btn-sm borderless-btn note-action-menu-btn"
                data-toggle="modal"
                data-target={"#edit-note-modal" + note['id']}
                data-backdrop="static"
                data-keyboard="false"
                key={"editNode" + note['id']}
              >
                Edit
              </button>
            </div>
            <div class="dropdown-item note-dropdown-item">
              <DeleteModalBtn
                modalId={note['id']}
                key={"deleteBtnNode" + note['id']}
              />
            </div>
          </span>
        }
      </div>
    </div>
  );
}


export default NoteCard;