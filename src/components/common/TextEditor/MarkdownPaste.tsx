import { ContentState, convertFromRaw, convertToRaw, genKey } from "draft-js";
import { stateFromMarkdown } from "draft-js-import-markdown";
import draftToHtml from "draftjs-to-html";
import DOMPurify from "dompurify";

const TABLE_ENTITY = "MARKDOWN_TABLE";

function splitTableRow(line: string) {
  return line.trim().replace(/^\\?\||(?<!\\)\|$/g, "").split(/(?<!\\)\|/)
    .map((cell) => cell.trim().replace(/\\\|/g, "|"));
}

function tableHtml(rows: string[][], separators: string[]) {
  return `<table class="table table-bordered"><thead>${rows.map((row, index) => {
    const tag = index === 0 ? "th" : "td";
    const cells = separators.map((separator, column) => {
      const alignment = separator.endsWith(":")
        ? separator.startsWith(":") ? "text-center" : "text-end"
        : "text-start";
      const html = draftToHtml(convertToRaw(stateFromMarkdown(row[column] || "")))
        .replace(/^<p>|<\/p>\s*$/g, "");
      return `<${tag} class="${alignment}">${html}</${tag}>`;
    }).join("");
    return `${index === 1 ? "</thead><tbody>" : ""}<tr>${cells}</tr>`;
  }).join("")}${rows.length === 1 ? "</thead>" : "</tbody>"}</table>`;
}

export function createMarkdownPasteContent(text: string) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const blocks: any[] = [];
  let pending: string[] = [];
  let fence = "";

  function flush() {
    if (pending.length) {
      const text = pending.join("\n");
      blocks.push(...(text.trim() ? stateFromMarkdown(text) : ContentState.createFromText(text))
        .getBlocksAsArray());
      pending = [];
    }
  }

  for (let index = 0; index < lines.length; index++) {
    const marker = lines[index].match(/^ {0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) {
        fence = marker[1];
      } else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) {
        fence = "";
      }
    }
    const separators = splitTableRow(lines[index + 1] || "");
    if (fence || /^(?: {4}| {0,3}\t)/.test(lines[index]) || !lines[index].includes("|") ||
      !separators.every((cell) => /^:?-{3,}:?$/.test(cell)) ||
      splitTableRow(lines[index]).length !== separators.length) {
      pending.push(lines[index]);
      continue;
    }

    flush();
    if (!blocks.length) {
      blocks.push(...ContentState.createFromText("").getBlocksAsArray());
    }
    const rows = [splitTableRow(lines[index])];
    index++;
    while (index + 1 < lines.length && lines[index + 1].includes("|")) {
      rows.push(splitTableRow(lines[++index]));
    }
    const tableText = rows.map((row) => row.join(" | ")).join("; ");
    blocks.push(...convertFromRaw({
      blocks: [{
        key: genKey(), text: tableText, type: "atomic", depth: 0,
        inlineStyleRanges: [], entityRanges: [{ offset: 0, length: tableText.length, key: 0 }], data: {},
      }],
      entityMap: { 0: {
        type: TABLE_ENTITY, mutability: "IMMUTABLE",
        data: { html: DOMPurify.sanitize(tableHtml(rows, separators)) },
      } },
    }).getBlocksAsArray());
  }
  flush();
  if (blocks[blocks.length - 1]?.getType() === "atomic") {
    blocks.push(...ContentState.createFromText("").getBlocksAsArray());
  }
  return ContentState.createFromBlockArray(blocks);
}

export function hasRichClipboardHtml(html: string, text: string) {
  if (!html || /^ {0,3}(?:#{1,6}\s|>\s|`{3,}|~{3,})/m.test(text) ||
    /\*\*\S[^\n]*?\*\*|__\S[^\n]*?__|`[^`\n]+`|\[[^\]\n]+\]\([^\n]+\)/.test(text)) {
    return false;
  }
  const document = new DOMParser().parseFromString(DOMPurify.sanitize(html), "text/html");
  return Array.from(document.querySelectorAll(
    "h1,h2,h3,h4,h5,h6,strong,b,em,i,u,s,del,blockquote,ul,ol,table,a[href],img,[style]",
  )).some((element) => {
    if (element.closest("pre,code")) return false;
    if (element.tagName === "A") {
      return element.textContent?.trim() !== element.getAttribute("href");
    }
    if (element.matches("h1,h2,h3,h4,h5,h6,strong,b,em,i,u,s,del,blockquote,ul,ol,table,img")) {
      return true;
    }
    const style = (element as HTMLElement).style;
    return style.fontWeight === "bold" || Number(style.fontWeight) >= 600 ||
      style.fontStyle === "italic" ||
      /underline|line-through/.test(`${style.textDecoration} ${style.textDecorationLine}`);
  });
}

function MarkdownTable({ block, contentState }) {
  return <div className="table-responsive" dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(contentState.getEntity(block.getEntityAt(0)).getData().html),
  }} />;
}

export function renderMarkdownTableBlock(block, _config, getEditorState) {
  if (block.getType() === "atomic" && block.getEntityAt(0) !== null &&
    getEditorState().getCurrentContent().getEntity(block.getEntityAt(0)).getType() === TABLE_ENTITY) {
    return { component: MarkdownTable, editable: false };
  }
}

export function markdownTableEntityToHtml(entity) {
  if (entity.type === TABLE_ENTITY) return DOMPurify.sanitize(entity.data.html);
}
