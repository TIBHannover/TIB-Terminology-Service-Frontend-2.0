/// <reference types="react-scripts" />

declare module "*.md" {
  const content: string;
  export default content;
}

interface Element {
  dataset: DOMStringMap;
  href: string;
  rel: string;
  style: CSSStyleDeclaration;
  click(): void;
}

interface HTMLElement {
  checked: any;
  value: any;
}

interface ParentNode {
  click(): void;
}

declare namespace React {
  interface AnchorHTMLAttributes<T> {
    authProvider?: string;
  }

  interface OptionHTMLAttributes<T> {
    url?: string;
  }
}
