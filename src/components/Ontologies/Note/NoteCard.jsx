import {useState, useEffect, useContext} from "react";
import {buildNoteAboutPart, PinnModal} from "./helpers";
import {Link} from 'react-router-dom';
import Auth from "../../../Libs/AuthLib";
import {DeleteModal} from "../../common/DeleteModal/DeleteModal";
import {ReportModal} from "../../common/ReportModal/ReportModal";
import NoteEdit from "./NoteEdit";
import {CopiedSuccessAlert} from "../../common/Alerts/Alerts";
import {NoteContext} from "../../../context/NoteContext";
import {OntologyPageContext} from "../../../context/OntologyPageContext";
import NoteUrlFactory from "../../../UrlFactory/NoteUrlFactory";
import Login from "../../User/Login/TS/Login";
import Toolkit from "../../../Libs/Toolkit";
import {getTsPluginHeaders} from "../../../api/header";
import Dropdown from 'react-bootstrap/Dropdown';


const VISIBILITY_HELP = {
  "me": "Only you can see this Note.",
  "internal": "Only the registered users in TS can see this Note.",
  "public": "Everyone on the Internet can see this Note."
}

const deleteEndpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/delete/';
const reportEndpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/report/create/';


export const NoteCard = (props) => {
  /*
      This component is responsible for rendering the note card.        
  */
  
  const noteContext = useContext(NoteContext);
  
  const noteUrlFactory = new NoteUrlFactory();
  
  let noteUrl = noteUrlFactory.getCurrentNoteLink({noteId: props.note['id']});
  
  return (
    <div className="row" key={props.note['id']}>
      <div className="col-sm-12">
        <div className="card note-list-card stour-onto-note-list-card">
          <div className="card-header">
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
                <i className="fa fa-comment" aria-hidden="true"><small>{props.note['comments_count']}</small></i>
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
  const noteContext = useContext(NoteContext);
  
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
  
  let reportFormData = {};
  reportFormData["objectId"] = note['id'];
  reportFormData["objectType"] = 'note';
  reportFormData["ontology"] = ontologyPageContext.ontology.ontologyId;
  
  let redirectAfterDeleteEndpoint = noteUrlFactory.getNoteListLink({page: 1, size: 10});
  
  return [
    <div className="row" key={"note-" + note['id']}>
      <div className="col-sm-9 stour-onto-note-list-card-meta">
        <small>
          {"Opened on " + Toolkit.formatDateTime(note['created_at']) + " by "}
          <b>{Auth.getUserName(note['created_by'])}</b>
        </small>
        {note['pinned'] && !note['imported'] &&
          // Pinned Imported notes from child should not be pinned in parent
          <div className="pinned-message-icon">Pinned</div>
        }
        {note['imported'] &&
          // if the current ontology is not equal to the note ontology, then the note is imported.
          <div className="note-imported-message-icon">Imported from {note['ontology_id']}</div>
        }
        {linkCopied && <CopiedSuccessAlert message="link copied"/>}
      </div>
      <div className="col-sm-3">
        <div className="row">
          <div className="col-sm-12 text-end note-header-container">
            <Dropdown>
              <Dropdown.Toggle
                className="btn btn-secondary note-dropdown-toggle btn-sm note-dropdown-btn borderless-btn"
                type="button" id="dropdownMenu2">
                <i className="fa fa-ellipsis-h"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item className="note-dropdown-item">
                  <div title={VISIBILITY_HELP[note['visibility']]}>
                    <small><i className="fa fa-solid fa-eye ms-0 me-1 "></i>{note['visibility']}</small>
                  </div>
                </Dropdown.Item>
                <div className="dropdown-divider"></div>
                <Dropdown.Item className="note-dropdown-item">
                  <button
                    type="button"
                    className="btn btn-sm note-action-menu-btn borderless-btn ms-0"
                    onClick={() => {
                      let noteLink = noteUrlFactory.getCurrentNoteLink({noteId: note['id'], fullLink: true});
                      navigator.clipboard.writeText(noteLink);
                      setLinkCopied(true);
                      setTimeout(() => {
                        setLinkCopied(false);
                      }, 2000);
                    }}
                  >
                    <i className="fa fa-solid fa-copy ms-0"></i> Link
                  </button>
                </Dropdown.Item>
                <Dropdown.Item className="note-dropdown-item">
                  <ReportModal
                    modalId={note['id']}
                    formData={reportFormData}
                    callHeaders={getTsPluginHeaders({withAccessToken: true})}
                    reportEndpoint={reportEndpoint}
                    key={"reportNote" + note['id']}
                  />
                </Dropdown.Item>
                {note['can_edit'] && !note['imported'] &&
                  <>
                    <div className="dropdown-divider"></div>
                    <Dropdown.Item className="note-dropdown-item">
                      <PinnModal
                        note={note}
                        modalId={note['id']}
                        callHeaders={getTsPluginHeaders({withAccessToken: true, isJson: true})}
                        key={"pinnModal" + note['id']}
                      />
                    </Dropdown.Item>
                    <Dropdown.Item className="note-dropdown-item">
                      <NoteEdit
                        note={note}
                        key={"editNode" + note['id']}
                      />
                    </Dropdown.Item>
                    <Dropdown.Item className="note-dropdown-item">
                      <DeleteModal
                        modalId={note['id']}
                        formData={JSON.stringify(deleteFormData)}
                        callHeaders={getTsPluginHeaders({withAccessToken: true, isJson: true})}
                        deleteEndpoint={deleteEndpoint}
                        afterDeleteRedirectUrl={redirectAfterDeleteEndpoint}
                        key={"deleteNode" + note['id']}
                        method="DELETE"
                      />
                    </Dropdown.Item>
                  </>
                }
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
      <Login isModal={true} customModalId="loginModalReport" withoutButton={true}/>
    </div>
  ];
}


export default NoteCard;