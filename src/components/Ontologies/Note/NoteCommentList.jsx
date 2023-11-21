import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { submitNoteComment, editNoteComment } from "../../../api/tsMicroBackendCalls";
import {getTextEditorContent, createTextEditorEmptyText, createTextEditorStateFromJson} from "../../common/TextEditor/TextEditor";
import { NoteCommentListRender } from "./renders/NoteCommentListRender";



const NoteCommentList = (props) => {
    const [commentEditorState, setCommentEditorState] = useState(createTextEditorEmptyText());    
    const [noteId, setNoteId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editCommentId, setEditCommentId] = useState(-1);

    const history = useHistory();


    function onTextAreaChange (newEditorState){
        document.getElementsByClassName('rdw-editor-main')[0].style.border = '';
        setCommentEditorState(newEditorState);        
    }


    function  handleEditButton(e){
        let commentId = e.target.getAttribute('data-id');
        let commentContent = e.target.getAttribute('data-content');
        if(commentContent){
            let content =  createTextEditorStateFromJson(commentContent);
            let editorBox = document.getElementsByClassName("note-comment-editor-warpper")[0];
            editorBox.scrollIntoView();            
            setCommentEditorState(content);
            setEditMode(true);
            setEditCommentId(commentId);       
        }
    }


    function submitComment(){
        let commentContent = "";
        let formIsValid = true;
        if(!commentEditorState){            
            document.getElementsByClassName('rdw-editor-main')[0].style.border = '1px solid red';
            formIsValid = false;
        }
        else{                    
            commentContent = getTextEditorContent(commentEditorState);
        }

        if(!commentContent || commentContent.trim() === ""){
            document.getElementsByClassName('rdw-editor-main')[0].style.border = '1px solid red';
            formIsValid = false;
        }

        if(!formIsValid){
            return;
        }

        let data = {'noteId': props.note['id'], 'content': commentContent};
        submitNoteComment(data).then((result) => {
            if(result){                
                setNoteId(null);
                setCommentEditorState(null);
                props.noteDetailReloader();            
            }
        });
    }


    function edit(){
        let commentContent = "";
        let formIsValid = true;
        if(!commentEditorState){            
            document.getElementsByClassName('rdw-editor-main')[0].style.border = '1px solid red';
            formIsValid = false;
        }
        else{               
            commentContent = getTextEditorContent(commentEditorState);
        }

        if(!commentContent || commentContent.trim() === ""){
            document.getElementsByClassName('rdw-editor-main')[0].style.border = '1px solid red';
            formIsValid = false;
        }

        if(!formIsValid){
            return;
        }

        let data = {'commentId': editCommentId, 'content': commentContent};
        editNoteComment(data).then((result) => {
            if(result){                
                setNoteId(null);
                setCommentEditorState(null);
                setEditCommentId(-1);
                setEditMode(false);
                props.noteDetailReloader();              
            }
        });
    }


    function cancelEdit(){
        let searchParams = new URLSearchParams(window.location.search);     
        searchParams.delete('comment');        
        history.push(window.location.pathname + "?" +  searchParams.toString());
        setCommentEditorState(null);
        setEditCommentId(-1);
        setEditMode(false);    
    }


    function jumpToCommentIfExist(){
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


    // useEffect(() => {

    // }, []);

    useEffect(() => {
        jumpToCommentIfExist();
    }, [props.note]);



    if(process.env.REACT_APP_NOTE_FEATURE !== "true"){            
        return null;
    }

    return (
        <NoteCommentListRender 
            note={props.note}
            handleEditButton={handleEditButton}
            commentEditorState={commentEditorState}
            onTextAreaChange={onTextAreaChange}
            editMode={editMode}
            submitComment={submitComment}
            edit={edit}
            cancelEdit={cancelEdit}
        />
    );


}



export default NoteCommentList;


