import React from 'react';
import {getNodeByIri, getChildrenJsTree, getChildrenSkosTree, skosNodeHasChildren, getSkosNodeByIri, getSkosNodeParent, getSkosOntologyRootConcepts} from '../../../api/fetchData';
import TreeNodeController from './TreeNode';
import Toolkit from "../../common/Toolkit";



export default class TreeHelper{


  static autoExpandTargetNode(nodeList, parentId, targetIri, targetHasChildren){
    let subNodes = [];
    let treeNode = new TreeNodeController();
    for(let i = 0; i < nodeList.length; i++){
      let childNodeChildren = [];
      if(nodeList[i].iri !== targetIri){
        let subUl = TreeHelper.autoExpandTargetNode(nodeList[i].childrenList, nodeList[i].id, targetIri, targetHasChildren);
        childNodeChildren.push(subUl);
      }           
      let isClicked = false;
      let isExpanded = true;      
      
      if (nodeList[i].iri === targetIri){
        if(targetHasChildren){
          nodeList[i]['has_children'] = true;
          isExpanded = false;     
        }
        else{
          isExpanded = false;
          nodeList[i]['has_children'] = false;
        }
        isClicked = true;
      }
      else{
        if(nodeList[i].children && nodeList[i].childrenList.length == 0){
          nodeList[i]['has_children'] = true;
          isExpanded = false;
        }
        else if(nodeList[i].state.opened && nodeList[i].childrenList.length != 0){
          isExpanded = true;
          nodeList[i]['has_children'] = true;
        }
        else{
          nodeList[i]['has_children'] = false;
        }
      }
      
      treeNode.children = childNodeChildren;
      let childNode = treeNode.buildNodeWithReact(nodeList[i], nodeList[i].id, isClicked, isExpanded);
      subNodes.push(childNode);
    }

    let ul = React.createElement("ul", {"className": "tree-node-ul", "id": "children_for_" + parentId}, subNodes);
    if (nodeList.length === 0){
      ul = "";
    }

    return ul;
  }


  static async expandNode(e, ontologyId, childExtractName, isSkos){
    let targetNodeIri = e.dataset.iri;
    let targetNodeId = e.dataset.id;
    let Id = e.id;
    let treeNode = new TreeNodeController();
    if(document.getElementById(Id).classList.contains("closed")){
        // expand node
        let res = [];      
        if(isSkos){
          res = await getChildrenSkosTree(ontologyId, targetNodeIri);        
        }
        else{        
          res =  await getChildrenJsTree(ontologyId, targetNodeIri, targetNodeId, childExtractName); 
        }
        let sortKey = TreeHelper.getTheNodeSortKey(res);
        if(sortKey){
            res = Toolkit.sortListOfObjectsByKey(res, sortKey, true);
        }   
        let ul = document.createElement("ul");
        ul.setAttribute("id", "children_for_" + Id);
        ul.classList.add("tree-node-ul");
        for(let i=0; i < res.length; i++){
          let node = isSkos ? await shapeSkosMetadata(res[i]) : res[i];        
          let listItem = treeNode.buildNodeWithTradionalJs(node, node.iri);
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


   
  static async nodeHasChildren(ontology, nodeIri, mode){
      let node = "";
      if(mode === 'term'){
        node = await getNodeByIri(ontology, encodeURIComponent(nodeIri), "terms");
      }
      else if(mode === "property"){
        node = await getNodeByIri(ontology, encodeURIComponent(nodeIri), "properties");
      }
      else{
        return false;
      }
      return node.has_children;
      
  }


  static async nodeIsRoot(ontology, nodeIri, mode){
      let node = "";
      if(mode === 'term'){
        node = await getNodeByIri(ontology, encodeURIComponent(nodeIri), "terms");
      }
      else{
        node = await getNodeByIri(ontology, encodeURIComponent(nodeIri), "properties");
      }
      return node.is_root;
      
    }
  


    static setIsExpandedAndHasChildren(nodeObject){
      let hasChildren = false;
      let isExpanded = false;
      if (nodeObject.childrenList.length === 0 && !nodeObject.children && !nodeObject.opened){
        //  root node is a leaf
        hasChildren = false;
        isExpanded = false;
      }            
      else if(nodeObject.childrenList.length === 0 && nodeObject.children && !nodeObject.opened){
          // root is not leaf but does not include the target node on its sub-tree
          hasChildren = true;
          isExpanded = false;
      }
      else{
          // root is not leaf and include the target node on its sub-tree
          hasChildren = true;
          isExpanded = true;
      }
      return {"hasChildren": hasChildren, "isExpanded": isExpanded}
    }



    static getTheNodeSortKey(nodesList){
      if(nodesList.length !== 0){
        return nodesList[0].label ? 'label' : 'text';
      }
      return null;
    }



}







async function shapeSkosMetadata(skosNode, isRootNode=false){
  if(isRootNode){
    skosNode = skosNode.data;
  }
  let result = {};
  result["id"] = skosNode.iri;
  result["text"] = skosNode.label;
  result["iri"] = skosNode.iri;
  result["children"] = await skosNodeHasChildren(skosNode.ontology_name, skosNode.iri);
  result["a_attr"] = {"class" : ""};
  return result;
}


export async function buildSkosSubtree(ontologyId, iri, fullTree=false){
  let treeNodes = [];
  let targetNode = await getSkosNodeByIri(ontologyId, encodeURIComponent(iri));
  treeNodes.push(targetNode);  
  while(true){
    let res = await getSkosNodeParent(ontologyId, iri);    
    if(!res){
      break;
    }
    treeNodes.push(res);
    iri = res['iri'];
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
    
    let parentId = i+1 < treeNodes.length ? ("children_for_" + treeNodes[i + 1].iri) : false;
    if(!parentId){
      break;
    }
    ul = React.createElement("ul", {className: "tree-node-ul", id: parentId}, nodeInTree);
    childNode = ul;
  }
  if(fullTree){
    // show the full tree
    let listOfNodes = [];
    let rootNodes = await getSkosOntologyRootConcepts(ontologyId);
    for(let i=0; i < rootNodes.length; i++){
      let node = await shapeSkosMetadata(rootNodes[i], true);      
      if(node.iri !== treeNodes[treeNodes.length - 1].iri){
        let leafClass = " closed";        
        let symbol = React.createElement("i", {"className": "fa fa-plus", "aria-hidden": "true"}, "");
        let textSpan = React.createElement("span", {"className": "li-label-text"}, node.text);
        let containerSpan = React.createElement("span", {"className": "tree-text-container"}, textSpan);        
        if (!node.children){
          leafClass = " leaf-node";
          // symbol = React.createElement("i", {"className": "fa fa-close"}, "");
          symbol = React.createElement("i", {"className": ""}, "");
        }          
        let element = React.createElement("li", {         
            "data-iri":node.iri, 
            "data-id": node.iri,
            "className": "tree-node-li" + leafClass,
            "id": node.iri
          }
            , symbol, containerSpan
            );
        listOfNodes.push(element);
      }
      else{
        listOfNodes.push(nodeInTree);
      } 
    }
    ul = React.createElement("ul", {className: "tree-node-ul", id: "tree-root-ul"}, listOfNodes);   

  }
  else{
    ul = React.createElement("ul", {className: "tree-node-ul", id: "tree-root-ul"}, nodeInTree);   
  }

  return ul;
}


/**
 * Show/hide siblings for the SKOS ontology tree
 */
export async function showHidesiblingsForSkos(showFlag, ontologyId, iri){
  let parent = await getSkosNodeParent(ontologyId, iri);
  let siblingsNodes = "";
  let targetUl = "";
  let children = "";
  let treeNode = new TreeNodeController();
  if(showFlag){
    // Show the siblings    
    if(!parent){
      // Node is a root
      siblingsNodes = await getSkosOntologyRootConcepts(ontologyId);      
      targetUl = document.getElementById("tree-root-ul");      
    }
    else{
      siblingsNodes = await getChildrenSkosTree(ontologyId, parent.iri);
      targetUl = document.getElementById("children_for_" + parent.iri);      
    }
    for(let i=0; i < siblingsNodes.length; i++){
      let node = await shapeSkosMetadata(siblingsNodes[i], (!parent ? true : false));
      if(node.iri !== iri){        
        let listItem = treeNode.buildNodeWithTradionalJs(node, node.iri);
        targetUl.appendChild(listItem);
      } 
    }   

  }
  else{
    // Hide the siblings
    if(!parent){
      // root node
      targetUl = document.getElementById("tree-root-ul");      
      children = [].slice.call(targetUl.childNodes);      
    }
    else{      
      targetUl = document.getElementById("children_for_" + parent.iri);      
      children = [].slice.call(targetUl.childNodes);      
    }
    for(let i=0; i < children.length; i++){
      if(children[i].dataset.iri !== iri){
        children[i].remove();
      }
    }
  }

}
