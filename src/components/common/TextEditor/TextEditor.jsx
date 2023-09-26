import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, EditorState, convertFromRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'dompurify';



const TextEditor = (props) =>{
    return (
        <Editor
            editorState={props.editorState}
            onEditorStateChange={props.textChangeHandlerFunction}
            wrapperClassName={props.wrapperClassName}
            editorClassName={props.editorClassName}
            placeholder={props.placeholder}          
            toolbar={{
                    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link'],
                    inline: {
                        options: ['bold', 'italic', 'underline', 'strikethrough'],
                    },
                    blockType: {
                        inDropdown: true,
                        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
                    },
                    list: {
                        inDropdown: true,
                        options: ['unordered', 'ordered'],
                    },
            }}
        />
    );
}



export function getTextEditorContent(editorState){
    let content = editorState.getCurrentContent();  
    return JSON.stringify(convertToRaw(content)); 
}


export function createTextEditorStateFromJson(jsonInput){    
    try{
        return EditorState.createWithContent(convertFromRaw(JSON.parse(jsonInput)));      
    }
    catch(e){
        let empty = createTextEditorEmptyText();
         return empty;
    }  
}



export function createHtmlFromEditorJson(jsonInput){
    try{
        let editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(jsonInput)));                       
        let noteContent = convertToRaw(editorState.getCurrentContent());
        noteContent = draftToHtml(noteContent);
        return DOMPurify.sanitize(noteContent, { USE_PROFILES: { html: true } });
    } 
    catch(e){
        return "";
    }
}



export function createTextEditorEmptyText(){
    return EditorState.createWithContent(ContentState.createFromText(''));
}


export default TextEditor;