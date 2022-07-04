import React from 'react';
import {getNodeByIri} from '../../../api/fetchData';


/**
 * Create a hierarchical list form a flat list. 
 * @param {*} flatList 
 * @returns 
 */
export function buildHierarchicalArray(flatList){
    let map = {}; 
    let node = "";
    let roots = [];
    for (let i = 0; i < flatList.length; i++) {
        map[flatList[i].id] = i; 
        flatList[i].childrenList = [];
    }
    
    for (let i = 0; i < flatList.length; i++) {
        node = flatList[i];
        if (node.parent !== "#") {
        flatList[map[node.parent]].childrenList.push(node);
        } else {
        roots.push(node);
        }
    }
    return roots;
}



/**
 * Build a list (li) element for the tree veiw
 * @param {*} childNode
 */
 export function buildTreeListItem(childNode){
    let newId = childNode.id;
    let label = document.createTextNode(childNode.text);
    let labelTextSpan = document.createElement("span");
    labelTextSpan.classList.add("li-label-text");
    labelTextSpan.appendChild(label);
    let symbol = document.createElement("i");
    let listItem = document.createElement("li");
    listItem.setAttribute("id", newId);
    listItem.setAttribute("data-iri", childNode.iri);
    listItem.setAttribute("data-id", childNode.id);
    if(childNode.children){
      listItem.classList.add("closed");
      symbol.classList.add('fa');
      symbol.classList.add('fa-plus');
    }
    else{
      listItem.classList.add("leaf-node");
      symbol.classList.add('fa');
      symbol.classList.add('fa-close');
    }
    listItem.appendChild(symbol);
    if(childNode["a_attr"]["class"] === "part_of"){
      let partOfSymbol = document.createElement("span");
      let pText = document.createTextNode("P");
      partOfSymbol.appendChild(pText);
      partOfSymbol.classList.add("p-icon-style"); 
      listItem.appendChild(partOfSymbol);
    }
    listItem.appendChild(labelTextSpan);
    listItem.classList.add("tree-node-li");

    return listItem;
  }



  /**
   * Expand a node in the tree in loading. Used for jumping directly to a node given by Iri.
   * @param {*} nodeList 
   * @param {*} parentId 
   * @returns 
   */
  export function expandTargetNode(nodeList, parentId, targetIri, targetHasChildren){
    let subNodes = [];
    for(let i = 0; i < nodeList.length; i++){
      let childNodeChildren = [];
      if(nodeList[i].iri !== targetIri){
        let subUl = expandTargetNode(nodeList[i].childrenList, nodeList[i].id, targetIri, targetHasChildren);
        childNodeChildren.push(subUl);
      }

      let newId = nodeList[i].id;
      let nodeStatusClass = "opened";
      let iconClass = "fa fa-minus";
      let clickedClass = "";
      if (nodeList[i].iri === targetIri){
        if(targetHasChildren){
          nodeStatusClass = "closed";
          iconClass = "fa fa-plus";  
        }
        else{
          nodeStatusClass = "leaf-node";
          iconClass = "fa fa-close";
        }
        clickedClass = "clicked targetNodeByIri";
      }
      else{
        if(nodeList[i].children && nodeList[i].childrenList.length == 0){
          nodeStatusClass = "closed";
          iconClass = "fa fa-plus";  
        }
        else if(nodeList[i].children && nodeList[i].childrenList.length != 0){
          nodeStatusClass = "opened";
          iconClass = "fa fa-minus";
        }
        else{
          nodeStatusClass = "leaf-node";
          iconClass = "fa fa-close";
        }
      }
      let symbol = React.createElement("i", {"className": iconClass }, "");
      let label = React.createElement("span", {"className": "li-label-text " + clickedClass}, nodeList[i].text);
      let childNode = "";
      if(nodeList[i]['a_attr']["class"] === "part_of"){
        let partOfSymbol = React.createElement("span", {"className": "p-icon-style"}, "P");
        childNode = React.createElement("li", {
          "className": nodeStatusClass + " tree-node-li",
          "id": newId,
          "data-iri": nodeList[i].iri,
          "data-id": nodeList[i].id
        }, symbol, partOfSymbol, label, childNodeChildren);
      }
      else{
        childNode = React.createElement("li", {
          "className": nodeStatusClass + " tree-node-li",
          "id": newId,
          "data-iri": nodeList[i].iri,
          "data-id": nodeList[i].id
        }, symbol, label, childNodeChildren);
      }

      subNodes.push(childNode);
    }

    let ul = React.createElement("ul", {"className": "tree-node-ul", "id": "children_for_" + parentId}, subNodes);
    if (nodeList.length === 0){
      ul = "";
    }

    return ul;
  }


  /**
   * Check a node has children or not
   */
  export async function nodeHasChildren(ontology, nodeIri, mode){
    let node = "";
    if(mode === 'term'){
      node = await getNodeByIri(ontology, encodeURIComponent(nodeIri), "terms");
    }
    else{
      node = await getNodeByIri(ontology, encodeURIComponent(nodeIri), "properties");
    }
    return node.has_children;
    
  }


  /**
   * Check a node is root or not
   */
   export async function nodeIsRoot(ontology, nodeIri, mode){
    let node = "";
    if(mode === 'term'){
      node = await getNodeByIri(ontology, encodeURIComponent(nodeIri), "terms");
    }
    else{
      node = await getNodeByIri(ontology, encodeURIComponent(nodeIri), "properties");
    }
    return node.is_root;
    
  }