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
    return concepts    
}


export function renderOntologyPageTabs(tabMetadataJson, tabChangeHandler, ontologyId, activeTabId){
    let result = [];
    for(let configItemKey in tabMetadataJson){
        let configObject = tabMetadataJson[configItemKey];
        if(process.env.REACT_APP_NOTE_FEATURE !== "true" && configItemKey === "Notes"){
            continue;
        }
        if(process.env.REACT_APP_GITHUB_ISSUE_LIST_FEATURE !== "true" && configItemKey === "IssueList"){
            continue;
        }
        result.push(
            <li className="nav-item ontology-detail-nav-item" key={configObject['keyForRenderAsTabItem']}>
                <Link 
                    onClick={tabChangeHandler} 
                    data-value={configObject['tabId']} 
                    className={(activeTabId === parseInt(configObject['tabId'])) ? "nav-link active" : "nav-link"} 
                    to={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + ontologyId + configObject['urlEndPoint']}
                    >                
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
                        <h2><Link className={"ont-info-bar-title"} to = {process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + ontology.ontologyId}>{ontology.config.title}</Link></h2>
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
    let collapseIcone = document.getElementsByClassName('header-collpase-icon')[0];    
    let ontologyBannerContainer = document.getElementsByClassName('ont-info-bar')[0];
    let collapseIconContainer = document.getElementsByClassName('collpase-button-container')[0];    
    if(collapseIcone.classList.contains('fa-angle-double-up')){        
        ontologyBannerContainer.classList.add('hidden-header');
        siteHeader.classList.add('hidden-header');
        siteHeader.classList.remove('visible-header');
        ontologyBannerContainer.classList.remove('visible-header');        
        collapseIcone.classList.remove('fa-angle-double-up');
        collapseIcone.classList.add('fa-angle-double-down'); 
        collapseIconContainer.classList.add('show-header-arrow-down');                    
    }
    else{
        siteHeader.classList.remove('hidden-header');  
        ontologyBannerContainer.classList.remove('hidden-header');
        siteHeader.classList.add('visible-header');
        ontologyBannerContainer.classList.add('visible-header');                  
        collapseIcone.classList.add('fa-angle-double-up');
        collapseIcone.classList.remove('fa-angle-double-down'); 
        collapseIconContainer.classList.remove('show-header-arrow-down');        
    }
    
}