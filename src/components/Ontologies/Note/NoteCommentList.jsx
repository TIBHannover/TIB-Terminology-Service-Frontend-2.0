import React from "react";
import textEditor from "../../common/TextEditor/TextEditor";



class NoteCommnentList extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            commentEditorState: null
        });
        this.onTextAreaChange = this.onTextAreaChange.bind(this);
    }


    onTextAreaChange = (newEditorState) => {
        // document.getElementsByClassName('rdw-editor-main')[0].style.border = '';
        this.setState({ commentEditorState: newEditorState });        
    };


    render(){
        return [
            <span>
                <div className="row">
                    <div className="col-sm-9">
                        {textEditor(this.state.commentEditorState, this.onTextAreaChange, "note-comment-editor")}
                    </div>
                </div>                
            </span>
        ];
    }
}

export default NoteCommnentList;


