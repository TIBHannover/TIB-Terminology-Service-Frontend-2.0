import React from "react";
import textEditor from "../../common/TextEditor/TextEditor";



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
                        <button type="button" class="btn btn-primary note-comment-submit-btn" onClick={this.submitNote}>Submit</button>
                    </div>
                </div>              
            </span>
        ];
    }
}

export default NoteCommnentList;


