import React from "react";
import textEditor from "../../common/TextEditor/TextEditor";
import { submitNoteComment } from "../../../api/tsMicroBackendCalls";
import draftToMarkdown from 'draftjs-to-markdown';
import { convertToRaw } from 'draft-js';
import { rowWithSingleColumn } from "../../common/Grid/BootstrapGrid";



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
        document.getElementsByClassName('rdw-editor-main')[0].style.border = '';
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
        let editor = textEditor({
            editorState: this.state.commentEditorState, 
            textChangeHandlerFunction: this.onTextAreaChange,
            wrapperClassName: "note-comment-editor-warpper", 
            editorClassName: "note-comment-editor",
            placeholder: "leave a comment ..."
        });

        return [
            <span>
                {rowWithSingleColumn({content: editor, columnClass: "col-sm-9"})}
                {rowWithSingleColumn({
                    content: <button type="button" class="btn btn-primary note-comment-submit-btn" onClick={this.submitComment}>Comment</button>,
                    columnClass: "col-sm-9" 
                })}
                
            </span>
        ];
    }
}

export default NoteCommnentList;


