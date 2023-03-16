import { Link } from 'react-router-dom';
import {skosNodeHasChildren} from '../../../api/fetchData';



/**
 * Shape the skos concepts obtained from API to be in a format that data tree can render it like other term trees.
 * @param {*} skosConcepts 
 */
export async function shapeSkosConcepts(skosConcepts){
    let concepts = [];
    for(let cons of skosConcepts){
        let res = {};
        res["label"] = cons["data"]["label"];        
        res["has_children"] = await skosNodeHasChildren(cons['data']['ontology_name'], cons["data"]["iri"]);
        res["iri"] = cons["data"]["iri"];
        concepts.push(res);
    }
    console.info(concepts)
    return concepts    
}


export function renderOntologyPageTabs(tabMetadataJson, tabChangeHandler, ontologyId, activeTabId){
    let result = [];
    for(let configItemKey in tabMetadataJson){
        let configObject = tabMetadataJson[configItemKey];
        result.push(
            <li className="nav-item ontology-detail-nav-item" key={configObject['keyForRenderAsTabItem']}>
                <Link 
                    onClick={tabChangeHandler} 
                    data-value={configObject['tabId']} 
                    className={(activeTabId === parseInt(configObject['tabId'])) ? "nav-link active" : "nav-link"} 
                    to={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + ontologyId + configObject['urlEndPoint']}>
                
                    {configObject['tabTitle']}
                </Link>
            </li>
        );
    }

    return result;
}