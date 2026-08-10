import { getTextEditorContent } from "../components/common/TextEditor/TextEditor";

class FormLib {
  static getFieldByIdIfValid(id: string): string {
    let field = document.getElementById(id) as HTMLInputElement;
    if (field) {
      let value = field.value;
      if (!value) {
        field.style.borderColor = "red";
        return "";
      }
      return value;
    }
    return "";
  }

  static getTextEditorValueIfValid(
    editorState: object,
    id: string,
  ): false | string {
    /*
        react-draft-wysiwyg lib editor content validation.
    */

    let textEditorWrapper = document.getElementById(
      "rdw-wrapper-" + id,
    ) as HTMLElement | null;
    if (!textEditorWrapper) {
      return false;
    }
    let textEditorTextBox = textEditorWrapper.getElementsByClassName(
      "rdw-editor-main",
    )[0] as HTMLElement;
    if (
      !textEditorTextBox ||
      !editorState ||
      typeof (editorState as any).getCurrentContent !== "function"
    ) {
      if (textEditorTextBox) {
        textEditorTextBox.style.border = "1px solid red";
      }
      return false;
    }

    let content: any = getTextEditorContent(editorState);
    let contentJson = JSON.parse(content);
    let contentText: string = contentJson?.["blocks"]?.[0]?.["text"];

    if (!contentText || contentText.trim() === "") {
      textEditorTextBox.style.border = "1px solid red";
      return false;
    }
    return content;
  }
}

export default FormLib;
