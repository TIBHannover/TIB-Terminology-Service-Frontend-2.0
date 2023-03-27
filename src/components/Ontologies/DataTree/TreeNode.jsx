import React from "react";


class TreeNodeController{
    constructor(){
        this.classes = "tree-node-li";
        this.iconInTree = "";
        this.textDivContainer = "";
        this.textDiv = "";
        this.nodeRootElementName = "li";
        this.nodeIri = "";
        this.nodeId = "";
        this.children = [];        
    }


    buildNodeWithReact(nodeObject, nodeId, nodeIsClicked=false, isExpanded=false){
        console.info(nodeObject)
        let nodeLabel = (nodeObject.label ? nodeObject.label : nodeObject.text);
        let nodeHasChildren = (typeof(nodeObject.has_children) !== "undefined" ? nodeObject.has_children : nodeObject.children);
        let partOfSymbol = "";
        this.textDiv = React.createElement("div", {"className": "li-label-text"}, nodeLabel);

        if(typeof(nodeObject['a_attr']) !== "undefined" && nodeObject['a_attr']["class"] === "part_of"){
            partOfSymbol = React.createElement("div", {"className": "p-icon-style"}, "P");            
        }

        if(nodeIsClicked){
            this.textDivContainer = React.createElement("div", {"className": "tree-text-container clicked targetNodeByIri"}, partOfSymbol, this.textDiv);
        }
        else{
            this.textDivContainer = React.createElement("div", {"className": "tree-text-container"}, partOfSymbol, this.textDiv);
        }        
        this.nodeIri = nodeObject.iri;
        if (!nodeHasChildren){
            this.classes += " leaf-node";            
            this.iconInTree = React.createElement("i", {"className": ""}, "");
        } 
        else if(nodeHasChildren && !isExpanded){
            this.classes += " closed";            
            this.iconInTree = React.createElement("i", {"className": "fa fa-plus", "aria-hidden": "true"}, "");
        }
        else{
            this.classes += " opened";            
            this.iconInTree = React.createElement("i", {"className": "fa fa-minus", "aria-hidden": "true"}, "");
        }
       
        let node = React.createElement(this.nodeRootElementName, {         
            "data-iri":this.nodeIri, 
            "data-id": nodeId,
            "className": this.classes,
            "id": nodeId
            }
            , this.iconInTree, this.textDivContainer, this.children
            );
        
        return node;

    }


    buildNodeWithTradionalJs(nodeObject, nodeId, nodeIsClicked=false, isExpanded=false){        
        let nodeLabel = (nodeObject.label ? nodeObject.label : nodeObject.text);
        let nodeHasChildren = (typeof(nodeObject.has_children) !== "undefined" ? nodeObject.has_children : nodeObject.children)
        this.textDiv = document.createElement("div");
        let label = document.createTextNode(nodeLabel);
        this.textDiv.classList.add("li-label-text");
        this.textDiv.appendChild(label);
        this.iconInTree = document.createElement("i");
        this.textDivContainer = document.createElement("div");
        this.textDivContainer.classList.add("tree-text-container");
        let node = document.createElement(this.nodeRootElementName);
        node.setAttribute("id", nodeObject.id + "_" + nodeObject.parent);
        node.setAttribute("data-iri", nodeObject.iri);
        node.setAttribute("data-id", nodeObject.id); 
        node.classList.add(this.classes);
        if(nodeIsClicked){            
            this.textDivContainer.classList.add("clicked");
            this.textDivContainer.classList.add("targetNodeByIri");
        }        
        this.nodeIri = nodeObject.iri;
        if (!nodeHasChildren){
            node.classList.add("leaf-node");
        } 
        else if(nodeHasChildren && !isExpanded){            
            node.classList.add("closed");   
            this.iconInTree.classList.add('fa');
            this.iconInTree.classList.add('fa-plus');
        }
        else{            
            node.classList.add("opened");               
            this.iconInTree.classList.add('fa');
            this.iconInTree.classList.add('fa-minus');
        }

        node.appendChild(this.iconInTree);
        if(typeof(nodeObject['a_attr']) !== "undefined" && nodeObject["a_attr"]["class"] === "part_of"){
            let partOfSymbol = document.createElement("div");
            let pText = document.createTextNode("P");
            partOfSymbol.appendChild(pText);
            partOfSymbol.classList.add("p-icon-style");      
            this.textDivContainer.appendChild(partOfSymbol);
          }
        
        this.textDivContainer.appendChild(this.textDiv);
        node.appendChild(this.textDivContainer);
               
        return node;
    }


    unClickAllNodes(){
        let selectedElement = document.querySelectorAll(".clicked");
        for(let i=0; i < selectedElement.length; i++){
            selectedElement[i].classList.remove("clicked");
        }
    }

    scrollToNode(id){
        let position = document.getElementById(id).offsetTop;
        document.getElementById('trea-container').scrollTop = position;
    }

    scrollToNextNode(id){
        let position = document.getElementById(id).nextSibling.offsetTop;
        document.getElementById('trea-container').scrollTop = position;
    }

    scrollToPreviousNode(id){
        let position = document.getElementById(id).previousSibling.offsetTop;
        document.getElementById('trea-container').scrollTop = position;        
    }

    getClickedNodeDiv(node){
        if(node.tagName === "DIV"){
            return node;    
        }
        return null;
    }

    getClickedNodeIri(node){        
        return node.parentNode.dataset.iri;
    }

    getClickedNodeId(node){
        return node.parentNode.id;
    }

    getNodeLabelTextById(id){
        return document.getElementById(id).getElementsByClassName('tree-text-container')[0];
    }

    getFirstChildLabelText(id){
        return document.getElementById("children_for_" + id).getElementsByClassName('tree-text-container')[0];
    }

    getNodeNextSiblings(id){         
        let node = document.getElementById(id);
        return node.nextSibling.getElementsByClassName('tree-text-container')[0];
    }

    getParentNode(id){
        let node = document.getElementById(id);
        return node.parentNode.parentNode;
    }

    getNodeChildren(id){
        return document.getElementById("children_for_" + id).getElementsByClassName('tree-node-li');
    }

    isNodeExpanded(node){
        return node.classList.contains("opened");
    }

    isNodeClosed(node){
        return node.classList.contains("closed")
    }

    isNodeLeaf(node){
        return node.classList.contains("leaf-node");
    }
}

export default TreeNodeController;