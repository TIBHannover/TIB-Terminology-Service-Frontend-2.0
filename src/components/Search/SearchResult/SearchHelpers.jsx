import {getCollectionOntologies, getAllOntologies} from '../../../api/fetchData';
import { apiHeaders } from '../../../api/headers';


export function setResultTitleAndLabel(resultItem){
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
 * Set the counter for the fields in facet
 * @param {*} triggerField: which facet field is triggered
 * @param {*} enteredTerm : search term
 * @param {*} filteredFacetFields : the facet fields json
 * @param {*} lastFacetState : last facet field json
 * @param {*} collections : selected collections
 * @param {*} types : selected types
 * @param {*} ontologiesForFilter : selected ontologies
 * @returns 
 */
export async function setFacetCounts(triggerField, enteredTerm, filteredFacetFields, lastFacetState, collections, types, ontologiesForFilter){
    if(triggerField === "type" || triggerField === ""){    
        let url = process.env.REACT_APP_SEARCH_URL + `?q=${enteredTerm}`;
        let allOntologies = [];
        if(collections.length === 0){
            let all = await getAllOntologies();
            for(let onto of all){
                allOntologies.push(onto['ontologyId'])
            }
        }
        else{
            let collectionOntologies = await getCollectionOntologies(collections, false);            
            for(let onto of collectionOntologies){
                allOntologies.push(onto['ontologyId']);
            }
        }      
        allOntologies.forEach(item => {
            url = url + `&ontology=${item.toLowerCase()}`;
        });       
        types.forEach(item => {
            url = url + `&type=${item.toLowerCase()}`;      
        });
        let res = await (await fetch(url)).json();
        res = res['facet_counts'];
        filteredFacetFields["facet_fields"]["ontology_name"] = res["facet_fields"]["ontology_name"];


        url = process.env.REACT_APP_SEARCH_URL + `?q=${enteredTerm}`;
        ontologiesForFilter.forEach(item => {
            url = url + `&ontology=${item.toLowerCase()}`;
        });  
        res = await (await fetch(url,{mode: 'cors', headers: apiHeaders(),})).json();
        res = res['facet_counts'];
        filteredFacetFields["facet_fields"]["type"] = res["facet_fields"]["type"];
        return filteredFacetFields;
    
      }
      if(triggerField === "ontology" || triggerField === ""){    
        let url = process.env.REACT_APP_SEARCH_URL + `?q=${enteredTerm}`;
        ["class", "property", "individual", "ontology"].forEach(item => {
            url = url + `&type=${item.toLowerCase()}`;
        });
        ontologiesForFilter.forEach(item => {
            url = url + `&ontology=${item.toLowerCase()}`;
        });
        let res = await (await fetch(url,{mode: 'cors', headers: apiHeaders(),})).json();
        res = res['facet_counts'];
        filteredFacetFields["facet_fields"]["type"] = res["facet_fields"]["type"];        
                        
        url = process.env.REACT_APP_SEARCH_URL + `?q=${enteredTerm}`;
        types.forEach(item => {
            url = url + `&type=${item.toLowerCase()}`;
        });
        
        let collectionOntologies = await getCollectionOntologies(collections, false);
        collectionOntologies.forEach(item => {
            url = url + `&ontology=${item['ontologyId'].toLowerCase()}`;
        });
        res = await (await fetch(url,{mode: 'cors', headers: apiHeaders(),})).json();
        res = res['facet_counts'];    
        filteredFacetFields["facet_fields"]["ontology_name"] = res["facet_fields"]["ontology_name"];
        return filteredFacetFields;
    
      }
      if((triggerField === "collection" || triggerField === "") && process.env.REACT_APP_PROJECT_ID === "general"){        
        let url = process.env.REACT_APP_SEARCH_URL + `?q=${enteredTerm}`;
        ["class", "property", "individual", "ontology"].forEach(item => {
            url = url + `&type=${item.toLowerCase()}`;      
        });
        ontologiesForFilter.forEach(item => {
            url = url + `&ontology=${item.toLowerCase()}`;
        });
        let res = await (await fetch(url,{mode: 'cors', headers: apiHeaders(),})).json();
        res = res['facet_counts'];
        filteredFacetFields["facet_fields"]["type"] = res["facet_fields"]["type"];


        url = process.env.REACT_APP_SEARCH_URL + `?q=${enteredTerm}`;
        types.forEach(item => {
            url = url + `&type=${item.toLowerCase()}`;      
        });
        
        let collectionOntologies = await getCollectionOntologies(collections, false);
        collectionOntologies.forEach(item => {
            url = url + `&ontology=${item['ontologyId'].toLowerCase()}`;
        });
        res = await (await fetch(url, {mode: 'cors', headers: apiHeaders(),})).json();
        res = res['facet_counts'];
        filteredFacetFields["facet_fields"]["ontology_name"] = res["facet_fields"]["ontology_name"];
        return filteredFacetFields;
      }
      return filteredFacetFields;      
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