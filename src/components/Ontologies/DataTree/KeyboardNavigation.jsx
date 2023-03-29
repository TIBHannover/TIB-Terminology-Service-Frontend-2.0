import TreeNodeController from "./TreeNode";


let treeNode = new TreeNodeController();


export function performArrowUp(currentNode, nodeSelectorFunction, scrollToElementId){
    if(!currentNode.previousSibling){
        let parentNode = treeNode.getParentNode(currentNode.id);
        let parentNodeLabelText = treeNode.getNodeLabelTextById(parentNode.id);
        nodeSelectorFunction(parentNodeLabelText);                    
        treeNode.scrollToNode(parentNode.id);
    }
    else if(treeNode.isNodeClosed(currentNode.previousSibling) || treeNode.isNodeLeaf(currentNode.previousSibling)){
        let previousSiblingNode = treeNode.getNodeLabelTextById(currentNode.previousSibling.id);
        nodeSelectorFunction(previousSiblingNode);                    
        treeNode.scrollToPreviousNode(scrollToElementId);
    }
    else{                    
        let previousSiblingNodeChildren =  treeNode.getNodeChildren(currentNode.previousSibling.id);
        let lastChild = previousSiblingNodeChildren[previousSiblingNodeChildren.length - 1];
        while(true){
            if(treeNode.isNodeClosed(lastChild) || treeNode.isNodeLeaf(lastChild)){
                break;
            }
            previousSiblingNodeChildren =  treeNode.getNodeChildren(lastChild.id);
            lastChild = previousSiblingNodeChildren[previousSiblingNodeChildren.length - 1];
        }
        let lastChildNode = treeNode.getNodeLabelTextById(lastChild.id);
        nodeSelectorFunction(lastChildNode);                    
        treeNode.scrollToPreviousNode(scrollToElementId);
    }
}


export function performArrowDown(currentNode, nodeSelectorFunction, scrollToElementId){
    if(treeNode.isNodeExpanded(currentNode)){
        let firstChildNode = treeNode.getFirstChildLabelText(currentNode.id);
        nodeSelectorFunction(firstChildNode);
        treeNode.scrollToNode(scrollToElementId);
    }
    else if(currentNode.nextSibling){                            
        let nextNode = treeNode.getNodeNextSiblings(currentNode.id);
        nodeSelectorFunction(nextNode);
        treeNode.scrollToNextNode(scrollToElementId);
    }
    else{                    
        let parentNode = treeNode.getParentNode(currentNode.id);
        while(!parentNode.nextSibling){
            parentNode = treeNode.getParentNode(parentNode.id);
        }                    
        let parentNodeNextSiblings = treeNode.getNodeNextSiblings(parentNode.id);
        nodeSelectorFunction(parentNodeNextSiblings);                    
        treeNode.scrollToNode(scrollToElementId);
    }    
}

