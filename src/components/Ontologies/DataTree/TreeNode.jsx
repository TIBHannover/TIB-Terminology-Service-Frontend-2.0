import React from "react";


class TreeNode{
    constructor(){
        this.classes = "tree-node-li";
        this.iconInTree = "";
        this.textSpanContainer = "";
        this.textSpan = "";
        this.nodeRootElementName = "li";
        this.nodeIri = "";
        this.nodeId = "";
        this.children = [];        
    }


    buildNodeWithReact(nodeObject, nodeId, nodeIsClicked=false, isExpanded=false){
        let nodeLabel = (nodeObject.label ? nodeObject.label : nodeObject.text);
        let nodeHasChildren = (typeof(nodeObject.has_children) !== "undefined" ? nodeObject.has_children : nodeObject.children);
        let partOfSymbol = "";
        this.textSpan = React.createElement("span", {"className": "li-label-text"}, nodeLabel);

        if(typeof(nodeObject['a_attr']) !== "undefined" && nodeObject['a_attr']["class"] === "part_of"){
            partOfSymbol = React.createElement("span", {"className": "p-icon-style"}, "P");            
        }

        if(nodeIsClicked){
            this.textSpanContainer = React.createElement("span", {"className": "tree-text-container clicked targetNodeByIri"}, partOfSymbol, this.textSpan);
        }
        else{
            this.textSpanContainer = React.createElement("span", {"className": "tree-text-container"}, partOfSymbol, this.textSpan);
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
            , this.iconInTree, this.textSpanContainer, this.children
            );
        
        return node;

    }


    buildNodeWithTradionalJs(nodeObject, nodeId, nodeIsClicked=false, isExpanded=false){
        let nodeLabel = (nodeObject.label ? nodeObject.label : nodeObject.text);
        let nodeHasChildren = (typeof(nodeObject.has_children) !== "undefined" ? nodeObject.has_children : nodeObject.children)
        this.textSpan = document.createElement("span");
        let label = document.createTextNode(nodeLabel);
        this.textSpan.classList.add("li-label-text");
        this.textSpan.appendChild(label);
        this.iconInTree = document.createElement("i");
        this.textSpanContainer = document.createElement("span");
        this.textSpanContainer.classList.add("tree-text-container");
        let node = document.createElement(this.nodeRootElementName);
        node.setAttribute("id", nodeId);
        node.setAttribute("data-iri", nodeObject.iri);
        node.setAttribute("data-id", nodeObject.id); 
        node.classList.add(this.classes);
        if(nodeIsClicked){            
            this.textSpanContainer.classList.add("clicked");
            this.textSpanContainer.classList.add("targetNodeByIri");
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
        if(nodeObject["a_attr"]["class"] === "part_of"){
            let partOfSymbol = document.createElement("span");
            let pText = document.createTextNode("P");
            partOfSymbol.appendChild(pText);
            partOfSymbol.classList.add("p-icon-style");      
            this.textSpanContainer.appendChild(partOfSymbol);
          }
        
        this.textSpanContainer.appendChild(this.textSpan);
        node.appendChild(this.textSpanContainer);
               
        return node;
    }
}

export default TreeNode;