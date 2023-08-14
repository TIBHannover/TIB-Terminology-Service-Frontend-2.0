import { Editor } from 'react-draft-wysiwyg';


export default function textEditor({editorState, textChangeHandlerFunction, wrapperClassName="", placeholder=""}){
    return [
        <Editor
            editorState={editorState}
            onEditorStateChange={textChangeHandlerFunction}
            wrapperClassName={wrapperClassName}
            placeholder={placeholder}          
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
    ];
}