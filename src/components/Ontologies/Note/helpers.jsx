import {React, useState, useEffect} from "react";
import AuthTool from "../../User/Login/authTools";
import {DeleteModal, DeleteModalBtn} from "../../common/DeleteModal/DeleteModal";
import NoteEdit from "./NoteEdit";


const VISIBILITY_HELP = {
    "me": "Only you can see this Note.", 
    "internal": "Only the registered users in TS can see this Note.", 
    "public": "Everyone on the Internet can see this Note."
}

const deleteEndpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/delete';
const callHeader = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});


export const NoteCardHeader = (props) => {
    const [note, setNote] = useState({});

    useEffect(() => {
        setNote(props.note)
    }
    , [props.note]);


    let deleteFormData = new FormData();
    deleteFormData.append("objectId", note['id']);
    deleteFormData.append("objectType", 'note');
    let redirectAfterDeleteEndpoint = window.location.href;
    let searchParams = new URLSearchParams(window.location.search);
    let locationObject = window.location;
    searchParams.set('page', 1);
    searchParams.set('size', 10);
    if (redirectAfterDeleteEndpoint.includes("noteId=")){
        // we are on the note page                
        searchParams.delete('noteId');                 
    }
    redirectAfterDeleteEndpoint = locationObject.pathname + "?" +  searchParams.toString();

    return [
        <div className="row">        
            <div className="col-sm-9">
                <small>
                    {"Opened on " + note['created_at'] + " by "} <b>{AuthTool.getUserName(note['created_by'])}</b> 
                </small>
            </div>
            <div className="col-sm-3">
                <div className="row">                    
                    <div className="col-sm-12 text-right">
                        <div class="dropdown custom-dropdown">
                            <button class="btn btn-secondary note-dropdown-toggle dropdown-toggle btn-sm note-dropdown-btn borderless-btn" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fa fa-ellipsis-h"></i>
                            </button>
                            <div class="dropdown-menu note-dropdown-menu" aria-labelledby="dropdownMenu2">                                
                                <div class="dropdown-item note-dropdown-item" data-toggle="tooltip"  data-placement="top" title={VISIBILITY_HELP[note['visibility']]}>
                                    <small><i class="fa-solid fa-eye"></i>{note['visibility']}</small>
                                </div>
                                {note['can_edit'] &&
                                    <span>
                                        <div class="dropdown-divider"></div>
                                        <div class="dropdown-item note-dropdown-item">
                                        <button type="button" 
                                            class="btn btn-sm borderless-btn note-edit-btn" 
                                            data-toggle="modal" 
                                            data-target={"#edit-note-modal" + note['id']}
                                            data-backdrop="static"
                                            data-keyboard="false"
                                            key={"editNode" + note['id']}                      
                                            >
                                            <i class="far fa-edit"></i> Edit
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
                    </div>
                </div>                                                      
            </div>
            <NoteEdit 
                note={note}
                key={"editNode" + note['id']}
                noteListSubmitStatusHandler={props.noteEditAfterSubmitHandler}
            />
            <DeleteModal
                modalId={note['id']}
                formData={deleteFormData}
                callHeaders={callHeader}
                deleteEndpoint={deleteEndpoint}
                afterDeleteRedirectUrl={redirectAfterDeleteEndpoint}
                key={"deleteNode" + note['id']}
            />
        </div> 
    ];
}



export function buildCommentCardHeader(comment){    
    let deleteFormData = new FormData();
    deleteFormData.append("objectId", comment['id']);
    deleteFormData.append("objectType", 'comment');
    let redirectAfterDeleteEndpoint = window.location.href;
    console.info(redirectAfterDeleteEndpoint)

    return [
        <div className="row">        
            <div className="col-sm-9">
                <small>
                    {"Opened on " + comment['created_at'] + " by "} <b>{AuthTool.getUserName(comment['created_by'])}</b> 
                </small>
            </div>
            <div className="col-sm-3">
                <div className="row">                    
                    <div className="col-sm-12 text-right">
                        <div class="dropdown custom-dropdown">
                            <button class="btn btn-secondary note-dropdown-toggle dropdown-toggle btn-sm note-dropdown-btn borderless-btn" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fa fa-ellipsis-h"></i>
                            </button>
                            <div class="dropdown-menu note-dropdown-menu" aria-labelledby="dropdownMenu2">                                
                                <div class="dropdown-item note-dropdown-item">
                                    <small>Copy link</small>
                                </div>
                                {comment['can_edit'] &&
                                    <span>
                                        <div class="dropdown-divider"></div>
                                        <div class="dropdown-item note-dropdown-item"><button type="button" class="btn btn-danger btn-sm note-edit-btn borderless-btn">Edit</button></div>
                                        <div class="dropdown-item note-dropdown-item">
                                            <DeleteModalBtn
                                                modalId={"_comment-" + comment['id']}                                                
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
            />
        </div> 
    ];
}



export function buildNoteAboutPart(note){
    let url = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + note['ontology_id'];
    let label = "";
    if (note['semantic_component_type'] === "ontology"){
        label = note['ontology_id'];
    }
    else if (note['semantic_component_type'] === "class"){
        url += ('/terms?iri=' + encodeURIComponent(note['semantic_component_iri']))
        label = note['semantic_component_label'];
    }
    else if (note['semantic_component_type'] === "property"){
        url += ('/props?iri=' + encodeURIComponent(note['semantic_component_iri']))
        label = note['semantic_component_label'];
    }
    else{
        url += ('/individuals?iri=' + encodeURIComponent(note['semantic_component_iri']))
        label = note['semantic_component_label'];
    }

    return (
        <a  href={url} target="_blank">
            <b>{label}</b>
        </a>
    );
}




export default NoteCardHeader;