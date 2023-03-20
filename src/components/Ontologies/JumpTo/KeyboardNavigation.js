

export function keyboardNavigationForJumpto(event){
    let jumtoItems = document.getElementsByClassName('jumpto-autosuggest-item');
    if(jumtoItems.length !== 0 && (event.code === "ArrowDown" || event.code === "ArrowUp")){
        event.preventDefault();        
    }    
}