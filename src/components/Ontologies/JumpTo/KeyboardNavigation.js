

export function keyboardNavigationForJumpto(event){
    let jumtoItems = document.getElementsByClassName('jumpto-result-text');
    if(jumtoItems.length === 0){
        return false;
    }    
    try{        
        if(event.key === "ArrowDown"){
            event.preventDefault();
            performArrowDown();
        }
        else if(event.key === "ArrowUp"){
            event.preventDefault();
            performArrowUp();
        }
        else if(event.key === "Enter"){
            event.preventDefault();
            performEnter();
        }
    }
    catch(e){
        // console.info(e);
    }
}


function performArrowDown(){
    let selectedElement = document.getElementsByClassName('selected-by-arrow-key');
    if(selectedElement.length === 0){
        selectTheFirstItem();
    }   
    else{                
        selectTheNextSibling(selectedElement[0]);
    }
}


function performArrowUp(){
    let selectedElement = document.getElementsByClassName('selected-by-arrow-key');
    if(selectedElement.length === 0){
        selectTheLastElement();
    }
    else{
        selectThePreviousSibling(selectedElement[0]);
    }
}


function performEnter(){
    let selectedElement = document.getElementsByClassName('selected-by-arrow-key');
    if(selectedElement.length !== 0){
        selectedElement[0].parentNode.click();
    }
}



function selectTheNextSibling(selectedElement){
    let nextSiblng = getNextSiblings();
    selectedElement.classList.remove('selected-by-arrow-key');
    if(nextSiblng && nextSiblng.classList.contains('jumpto-result-text')){                    
        nextSiblng.classList.add('selected-by-arrow-key');
    }
    else{
        selectTheFirstItem();
    }
}


function selectThePreviousSibling(selectedElement){
    let previousSibling = getPreviousSiblings();
    selectedElement.classList.remove('selected-by-arrow-key');
    if(previousSibling && previousSibling.classList.contains('jumpto-result-text')){                    
        previousSibling.classList.add('selected-by-arrow-key');
    }
    else{
        selectTheLastElement();
    }
}



function getNextSiblings(){
    let holders = document.getElementsByClassName('jumpto-item-holder');
    let lastSelectedIndexObserved = false;
    for(let item of holders){
        if(lastSelectedIndexObserved){
            return item.firstChild.firstChild;
        }
        if(item.firstChild.firstChild.classList.contains('selected-by-arrow-key')){
            lastSelectedIndexObserved = true;
        }
    }
    return null;
}


function getPreviousSiblings(){
    let holders = document.getElementsByClassName('jumpto-item-holder');
    holders = [].slice.call(holders);    
    holders = holders.reverse();
    let lastSelectedIndexObserved = false;
    for(let item of holders){
        if(lastSelectedIndexObserved){
            return item.firstChild.firstChild;
        }
        if(item.firstChild.firstChild.classList.contains('selected-by-arrow-key')){
            lastSelectedIndexObserved = true;
        }
    }
    return null;
}


function selectTheFirstItem(){    
    let jumtoItems = document.getElementsByClassName('jumpto-result-text');    
    jumtoItems[0].classList.add('selected-by-arrow-key');
}

function selectTheLastElement(){
    let jumtoItems = document.getElementsByClassName('jumpto-result-text');
    jumtoItems[jumtoItems.length - 1].classList.add('selected-by-arrow-key');
}