import { useState, useEffect, useContext } from "react";
import TextEditor from "../../../common/TextEditor/TextEditor";
import { RowWithSingleColumn } from "../../../common/Grid/BootstrapGrid";
import CommentCard from "../CommentCard";
import { AppContext } from "../../../../context/AppContext";
import Login from "../../../User/Login/TS/Login";



export const NoteCommentListRender = (props) => {

    const appContext = useContext(AppContext);

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


    const editor = <TextEditor 
                        editorState={props.commentEditorState} 
                        textChangeHandlerFunction={props.onTextAreaChange}
                        wrapperClassName="note-comment-editor-warpper"
                        editorClassName="note-comment-editor"
                        placeholder="leave a comment ..."
                        textSizeOptions={['Normal', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code']}
                    />

    const submitButton = !props.editMode && <button type="button" class="btn btn-secondary note-comment-submit-btn" onClick={props.submitComment}>Comment</button>;
    const editButton = props.editMode && <button type="button" class="btn btn-secondary note-comment-submit-btn" onClick={props.edit}>Edit</button>;
    const cancelButton = props.editMode && <button type="button" class="btn btn-secondary note-comment-cancel-edit-btn" onClick={props.cancelEdit}>Cancel</button>;
    const loginModalId = "joinConversationModal";
    const loginBtn = <div className="row text-center">
                            <div className="col-sm-12">
                                <button type="button" 
                                    class="btn btn-secondary" 
                                    data-toggle="modal" 
                                    data-target={"#" + loginModalId}
                                    data-backdrop="static"
                                    data-keyboard="false"                                    
                                    >
                                    Join this conversation
                                </button>
                            </div>
                        </div>  

    return (
        <div className="note-comment-container">
            {!props.editMode &&
                <RowWithSingleColumn 
                    content={commentListToRener}
                    columnClass="col-sm-12"
                    rowClass=""
                />
            }
            <hr></hr>                
            {appContext.user && 
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
            {!appContext.user &&
                <div className="row">
                    <div className="col-sm-12">
                        <Login isModal={true}  customLoginBtn={loginBtn} customModalId={loginModalId} />                        
                    </div>
                </div>
            }                
        </div>
    );

}