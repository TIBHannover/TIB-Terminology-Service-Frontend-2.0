
export function buildHtmlAnchor(url: string, text: string): HTMLAnchorElement {
  let a = document.createElement('a') as HTMLAnchorElement;
  a.href = url;
  a.innerHTML = text;
  a.target = '_blank';
  return a;
}

export function buildOpenParanthesis(): HTMLSpanElement {
  let span = document.createElement('span');
  span.innerHTML = " ( ";
  return span;
}


export function buildCloseParanthesis(): HTMLSpanElement {
  let span = document.createElement('span');
  span.innerHTML = " ) ";
  return span;
}
