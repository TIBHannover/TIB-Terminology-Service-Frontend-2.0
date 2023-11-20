import {React, useState, useEffect} from "react";
import { buildNoteAboutPart } from "./helpers";
import Toolkit from "../../common/Toolkit";
import { Link } from 'react-router-dom';
import AuthTool from "../../User/Login/authTools";
import {DeleteModal, DeleteModalBtn} from "../../common/DeleteModal/DeleteModal";
import NoteEdit from "./NoteEdit";
import { CopiedSuccessAlert } from "../../common/Alerts/Alerts";
import {createHtmlFromEditorJson} from "../../common/TextEditor/TextEditor";



const VISIBILITY_HELP = {
    "me": "Only you can see this Note.", 
    "internal": "Only the registered users in TS can see this Note.", 
    "public": "Everyone on the Internet can see this Note."
}

const deleteEndpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/delete';
const callHeader = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});





export const NoteCard = (props) => {
    
    let searchParams = new URLSearchParams(window.location.search);        
    searchParams.set('noteId', props.note['id']);
    searchParams.delete('page');
    searchParams.delete('size');
    searchParams.delete('type');
    let noteUrl = window.location.pathname + "?" +  searchParams.toString();

    return(
        <div className="row" key={props.note['id']}>
            <div className="col-sm-12">
                <div className="card note-list-card">
                    <div class="card-header">
                        <NoteCardHeader note={props.note} /> 
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="coll-sm-12">
                                <h6 className="card-title">
                                    <Link to={noteUrl} 
                                        className="note-list-title" 
                                        value={props.note['id']} 
                                        onClick={props.noteSelectionHandler}
                                        >
                                        {props.note['title']}
                                    </Link>
                                </h6>
                            </div>                                    
                        </div>                                
                        <p className="card-text">
                            <small>
                                <ul className="">
                                    <li>type: {props.note['semantic_component_type']}</li>
                                    <li>About: {buildNoteAboutPart(props.note)}</li>
                                </ul>                            
                            </small>                                    
                        </p>                        
                    </div>
                    <div class="card-footer note-card-footer text-muted">                                
                        <i class="fa fa-comment" aria-hidden="true"></i><small>{props.note['comments_count']}</small>
                    </div>
                </div>
            </div>
        </div>
    );
}



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



export const NoteCardHeader = (props) => {
    const [note, setNote] = useState({});
    const [linkCopied, setLinkCopied] = useState(false);

    useEffect(() => {
        setNote(props.note)
    }
    , [props.note]);


    let deleteFormData = new FormData();
    deleteFormData.append("objectId", note['id']);
    deleteFormData.append("objectType", 'note');
    deleteFormData.append("ontology_id", props.ontologyId);
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
        <div className="row" key={"note-" + note['id']}>        
            <div className="col-sm-9">
                <small>
                    {"Opened on " + note['created_at'] + " by "} <b>{AuthTool.getUserName(note['created_by'])}</b> 
                </small>
                {linkCopied && <CopiedSuccessAlert message="link copied" />}
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
                                    <small><i class="fa fa-solid fa-eye"></i>{note['visibility']}</small>
                                </div>
                                <div class="dropdown-item note-dropdown-item">
                                    <button 
                                        type="button" 
                                        class="btn btn-danger btn-sm note-edit-btn borderless-btn"                                      
                                        onClick={() => {
                                            let searchParams = new URLSearchParams(window.location.search);
                                            let locationObject = window.location;
                                            searchParams.delete('comment');
                                            searchParams.delete('page');
                                            searchParams.delete('size');
                                            searchParams.delete('type');
                                            searchParams.set('noteId', note['id']);                                             
                                            navigator.clipboard.writeText(locationObject.origin + locationObject.pathname + "?" +  searchParams.toString());
                                            setLinkCopied(true);
                                            setTimeout(() => {
                                                setLinkCopied(false);
                                            }, 2000); 
                                        }}
                                        >
                                        <i class="fa fa-solid fa-copy"></i> Link
                                    </button>
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
                                                <i class="fa fa-edit"></i> Edit
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



export const CommentCardHeader = (props) =>{
    const [comment, setComment] = useState({});
    const [linkCopied, setLinkCopied] = useState(false);

    useEffect(() => {
        setComment(props.comment);
    },[props.comment]);
    
    let deleteFormData = new FormData();
    deleteFormData.append("objectId", comment['id']);
    deleteFormData.append("objectType", 'comment');   
    deleteFormData.append("ontology_id", props.ontologyId);     
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
                    <div className="col-sm-12 text-right">
                        <div class="dropdown custom-dropdown">
                            <button class="btn btn-secondary note-dropdown-toggle dropdown-toggle btn-sm note-dropdown-btn borderless-btn" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fa fa-ellipsis-h"></i>
                            </button>
                            <div class="dropdown-menu note-dropdown-menu" aria-labelledby="dropdownMenu2">                                
                                <div class="dropdown-item note-dropdown-item">
                                    <button 
                                        type="button" 
                                        class="btn btn-danger btn-sm note-edit-btn borderless-btn"                                      
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
                                {comment['can_edit'] &&
                                    <span>
                                        <div class="dropdown-divider"></div>
                                        <div class="dropdown-item note-dropdown-item">
                                            <button 
                                                type="button" 
                                                class="btn btn-danger btn-sm note-edit-btn borderless-btn"
                                                data-id={comment['id']}
                                                data-content={comment['content']}
                                                onClick={props.editHandlerFunc}
                                                >
                                                <i class="fa fa-edit"></i> Edit
                                            </button>
                                        </div>
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



export default NoteCard;