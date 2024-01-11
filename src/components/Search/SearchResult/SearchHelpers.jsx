import {getCollectionOntologies, getAllOntologies} from '../../../api/fetchData';


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


/**
 * Set the ontology list  for filter based on the selected ontology and collections
 * @param {*} selectedOntologies 
 * @param {*} selectedCollections 
 */
export async function setOntologyForFilter(selectedOntologies, selectedCollections){
    let result = [];    
    if(selectedOntologies.length === 0 && selectedCollections.length === 0){
        return [[], "all"];
    }
    else if(selectedCollections.length === 0){
        return [selectedOntologies, ""];
    }
    else if(selectedOntologies.length === 0){
        let collectionOntologies = await getCollectionOntologies(selectedCollections, false);
        for(let onto of collectionOntologies){
            result.push(onto['ontologyId']);
        }
        return [result, ""];
    }
    else{
        let collectionOntologies = await getCollectionOntologies(selectedCollections, false);
        for(let onto of selectedOntologies){          
            if(ontologyIsPartOfSelectedCollections(collectionOntologies, onto)){
                result.push(onto);
            }
        }
        return [result, ""];
    }        
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
 * Create an empty facet counts. Used when there is not search results
 */
export function createEmptyFacetCounts(allOntologies){
    let facetData = {};
    facetData["facet_fields"] = {};    
    facetData["facet_fields"]["type"] = ["class", 0, "property", 0, "individual", 0, "ontology", 0];
    facetData["facet_fields"]["ontology_name"] = [];
    for(let onto of allOntologies){
        facetData["facet_fields"]["ontology_name"].push(onto["ontologyId"].toUpperCase());
        facetData["facet_fields"]["ontology_name"].push(0);
    }    
    return facetData;
}