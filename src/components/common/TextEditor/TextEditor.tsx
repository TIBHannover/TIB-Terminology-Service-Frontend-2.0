import { Editor } from "react-draft-wysiwyg";
import {
  convertToRaw,
  EditorState,
  convertFromRaw,
  ContentState,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import DOMPurify from "dompurify";

type TextEditorProps = {
  editorState: any;
  textChangeHandlerFunction: (editorState: any) => void;
  wrapperClassName?: string;
  editorClassName?: string;
  placeholder?: string;
  wrapperId?: string;
  textSizeOptions: string[];
};

const TextEditor = (props: TextEditorProps) => {
  function onModalClick() {
    setTimeout(() => {
      /*  Auto focus on the insert link part when link option is open in toolbar.
                Time out is needed since it takes abit to load the link view after clicking.
            */
      (document.getElementById("linkTarget") as HTMLElement | null)?.focus();
    }, 200);
  }

  return (
    <div onClick={onModalClick}>
      <Editor
        editorState={props.editorState}
        onEditorStateChange={props.textChangeHandlerFunction}
        wrapperClassName={props.wrapperClassName}
        editorClassName={props.editorClassName}
        placeholder={props.placeholder}
        wrapperId={props.wrapperId}
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "list",
            "textAlign",
            "colorPicker",
            "link",
          ],
          inline: {
            options: ["bold", "italic", "underline", "strikethrough"],
          },
          blockType: {
            inDropdown: true,
            options: props.textSizeOptions,
          },
          list: {
            inDropdown: true,
            options: ["unordered", "ordered"],
          },
        }}
      />
    </div>
  );
};

export function getTextEditorContent(editorState: any) {
  let content = editorState.getCurrentContent();
  return JSON.stringify(convertToRaw(content));
}

export function createTextEditorStateFromJson(jsonInput: string) {
  try {
    return EditorState.createWithContent(convertFromRaw(JSON.parse(jsonInput)));
  } catch (e) {
    let empty = createTextEditorEmptyText();
    return empty;
  }
}

export function createHtmlFromEditorJson(jsonInput: string) {
  try {
    let editorState = EditorState.createWithContent(
      convertFromRaw(JSON.parse(jsonInput)),
    );
    let noteContent = convertToRaw(editorState.getCurrentContent());
    noteContent = draftToHtml(noteContent);
    return DOMPurify.sanitize(noteContent, { USE_PROFILES: { html: true } });
  } catch (e) {
    return "";
  }
}

export function createTextEditorEmptyText() {
  return EditorState.createWithContent(ContentState.createFromText(""));
}

export default TextEditor;
