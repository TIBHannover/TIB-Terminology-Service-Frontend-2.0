import React from "react";
import NoteCardHeader from "./helpers";
import { buildNoteAboutPart } from "./helpers";
import Toolkit from "../../common/Toolkit";
import { Link } from 'react-router-dom';
import { CommentCardHeader } from "./helpers";
import ReactMarkdown from 'react-markdown';




export const NoteCard = (props) => {

    let noteUrl = Toolkit.setParamInUrl('noteId', props.note['id']);

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
                                <h5 className="card-title">
                                    <Link to={noteUrl} 
                                        className="note-list-title" 
                                        value={props.note['id']} 
                                        onClick={props.noteSelectionHandler}
                                        >
                                        {props.note['title']}
                                    </Link>
                                </h5>
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
    
    return (
        <div className="card">
            <div className="card-header">
                <CommentCardHeader comment={props.comment}  editHandlerFunc={props.commentEditHandler} />                        
            </div>
            <div class="card-body">                        
                <p className="card-text">
                    <ReactMarkdown>{props.comment['content']}</ReactMarkdown>
                </p>                        
            </div>
        </div>
    );
}






export default NoteCard;