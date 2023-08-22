import React from "react";
import { submitNoteComment, editNoteComment } from "../../../api/tsMicroBackendCalls";
import draftToMarkdown from 'draftjs-to-markdown';
import { stateFromMarkdown } from 'draft-js-import-markdown';
import { convertToRaw, EditorState } from 'draft-js';
import { RowWithSingleColumn } from "../../common/Grid/BootstrapGrid";
import TextEditor from "../../common/TextEditor/TextEditor";
import { CommentCard } from "./Cards";
import { withRouter } from 'react-router-dom';




class NoteCommnentList extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            commentEditorState: null,
            commentListToRener: "",
            noteId: null,
            editMode: false,
            editCommentId: -1
        });
        this.onTextAreaChange = this.onTextAreaChange.bind(this);
        this.submitComment = this.submitComment.bind(this);
        this.createCommentList = this.createCommentList.bind(this);
        this.handleEditButton = this.handleEditButton.bind(this);
        this.edit = this.edit.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
    }


    onTextAreaChange = (newEditorState) => {
        document.getElementsByClassName('rdw-editor-main')[0].style.border = '';
        this.setState({ commentEditorState: newEditorState });        
    };


    createCommentList(){        
        let comments = this.props.note['comments'] ? this.props.note['comments'] : [];        
        let result = [];
        for (let comment of comments){            
            result.push(
                <RowWithSingleColumn 
                    content={<CommentCard comment={comment} commentEditHandler={this.handleEditButton} />}
                    columnClass="col-sm-9"
                    rowClass="note-comment-card"                    
                />         
            );
        }
        this.setState({
            commentListToRener: result,
            noteId: this.props.note['id']
        });
    }



    handleEditButton(e){
        let commentId = e.target.getAttribute('data-id');
        let commentContent = e.target.getAttribute('data-content');
        if(commentContent){
            let content =  EditorState.createWithContent(stateFromMarkdown(commentContent));
            let editorBox = document.getElementsByClassName("note-comment-editor-warpper")[0];
            editorBox.scrollIntoView();            
            this.setState({
                commentEditorState: content,
                editMode: true,
                editCommentId: commentId
            });
        }        

    }



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
            if(result){                
                this.setState({
                    noteId: null,
                    commentEditorState: null
                }, ()=> {
                    this.props.noteDetailReloader();
                })                
            }
        });
    }


    edit(){
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

        let data = {'commentId': this.state.editCommentId, 'content': commentContent};
        editNoteComment(data).then((result) => {
            if(result){                
                this.setState({
                    noteId: null,
                    commentEditorState: null,
                    editNoteComment: -1,
                    editMode: false
                }, ()=> {
                    this.props.noteDetailReloader();
                })                
            }
        });
    }


    cancelEdit(){
        let searchParams = new URLSearchParams(window.location.search);     
        searchParams.delete('comment');
        this.props.history.push(window.location.pathname + "?" +  searchParams.toString());
        this.setState({
            editNoteComment: -1,
            editMode: false,
            commentEditorState: null
        });
    }


    jumpToCommentIfExist(){
        let searchParams = new URLSearchParams(window.location.search);     
        let commentId = searchParams.get('comment');
        let commentBox = document.getElementById("comment-card-" + commentId);
        if(commentBox){            
            commentBox.style.border = '2px solid red';            
            setTimeout(() => {
                commentBox.style.borderColor = '';
            },5000); 
            commentBox.scrollIntoView();
        }
    }


    componentDidMount(){
        this.createCommentList();        
    }

    componentDidUpdate(){
        if(this.state.noteId !== this.props.note['id']){
            this.createCommentList();            
        }
        this.jumpToCommentIfExist();
    }


    render(){
        if(!process.env.REACT_APP_NOTE_FEATURE || process.env.REACT_APP_NOTE_FEATURE !== "true"){            
            return null;
        }
        
        let editor = <TextEditor 
                        editorState={this.state.commentEditorState} 
                        textChangeHandlerFunction={this.onTextAreaChange}
                        wrapperClassName="note-comment-editor-warpper"
                        editorClassName="note-comment-editor"
                        placeholder="leave a comment ..."
                    />

        let submitButton = !this.state.editMode && <button type="button" class="btn btn-primary note-comment-submit-btn" onClick={this.submitComment}>Comment</button>;
        let editButton = this.state.editMode && <button type="button" class="btn btn-primary note-comment-submit-btn" onClick={this.edit}>Edit</button>;
        let cancelButton = this.state.editMode && <button type="button" class="btn btn-danger note-comment-cancel-edit-btn" onClick={this.cancelEdit}>Cancel</button>;

        return [
            <span>
                {!this.state.editMode &&
                    <RowWithSingleColumn 
                        content={this.state.commentListToRener}
                        columnClass="col-sm-12"
                        rowClass=""
                    />
                }
                <hr></hr>                
                {localStorage.getItem('isLoginInTs') === 'true' && 
                    [
                        <RowWithSingleColumn 
                            content={editor}
                            columnClass="col-sm-9"
                            rowClass=""
                        />,
                         <RowWithSingleColumn 
                            content={submitButton}
                            columnClass="col-sm-9"
                            rowClass=""
                        />,
                        <RowWithSingleColumn 
                            content={[editButton, cancelButton]}
                            columnClass="col-sm-9"
                            rowClass=""
                        />
                    ]                   
                }                
            </span>
        ];
    }
}

export default withRouter(NoteCommnentList);


