
class PaneResize{

    constructor(){
        this.lastPagePositionX = 0;
        this.isResizeOn = false;
    }


    generateVerticalResizeLine(){
        return [
            <div className='page-resize-vertical-line'></div>
        ];
    }

    onMouseDown(event){
        let targetElement = event.target;
        if (!targetElement.classList.contains('page-resize-vertical-line')){
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
        let pageLeftPane = document.getElementById("page-left-pane");
        let pageRightPane = document.getElementById("page-right-pane");
        let currentWidthLeft = parseInt(pageLeftPane.offsetWidth);    
        let currentWidthRight = parseInt(pageRightPane.offsetWidth);    
        pageLeftPane.style.width = (currentWidthLeft + addedWidth) + "px";
        pageRightPane.style.width = (currentWidthRight - addedWidth) + "px";
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