import TreeNodeController from "./TreeNode";

const NAVIGATION_KEYS = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"];

class KeyboardNavigator {
  selectedNodeId: string | null;
  node: HTMLElement | null;
  afterRunEventFunction: (target: HTMLElement) => void;
  expandNodeHandlerFunction: (target: HTMLElement) => void | Promise<void>;

  constructor(
    selectedNodeId: string | null,
    afterRunEventFunction: (target: HTMLElement) => void,
    expandNodeHandlerFunction: (target: HTMLElement) => void | Promise<void>,
  ) {
    this.selectedNodeId = selectedNodeId;
    this.node = null;
    this.afterRunEventFunction = afterRunEventFunction;
    this.expandNodeHandlerFunction = expandNodeHandlerFunction;
  }

  updateSelectedNodeId(newId: string | number | null) {
    this.selectedNodeId = newId === null ? null : String(newId);
  }

  jumpToSuggestionsAreOpen() {
    const openContainers = Array.from(
      document.getElementsByClassName(
        "react-autosuggest__suggestions-container--open",
      ),
    ) as HTMLElement[];

    return openContainers.some((container) => {
      const style = window.getComputedStyle(container);
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        container.getClientRects().length > 0 &&
        container.querySelector(".react-autosuggest__suggestion")
      );
    });
  }

  run(event: KeyboardEvent) {
    let treeNodeManager = new TreeNodeController();
    let reactour = document.getElementsByClassName("reactour__helper");
    if (reactour.length !== 0 || this.jumpToSuggestionsAreOpen()) {
      // do not perform when Jumpto box is open OR site tour is open
      return true;
    }
    if (NAVIGATION_KEYS.includes(event.code)) {
      event.preventDefault();
    }
    try {
      if (
        !this.selectedNodeId &&
        ["ArrowDown", "ArrowUp"].includes(event.key)
      ) {
        // No term is selected yet. Pick the first one
        this.node = treeNodeManager.getFirstNodeInTree();
        this.afterRunEventFunction(this.node);
        treeNodeManager.scrollElementIntoTreePane(this.node);
      } else if (this.selectedNodeId && event.key === "ArrowDown") {
        // select the next node. It is either the next siblings or the node first child
        this.node = document.getElementById(this.selectedNodeId);
        if (this.node) this.performArrowDown();
      } else if (this.selectedNodeId && event.key === "ArrowUp") {
        // select the previous node. It is either the previous siblings or last opened node.
        this.node = document.getElementById(this.selectedNodeId);
        if (this.node) this.performArrowUp();
      } else if (this.selectedNodeId && event.key === "ArrowRight") {
        // Expand the node if it has children. if it is already expanded, move the select into children
        this.node = document.getElementById(this.selectedNodeId);
        if (!this.node) return true;
        if (treeNodeManager.isNodeClosed(this.node)) {
          this.expandNodeHandlerFunction(this.node);
        } else if (!treeNodeManager.isNodeLeaf(this.node)) {
          let childNode = treeNodeManager.getFirstChildLabelText(this.node.id);
          this.afterRunEventFunction(childNode);
          treeNodeManager.scrollElementIntoTreePane(childNode);
        }
      } else if (this.selectedNodeId && event.key === "ArrowLeft") {
        // Move the selection to the parent. If it is already moved, close the parent.
        this.node = document.getElementById(this.selectedNodeId);
        if (!this.node) return true;
        let parentNode = treeNodeManager.getParentNode(this.node.id);
        if (treeNodeManager.isNodeExpanded(this.node)) {
          this.expandNodeHandlerFunction(this.node);
        } else if (parentNode.tagName === "LI") {
          parentNode = treeNodeManager.getNodeLabelTextById(parentNode.id);
          this.afterRunEventFunction(parentNode);
          treeNodeManager.scrollElementIntoTreePane(parentNode);
        }
      }
    } catch (e) {
      // console.info(e)
    }
  }

  performArrowUp() {
    let treeNodeManager = new TreeNodeController();
    if (!this.node) return;
    if (!this.node.previousSibling) {
      let parentNode = treeNodeManager.getParentNode(this.node.id);
      let parentNodeLabelText = treeNodeManager.getNodeLabelTextById(
        parentNode.id,
      );
      this.afterRunEventFunction(parentNodeLabelText);
      treeNodeManager.scrollElementIntoTreePane(parentNodeLabelText);
    } else if (
      treeNodeManager.isNodeClosed(this.node.previousSibling) ||
      treeNodeManager.isNodeLeaf(this.node.previousSibling)
    ) {
      let previousSiblingNode = treeNodeManager.getNodeLabelTextById(
        (this.node.previousSibling as HTMLElement).id,
      );
      this.afterRunEventFunction(previousSiblingNode);
      treeNodeManager.scrollToPreviousNode(this.selectedNodeId);
    } else {
      let previousSiblingNodeChildren = treeNodeManager.getNodeChildren(
        (this.node.previousSibling as HTMLElement).id,
      );
      let lastChild =
        previousSiblingNodeChildren[previousSiblingNodeChildren.length - 1];
      while (true) {
        if (
          treeNodeManager.isNodeClosed(lastChild) ||
          treeNodeManager.isNodeLeaf(lastChild)
        ) {
          break;
        }
        previousSiblingNodeChildren = treeNodeManager.getNodeChildren(
          (lastChild as HTMLElement).id,
        );
        lastChild =
          previousSiblingNodeChildren[previousSiblingNodeChildren.length - 1];
      }
      let lastChildNode = treeNodeManager.getNodeLabelTextById(
        (lastChild as HTMLElement).id,
      );
      this.afterRunEventFunction(lastChildNode);
      treeNodeManager.scrollElementIntoTreePane(lastChildNode);
    }
  }

  performArrowDown() {
    let treeNodeManager = new TreeNodeController();
    if (!this.node) return;
    if (treeNodeManager.isNodeExpanded(this.node)) {
      let firstChildNode = treeNodeManager.getFirstChildLabelText(this.node.id);
      this.afterRunEventFunction(firstChildNode);
      treeNodeManager.scrollElementIntoTreePane(firstChildNode);
    } else if (this.node.nextSibling) {
      let nextNode = treeNodeManager.getNodeNextSiblings(this.node.id);
      this.afterRunEventFunction(nextNode);
      treeNodeManager.scrollToNextNode(this.selectedNodeId);
    } else {
      let parentNode = treeNodeManager.getParentNode(this.node.id);
      while (!parentNode.nextSibling) {
        parentNode = treeNodeManager.getParentNode(parentNode.id);
      }
      let parentNodeNextSiblings = treeNodeManager.getNodeNextSiblings(
        parentNode.id,
      );
      this.afterRunEventFunction(parentNodeNextSiblings);
      treeNodeManager.scrollElementIntoTreePane(parentNodeNextSiblings);
    }
  }
}

export default KeyboardNavigator;
