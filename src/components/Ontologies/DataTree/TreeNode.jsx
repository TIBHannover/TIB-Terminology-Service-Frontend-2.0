import React from "react";
import TermLib from "../../../Libs/TermLib";
import SkosLib from "../../../Libs/Skos";


class TreeNodeController {
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
  
  
  buildNodeWithReact({nodeObject, nodeIsClicked = false, isExpanded = false, isSkos = false}) {
    let nodeLabel = `${TermLib.extractLabel(nodeObject)} (${nodeObject["numDescendants"] ?? "0"})`;
    let nodeHasChildren = !isSkos ? TermLib.termHasChildren(nodeObject) : SkosLib.skosTermHasChildren(nodeObject);
    let partOfSymbol = "";
    let individualSymbol = "";
    if (nodeObject.isObsolete) {
      nodeLabel = React.createElement("s", {}, nodeLabel);
    }
    this.textDiv = React.createElement("div", {"className": "li-label-text stour-tree-node"}, nodeLabel);
    
    if (nodeObject.hasHierarchicalParents && false) {
      // find the part of relation metadat
      partOfSymbol = React.createElement("div", {"className": "p-icon-style"}, "P");
    }
    
    if (TermLib.getTermType(nodeObject) === "individual") {
      individualSymbol = React.createElement("div", {"className": "i-icon-style", "title": "individual"}, <i
        class="fa fa-solid fa-info"></i>);
    }
    
    if (nodeIsClicked) {
      this.textDivContainer = React.createElement("div", {"className": "tree-text-container clicked targetNodeByIri"}, partOfSymbol, individualSymbol, this.textDiv);
    } else {
      this.textDivContainer = React.createElement("div", {"className": "tree-text-container "}, partOfSymbol, individualSymbol, this.textDiv);
    }
    this.nodeIri = nodeObject.iri;
    if (!nodeHasChildren) {
      this.classes += " leaf-node";
      this.iconInTree = React.createElement("i", {"className": ""}, "");
    } else if (nodeHasChildren && !isExpanded) {
      this.classes += " closed";
      this.iconInTree = React.createElement("i", {
        "className": "fa fa-plus stour-tree-expand-node-icon",
        "aria-hidden": "true"
      }, "");
    } else {
      this.classes += " opened";
      this.iconInTree = React.createElement("i", {
        "className": "fa fa-minus stour-tree-expand-node-icon",
        "aria-hidden": "true"
      }, "");
    }
    
    let node = React.createElement(this.nodeRootElementName, {
        "data-iri": this.nodeIri,
        "data-id": nodeObject.id ?? TermLib.makeTermIdForTree(nodeObject),
        "className": this.classes,
        "id": nodeObject.id ?? TermLib.makeTermIdForTree(nodeObject)
      }
      , this.iconInTree, this.textDivContainer, this.children
    );
    
    return node;
    
  }
  
  
  buildNodeWithTradionalJs({nodeObject, nodeIsClicked = false, isExpanded = false, isSkos = false}) {
    let nodeLabel = `${TermLib.extractLabel(nodeObject)} (${nodeObject["numDescendants"] ?? "0"})`;
    let nodeHasChildren = !isSkos ? TermLib.termHasChildren(nodeObject) : SkosLib.skosTermHasChildren(nodeObject);
    this.textDiv = document.createElement("div");
    let label = document.createTextNode(nodeLabel);
    this.textDiv.classList.add("li-label-text");
    this.textDiv.classList.add("stour-tree-node");
    this.textDiv.appendChild(label);
    this.iconInTree = document.createElement("i");
    this.textDivContainer = document.createElement("div");
    this.textDivContainer.classList.add("tree-text-container");
    let node = document.createElement(this.nodeRootElementName);
    node.setAttribute("id", TermLib.makeTermIdForTree(nodeObject));
    node.setAttribute("data-iri", nodeObject.iri);
    node.setAttribute("data-id", TermLib.makeTermIdForTree(nodeObject));
    node.classList.add(this.classes);
    if (nodeIsClicked) {
      this.textDivContainer.classList.add("clicked");
      this.textDivContainer.classList.add("targetNodeByIri");
    }
    this.nodeIri = nodeObject.iri;
    if (!nodeHasChildren) {
      node.classList.add("leaf-node");
    } else if (nodeHasChildren && !isExpanded) {
      node.classList.add("closed");
      this.iconInTree.classList.add('fa');
      this.iconInTree.classList.add('fa-plus');
      this.iconInTree.classList.add('stour-tree-expand-node-icon');
    } else {
      node.classList.add("opened");
      this.iconInTree.classList.add('fa');
      this.iconInTree.classList.add('fa-minus');
      this.iconInTree.classList.add('stour-tree-expand-node-icon');
    }
    
    node.appendChild(this.iconInTree);
    if (nodeObject.hasHierarchicalParents && false) {
      let partOfSymbol = document.createElement("div");
      let pText = document.createTextNode("P");
      partOfSymbol.appendChild(pText);
      partOfSymbol.classList.add("p-icon-style");
      this.textDivContainer.appendChild(partOfSymbol);
    }
    
    if (TermLib.getTermType(nodeObject) === "individual") {
      let individualSymbol = document.createElement("div");
      individualSymbol.title = "individual";
      let text = document.createElement("i");
      text.classList.add("fa", "fa-solid", "fa-info");
      individualSymbol.appendChild(text);
      individualSymbol.classList.add("i-icon-style");
      this.textDivContainer.appendChild(individualSymbol);
    }
    
    this.textDivContainer.appendChild(this.textDiv);
    node.appendChild(this.textDivContainer);
    
    return node;
  }
  
  
  unClickAllNodes() {
    let selectedElement = document.querySelectorAll(".clicked");
    for (let i = 0; i < selectedElement.length; i++) {
      selectedElement[i].classList.remove("clicked");
    }
  }
  
  scrollToNode(id) {
    let position = document.getElementById(id).offsetTop;
    document.getElementsByClassName('tree-page-left-part')[0].scrollTop = position;
  }
  
  scrollToNextNode(id) {
    document.getElementsByClassName('tree-page-left-part')[0].getElementById(id).nextSibling.scrollIntoView();
  }
  
  scrollToPreviousNode(id) {
    let position = document.getElementById(id).previousSibling.offsetTop;
    document.getElementsByClassName('tree-page-left-part')[0].scrollTop = position;
  }
  
  getClickedNodeDiv(node) {
    if (node.tagName === "DIV") {
      return node;
    }
    return null;
  }
  
  getClickedNodeIri(node) {
    return node.parentNode.dataset.iri;
  }
  
  getClickedNodeId(node) {
    return node.parentNode.id;
  }
  
  getNodeLabelTextById(id) {
    return document.getElementById(id).getElementsByClassName('tree-text-container')[0];
  }
  
  getFirstNodeInTree() {
    let treeRootUl = document.getElementById('tree-root-ul');
    return treeRootUl.querySelector('li:first-child').getElementsByClassName('tree-text-container')[0];
  }
  
  getFirstChildLabelText(id) {
    return document.getElementById("children_for_" + id).getElementsByClassName('tree-text-container')[0];
  }
  
  getNodeNextSiblings(id) {
    let node = document.getElementById(id);
    return node.nextSibling.getElementsByClassName('tree-text-container')[0];
  }
  
  getParentNode(id) {
    let node = document.getElementById(id);
    return node.parentNode.parentNode;
  }
  
  getNodeChildren(id) {
    return document.getElementById("children_for_" + id).getElementsByClassName('tree-node-li');
  }
  
  isNodeExpanded(node) {
    return node.classList.contains("opened");
  }
  
  isNodeClosed(node) {
    return node.classList.contains("closed")
  }
  
  isNodeLeaf(node) {
    return node.classList.contains("leaf-node");
  }
}

export default TreeNodeController;