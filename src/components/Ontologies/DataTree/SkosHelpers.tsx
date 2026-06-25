import React from "react";
import type { ReactNode } from "react";
import SkosApi from "../../../api/skos";
import TreeNodeController from "./TreeNode";

export default class SkosHelper {
  static async buildSkosTree(
    ontologyId: string,
    targetIri: string | null = null,
    fullTree = false,
    lang = "en",
  ) {
    let subTreeObject = await SkosHelper.buildSkosSubTree(
      ontologyId,
      targetIri,
      lang,
      fullTree,
    );
    let ul: ReactNode = subTreeObject.ul;
    let subTreeRoot =
      subTreeObject.treeNodesArray[subTreeObject.treeNodesArray.length - 1];
    if (fullTree) {
      ul = await SkosHelper.buildSkosFullTree(
        ontologyId,
        subTreeRoot?.iri ?? "",
        subTreeObject.nodeSubTree,
      );
    } else {
      ul = React.createElement(
        "ul",
        { className: "tree-node-ul", id: "tree-root-ul" },
        subTreeObject.nodeSubTree,
      );
    }
    return ul;
  }

  static async buildSkosSubTree(
    ontologyId: string,
    iri: string | null,
    lang: string,
    fullTree = false,
  ) {
    let treeNodes: any[] = [];
    let skosApi = new SkosApi({
      ontologyId: ontologyId,
      iri: iri,
      lang: lang,
    } as any);
    treeNodes.push(await skosApi.fetchSkosTerm());
    let targetNodeIri = iri;
    while (true) {
      // we need to call the parent from the target node to the top (bottom-up) to build the sub-tree
      let res = await skosApi.fetchSkosTermParent();
      if (!res) {
        break;
      }
      treeNodes.push(res);
      skosApi.setIri(res["iri"]);
    }
    let nodeInTree: ReactNode = "";
    let childNode: ReactNode = "";
    let ul: ReactNode = "";
    for (let i = 0; i < treeNodes.length; i++) {
      let node: any = treeNodes[i];
      let leafClass = i !== 0 ? "opened" : "closed";
      let clickedClass = i === 0 ? " clicked" : "";
      let symbol: ReactNode = React.createElement(
        "i",
        { className: "fa fa-minus", "aria-hidden": "true" },
        "",
      );
      let textSpan = React.createElement(
        "div",
        { className: "li-label-text" },
        node.label,
      );
      let containerSpan = React.createElement(
        "div",
        { className: "tree-text-container" + clickedClass },
        textSpan,
      );
      if (!node.hasChildren) {
        leafClass = "leaf-node";
        symbol = React.createElement("i", { className: "" }, "");
      } else if (node.hasChildren && i === 0) {
        symbol = React.createElement(
          "i",
          { className: "fa fa-plus", "aria-hidden": "true" },
          "",
        );
      }
      nodeInTree = React.createElement(
        "li",
        {
          "data-iri": node.iri,
          "data-id": node.iri,
          className: "tree-node-li " + leafClass,
          id: node.iri,
        },
        symbol,
        containerSpan,
        childNode,
      );

      let parentId =
        i + 1 < treeNodes.length
          ? "children_for_" + treeNodes[i + 1].iri
          : false;
      if (!parentId) {
        break;
      }

      if (fullTree && node.iri === targetNodeIri) {
        let siblingsNodes = await SkosHelper.createSiblingsNodes(
          ontologyId,
          targetNodeIri,
        );
        siblingsNodes.unshift(nodeInTree);
        ul = React.createElement(
          "ul",
          { className: "tree-node-ul", id: parentId },
          siblingsNodes,
        );
      } else {
        ul = React.createElement(
          "ul",
          { className: "tree-node-ul", id: parentId },
          nodeInTree,
        );
      }

      childNode = ul;
    }
    return { ul: ul, nodeSubTree: nodeInTree, treeNodesArray: treeNodes };
  }

  static async buildSkosFullTree(
    skosOntologyId: string,
    excludedRootNodeIri: string | null = null,
    exludedRootNodeSubtreeContent: ReactNode = null,
  ) {
    let listOfNodes: ReactNode[] = [];
    let skosApi = new SkosApi({ ontologyId: skosOntologyId, iri: "" } as any);
    let rootNodes = await skosApi.fetchRootConcepts();
    for (let i = 0; i < rootNodes.length; i++) {
      let node: any = rootNodes[i];
      if (node.iri !== excludedRootNodeIri) {
        let leafClass = " closed";
        let symbol: ReactNode = React.createElement(
          "i",
          { className: "fa fa-plus", "aria-hidden": "true" },
          "",
        );
        let textSpan = React.createElement(
          "div",
          { className: "li-label-text" },
          node.text,
        );
        let containerSpan = React.createElement(
          "div",
          { className: "tree-text-container" },
          textSpan,
        );
        if (!node.has_children) {
          leafClass = " leaf-node";
          symbol = React.createElement("i", { className: "" }, "");
        }
        let element = React.createElement(
          "li",
          {
            "data-iri": node.iri,
            "data-id": node.iri,
            className: "tree-node-li" + leafClass,
            id: node.iri,
          },
          symbol,
          containerSpan,
        );
        listOfNodes.push(element);
      } else {
        listOfNodes.push(exludedRootNodeSubtreeContent);
      }
    }
    return React.createElement(
      "ul",
      { className: "tree-node-ul", id: "tree-root-ul" },
      listOfNodes,
    );
  }

  static async createSiblingsNodes(
    ontologyId: string,
    targetNodeIri: string | null,
  ) {
    let skosApi = new SkosApi({
      ontologyId: ontologyId,
      iri: targetNodeIri,
    } as any);
    let parentNode = await skosApi.fetchSkosTermParent();
    let siblingsNodes: any[] = [];
    let nodesToRender: ReactNode[] = [];
    if (!parentNode) {
      // node is root. We fetch other roots.
      let skosApi = new SkosApi({ ontologyId: ontologyId, iri: "" } as any);
      siblingsNodes = await skosApi.fetchRootConcepts();
    } else {
      let skosApi = new SkosApi({
        ontologyId: ontologyId,
        iri: parentNode.iri,
      } as any);
      siblingsNodes = await skosApi.fetchChildrenForSkosTerm();
    }

    for (let i = 0; i < siblingsNodes.length; i++) {
      let node = siblingsNodes[i];
      if (node.iri !== targetNodeIri) {
        let treeNode = new TreeNodeController();
        let listItem = treeNode.buildNodeWithReact({ nodeObject: node });
        nodesToRender.push(listItem);
      }
    }
    return nodesToRender;
  }

  static async showHidesiblingsForSkos(
    showFlag: boolean,
    ontologyId: string,
    iri: string,
    skosRoot: string,
    lang: string,
  ) {
    let skosApi = new SkosApi({
      ontologyId: ontologyId,
      iri: iri,
      lang: lang,
    } as any);
    let parent = await skosApi.fetchSkosTermParent();
    let siblingsNodes: any[] = [];
    let targetUl: HTMLElement | null = null;
    let children: HTMLElement[] = [];
    let treeNode = new TreeNodeController();
    if (showFlag) {
      // Show the siblings
      if (!parent) {
        // Node is a root
        let skosApi = new SkosApi({
          ontologyId: ontologyId,
          iri: "",
          skosRoot: skosRoot,
          lang: lang,
        } as any);
        siblingsNodes = await skosApi.fetchRootConcepts();
        targetUl = document.getElementById("tree-root-ul");
      } else {
        let skosApi = new SkosApi({
          ontologyId: ontologyId,
          iri: parent.iri,
          lang: lang,
        } as any);
        siblingsNodes = await skosApi.fetchChildrenForSkosTerm();
        targetUl = document.getElementById("children_for_" + parent.iri);
      }
      for (let node of siblingsNodes) {
        if (node.iri !== iri) {
          let listItem = treeNode.buildNodeWithTradionalJs({
            nodeObject: node,
            isSkos: true,
          });
          targetUl?.appendChild(listItem);
        }
      }
    } else {
      // Hide the siblings
      if (!parent) {
        // root node
        targetUl = document.getElementById("tree-root-ul");
        children = Array.from(targetUl?.childNodes ?? []) as HTMLElement[];
      } else {
        targetUl = document.getElementById("children_for_" + parent.iri);
        children = Array.from(targetUl?.childNodes ?? []) as HTMLElement[];
      }
      for (let i = 0; i < children.length; i++) {
        if (children[i].dataset.iri !== iri) {
          children[i].remove();
        }
      }
    }
  }
}
