export function keyboardNavigationForJumpto(event) {
  let jumtoItems = document.getElementsByClassName("item-for-navigation");
  if (jumtoItems.length === 0) {
    return false;
  }
  try {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      performArrowDown();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      performArrowUp();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      performArrowRight();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      performArrowLeft();
    } else if (event.key === "Enter") {
      event.preventDefault();
      performEnter();
    }
  } catch (e) {
    // console.info(e);
  }
}

function performArrowRight() {
  selectItemInOtherColumn(".jump-to-ontology-column");
}

function performArrowLeft() {
  selectItemInOtherColumn(".jump-to-term-column");
}

function performArrowDown() {
  let selectedElement = document.getElementsByClassName(
    "selected-by-arrow-key",
  );

  if (selectedElement.length === 0) {
    selectTheFirstItem();
  } else {
    selectTheNextSibling(selectedElement[0]);
  }
}

function performArrowUp() {
  let selectedElement = document.getElementsByClassName(
    "selected-by-arrow-key",
  );
  if (selectedElement.length === 0) {
    selectTheLastElement();
  } else {
    selectThePreviousSibling(selectedElement[0]);
  }
}

function selectItemInOtherColumn(columnSelector: string) {
  let targetColumn = document.querySelector(columnSelector);
  if (!targetColumn) {
    return;
  }

  let targetItems = targetColumn.getElementsByClassName("item-for-navigation");
  if (targetItems.length === 0) {
    return;
  }

  let selectedElement = document.getElementsByClassName(
    "selected-by-arrow-key",
  );
  let targetIndex = 0;
  if (selectedElement.length !== 0) {
    let currentColumn = selectedElement[0].closest(
      ".jump-to-term-column, .jump-to-ontology-column",
    );
    if (currentColumn === targetColumn) {
      return;
    }
    targetIndex = getItemIndexInColumn(selectedElement[0], currentColumn);
    selectedElement[0].classList.remove("selected-by-arrow-key");
  }

  targetItems[Math.min(targetIndex, targetItems.length - 1)].classList.add(
    "selected-by-arrow-key",
  );
}

function getItemIndexInColumn(selectedElement, currentColumn) {
  if (!currentColumn) {
    return 0;
  }
  let currentItems = currentColumn.getElementsByClassName(
    "item-for-navigation",
  );
  for (let i = 0; i < currentItems.length; i++) {
    if (currentItems[i] === selectedElement) {
      return i;
    }
  }
  return 0;
}

function performEnter() {
  let selectedElement = document.getElementsByClassName(
    "selected-by-arrow-key",
  );

  if (selectedElement.length !== 0) {
    let selectedLink =
      selectedElement[0].closest("a") || selectedElement[0].querySelector("a");
    if (selectedLink) {
      selectedLink.click();
    } else {
      selectedElement[0].parentNode.click();
    }
  }
}

function selectTheNextSibling(selectedElement) {
  let nextSiblng = getNextSiblings();
  selectedElement.classList.remove("selected-by-arrow-key");
  if (nextSiblng && nextSiblng.classList.contains("item-for-navigation")) {
    nextSiblng.classList.add("selected-by-arrow-key");
  } else {
    selectTheFirstItem();
  }
}

function selectThePreviousSibling(selectedElement) {
  let previousSibling = getPreviousSiblings();
  selectedElement.classList.remove("selected-by-arrow-key");
  if (
    previousSibling &&
    previousSibling.classList.contains("item-for-navigation")
  ) {
    previousSibling.classList.add("selected-by-arrow-key");
  } else {
    selectTheLastElement();
  }
}

function getNextSiblings() {
  let naviationalItems = document.getElementsByClassName("item-for-navigation");
  let lastSelectedIndexObserved = false;
  for (let item of naviationalItems) {
    if (lastSelectedIndexObserved) {
      return item;
    }
    if (item.classList.contains("selected-by-arrow-key")) {
      lastSelectedIndexObserved = true;
    }
  }
  return null;
}

function getPreviousSiblings() {
  let naviationalItems: any[] = Array.prototype.slice.call(
    document.getElementsByClassName("item-for-navigation"),
  );
  naviationalItems = naviationalItems.reverse();
  let lastSelectedIndexObserved = false;
  for (let item of naviationalItems) {
    if (lastSelectedIndexObserved) {
      return item;
    }
    if (item.classList.contains("selected-by-arrow-key")) {
      lastSelectedIndexObserved = true;
    }
  }
  return null;
}

function selectTheFirstItem() {
  let naviationalItems = document.getElementsByClassName("item-for-navigation");
  naviationalItems[0].classList.add("selected-by-arrow-key");
}

function selectTheLastElement() {
  let naviationalItems = document.getElementsByClassName("item-for-navigation");
  naviationalItems[naviationalItems.length - 1].classList.add(
    "selected-by-arrow-key",
  );
}
