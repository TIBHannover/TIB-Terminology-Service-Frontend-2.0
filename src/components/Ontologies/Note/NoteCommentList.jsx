import React from "react";
import textEditor from "../../common/TextEditor/TextEditor";
import { submitNoteComment } from "../../../api/tsMicroBackendCalls";
import draftToMarkdown from 'draftjs-to-markdown';
import { convertToRaw } from 'draft-js';



class NoteCommnentList extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            commentEditorState: null
        });
        this.onTextAreaChange = this.onTextAreaChange.bind(this);
        this.submitComment = this.submitComment.bind(this);
    }


    onTextAreaChange = (newEditorState) => {
        // document.getElementsByClassName('rdw-editor-main')[0].style.border = '';
        this.setState({ commentEditorState: newEditorState });        
    };


    submitComment(){
        let commentContent = "";
        let formIsValid = true;
        if(!this.state.commentEditorState){            
            document.getElementsByClassName('rdw-editor-main')[0].style.border = '1px solid red';
            formIsValid = false;
        }
        else{
            commentContent = this.state.commentEditorState.getCurrentContent();        
            commentContent = draftToMarkdown(convertToRaw(commentContent));  
        }

        if(!commentContent || commentContent.trim() === ""){
            document.getElementsByClassName('rdw-editor-main')[0].style.border = '1px solid red';
            formIsValid = false;
        }

        if(!formIsValid){
            return;
        }

        let data = {'noteId': this.props.note['id'], 'content': commentContent};
        submitNoteComment(data).then((result) => {
            console.info(result);
        });
    }


    render(){
        return [
            <span>
                <div className="row">
                    <div className="col-sm-9">
                        {textEditor({
                            editorState: this.state.commentEditorState, 
                            textChangeHandlerFunction: this.onTextAreaChange,
                            wrapperClassName: "note-comment-editor-warpper", 
                            editorClassName: "note-comment-editor",
                            placeholder: "leave a comment ..."
                        })}
                    </div>
                </div>  
                <div className="row">
                    <div className="col-sm-9">
                        <button type="button" class="btn btn-primary note-comment-submit-btn" onClick={this.submitComment}>Comment</button>
                    </div>
                </div>              
            </span>
        ];
    }
}

export default NoteCommnentList;


