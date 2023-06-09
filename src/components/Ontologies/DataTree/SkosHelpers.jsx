import React from 'react';
import {getChildrenSkosTree, skosNodeHasChildren, getSkosNodeByIri, getSkosNodeParent, getSkosOntologyRootConcepts} from '../../../api/fetchData';
import TreeNodeController from './TreeNode';




export default class SkosHelper{


    static async buildSkosTree(ontologyId, targetIri=null, fullTree=false){
        let subTreeObject = await SkosHelper.buildSkosSubTree(ontologyId, targetIri, fullTree);
        let ul = subTreeObject.ul;
        let subTreeRoot = subTreeObject.treeNodesArray[subTreeObject.treeNodesArray.length - 1];
        if(fullTree){          
          ul = await SkosHelper.buildSkosFullTree(ontologyId, subTreeRoot.iri, subTreeObject.nodeSubTree);      
        }
        else{
          ul = React.createElement("ul", {className: "tree-node-ul", id: "tree-root-ul"}, subTreeObject.nodeSubTree);   
        }      
        return ul;
    }



    static async buildSkosSubTree(ontologyId, iri, fullTree=false){
        let treeNodes = [];
        let targetNode = await getSkosNodeByIri(ontologyId, encodeURIComponent(iri));
        treeNodes.push(targetNode);
        let targetNodeIri = iri;
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
          let textSpan = React.createElement("div", {"className": "li-label-text"}, node.label);
          let containerSpan = React.createElement("div", {"className": "tree-text-container" + clickedClass}, textSpan);
          let hasChildren = await skosNodeHasChildren(ontologyId, node.iri);    
          if (!hasChildren){
            leafClass = " leaf-node";            
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
          
          if(fullTree && node.iri === targetNodeIri){
            let siblingsNodes = await SkosHelper.createSiblingsNodes(ontologyId, targetNodeIri);
            siblingsNodes.unshift(nodeInTree);
            ul = React.createElement("ul", {className: "tree-node-ul", id: parentId}, siblingsNodes);
          }
          else{
            ul = React.createElement("ul", {className: "tree-node-ul", id: parentId}, nodeInTree);
          }
                             
          childNode = ul;
        }
        return  {"ul": ul, "nodeSubTree": nodeInTree, "treeNodesArray": treeNodes};
    }



    static async buildSkosFullTree(skosOntologyId, excludedRootNodeIri=null, exludedRootNodeSubtreeContent=null){
      let listOfNodes = [];
      let rootNodes = await getSkosOntologyRootConcepts(skosOntologyId);
      for(let i=0; i < rootNodes.length; i++){
        let node = await SkosHelper.shapeSkosMetadata(rootNodes[i], true);      
        if(node.iri !== excludedRootNodeIri){
          let leafClass = " closed";        
          let symbol = React.createElement("i", {"className": "fa fa-plus", "aria-hidden": "true"}, "");
          let textSpan = React.createElement("div", {"className": "li-label-text"}, node.text);
          let containerSpan = React.createElement("div", {"className": "tree-text-container"}, textSpan);        
          if (!node.children){
            leafClass = " leaf-node";            
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
          listOfNodes.push(exludedRootNodeSubtreeContent);
        } 
      }
      return React.createElement("ul", {className: "tree-node-ul", id: "tree-root-ul"}, listOfNodes);      
    }



    static async createSiblingsNodes(ontologyId, targetNodeIri){
      let parentNode = await getSkosNodeParent(ontologyId, targetNodeIri);
      let siblingsNodes = [];
      let nodesToRender = [];      
      if(!parentNode){
        siblingsNodes = await getSkosOntologyRootConcepts(ontologyId);
      }
      else{
        siblingsNodes = await getChildrenSkosTree(ontologyId, parentNode.iri);
      }

      for(let i=0; i < siblingsNodes.length; i++){
        let node = await SkosHelper.shapeSkosMetadata(siblingsNodes[i], (!parentNode ? true : false));
        if(node.iri !== targetNodeIri){
          let treeNode = new TreeNodeController();
          let listItem = treeNode.buildNodeWithReact(node, node.iri);
          nodesToRender.push(listItem);
        } 
      }
      return nodesToRender;   

    }



    static async showHidesiblingsForSkos(showFlag, ontologyId, iri){
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
            let node = await SkosHelper.shapeSkosMetadata(siblingsNodes[i], (!parent ? true : false));
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



    static async shapeSkosMetadata(skosNode, isRootNode=false){
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





}

