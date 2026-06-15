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

class PaneResize {
  lastPagePositionX: number;
  isResizeOn: boolean;
  originalLeftPaneWidth: number;
  lastResizeTime: number;

  constructor() {
    this.lastPagePositionX = 0;
    this.isResizeOn = false;
    this.originalLeftPaneWidth = 0;
    this.lastResizeTime = Date.now();
  }

  setOriginalWidthForLeftPanes() {
    this.originalLeftPaneWidth =
      document.getElementById("page-left-pane")?.offsetWidth ?? 0;
  }

  generateVerticalResizeLine() {
    return [
      <div className="page-resize-vertical-line stour-tree-page-resize-line"></div>,
    ];
  }

  onMouseDown(event: MouseEvent) {
    let targetElement = event.target as HTMLElement;
    if (!targetElement.classList.contains("page-resize-vertical-line")) {
      return null;
    }
    this.lastPagePositionX = event.clientX;
    this.isResizeOn = true;
  }

  moveToResize(event: MouseEvent) {
    if (!this.isResizeOn || Date.now() - this.lastPagePositionX < 200) {
      return null;
    }
    this.lastResizeTime = Date.now();
    requestAnimationFrame(() => {
      let addedWidth = event.clientX - this.lastPagePositionX;
      let pageLeftPane = document.getElementById("page-left-pane");
      let pageRightPane = document.getElementById("page-right-pane");
      if (!pageLeftPane || !pageRightPane) {
        return;
      }
      let currentWidthLeft = pageLeftPane.offsetWidth;
      let currentWidthRight = pageRightPane.offsetWidth;
      pageLeftPane.style.width = currentWidthLeft + addedWidth + "px";
      pageRightPane.style.width = currentWidthRight - addedWidth + "px";
      this.lastPagePositionX = event.clientX;
      let jumpToBox = document.getElementsByClassName(
        "react-autosuggest__input",
      );
      if (jumpToBox.length !== 0 && addedWidth < 0) {
        jumpToBox[0].classList.add("small-jumpto-box");
      } else if (jumpToBox.length !== 0 && addedWidth < 0) {
        jumpToBox[0].classList.remove("small-jumpto-box");
      }
      let graphContainer = document.getElementsByClassName("graph-container");
      if (graphContainer.length === 1) {
        const graphElement = graphContainer[0] as HTMLElement;
        let currentGraphWidth = graphElement.offsetWidth;
        graphElement.style.width = currentGraphWidth - addedWidth + "px";
      }
    });
  }

  releaseMouseFromResize(event: MouseEvent) {
    if (!this.isResizeOn) {
      return null;
    }
    this.isResizeOn = false;
  }

  resetTheWidthToOrignial() {
    let pageLeftPane = document.getElementById("page-left-pane");
    if (pageLeftPane) {
      pageLeftPane.style.width = this.originalLeftPaneWidth + "px";
    }
    this.lastPagePositionX = 0;
    this.isResizeOn = false;
  }
}

export default PaneResize;
