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
    } else if (event.key === "Enter") {
      event.preventDefault();
      performEnter();
    }
  } catch (e) {
    // console.info(e);
  }
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

function performEnter() {
  let selectedElement = document.getElementsByClassName(
    "selected-by-arrow-key",
  );

  console.log(selectedElement);
  if (selectedElement.length !== 0) {
    selectedElement[0].parentNode.click();
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
  let naviationalItems = document.getElementsByClassName("item-for-navigation");
  naviationalItems = [].slice.call(naviationalItems);
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
