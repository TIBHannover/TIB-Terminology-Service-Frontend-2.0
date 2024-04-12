import NoteCommentList from "../NoteCommentList";
import { NoteCardHeader } from "../NoteCard";
import { buildNoteAboutPart } from "../helpers";
import ResolveReportActionsForAdmins from "../../../common/ResolveReportActions/ResolveReportAction";




export const NoteDetailRender = (props) => {

    function create_note_card(){                    
        return [
            <div className="row">
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-header">
                            <NoteCardHeader note={props.note} />              
                        </div>
                        <div class="card-body">
                            <h4 className="card-title note-list-title">{props.note['title']}</h4>
                            <ResolveReportActionsForAdmins 
                                objectType="note"
                                objectId={props.note['id']}
                                reportStatus={props.note['is_reported']}
                                creatorUsername={props.note['created_by']}
                            />
                            <small>
                                <ul className="">
                                    <li>type: {props.note['semantic_component_type']}</li>
                                    <li>About: {buildNoteAboutPart(props.note)}</li>
                                </ul>                            
                            </small>   
                            <hr></hr>
                            <p className="card-text">                                                            
                                <div dangerouslySetInnerHTML={{ __html: props.noteContent}}></div>                                
                            </p>                        
                        </div>
                    </div>                
                </div>
            </div>     
        ];
    }


    return(
        <span>
            {create_note_card()}                
            <NoteCommentList 
                note={props.note}  
                noteDetailReloader={props.reloadNoteDetail}    
            />
        </span>  
    );

}