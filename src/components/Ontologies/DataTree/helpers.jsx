import React from 'react';
import {getNodeByIri, getChildrenJsTree, getChildrenSkosTree, skosNodeHasChildren, getSkosNodeByIri} from '../../../api/fetchData';


const CLOSE__CLASSES = " fa-plus";
const OPEN__CLASSES = " fa-minus";
const LEAF__CLASSES = " fa-close";



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
      symbol.classList.add("fa");
      symbol.classList.add("fa-plus");
    }
    else{
      listItem.classList.add("leaf-node");
      // symbol.classList.add("fa");
      // symbol.classList.add("fa-close");
    }
    let containerSpan = document.createElement("span");
    containerSpan.classList.add("tree-text-container");
    listItem.appendChild(symbol);
    if(childNode["a_attr"]["class"] === "part_of"){
      let partOfSymbol = document.createElement("span");
      let pText = document.createTextNode("P");
      partOfSymbol.appendChild(pText);
      partOfSymbol.classList.add("p-icon-style");      
      containerSpan.appendChild(partOfSymbol);
    }    
    containerSpan.appendChild(labelTextSpan);
    listItem.appendChild(containerSpan);
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
      let iconClass = "fa" + OPEN__CLASSES;
      let clickedClass = "";
      if (nodeList[i].iri === targetIri){
        if(targetHasChildren){
          nodeStatusClass = "closed";
          iconClass = "fa" + CLOSE__CLASSES;  
        }
        else{
          nodeStatusClass = "leaf-node";
          // iconClass = "fa" + LEAF__CLASSES;
          iconClass = "";
        }
        clickedClass = "clicked targetNodeByIri";
      }
      else{
        if(nodeList[i].children && nodeList[i].childrenList.length == 0){
          nodeStatusClass = "closed";
          iconClass = "fa" + CLOSE__CLASSES;  
        }
        else if(nodeList[i].state.opened && nodeList[i].childrenList.length != 0){
          nodeStatusClass = "opened";
          iconClass = "fa" + OPEN__CLASSES;
        }
        else{
          nodeStatusClass = "leaf-node";
          // iconClass = "fa" + LEAF__CLASSES; 
          iconClass = "";         
        }
      }
      let symbol = React.createElement("i", {"className": iconClass }, "");
      let label = React.createElement("span", {"className": "li-label-text "}, nodeList[i].text);      
      let childNode = "";
      if(nodeList[i]['a_attr']["class"] === "part_of"){
        let partOfSymbol = React.createElement("span", {"className": "p-icon-style"}, "P");
        let containerSpan = React.createElement("span", {"className": "tree-text-container " + clickedClass}, partOfSymbol, label);
        childNode = React.createElement("li", {
          "className": nodeStatusClass + " tree-node-li",
          "id": newId,
          "data-iri": nodeList[i].iri,
          "data-id": nodeList[i].id
        }, symbol, containerSpan, childNodeChildren);
      }
      else{
        let containerSpan = React.createElement("span", {"className": "tree-text-container " + clickedClass}, label);
        childNode = React.createElement("li", {
          "className": nodeStatusClass + " tree-node-li",
          "id": newId,
          "data-iri": nodeList[i].iri,
          "data-id": nodeList[i].id
        }, symbol, containerSpan, childNodeChildren);
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
 * Expand/collapse a node on click
 */
export async function expandNode(e, ontologyId, childExtractName, isSkos){
  let targetNodeIri = e.dataset.iri;
  let targetNodeId = e.dataset.id;
  let Id = e.id;
  if(document.getElementById(Id).classList.contains("closed")){
      // expand node
      let res = [];
      if(isSkos){
        res = await getChildrenSkosTree(ontologyId, targetNodeIri);        
      }
      else{
        res =  await getChildrenJsTree(ontologyId, targetNodeIri, targetNodeId, childExtractName); 
      }
      let ul = document.createElement("ul");
      ul.setAttribute("id", "children_for_" + Id);
      ul.classList.add("tree-node-ul");
      for(let i=0; i < res.length; i++){
        let node = isSkos ? await shapeSkosMetadata(res[i]) : res[i];        
        let listItem = buildTreeListItem(node);
        ul.appendChild(listItem);      
      }      
      document.getElementById(Id).getElementsByTagName("i")[0].classList.remove("fa-plus");
      document.getElementById(Id).getElementsByTagName("i")[0].classList.add("fa-minus");
      document.getElementById(Id).classList.remove("closed");
      document.getElementById(Id).classList.add("opened");      
      document.getElementById(Id).appendChild(ul);
  }
  else if (!document.getElementById(Id).classList.contains("leaf-node")){
    // close an already expanded node
      document.getElementById(Id).classList.remove("opened");
      document.getElementById(Id).classList.add("closed");      
      document.getElementById(Id).getElementsByTagName("i")[0].classList.remove("fa-minus");
      document.getElementById(Id).getElementsByTagName("i")[0].classList.add("fa-plus");
      document.getElementById("children_for_" + Id).remove();
  }
      
}



/**
 * shape the skos metadata to match the format that expand tree node needs
 */
async function shapeSkosMetadata(skosNode){
  let result = {};
  result["id"] = skosNode.iri;
  result["text"] = skosNode.label;
  result["iri"] = skosNode.iri;
  result["children"] = await skosNodeHasChildren(skosNode.ontology_name, skosNode.iri);
  result["a_attr"] = {"class" : ""};
  return result;
}


/**
 * Build the skos ontology subtree. Used when the concept iri is given
 */
export async function buildSkosSubtree(ontologyId, iri){
  let baseUrl = process.env.REACT_APP_API_BASE_URL;  
  let callHeader = {
    'Accept': 'application/json'
  };
  let getCallSetting = {method: 'GET', headers: callHeader};
  let treeNodes = [];
  let targetNode = await getSkosNodeByIri(ontologyId, encodeURIComponent(iri));
  treeNodes.push(targetNode);  
  while(true){
    let url = baseUrl +  "/" + ontologyId +  "/conceptrelations/" + encodeURIComponent(encodeURIComponent(iri)) + "?relation_type=broader";
    let res = await (await fetch(url, getCallSetting)).json();
    res = res['_embedded'];    
    if(!res || !res['individuals']){
      break;
    }
    treeNodes.push(res['individuals'][0]);
    iri = res['individuals'][0]['iri'];
  }
  
  let nodeInTree = "";
  let childNode = "";
  let ul = "";
  for(let i=0; i < treeNodes.length; i++){
    let node = treeNodes[i];    
    let leafClass = i !==0 ? " opened" : " closed";
    let clickedClass = i === 0 ? " clicked" : "";    
    let symbol = React.createElement("i", {"className": "fa fa-minus", "aria-hidden": "true"}, "");
    let textSpan = React.createElement("span", {"className": "li-label-text"}, node.label);
    let containerSpan = React.createElement("span", {"className": "tree-text-container" + clickedClass}, textSpan);
    let hasChildren = await skosNodeHasChildren(ontologyId, node.iri);
    if (!hasChildren){
      leafClass = " leaf-node";
      // symbol = React.createElement("i", {"className": "fa fa-close"}, "");
      symbol = React.createElement("i", {"className": ""}, "");
    }
    else if(hasChildren && i === 0){
      symbol = React.createElement("i", {"className": "fa fa-plus", "aria-hidden": "true"}, "");
    }    
    nodeInTree = React.createElement("li", {         
        "data-iri":node.iri, 
        "data-id": node.iri,
        "className": "tree-node-li" + leafClass,
        "id": node.iri
      }
        , symbol, containerSpan, childNode
        );
    
    let parentId = i+1 < treeNodes.length ? ("children_for_" + treeNodes[i + 1].iri) : "tree-root-ul";    
    ul = React.createElement("ul", {className: "tree-node-ul", id: parentId}, nodeInTree);
    childNode = ul;
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


  /**
   * Check a node is part of the list of a list of nodes or not
   * @param {*} nodeIri 
   * @param {*} roots 
   */
  export function nodeExistInList(nodeIri, list){
    for(let item of list){
      if (item["iri"] === nodeIri){
        return true
      }
    }
    return false;
  }

  /**
   * function for generating jump to results
   */
  export function jumpToButton(resultItem){
    let content = [];
    let targetHref = "";
    if(resultItem["type"] === 'class'){
        targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']) + '/terms?iri=' + encodeURIComponent(resultItem['iri']);       
    }    
    content.push(
        <a href={targetHref} className="container">
        <div className="jump-tree-item">         
            {resultItem['label']}
        </div>
        </a>
    ); 
    
    return content; 
  }