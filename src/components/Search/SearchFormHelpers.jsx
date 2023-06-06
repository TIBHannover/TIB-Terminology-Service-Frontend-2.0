import {getCollectionOntologies, getAllOntologies} from '../../api/fetchData';


export function setJumpResultButtons(resultItem){
    let content = [];
    let targetHref = "";
    if(resultItem["type"] === 'class'){
        targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']) + '/terms?iri=' + encodeURIComponent(resultItem['iri']);       
    }
    else if(resultItem["type"] === 'property'){
        targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']) +'/props?iri=' + encodeURIComponent(resultItem['iri']);        
    }
    else if(resultItem["type"] === 'ontology'){
        targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']);       
    }
    else if(resultItem["type"] === 'individual'){
        targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']) +'/individuals?iri=' + encodeURIComponent(resultItem['iri']);
    }

    if (process.env.REACT_APP_PROJECT_ID === "nfdi4ing"){
        content.push(
            <a href={targetHref} className="jumto-result-link container">      
            {(() => { 
                if(resultItem["type"] === 'ontology'){
                    return (
                        <div className="jumpto-result-text item-for-navigation">
                            {resultItem['label']}
                            <div className="btn btn-default button-in-jumpto ontology-button">{resultItem['ontology_name']}</div>
                        </div>
                    )
                }
                else{
                    return(
                        <div className="jump-autocomplete-item jumpto-result-text item-for-navigation">  
                            {resultItem['label']}
                          <div className="btn btn-default button-in-jumpto term-button">{resultItem['short_form']}</div>
                          <div className="btn btn-default button-in-jumpto ontology-button">{resultItem['ontology_name']}</div>
                        </div>
                    )
                }       
                
            })()}                
            </a>
        ); 
    } else {
        content.push(
            <a href={targetHref} className="jumto-result-link container">            
            {(() => { 
                if(resultItem["type"] === 'ontology'){
                    return (
                        <div className="jumpto-result-text item-for-navigation">
                            {resultItem['label']}
                         <div className="btn btn-default button-in-jumpto jmp-ontology-button">{resultItem['ontology_name']}</div>
                        </div>
                    )
                }
                else{
                    return(
                        <div className="jumpto-result-text item-for-navigation">
                            {resultItem['label']}
                          <div className="btn btn-default button-in-jumpto jmp-ontology-button">{resultItem['ontology_name']}</div>
                          <div className="btn btn-default button-in-jumpto jmp-term-button">{resultItem['short_form']}</div>
                        </div>
                    )
                }       
                
            })()}            
            </a>
        ); 
    }
 
    return content;    
}

/**
 * Check if an ontology is part of a set of collections. Used in the facet filter
 * @param {*} collectionsOntologies 
 * @param {*} ontologyId 
 */
export function ontologyIsPartOfSelectedCollections(collectionsOntologies, ontologyId){    
    for(let onto of collectionsOntologies){        
        if(onto["ontologyId"] === ontologyId.toLowerCase()){
            return true;
        }
    }    
    return false;
}


/**
 * Set the autosuggest based on the Collection project
 */

export async function ontologyForAutosuggest(){
    let result = [];
    let ontologiesForCollection = await fetch(`${this.state.api_base_url}/ontologies/filterby?schema=collection&classification=NFDI4CHEM&exclusive=false`)
    ontologiesForCollection = (await ontologiesForCollection.json())['_embedded']['ontologies']
    for(let onto of ontologiesForCollection){
        result.push(onto['ontologyId']);
      }
    return result;

}