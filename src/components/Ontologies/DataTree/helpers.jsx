/**
 * Create a hierarchical list form a flat list. 
 * @param {*} flatList 
 * @returns 
 */
export function buildHierarchicalArray(flatList){
    let map = {}; 
    let node = "";
    let roots = [];
    for (let i = 0; i < flatList.length; i++) {
        map[flatList[i].id] = i; 
        flatList[i].childrenList = []; 
    }
    
    for (let i = 0; i < flatList.length; i++) {
        node = flatList[i];
        if (node.parent !== "#") {
        flatList[map[node.parent]].childrenList.push(node);
        } else {
        roots.push(node);
        }
    }
    return roots;
}



/**
 * Build a list (li) element for the tree veiw
 * @param {*} childNode
 */
 export function buildTreeListItem(childNode){
    let newId = childNode.id + "_" +  Math.floor(Math.random() * 10000);
    let label = document.createTextNode(childNode.text);
    let partOfSymbol = document.createElement("span");
    let pText = document.createTextNode("P");
    partOfSymbol.appendChild(pText);
    partOfSymbol.classList.add("p-icon-style");
    let labelTextSpan = document.createElement("span");
    labelTextSpan.classList.add("li-label-text");
    labelTextSpan.appendChild(label);
    let symbol = document.createElement("i");
    let listItem = document.createElement("li");
    listItem.setAttribute("id", newId);
    listItem.setAttribute("data-iri", childNode.iri);
    listItem.setAttribute("data-id", childNode.id);
    if(childNode.children){
      listItem.classList.add("closed");
      symbol.classList.add('fa');
      symbol.classList.add('fa-plus');
    }
    else{
      listItem.classList.add("leaf-node");
      symbol.classList.add('fa');
      symbol.classList.add('fa-close');
    }
    listItem.appendChild(symbol);
    listItem.appendChild(partOfSymbol);
    listItem.appendChild(labelTextSpan);
    listItem.classList.add("tree-node-li");

    return listItem;
  }