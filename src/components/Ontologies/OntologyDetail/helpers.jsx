import {skosNodeHasChildren} from '../../../api/fetchData';


/**
 * Shape the skos concepts obtained from API to be in a format that data tree can render it like other term trees.
 * @param {*} skosConcepts 
 */
export function shapeSkosConcepts(skosConcepts){
    let concepts = [];
    for(let cons of skosConcepts){
        let res = {};
        res["label"] = cons["data"]["label"];        
        res["has_children"] = skosNodeHasChildren(cons['ontology_name'], cons["data"]["iri"]);
        res["iri"] = cons["data"]["iri"];
        concepts.push(res);
    }
    return concepts    
}