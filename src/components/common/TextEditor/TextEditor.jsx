import React from 'react';
import { Editor } from 'react-draft-wysiwyg';


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


export default TextEditor;