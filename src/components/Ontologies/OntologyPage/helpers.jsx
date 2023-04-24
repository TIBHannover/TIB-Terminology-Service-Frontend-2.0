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


export function createOntologyPageHeadSection(ontology){
    return [
        <div className='span'>
            <div className='row ont-info-bar header-collapseable-section'>
                <div className= "col-sm-12">
                    <div>
                    <h4><Link className={"ont-info-bar-title"} to = {process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + ontology.ontologyId}>{ontology.config.title}</Link></h4>
                    </div>
                    <div>
                    <a href={ontology.config.id}>{ontology.config.id}</a>
                    </div>
                </div>
            </div>
            <div className='row collpase-button-container justify-content-md-center'>
                <div className='col-sm-1'>                                  
                    <div className='header-collapse-btn' onClick={() => {collpaseSiteHeader()}}>
                        <i className='fa fa-angle-double-up header-collpase-icon'></i>
                    </div>
                </div>
            </div>                        
        </div>                
    ];
}


function collpaseSiteHeader(){
    let siteHeader = document.getElementsByClassName('header-wrapper')[0];    
    let collpaseIcone = document.getElementsByClassName('header-collpase-icon')[0];    
    let ontologyBannerContainer = document.getElementsByClassName('ont-info-bar')[0];
    let applicationContent = document.getElementsByClassName('application-content')[0];
    if(collpaseIcone.classList.contains('fa-angle-double-up')){
        siteHeader.style.maxHeight = '0';
        ontologyBannerContainer.style.maxHeight = '0';
        collpaseIcone.classList.remove('fa-angle-double-up');
        collpaseIcone.classList.add('fa-angle-double-down');
        siteHeader.style.marginTop = '-10px';
        applicationContent.style.minHeight = '800px';
    }
    else{
        siteHeader.style.maxHeight = '200px';
        ontologyBannerContainer.style.maxHeight = '200px';
        collpaseIcone.classList.add('fa-angle-double-up');
        collpaseIcone.classList.remove('fa-angle-double-down');
        siteHeader.style.marginTop = '10px';
        applicationContent.style.minHeight = '500px';
    }
    
}