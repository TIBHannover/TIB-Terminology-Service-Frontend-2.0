
class PaneResize{

    constructor(){
        this.lastPagePositionX = 0;
        this.isResizeOn = false;
    }

    onMouseDown(event){
        let targetElement = event.target;
        if (!targetElement.classList.contains('tree-view-resize-area')){
          return null;
        }
        this.lastPagePositionX = event.clientX;
        this.isResizeOn = true;        
    }
    

    moveToResize(event){
        if(!this.isResizeOn){
          return null;
        }   
        let addedWidth = (event.clientX - this.lastPagePositionX) / 1;    
        let treeLeftPane = document.getElementById("tree-page-left-pane");
        let treeRightPane = document.getElementById("tree-page-right-pane");
        let currentWidthLeft = parseInt(treeLeftPane.offsetWidth);    
        let currentWidthRight = parseInt(treeRightPane.offsetWidth);    
        treeLeftPane.style.width = (currentWidthLeft + addedWidth) + "px";
        treeRightPane.style.width = (currentWidthRight - addedWidth) + "px";
        this.lastPagePositionX = event.clientX;        
      } 
    

    releaseMouseFromResize(event){
        if(!this.isResizeOn){
          return null;
        }
        this.isResizeOn = false;    
      }

}

export default PaneResize;