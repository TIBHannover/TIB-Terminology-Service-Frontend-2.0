
export function setResultTitleAndLabel(resultItem, obsoletes){
    let content = [];
    let targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']);
    if(resultItem["type"] === 'class'){
        targetHref += '/terms?iri=' + encodeURIComponent(resultItem['iri']) + `&obsoletes=${obsoletes}`;       
    }
    else if(resultItem["type"] === 'property'){
        targetHref += '/props?iri=' + encodeURIComponent(resultItem['iri']) + `&obsoletes=${obsoletes}`;        
    }   
    else if(resultItem["type"] === 'individual'){
        targetHref += '/individuals?iri=' + encodeURIComponent(resultItem['iri']) + `&obsoletes=${obsoletes}`;
    }
    
    content.push(
        <div className="search-card-title"> 
            <a href={targetHref} className="search-result-title">
                [{resultItem.type}] <h4>{resultItem.label}</h4>
            </a>
            <a className="btn btn-default term-button" href={targetHref} >
                {resultItem.short_form}
            </a>
        </div>
    ); 
    
    return content;    
}



export function makeAlsoInTag(resultItem){
    let content = [];
    let targetHref = "";
    if(resultItem["type"] === 'class'){
        targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']) + '/terms?iri=' + encodeURIComponent(resultItem['iri']);       
    }
    else if(resultItem["type"] === 'property'){
        targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']) +'/props?iri=' + encodeURIComponent(resultItem['iri']);        
    }
    else if(resultItem["type"] === 'individual'){
        targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']) +'/individuals?iri=' + encodeURIComponent(resultItem['iri']);
    }
    
    content.push(
        <div> 
            <a href={targetHref} className="btn btn-default ontology-button " target="_blank">
            {resultItem['ontology_prefix']}
            </a>
        </div>
    ); 
    
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
