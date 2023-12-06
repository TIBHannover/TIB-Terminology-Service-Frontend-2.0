/**
 * This is the class for having a two-pain page in a way that each pane would be resizeable. Example: Tree View
 * 
 * How to use:
 * 
 * The page structure (rendered result) has to be like this in order for this functionality to perform:
 * 
 *      <div className="resizable-container">
 *          <div id="page-left-pane>
 *              // your left content
 *          </div>
 *          {MyPaneResizeClassInstance.generateVerticalResizeLine()}
 *          <div id="page-right-pane>
 *              // your right content
 *          </div>
 *      </div>
 * 
 * 
 * You need also add the mouse events listeners to your componentDidMount() function:
 *      document.body.addEventListener("mousedown", MyPaneResizeClassInstance.onMouseDown);
        document.body.addEventListener("mousemove", MyPaneResizeClassInstance.moveToResize);
        document.body.addEventListener("mouseup", MyPaneResizeClassInstance.releaseMouseFromResize);
 * 
 * 
 * Note: Remeber to remove these listeners when component is unmount.
 * 
 * 
 * 
 */



class PaneResize{

    constructor(){
        this.lastPagePositionX = 0;
        this.isResizeOn = false;        
        this.originalLeftPaneWidth = 0;
    }


    setOriginalWidthForLeftPanes(){        
        this.originalLeftPaneWidth = document.getElementById("page-left-pane").offsetWidth;
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


    resetTheWidthToOrignial(){
        let pageLeftPane = document.getElementById("page-left-pane");                    
        pageLeftPane.style.width = this.originalLeftPaneWidth + "px";        ;
        this.lastPagePositionX = 0;        
        this.isResizeOn = false;   
    }

}

export default PaneResize;