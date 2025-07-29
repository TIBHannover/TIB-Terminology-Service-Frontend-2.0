import {useState, useEffect, useContext} from "react";
import Auth from "../../../Libs/AuthLib";
import {DeleteModal} from "../../common/DeleteModal/DeleteModal";
import {CopiedSuccessAlert} from "../../common/Alerts/Alerts";
import {createHtmlFromEditorJson} from "../../common/TextEditor/TextEditor";
import {ReportModal} from "../../common/ReportModal/ReportModal";
import {OntologyPageContext} from "../../../context/OntologyPageContext";
import {AppContext} from "../../../context/AppContext";
import {NoteContext} from "../../../context/NoteContext";
import ResolveReportActionsForAdmins from "../../common/ResolveReportActions/ResolveReportAction";
import NoteUrlFactory from "../../../UrlFactory/NoteUrlFactory";
import Login from "../../User/Login/TS/Login";
import Toolkit from "../../../Libs/Toolkit";
import {getTsPluginHeaders} from "../../../api/header";
import Dropdown from 'react-bootstrap/Dropdown';


const deleteEndpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/delete/';
const reportEndpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/report/create/';


export const CommentCard = (props) => {
  /*
      This component is responsible for rendering the comment card.
      It uses the OntologyPageContext to get the ontology information.
      It uses the AppContext to get the user information.        
      It uses the ResolveReportActionsForAdmins component to render the report actions for the admins.        
  */
  
  let commnetContent = createHtmlFromEditorJson(props.comment['content']);
  
  return (
    <div className="card" id={"comment-card-" + props.comment['id']}>
      <div className="card-header">
        <CommentCardHeader comment={props.comment} editHandlerFunc={props.commentEditHandler}/>
      </div>
      <ResolveReportActionsForAdmins
        objectType="comment"
        objectId={props.comment['id']}
        reportStatus={props.comment['is_reported']}
        creatorUsername={props.comment['created_by']}
      />
      <div className="card-body">
        <p className="card-text">
          <div dangerouslySetInnerHTML={{__html: commnetContent}}></div>
        </p>
      </div>
    </div>
  );
}


export const CommentCardHeader = (props) => {
  
  const ontologyPageContext = useContext(OntologyPageContext);
  
  const noteUrlFactory = new NoteUrlFactory();
  
  const [comment, setComment] = useState({});
  const [linkCopied, setLinkCopied] = useState(false);
  
  useEffect(() => {
    setComment(props.comment);
  }, [props.comment]);
  
  let deleteFormData = {};
  deleteFormData["objectId"] = comment['id'];
  deleteFormData["objectType"] = 'comment';
  deleteFormData["ontology_id"] = ontologyPageContext.ontology.ontologyId;
  
  let reportFormData = {};
  reportFormData["objectId"] = comment['id'];
  reportFormData["objectType"] = 'comment';
  reportFormData["ontology"] = ontologyPageContext.ontology.ontologyId;
  
  let redirectAfterDeleteEndpoint = noteUrlFactory.getCommentDeleteRedirectLink();
  
  return [
    <div className="row" key={"c-" + comment['id']}>
      <div className="col-sm-9">
        <small>
          {"Opened on " + Toolkit.formatDateTime(comment['created_at']) + " by "}
          <b>{Auth.getUserName(comment['created_by'])}</b>
        </small>
        {linkCopied && <CopiedSuccessAlert message="link copied"/>}
      </div>
      <div className="col-sm-3">
        <div className="row">
          <div className="col-sm-12 text-end note-header-container">
            <Dropdown className="custom-dropdown">
              <Dropdown.Toggle
                className="btn btn-secondary note-dropdown-toggle btn-sm note-dropdown-btn borderless-btn">
                <i className="fa fa-ellipsis-h ms-0"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu className="note-dropdown-menu">
                <Dropdown.Item className="note-dropdown-item">
                  <button
                    type="button"
                    className="btn btn-sm note-action-menu-btn borderless-btn"
                    onClick={() => {
                      let url = noteUrlFactory.getCommentLink({commentId: comment['id']});
                      navigator.clipboard.writeText(url);
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
                    modalId={comment['id']}
                    formData={reportFormData}
                    callHeaders={getTsPluginHeaders({withAccessToken: true})}
                    reportEndpoint={reportEndpoint}
                    key={"reportComment" + comment['id']}
                  />
                </Dropdown.Item>
                {comment['can_edit'] &&
                  <>
                    <div className="dropdown-divider"></div>
                    <Dropdown.Item className="note-dropdown-item">
                      <button
                        type="button"
                        className="btn btn-sm note-action-menu-btn borderless-btn"
                        data-id={comment['id']}
                        data-content={comment['content']}
                        onClick={props.editHandlerFunc}
                        key={"commentEdit" + comment['id']}
                      >
                        Edit
                      </button>
                    </Dropdown.Item>
                    <Dropdown.Item className="note-dropdown-item">
                      <DeleteModal
                        modalId={"_comment-" + comment['id']}
                        formData={JSON.stringify(deleteFormData)}
                        callHeaders={getTsPluginHeaders({withAccessToken: true, isJson: true})}
                        deleteEndpoint={deleteEndpoint}
                        afterDeleteRedirectUrl={redirectAfterDeleteEndpoint}
                        key={"commentDelModal" + comment['id']}
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


export default CommentCard;