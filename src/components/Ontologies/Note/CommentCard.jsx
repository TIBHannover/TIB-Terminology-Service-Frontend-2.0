import {useState, useEffect, useContext} from "react";
import Toolkit from "../../../Libs/Toolkit";
import AuthTool from "../../User/Login/authTools";
import {DeleteModal, DeleteModalBtn} from "../../common/DeleteModal/DeleteModal";
import { CopiedSuccessAlert } from "../../common/Alerts/Alerts";
import {createHtmlFromEditorJson} from "../../common/TextEditor/TextEditor";
import { ReportModalBtn, ReportModal } from "../../common/ReportModal/ReportModal";
import { OntologyPageContext } from "../../../context/OntologyPageContext";



const deleteEndpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/delete';
const reportEndpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/report/create_report';
const callHeader = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});



export const CommentCard = (props) =>{
    let commnetContent = createHtmlFromEditorJson(props.comment['content']);
    
    return (
        <div className="card" id={"comment-card-" + props.comment['id']}>
            <div className="card-header">
                <CommentCardHeader comment={props.comment}  editHandlerFunc={props.commentEditHandler}  ontologyId={props.ontologyId}/>                        
            </div>
            <div class="card-body">                        
                <p className="card-text">                    
                    <div dangerouslySetInnerHTML={{ __html: commnetContent}}></div>  
                </p>                        
            </div>
        </div>
    );
}




export const CommentCardHeader = (props) =>{

    const ontologyPageContext = useContext(OntologyPageContext);

    const [comment, setComment] = useState({});
    const [linkCopied, setLinkCopied] = useState(false);

    useEffect(() => {
        setComment(props.comment);
    },[props.comment]);
    
    let deleteFormData = new FormData();
    deleteFormData.append("objectId", comment['id']);
    deleteFormData.append("objectType", 'comment');   
    deleteFormData.append("ontology_id", props.ontologyId);
    
    let reportFormData = new FormData();
    reportFormData.append("objectId", comment['id']);
    reportFormData.append("objectType", 'comment');
    reportFormData.append("ontology", ontologyPageContext.ontology.ontologyId);

    let searchParams = new URLSearchParams(window.location.search);
    let locationObject = window.location;
    searchParams.delete('comment');    
    let redirectAfterDeleteEndpoint = locationObject.pathname + "?" +  searchParams.toString();  

    return [
        <div className="row" key={"c-" + comment['id']}>        
            <div className="col-sm-9">
                <small>
                    {"Opened on " + comment['created_at'] + " by "} <b>{AuthTool.getUserName(comment['created_by'])}</b> 
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
                                            let url = window.location.origin + Toolkit.setParamInUrl('comment', comment['id']);                                            
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
                                {localStorage.getItem('isLoginInTs') === "true" &&
                                    <div class="dropdown-item note-dropdown-item">
                                        <ReportModalBtn 
                                            modalId={comment['id']}  
                                            key={"reportBtnComment" + comment['id']} 
                                        />
                                    </div>
                                }
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
                formData={deleteFormData}
                callHeaders={callHeader}
                deleteEndpoint={deleteEndpoint}
                afterDeleteRedirectUrl={redirectAfterDeleteEndpoint}
                key={"commentDelModal" + comment['id']}
            />
            <ReportModal
                modalId={comment['id']}
                formData={reportFormData}
                callHeaders={callHeader}
                reportEndpoint={reportEndpoint}                
                key={"reportComment" + comment['id']}
            />            
        </div> 
    ];
}



export default CommentCard;