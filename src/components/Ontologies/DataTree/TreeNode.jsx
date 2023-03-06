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
        let nodeHasChildren = (typeof(nodeObject.has_children) !== "undefined" ? nodeObject.has_children : nodeObject.children)
        this.textSpan = React.createElement("span", {"className": "li-label-text"}, nodeLabel);
        if(nodeIsClicked){
            this.textSpanContainer = React.createElement("span", {"className": "tree-text-container clicked targetNodeByIri"}, this.textSpan);
        }
        else{
            this.textSpanContainer = React.createElement("span", {"className": "tree-text-container"}, this.textSpan);
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
}

export default TreeNode;