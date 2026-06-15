import React from "react";
import type { ReactNode } from "react";
import type { TreeTermNode } from "./types";

type BuildNodeArgs = {
  nodeObject: TreeTermNode;
  nodeIsClicked?: boolean;
  isExpanded?: boolean;
  isSkos?: boolean;
  [key: string]: any;
};

class TreeNodeController {
  classes: string;
  iconInTree: ReactNode | HTMLElement | string;
  textDivContainer: ReactNode | HTMLElement | string;
  textDiv: ReactNode | HTMLElement | string;
  nodeRootElementName: string;
  nodeIri: string;
  nodeId: string;
  children: ReactNode;

  constructor() {
    this.classes = "tree-node-li";
    this.iconInTree = "";
    this.textDivContainer = "";
    this.textDiv = "";
    this.nodeRootElementName = "li";
    this.nodeIri = "";
    this.nodeId = "";
    this.children = [];
  }

  buildNodeWithReact({
    nodeObject,
    nodeIsClicked = false,
    isExpanded = false,
    isSkos = false,
  }: BuildNodeArgs) {
    let numOfdescendant: string | number = nodeObject["numDescendants"] ?? 0;
    numOfdescendant = numOfdescendant ? `(${numOfdescendant})` : "";
    let nodeLabel: ReactNode = `${nodeObject.label ?? nodeObject.text ?? ""}${numOfdescendant}`;
    let nodeHasChildren = !isSkos
      ? nodeObject.hasChildren
      : nodeObject.hasChildren;
    let partOfSymbol: ReactNode = "";
    let individualSymbol: ReactNode = "";
    if (nodeObject.isObsolete) {
      nodeLabel = React.createElement("s", {}, nodeLabel);
    }
    this.textDiv = React.createElement(
      "div",
      { className: "li-label-text stour-tree-node" },
      nodeLabel,
    );

    if (nodeObject.hasHierarchicalParents && false) {
      // find the part of relation metadat
      partOfSymbol = React.createElement(
        "div",
        { className: "p-icon-style" },
        "P",
      );
    }

    if (nodeObject.type === "individual") {
      individualSymbol = React.createElement(
        "div",
        { className: "i-icon-style", title: "individual" },
        <i className="fa fa-solid fa-info"></i>,
      );
    }

    if (nodeIsClicked) {
      this.textDivContainer = React.createElement(
        "div",
        { className: "tree-text-container clicked targetNodeByIri" },
        partOfSymbol,
        individualSymbol,
        this.textDiv,
      );
    } else {
      this.textDivContainer = React.createElement(
        "div",
        { className: "tree-text-container " },
        partOfSymbol,
        individualSymbol,
        this.textDiv,
      );
    }
    this.nodeIri = nodeObject.iri;
    if (!nodeHasChildren) {
      this.classes += " leaf-node";
      this.iconInTree = React.createElement("i", { className: "" }, "");
    } else if (nodeHasChildren && !isExpanded) {
      this.classes += " closed";
      this.iconInTree = React.createElement(
        "i",
        {
          className: "fa fa-plus stour-tree-expand-node-icon",
          "aria-hidden": "true",
        },
        "",
      );
    } else {
      this.classes += " opened";
      this.iconInTree = React.createElement(
        "i",
        {
          className: "fa fa-minus stour-tree-expand-node-icon",
          "aria-hidden": "true",
        },
        "",
      );
    }

    let node = React.createElement(
      this.nodeRootElementName,
      {
        "data-iri": this.nodeIri,
        "data-id": nodeObject.id,
        className: this.classes,
        id: nodeObject.id,
      },
      this.iconInTree,
      this.textDivContainer,
      this.children,
    );

    return node;
  }

  buildNodeWithTradionalJs({
    nodeObject,
    nodeIsClicked = false,
    isExpanded = false,
    isSkos = false,
  }: BuildNodeArgs) {
    let numOfdescendant: string | number = nodeObject["numDescendants"] ?? 0;
    numOfdescendant = numOfdescendant ? `(${numOfdescendant})` : "";
    let nodeLabel = `${nodeObject.label ?? nodeObject.text ?? ""}${numOfdescendant}`;
    let nodeHasChildren = !isSkos
      ? nodeObject.hasChildren
      : nodeObject.hasChildren;
    this.textDiv = document.createElement("div");
    let label = document.createTextNode(nodeLabel);
    (this.textDiv as HTMLElement).classList.add("li-label-text");
    (this.textDiv as HTMLElement).classList.add("stour-tree-node");
    (this.textDiv as HTMLElement).appendChild(label);
    this.iconInTree = document.createElement("i");
    this.textDivContainer = document.createElement("div");
    (this.textDivContainer as HTMLElement).classList.add("tree-text-container");
    let node = document.createElement(this.nodeRootElementName);
    node.setAttribute("id", nodeObject.id);
    node.setAttribute("data-iri", nodeObject.iri);
    node.setAttribute("data-id", nodeObject.id);
    node.classList.add(this.classes);
    if (nodeIsClicked) {
      (this.textDivContainer as HTMLElement).classList.add("clicked");
      (this.textDivContainer as HTMLElement).classList.add("targetNodeByIri");
    }
    this.nodeIri = nodeObject.iri;
    if (!nodeHasChildren) {
      node.classList.add("leaf-node");
    } else if (nodeHasChildren && !isExpanded) {
      node.classList.add("closed");
      (this.iconInTree as HTMLElement).classList.add("fa");
      (this.iconInTree as HTMLElement).classList.add("fa-plus");
      (this.iconInTree as HTMLElement).classList.add(
        "stour-tree-expand-node-icon",
      );
    } else {
      node.classList.add("opened");
      (this.iconInTree as HTMLElement).classList.add("fa");
      (this.iconInTree as HTMLElement).classList.add("fa-minus");
      (this.iconInTree as HTMLElement).classList.add(
        "stour-tree-expand-node-icon",
      );
    }

    node.appendChild(this.iconInTree as HTMLElement);
    if (nodeObject.hasHierarchicalParents && false) {
      let partOfSymbol = document.createElement("div");
      let pText = document.createTextNode("P");
      partOfSymbol.appendChild(pText);
      partOfSymbol.classList.add("p-icon-style");
      (this.textDivContainer as HTMLElement).appendChild(partOfSymbol);
    }

    if (nodeObject.type === "individual") {
      let individualSymbol = document.createElement("div");
      individualSymbol.title = "individual";
      let text = document.createElement("i");
      text.classList.add("fa", "fa-solid", "fa-info");
      individualSymbol.appendChild(text);
      individualSymbol.classList.add("i-icon-style");
      (this.textDivContainer as HTMLElement).appendChild(individualSymbol);
    }

    (this.textDivContainer as HTMLElement).appendChild(
      this.textDiv as HTMLElement,
    );
    node.appendChild(this.textDivContainer as HTMLElement);

    return node;
  }

  unClickAllNodes() {
    let selectedElement = document.querySelectorAll(".clicked");
    for (let i = 0; i < selectedElement.length; i++) {
      selectedElement[i].classList.remove("clicked");
    }
  }

  scrollToNode(id: string | null) {
    if (!id) return;
    let position = document.getElementById(id)?.offsetTop ?? 0;
    (
      document.getElementsByClassName("tree-page-left-part")[0] as
        | HTMLElement
        | undefined
    )?.scrollTo({
      top: position,
    });
  }

  scrollToNextNode(id: string | null) {
    if (!id) return;
    (
      document.getElementById(id)?.nextSibling as HTMLElement | null
    )?.scrollIntoView();
  }

  scrollToPreviousNode(id: string | null) {
    if (!id) return;
    let position =
      (document.getElementById(id)?.previousSibling as HTMLElement | null)
        ?.offsetTop ?? 0;
    (
      document.getElementsByClassName("tree-page-left-part")[0] as
        | HTMLElement
        | undefined
    )?.scrollTo({
      top: position,
    });
  }

  getClickedNodeDiv(node: any): HTMLElement | null {
    if (node.tagName === "DIV") {
      return node;
    }
    return null;
  }

  getClickedNodeIri(node: any): string {
    return node.parentNode?.dataset?.iri ?? "";
  }

  getClickedNodeId(node: any): string {
    return node.parentNode?.id ?? "";
  }

  getNodeLabelTextById(id: string): HTMLElement {
    return document
      .getElementById(id)
      ?.getElementsByClassName("tree-text-container")[0] as HTMLElement;
  }

  getFirstNodeInTree(): HTMLElement {
    let treeRootUl = document.getElementById("tree-root-ul");
    return treeRootUl
      ?.querySelector("li:first-child")
      ?.getElementsByClassName("tree-text-container")[0] as HTMLElement;
  }

  getFirstChildLabelText(id: string): HTMLElement {
    return document
      .getElementById("children_for_" + id)
      ?.getElementsByClassName("tree-text-container")[0] as HTMLElement;
  }

  getNodeNextSiblings(id: string): HTMLElement {
    let node = document.getElementById(id);
    return (node?.nextSibling as HTMLElement | null)?.getElementsByClassName(
      "tree-text-container",
    )[0] as HTMLElement;
  }

  getParentNode(id: string): HTMLElement {
    let node = document.getElementById(id);
    return node?.parentNode?.parentNode as HTMLElement;
  }

  getNodeChildren(id: string): HTMLCollectionOf<Element> {
    return document
      .getElementById("children_for_" + id)
      ?.getElementsByClassName("tree-node-li") as HTMLCollectionOf<Element>;
  }

  isNodeExpanded(node: any): boolean {
    return node.classList.contains("opened");
  }

  isNodeClosed(node: any): boolean {
    return node.classList.contains("closed");
  }

  isNodeLeaf(node: any): boolean {
    return node.classList.contains("leaf-node");
  }
}

export default TreeNodeController;
