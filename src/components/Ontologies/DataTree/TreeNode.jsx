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
        // this.buildNodeWithReact = this.buildNodeWithReact.bind(this);        
    }


    buildNodeWithReact(nodeObject, nodeId){
        this.textSpan = React.createElement("span", {"className": "li-label-text"}, nodeObject.label);
        this.textSpanContainer = React.createElement("span", {"className": "tree-text-container"}, this.textSpan);
        this.nodeIri = nodeObject.iri;
        if (!nodeObject.has_children){
            this.classes += " leaf-node";            
            this.iconInTree = React.createElement("i", {"className": ""}, "");
        } 
        else{
            this.classes += " closed";            
            this.iconInTree = React.createElement("i", {"className": "fa fa-plus", "aria-hidden": "true"}, "");
        }
        let node = React.createElement(this.nodeRootElementName, {         
            "data-iri":this.nodeIri, 
            "data-id": nodeId,
            "className": this.classes,
            "id": nodeId
            }
            , this.iconInTree, this.textSpanContainer
            );
        
        return node;

    }
}

export default TreeNode;