import { useState, useEffect, useContext } from "react";
import Auth from "../../../Libs/AuthLib";
import { DeleteModal, DeleteModalBtn } from "../../common/DeleteModal/DeleteModal";
import { CopiedSuccessAlert } from "../../common/Alerts/Alerts";
import { createHtmlFromEditorJson } from "../../common/TextEditor/TextEditor";
import { ReportModalBtn, ReportModal } from "../../common/ReportModal/ReportModal";
import { OntologyPageContext } from "../../../context/OntologyPageContext";
import { AppContext } from "../../../context/AppContext";
import { NoteContext } from "../../../context/NoteContext";
import ResolveReportActionsForAdmins from "../../common/ResolveReportActions/ResolveReportAction";
import NoteUrlFactory from "../../../UrlFactory/NoteUrlFactory";
import Login from "../../User/Login/TS/Login";
import Toolkit from "../../../Libs/Toolkit";
import { getTsPluginHeaders } from "../../../api/header";



const deleteEndpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/delete/';
const reportEndpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/report/create_report/';



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
        <CommentCardHeader comment={props.comment} editHandlerFunc={props.commentEditHandler} />
      </div>
      <ResolveReportActionsForAdmins
        objectType="comment"
        objectId={props.comment['id']}
        reportStatus={props.comment['is_reported']}
        creatorUsername={props.comment['created_by']}
      />
      <div class="card-body">
        <p className="card-text">
          <div dangerouslySetInnerHTML={{ __html: commnetContent }}></div>
        </p>
      </div>
    </div>
  );
}




export const CommentCardHeader = (props) => {

  const ontologyPageContext = useContext(OntologyPageContext);
  const appContext = useContext(AppContext);
  const noteContext = useContext(NoteContext);

  const noteUrlFactory = new NoteUrlFactory();

  const [comment, setComment] = useState({});
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    setComment(props.comment);
    console.log("CommentCardHeader: ", props.comment);
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
          {"Opened on " + Toolkit.formatDateTime(comment['created_at']) + " by "} <b>{Auth.getUserName(comment['created_by'])}</b>
        </small>
        {linkCopied && <CopiedSuccessAlert message="link copied" />}
      </div>
      <div className="col-sm-3">
        <div className="row">
          <div className="col-sm-12 text-right note-header-container">
            <div class="dropdown custom-dropdown">
              <button class="btn btn-secondary note-dropdown-toggle dropdown-toggle btn-sm note-dropdown-btn borderless-btn" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa fa-ellipsis-h"></i>
              </button>
              <div class="dropdown-menu note-dropdown-menu" aria-labelledby="dropdownMenu2">
                <div class="dropdown-item note-dropdown-item">
                  <button
                    type="button"
                    class="btn btn-sm note-action-menu-btn borderless-btn"
                    onClick={() => {
                      let url = noteUrlFactory.getCommentLink({ commentId: comment['id'] });
                      navigator.clipboard.writeText(url);
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
                    modalId={comment['id']}
                    key={"reportBtnComment" + comment['id']}
                  />
                </div>
                {comment['can_edit'] &&
                  <span>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-item note-dropdown-item">
                      <button
                        type="button"
                        class="btn btn-sm note-action-menu-btn borderless-btn"
                        data-id={comment['id']}
                        data-content={comment['content']}
                        onClick={props.editHandlerFunc}
                        key={"commentEdit" + comment['id']}
                      >
                        Edit
                      </button>
                    </div>
                    <div class="dropdown-item note-dropdown-item">
                      <DeleteModalBtn
                        modalId={"_comment-" + comment['id']}
                        key={"commentDel" + comment['id']}
                      />
                    </div>
                  </span>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteModal
        modalId={"_comment-" + comment['id']}
        formData={JSON.stringify(deleteFormData)}
        callHeaders={getTsPluginHeaders({ withAccessToken: true, isJson: true })}
        deleteEndpoint={deleteEndpoint}
        afterDeleteRedirectUrl={redirectAfterDeleteEndpoint}
        key={"commentDelModal" + comment['id']}
        method="DELETE"
      />
      <ReportModal
        modalId={comment['id']}
        formData={reportFormData}
        callHeaders={getTsPluginHeaders({ withAccessToken: true })}
        reportEndpoint={reportEndpoint}
        key={"reportComment" + comment['id']}
      />
      <Login isModal={true} customModalId="loginModalReport" withoutButton={true} />
    </div>
  ];
}



export default CommentCard;