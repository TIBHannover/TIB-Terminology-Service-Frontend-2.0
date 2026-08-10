import { MouseEvent, useEffect, useRef, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../layout/textEditor.css";
import {
  convertToRaw,
  EditorState,
  convertFromRaw,
  ContentState,
  RichUtils,
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

const FONT_SIZE_OPTIONS = [
  "8",
  "9",
  "10",
  "11",
  "12",
  "14",
  "16",
  "18",
  "24",
  "30",
  "36",
  "48",
  "60",
  "72",
  "96",
];

const BLOCK_TYPE_MAP: Record<string, string> = {
  Normal: "unstyled",
  H1: "header-one",
  H2: "header-two",
  H3: "header-three",
  H4: "header-four",
  H5: "header-five",
  H6: "header-six",
  Blockquote: "blockquote",
  Code: "code-block",
};

const LIST_TYPE_MAP: Record<string, string> = {
  unordered: "unordered-list-item",
  ordered: "ordered-list-item",
};

const TextEditor = (props: TextEditorProps) => {
  const [emptyEditorState] = useState(createTextEditorEmptyText);
  const [editorIsReady, setEditorIsReady] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const editorState = props.editorState ?? emptyEditorState;
  const editorStateRef = useRef(editorState);
  const fallbackTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setEditorIsReady(true);
    });

    return () => {
      window.clearTimeout(timeoutId);
      clearFallbackTimeout();
      closeFallbackDropdowns();
    };
  }, []);

  useEffect(() => {
    editorStateRef.current = editorState;
  }, [editorState]);

  function onModalClick(event: MouseEvent<HTMLDivElement>) {
    openFallbackDropdown(event);

    setTimeout(() => {
      /*  Auto focus on the insert link part when link option is open in toolbar.
                Time out is needed since it takes abit to load the link view after clicking.
            */
      (document.getElementById("linkTarget") as HTMLElement | null)?.focus();
    }, 200);
  }

  function openFallbackDropdown(event: MouseEvent<HTMLDivElement>) {
    const dropdown = (event.target as HTMLElement).closest(
      ".rdw-dropdown-wrapper",
    ) as HTMLElement | null;
    if (!dropdown) {
      closeFallbackDropdowns();
      return;
    }

    const fallbackDropdown = dropdown.querySelector(
      ".text-editor-fallback-dropdown",
    );
    if (fallbackDropdown) {
      fallbackDropdown.remove();
      dropdown.setAttribute("aria-expanded", "false");
      return;
    }

    const hadOptionWrapper = !!dropdown.querySelector(
      ".rdw-dropdown-optionwrapper",
    );

    clearFallbackTimeout();
    fallbackTimeoutRef.current = window.setTimeout(() => {
      if (
        hadOptionWrapper ||
        dropdown.querySelector(".rdw-dropdown-optionwrapper")
      ) {
        return;
      }

      const type = dropdown.classList.contains("rdw-fontsize-dropdown")
        ? "fontSize"
        : dropdown.classList.contains("rdw-block-dropdown")
          ? "blockType"
          : dropdown.classList.contains("rdw-list-dropdown")
            ? "list"
            : null;

      if (type) {
        renderFallbackDropdown(dropdown, type);
      }
    });
  }

  function clearFallbackTimeout() {
    if (fallbackTimeoutRef.current !== null) {
      window.clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }
  }

  function closeFallbackDropdowns() {
    rootRef.current
      ?.querySelectorAll(".text-editor-fallback-dropdown")
      .forEach((dropdown) => dropdown.remove());
    rootRef.current
      ?.querySelectorAll(".rdw-dropdown-wrapper[aria-expanded='true']")
      .forEach((dropdown) => dropdown.setAttribute("aria-expanded", "false"));
  }

  function renderFallbackDropdown(
    dropdown: HTMLElement,
    type: "blockType" | "fontSize" | "list",
  ) {
    closeFallbackDropdowns();
    dropdown.setAttribute("aria-expanded", "true");

    const optionWrapper = document.createElement("ul");
    optionWrapper.className =
      "rdw-dropdown-optionwrapper text-editor-fallback-dropdown";
    optionWrapper.setAttribute("role", "listbox");

    getFallbackOptions(type).forEach((option) => {
      const optionElement = document.createElement("li");
      optionElement.className = "rdw-dropdownoption-default";
      optionElement.textContent = option;
      optionElement.tabIndex = 0;
      optionElement.setAttribute("role", "option");
      optionElement.addEventListener("click", (event) => {
        event.stopPropagation();
        applyFallbackOption(type, option);
      });
      optionElement.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          applyFallbackOption(type, option);
        }
      });
      optionWrapper.appendChild(optionElement);
    });

    dropdown.appendChild(optionWrapper);
  }

  function applyFallbackOption(
    type: "blockType" | "fontSize" | "list",
    option: string,
  ) {
    const editorState = editorStateRef.current;
    let nextEditorState = editorState;

    if (type === "fontSize") {
      nextEditorState = RichUtils.toggleInlineStyle(
        editorState,
        `fontsize-${option}`,
      );
    }

    if (type === "blockType") {
      if (!BLOCK_TYPE_MAP[option]) {
        return;
      }
      nextEditorState = RichUtils.toggleBlockType(
        editorState,
        BLOCK_TYPE_MAP[option],
      );
    }

    if (type === "list") {
      nextEditorState = RichUtils.toggleBlockType(
        editorState,
        LIST_TYPE_MAP[option] ?? option,
      );
    }

    props.textChangeHandlerFunction(nextEditorState);
    closeFallbackDropdowns();
  }

  function getFallbackOptions(type: "blockType" | "fontSize" | "list") {
    if (type === "fontSize") {
      return FONT_SIZE_OPTIONS;
    }
    if (type === "blockType") {
      return props.textSizeOptions;
    }
    return ["unordered", "ordered"];
  }

  return (
    <div ref={rootRef} onClick={onModalClick}>
      {editorIsReady && (
        <Editor
          editorState={editorState}
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
      )}
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
