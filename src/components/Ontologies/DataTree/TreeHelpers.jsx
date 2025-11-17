import React from 'react';
import SkosApi from '../../../api/skos';
import TermApi from '../../../api/term';
import TreeNodeController from './TreeNode';
import TermLib from '../../../Libs/TermLib';



export default class TreeHelper {


  static autoExpandTargetNode(nodeList, parentId, targetIri, targetHasChildren) {
    let subNodes = [];
    let treeNode = new TreeNodeController();
    for (let i = 0; i < nodeList.length; i++) {
      let childNodeChildren = [];
      if (nodeList[i].iri !== targetIri) {
        let subUl = TreeHelper.autoExpandTargetNode(nodeList[i].childrenList, nodeList[i].id, targetIri, targetHasChildren);
        childNodeChildren.push(subUl);
      }
      let isClicked = false;
      let isExpanded = true;

      if (nodeList[i].iri === targetIri) {
        if (targetHasChildren) {
          nodeList[i]['hasDirectChildren'] = true;
          isExpanded = false;
        }
        else {
          isExpanded = false;
          nodeList[i]['hasDirectChildren'] = false;
        }
        isClicked = true;
      }
      else {
        if (nodeList[i].children && nodeList[i].childrenList.length == 0) {
          nodeList[i]['hasDirectChildren'] = true;
          isExpanded = false;
        }
        else if (nodeList[i].childrenList.length != 0) {
          isExpanded = true;
          nodeList[i]['hasDirectChildren'] = true;
        }
        else {
          nodeList[i]['hasDirectChildren'] = false;
        }
      }

      treeNode.children = childNodeChildren;
      let childNode = treeNode.buildNodeWithReact({ nodeObject: nodeList[i], nodeIsClicked: isClicked, isExpanded: isExpanded });
      subNodes.push(childNode);
    }

    let ul = React.createElement("ul", { "className": "tree-node-ul", "id": "children_for_" + parentId }, subNodes);
    if (nodeList.length === 0) {
      ul = "";
    }

    return ul;
  }


  static async expandNode({ e, ontologyId, childExtractName, isSkos, lang }) {
    let targetNodeIri = e.dataset.iri;
    let targetNodeId = e.dataset.id;
    let Id = e.id;
    let treeNode = new TreeNodeController();
    if (document.getElementById(Id).classList.contains("closed")) {
      // expand node
      let res = [];
      if (isSkos) {
        let skosApi = new SkosApi({ ontologyId: ontologyId, iri: targetNodeIri, lang: lang });
        res = await skosApi.fetchChildrenForSkosTerm();
      }
      else {
        let termApi = new TermApi(ontologyId, targetNodeIri, childExtractName, lang);
        res = await termApi.getChildrenJsTree();
      }
      TreeHelper.sortTermsInTree(res);
      let ul = document.createElement("ul");
      ul.setAttribute("id", "children_for_" + Id);
      ul.classList.add("tree-node-ul");
      for (let node of res) {
        let listItem = treeNode.buildNodeWithTradionalJs({ nodeObject: node, isSkos: isSkos, lang: lang });
        ul.appendChild(listItem);
      }
      document.getElementById(Id).getElementsByTagName("i")[0].classList.remove("fa-plus");
      document.getElementById(Id).getElementsByTagName("i")[0].classList.add("fa-minus");
      document.getElementById(Id).classList.remove("closed");
      document.getElementById(Id).classList.add("opened");
      document.getElementById(Id).appendChild(ul);
    }
    else if (!document.getElementById(Id).classList.contains("leaf-node")) {
      // close an already expanded node
      document.getElementById(Id).classList.remove("opened");
      document.getElementById(Id).classList.add("closed");
      document.getElementById(Id).getElementsByTagName("i")[0].classList.remove("fa-minus");
      document.getElementById(Id).getElementsByTagName("i")[0].classList.add("fa-plus");
      document.getElementById("children_for_" + Id).remove();
    }

  }


  static showSiblingsForRootNode(nodes, selectedNodeIri) {
    let treeNode = new TreeNodeController();
    TreeHelper.sortTermsInTree(nodes);
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].iri === selectedNodeIri || nodes[i].iri === "http://www.w3.org/2002/07/owl#Thing") {
        continue;
      }
      let node = treeNode.buildNodeWithTradionalJs({ nodeObject: nodes[i] });
      document.getElementById("tree-root-ul").appendChild(node);
    }
  }


  static async showSiblings(targetNodes, ontologyId, childExtractName) {
    let treeNode = new TreeNodeController();
    for (let node of targetNodes) {
      let parentUl = node.parentNode.parentNode;
      let parentId = parentUl.id.split("children_for_")[1];
      let Iri = document.getElementById(parentId);
      Iri = Iri.dataset.iri;
      let termApi = new TermApi(ontologyId, Iri, childExtractName);
      let res = await termApi.getChildrenJsTree();
      TreeHelper.sortTermsInTree(res);
      for (let i = 0; i < res.length; i++) {
        if (res[i].iri === node.parentNode.dataset.iri) {
          continue;
        }
        let item = treeNode.buildNodeWithTradionalJs({ nodeObject: res[i] });
        parentUl.appendChild(item);
      }
    }
  }


  static hideSiblingsForRootNode(selectedIri) {
    let parentUl = document.getElementById("tree-root-ul");
    let children = [].slice.call(parentUl.childNodes);
    for (let i = 0; i < children.length; i++) {
      if (children[i].dataset.iri !== selectedIri) {
        children[i].remove();
      }
    }
  }


  static hideSiblings(targetNodes) {
    for (let node of targetNodes) {
      let parentUl = node.parentNode.parentNode;
      let children = [].slice.call(parentUl.childNodes);
      for (let i = 0; i < children.length; i++) {
        if (children[i].dataset.iri !== node.parentNode.dataset.iri) {
          children[i].remove();
        }
      }
    }
  }



  static async nodeHasChildren(ontology, nodeIri, mode) {
    let termType = "";
    if (mode === 'terms') {
      termType = "terms";
    }
    else if (mode === "property") {
      termType = "properties";
    }
    else {
      return false;
    }
    let termApi = new TermApi(ontology, encodeURIComponent(nodeIri), termType);
    let tsTerm = await termApi.fetchTerm();
    return tsTerm.hasHierarchicalChildren || tsTerm.hasDirectChildren;
  }


  static async nodeIsRoot(ontology, nodeIri, mode) {
    let termType = mode === 'terms' ? "classes" : "properties";
    let termApi = new TermApi(ontology, encodeURIComponent(nodeIri), termType);
    let tsTerm = await termApi.fetchTerm();
    return !tsTerm.hasDirectParents && !tsTerm.hasHierarchicalParents;
  }



  static setIsExpandedAndHasChildren(nodeObject) {
    let hasChildren = false;
    let isExpanded = false;
    if (nodeObject.childrenList.length === 0 && !nodeObject.children && !nodeObject.opened) {
      //  root node is a leaf
      hasChildren = false;
      isExpanded = false;
    }
    else if (nodeObject.childrenList.length === 0 && nodeObject.children && !nodeObject.opened) {
      // root is not leaf but does not include the target node on its sub-tree
      hasChildren = true;
      isExpanded = false;
    }
    else {
      // root is not leaf and include the target node on its sub-tree
      hasChildren = true;
      isExpanded = true;
    }
    return { "hasChildren": hasChildren, "isExpanded": isExpanded }
  }



  static getTheNodeSortKey(nodesList) {
    if (nodesList.length !== 0) {
      return nodesList[0].label ? 'label' : 'text';
    }
    return null;
  }



  static renderObsoletes(obsoletes, resultArrayToPush, startIndex, targetSelectedNodeIri) {
    let lastSelectedItemId = startIndex;
    for (let i = 0; i < obsoletes.length; i++) {
      if (targetSelectedNodeIri === obsoletes[i].iri) {
        continue;
      }
      let treeNode = new TreeNodeController();
      let nodeIsClicked = (targetSelectedNodeIri && obsoletes[i].iri === targetSelectedNodeIri)
      if (nodeIsClicked) {
        lastSelectedItemId = i + startIndex;
      }
      let node = treeNode.buildNodeWithReact({ nodeObject: obsoletes[i], nodeIsClicked: nodeIsClicked });
      resultArrayToPush.push(node);
    }

    return [resultArrayToPush, lastSelectedItemId];
  }


  static sortTermsInTree(terms) {
    let sortKey = TreeHelper.getTheNodeSortKey(terms);
    if (sortKey) {
      terms.sort((node1, node2) => {
        let label1 = TermLib.extractLabel(node1);
        let label2 = TermLib.extractLabel(node2);
        if (label1 < label2) {
          return -1;
        }
        return 1;
      });
    }
  }


  static buildTermTreeFromFlatList(terms) {

    function getParentIris(parentIrisList) {
      let parentIris = [];
      if (!parentIrisList) {
        return [];
      }
      for (let parentIri of parentIrisList) {
        if (typeof parentIri === "string") {
          parentIris.push(parentIri);
        } else if ("value" in parentIri) {
          parentIris.push(parentIri.value);
        }
      }
      return parentIris;
    }

    for (let term of terms) {
      for (let potentialChild of terms) {
        let parentsIrisList = potentialChild.type[0] === "class" ? potentialChild["hierarchicalParent"] : potentialChild["directParent"];
        let parentsIris = getParentIris(parentsIrisList);
        if (!parentsIris.length) {
          // Thing class
          continue;
        }
        if (parentsIris.includes(term.iri)) {
          if (term.childrenList) {
            term.childrenList.push(potentialChild);
          } else {
            term.childrenList = [potentialChild];
          }
        }
      }
      if (!term.childrenList) {
        term.childrenList = [];
      }
      term.id = TermLib.makeTermIdForTree(term);
    }
    return terms.filter((term) => !term.hasHierarchicalParents && !term.hasDirectParents);
  }



}