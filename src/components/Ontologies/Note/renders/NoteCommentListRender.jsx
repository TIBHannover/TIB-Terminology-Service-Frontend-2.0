import { useState, useEffect } from "react";
import TextEditor from "../../../common/TextEditor/TextEditor";
import { RowWithSingleColumn } from "../../../common/Grid/BootstrapGrid";
import { CommentCard } from "../Cards";



export const NoteCommentListRender = (props) => {

    const [commentListToRener, setCommentListToRener] = useState("");

    useEffect(() => {
        createCommentList();
    }, [props.note]);



    function createCommentList(){        
        let comments = props.note['comments'] ? props.note['comments'] : [];        
        let result = [];
        for (let comment of comments){            
            result.push(
                <RowWithSingleColumn 
                    content={<CommentCard comment={comment} commentEditHandler={props.handleEditButton} />}
                    columnClass="col-sm-12"
                    rowClass="note-comment-card"                    
                />         
            );
        }
        setCommentListToRener(result);       
    }


    let editor = <TextEditor 
                        editorState={props.commentEditorState} 
                        textChangeHandlerFunction={props.onTextAreaChange}
                        wrapperClassName="note-comment-editor-warpper"
                        editorClassName="note-comment-editor"
                        placeholder="leave a comment ..."
                        textSizeOptions={['Normal', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code']}
                    />

        let submitButton = !props.editMode && <button type="button" class="btn btn-secondary note-comment-submit-btn" onClick={props.submitComment}>Comment</button>;
        let editButton = props.editMode && <button type="button" class="btn btn-secondary note-comment-submit-btn" onClick={props.edit}>Edit</button>;
        let cancelButton = props.editMode && <button type="button" class="btn btn-secondary note-comment-cancel-edit-btn" onClick={props.cancelEdit}>Cancel</button>;

    return (
        <span>
            {!props.editMode &&
                <RowWithSingleColumn 
                    content={commentListToRener}
                    columnClass="col-sm-12"
                    rowClass=""
                />
            }
            <hr></hr>                
            {localStorage.getItem('isLoginInTs') === 'true' && 
                [
                    <RowWithSingleColumn 
                        content={editor}
                        columnClass="col-sm-12"
                        rowClass=""
                    />,
                        <RowWithSingleColumn 
                        content={submitButton}
                        columnClass="col-sm-12"
                        rowClass=""
                    />,
                    <RowWithSingleColumn 
                        content={[editButton, cancelButton]}
                        columnClass="col-sm-12"
                        rowClass=""
                    />
                ]                   
            }                
        </span>
    );

}