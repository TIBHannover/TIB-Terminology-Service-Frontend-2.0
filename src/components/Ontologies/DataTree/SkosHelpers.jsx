import React from 'react';
import SkosApi from '../../../api/skos';
import SkosLib from '../../../Libs/Skos';
import TreeNodeController from './TreeNode';


export default class SkosHelper {


  static async buildSkosTree(ontologyId, targetIri = null, fullTree = false) {
    let subTreeObject = await SkosHelper.buildSkosSubTree(ontologyId, targetIri, fullTree);
    let ul = subTreeObject.ul;
    let subTreeRoot = subTreeObject.treeNodesArray[subTreeObject.treeNodesArray.length - 1];
    if (fullTree) {
      ul = await SkosHelper.buildSkosFullTree(ontologyId, subTreeRoot.iri, subTreeObject.nodeSubTree);
    }
    else {
      ul = React.createElement("ul", { className: "tree-node-ul", id: "tree-root-ul" }, subTreeObject.nodeSubTree);
    }
    return ul;
  }



  static async buildSkosSubTree(ontologyId, iri, fullTree = false) {
    let treeNodes = [];
    let skosApi = new SkosApi({ ontologyId: ontologyId, iri: iri });
    await skosApi.fetchSkosTerm();
    treeNodes.push(skosApi.skosTerm);
    let targetNodeIri = iri;
    while (true) {
      // we need to call the parent from the target node to the top (bottom-up) to build the sub-tree
      let res = await skosApi.fetchSkosTermParent();
      if (!res) {
        break;
      }
      res['has_children'] = SkosLib.skosTermHasChildren(res);
      treeNodes.push(res);
      skosApi.setIri(res['iri']);
    }
    let nodeInTree = "";
    let childNode = "";
    let ul = "";
    for (let i = 0; i < treeNodes.length; i++) {
      let node = treeNodes[i];
      let leafClass = i !== 0 ? " opened" : " closed";
      let clickedClass = i === 0 ? " clicked" : "";
      let symbol = React.createElement("i", { "className": "fa fa-minus", "aria-hidden": "true" }, "");
      let textSpan = React.createElement("div", { "className": "li-label-text" }, node.label);
      let containerSpan = React.createElement("div", { "className": "tree-text-container" + clickedClass }, textSpan);
      if (!node.has_children) {
        leafClass = " leaf-node";
        symbol = React.createElement("i", { "className": "" }, "");
      }
      else if (node.has_children && i === 0) {
        symbol = React.createElement("i", { "className": "fa fa-plus", "aria-hidden": "true" }, "");
      }
      nodeInTree = React.createElement("li", {
        "data-iri": node.iri,
        "data-id": node.iri,
        "className": "tree-node-li" + leafClass,
        "id": node.iri
      }
        , symbol, containerSpan, childNode
      );

      let parentId = i + 1 < treeNodes.length ? ("children_for_" + treeNodes[i + 1].iri) : false;
      if (!parentId) {
        break;
      }

      if (fullTree && node.iri === targetNodeIri) {
        let siblingsNodes = await SkosHelper.createSiblingsNodes(ontologyId, targetNodeIri);
        siblingsNodes.unshift(nodeInTree);
        ul = React.createElement("ul", { className: "tree-node-ul", id: parentId }, siblingsNodes);
      }
      else {
        ul = React.createElement("ul", { className: "tree-node-ul", id: parentId }, nodeInTree);
      }

      childNode = ul;
    }
    return { "ul": ul, "nodeSubTree": nodeInTree, "treeNodesArray": treeNodes };
  }



  static async buildSkosFullTree(skosOntologyId, excludedRootNodeIri = null, exludedRootNodeSubtreeContent = null) {
    let listOfNodes = [];
    let skosApi = new SkosApi({ ontologyId: skosOntologyId, iri: "" });
    await skosApi.fetchRootConcepts();
    let rootNodes = skosApi.rootConcepts;
    for (let i = 0; i < rootNodes.length; i++) {
      let node = await SkosLib.shapeSkosMetadata(rootNodes[i], true);
      if (node.iri !== excludedRootNodeIri) {
        let leafClass = " closed";
        let symbol = React.createElement("i", { "className": "fa fa-plus", "aria-hidden": "true" }, "");
        let textSpan = React.createElement("div", { "className": "li-label-text" }, node.text);
        let containerSpan = React.createElement("div", { "className": "tree-text-container" }, textSpan);
        if (!node.has_children) {
          leafClass = " leaf-node";
          symbol = React.createElement("i", { "className": "" }, "");
        }
        let element = React.createElement("li", {
          "data-iri": node.iri,
          "data-id": node.iri,
          "className": "tree-node-li" + leafClass,
          "id": node.iri
        }
          , symbol, containerSpan
        );
        listOfNodes.push(element);
      }
      else {
        listOfNodes.push(exludedRootNodeSubtreeContent);
      }
    }
    return React.createElement("ul", { className: "tree-node-ul", id: "tree-root-ul" }, listOfNodes);
  }



  static async createSiblingsNodes(ontologyId, targetNodeIri) {
    let skosApi = new SkosApi({ ontologyId: ontologyId, iri: targetNodeIri });
    let parentNode = await skosApi.fetchSkosTermParent();
    let siblingsNodes = [];
    let nodesToRender = [];
    if (!parentNode) {
      // node is root. We fetch other roots.
      let skosApi = new SkosApi({ ontologyId: ontologyId, iri: "" });
      await skosApi.fetchRootConcepts();
      siblingsNodes = skosApi.rootConcepts;
    }
    else {
      let skosApi = new SkosApi({ ontologyId: ontologyId, iri: parentNode.iri });
      await skosApi.fetchChildrenForSkosTerm();
      siblingsNodes = skosApi.childrenForSkosTerm;
    }

    for (let i = 0; i < siblingsNodes.length; i++) {
      let node = await SkosLib.shapeSkosMetadata(siblingsNodes[i], (!parentNode ? true : false));
      if (node.iri !== targetNodeIri) {
        let treeNode = new TreeNodeController();
        let listItem = treeNode.buildNodeWithReact({ nodeObject: node });
        nodesToRender.push(listItem);
      }
    }
    return nodesToRender;

  }



  static async showHidesiblingsForSkos(showFlag, ontologyId, iri, skosRoot, lang) {
    let skosApi = new SkosApi({ ontologyId: ontologyId, iri: iri });
    let parent = await skosApi.fetchSkosTermParent();
    let siblingsNodes = "";
    let targetUl = "";
    let children = "";
    let treeNode = new TreeNodeController();
    if (showFlag) {
      // Show the siblings    
      if (!parent) {
        // Node is a root
        let skosApi = new SkosApi({ ontologyId: ontologyId, iri: "", skosRoot: skosRoot, lang: lang });
        await skosApi.fetchRootConcepts();
        siblingsNodes = skosApi.rootConcepts;
        targetUl = document.getElementById("tree-root-ul");
      }
      else {
        let skosApi = new SkosApi({ ontologyId: ontologyId, iri: parent.iri });
        await skosApi.fetchChildrenForSkosTerm();
        siblingsNodes = skosApi.childrenForSkosTerm;
        targetUl = document.getElementById("children_for_" + parent.iri);
      }
      for (let node of siblingsNodes) {
        if (node.iri !== iri) {
          let listItem = treeNode.buildNodeWithTradionalJs({ nodeObject: node, isSkos: true, lang: lang });
          targetUl.appendChild(listItem);
        }
      }

    }
    else {
      // Hide the siblings
      if (!parent) {
        // root node
        targetUl = document.getElementById("tree-root-ul");
        children = [].slice.call(targetUl.childNodes);
      }
      else {
        targetUl = document.getElementById("children_for_" + parent.iri);
        children = [].slice.call(targetUl.childNodes);
      }
      for (let i = 0; i < children.length; i++) {
        if (children[i].dataset.iri !== iri) {
          children[i].remove();
        }
      }
    }

  }

}

