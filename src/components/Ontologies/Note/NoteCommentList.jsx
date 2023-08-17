import React from "react";
import { submitNoteComment } from "../../../api/tsMicroBackendCalls";
import draftToMarkdown from 'draftjs-to-markdown';
import { convertToRaw } from 'draft-js';
import AuthTool from "../../User/Login/authTools";
import ReactMarkdown from 'react-markdown';
import { RowWithSingleColumn } from "../../common/Grid/BootstrapGrid";
import TextEditor from "../../common/TextEditor/TextEditor";
import { buildCommentCardHeader } from "./helpers";



class NoteCommnentList extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            commentEditorState: null,
            commentListToRener: "",
            noteId: null            
        });
        this.onTextAreaChange = this.onTextAreaChange.bind(this);
        this.submitComment = this.submitComment.bind(this);
        this.createCommentList = this.createCommentList.bind(this);
    }


    onTextAreaChange = (newEditorState) => {
        document.getElementsByClassName('rdw-editor-main')[0].style.border = '';
        this.setState({ commentEditorState: newEditorState });        
    };


    createCommentList(){        
        let comments = this.props.note['comments'] ? this.props.note['comments'] : [];        
        let result = [];
        for (let comment of comments){
            let body = [
                <div className="card">
                    <div className="card-header">
                        {buildCommentCardHeader(comment)}
                    </div>
                    <div class="card-body">                        
                        <p className="card-text">
                            <ReactMarkdown>{comment['content']}</ReactMarkdown>
                        </p>                        
                    </div>
                </div> 
            ];
            result.push(
                <RowWithSingleColumn 
                    content={body}
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


    componentDidMount(){
        this.createCommentList();
    }

    componentDidUpdate(){
        if(this.state.noteId !== this.props.note['id']){
            this.createCommentList();
        }
    }


    render(){
        let editor = <TextEditor 
                        editorState={this.state.commentEditorState} 
                        textChangeHandlerFunction={this.onTextAreaChange}
                        wrapperClassName="note-comment-editor-warpper"
                        editorClassName="note-comment-editor"
                        placeholder="leave a comment ..."
                    />

        let submitButton = <button type="button" class="btn btn-primary note-comment-submit-btn" onClick={this.submitComment}>Comment</button>;

        return [
            <span>
                <RowWithSingleColumn 
                    content={this.state.commentListToRener}
                    columnClass="col-sm-12"
                    rowClass=""
                />
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
                        />
                    ]                   
                }                
            </span>
        ];
    }
}

export default NoteCommnentList;


