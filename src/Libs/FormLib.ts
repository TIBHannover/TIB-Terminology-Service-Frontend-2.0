import { getTextEditorContent } from "../components/common/TextEditor/TextEditor";



class FormLib{

    static getFieldByIdIfValid(id: string):false|string{
        let field = document.getElementById(id) as HTMLInputElement;
        if(field){
            let value = field.value;
            if(!value || value === ""){
                field.style.borderColor = 'red';
                return false;
            }
            return value;
        }
        return false;
    }



    static getTextEditorValueIfValid(editorState: object, id:string):false|string{
        /*
            react-draft-wysiwyg lib editor content validation.
        */

        let textEditorWrapper = document.getElementById('rdw-wrapper-noteContent' + id) as HTMLElement;
        let textEditorTextBox = textEditorWrapper.getElementsByClassName('rdw-editor-main')[0] as HTMLElement;        
        if(!textEditorTextBox || !editorState){            
            textEditorTextBox.style.border = '1px solid red';
            return false;
        }

        let content:any = getTextEditorContent(editorState);
        let contentJson = JSON.parse(content);
        let contentText:string = contentJson?.['blocks']?.[0]?.['text'];                        
        
        if(!contentText || contentText.trim() === ""){
            textEditorTextBox.style.border = '1px solid red';
            return false;
        }
        return content;
    }



}

export default FormLib;