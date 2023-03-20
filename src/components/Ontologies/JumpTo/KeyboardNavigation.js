

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
    }
    catch(e){
        console.info(e);
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



function selectTheNextSibling(selectedElement){
    let nextSiblng = selectedElement?.parentNode?.parentNode?.nextSibling?.firstChild.firstChild;
    selectedElement.classList.remove('selected-by-arrow-key');
    if(nextSiblng && nextSiblng.classList.contains('jumpto-result-text')){                    
        nextSiblng.classList.add('selected-by-arrow-key');
    }
    else{
        selectTheFirstItem();
    }
}


function selectTheFirstItem(){
    let jumtoItems = document.getElementsByClassName('jumpto-result-text');
    jumtoItems[0].classList.add('selected-by-arrow-key');
}