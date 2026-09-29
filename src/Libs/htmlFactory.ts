export function buildHtmlAnchor(url: string, text: string): HTMLAnchorElement {
  let a = document.createElement("a") as HTMLAnchorElement;
  a.href = url;
  a.textContent = text;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  return a;
}

export function buildOpenParanthesis(): HTMLSpanElement {
  let span = document.createElement("span");
  span.textContent = " ( ";
  return span;
}

export function buildCloseParanthesis(): HTMLSpanElement {
  let span = document.createElement("span");
  span.textContent = " ) ";
  return span;
}
