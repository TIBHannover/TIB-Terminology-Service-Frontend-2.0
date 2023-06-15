import React from 'react';
import {getChildrenSkosTree, skosNodeHasChildren, getSkosNodeByIri, getSkosNodeParent, getSkosOntologyRootConcepts} from '../../../api/fetchData';
import TreeNodeController from './TreeNode';




export default class SkosHelper{


    static async buildSkosSubtree(ontologyId, iri, fullTree=false){
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
            let node = await SkosHelper.shapeSkosMetadata(rootNodes[i], true);      
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

