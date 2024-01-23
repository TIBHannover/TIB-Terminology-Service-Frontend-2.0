import React from 'react';
import {getChildrenSkosTree} from '../../../api/fetchData';
import TermApi from '../../../api/term';
import TreeNodeController from './TreeNode';
import Toolkit from '../../../Libs/Toolkit';
import SkosHelper from './SkosHelpers';



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
        if(isSkos && childExtractName !== "terms"){
          res = await getChildrenSkosTree(ontologyId, targetNodeIri);        
        }
        else{
          let termApi = new TermApi(ontologyId, targetNodeIri, childExtractName);        
          res =  await termApi.getChildrenJsTree(targetNodeId); 
        }
        let sortKey = TreeHelper.getTheNodeSortKey(res);
        if(sortKey){
            res = Toolkit.sortListOfObjectsByKey(res, sortKey, true);
        }   
        let ul = document.createElement("ul");
        ul.setAttribute("id", "children_for_" + Id);
        ul.classList.add("tree-node-ul");
        for(let i=0; i < res.length; i++){
          let node = (isSkos  && childExtractName !== "terms") ? await SkosHelper.shapeSkosMetadata(res[i]) : res[i];        
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


  static showSiblingsForRootNode(nodes, selectedNodeIri){
    let treeNode = new TreeNodeController();
    let sortKey = TreeHelper.getTheNodeSortKey(nodes);
    if(sortKey){
        nodes = Toolkit.sortListOfObjectsByKey(nodes, sortKey, true);
    }  
    for(let i=0; i < nodes.length; i++){
        if (nodes[i].iri === selectedNodeIri){
            continue;
        }                
        let node = treeNode.buildNodeWithTradionalJs(nodes[i], nodes[i].id);
        document.getElementById("tree-root-ul").appendChild(node);
    }   
  }


  static async showSiblings(targetNodes, ontologyId, childExtractName){
      let treeNode = new TreeNodeController();
      for (let node of targetNodes){
          let parentUl = node.parentNode.parentNode;
          let parentId = parentUl.id.split("children_for_")[1];                    
          let Iri = document.getElementById(parentId);                    
          Iri = Iri.dataset.iri;
          let termApi = new TermApi(ontologyId, Iri, childExtractName);        
          let res =  await termApi.getChildrenJsTree(parentId);           
          let sortKey = TreeHelper.getTheNodeSortKey(res);
          if(sortKey){
              res = Toolkit.sortListOfObjectsByKey(res, sortKey, true);
          }   
          for(let i=0; i < res.length; i++){
              if (res[i].iri === node.parentNode.dataset.iri){
                  continue;
              }                        
              let item = treeNode.buildNodeWithTradionalJs(res[i], res[i].id);
              parentUl.appendChild(item);      
          }   
      }
  }


  static hideSiblingsForRootNode(selectedIri){
      let parentUl = document.getElementById("tree-root-ul");
      let children = [].slice.call(parentUl.childNodes);
      for(let i=0; i < children.length; i++){
          if(children[i].dataset.iri !== selectedIri){
              children[i].remove();
          }
      }
  }


  static hideSiblings(targetNodes){
      for (let node of targetNodes){
          let parentUl = node.parentNode.parentNode;
          let children = [].slice.call(parentUl.childNodes);
          for(let i=0; i < children.length; i++){
              if(children[i].dataset.iri !== node.parentNode.dataset.iri){
                  children[i].remove();
              }
          }
      }
  }


   
  static async nodeHasChildren(ontology, nodeIri, mode){
      let termType = "";      
      if(mode === 'terms'){
          termType = "terms";
      }
      else if(mode === "property"){
          termType = "properties";
      }
      else{
        return false;
      }
      let termApi = new TermApi(ontology, encodeURIComponent(nodeIri), termType);
      await termApi.fetchTerm();
      return termApi.term.has_children;      
  }


  static async nodeIsRoot(ontology, nodeIri, mode){
      let termType = mode === 'terms' ? "terms" : "properties";
      let termApi = new TermApi(ontology, encodeURIComponent(nodeIri), termType);
      await termApi.fetchTerm();
      return termApi.term.is_root; 
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



    static renderObsoletes(obsoletes, resultArrayToPush, startIndex, targetSelectedNodeIri){
        let lastSelectedItemId = startIndex;  
        for(let i=0; i < obsoletes.length; i++){         
          if(targetSelectedNodeIri === obsoletes[i].iri){
            continue;
          }
          let treeNode = new TreeNodeController();
          let nodeIsClicked = (targetSelectedNodeIri && obsoletes[i].iri === targetSelectedNodeIri)  
          if(nodeIsClicked){
              lastSelectedItemId =  i + startIndex;
          }  
          let node = treeNode.buildNodeWithReact(obsoletes[i], i + startIndex, nodeIsClicked);                       
          resultArrayToPush.push(node);
        }
      
        return [resultArrayToPush, lastSelectedItemId];
    }



}
