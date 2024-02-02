import {useState, useEffect} from 'react';
import DataTree from '../DataTree/DataTree';
import {getSkosOntologyRootConcepts} from '../../../api/fetchData';
import OntologyApi from '../../../api/ontology';
import IndividualsList from '../IndividualList/IndividualList';
import TermList from '../TermList/TermList';
import OntologyOverview from '../OntologyOverview/OntologyOverview';
import ontologyPageTabConfig from './listOfComponentsAsTabs.json';
import { shapeSkosConcepts, renderOntologyPageTabs, createOntologyPageHeadSection } from './helpers';
import Toolkit from '../../../Libs/Toolkit';
import IssueList from '../IssueList/IssueList';
import NoteList from '../Note/NoteList';
import '../../layout/ontologyHomePage.css';
import '../../layout/note.css';




const OVERVIEW_TAB_ID = 0;
const TERM_TREE_TAB_ID = 1;
const PROPERTY_TREE_TAB_ID = 2;
const INDIVIDUAL_LIST_TAB_ID = 3;
const TERM_LIST_TAB_ID = 4;
const NOTES_TAB_ID = 5;
const GIT_ISSUE_LIST_ID = 6;

const TAB_ID_MAP_TO_TAB_ENDPOINT = {
  "terms": TERM_TREE_TAB_ID,
  "props": PROPERTY_TREE_TAB_ID,
  "individuals": INDIVIDUAL_LIST_TAB_ID,
  "termList": TERM_LIST_TAB_ID,
  "notes": NOTES_TAB_ID,
  "gitpanel": GIT_ISSUE_LIST_ID
}



const OntologyPage = (props) => {

  document.getElementById('application_content').style.width = '100%';  

  const [lastRequestedTab, setLastRequestedTab] = useState("");
  const [ontology, setOntology] = useState(null);
  const [error, setError] = useState(null);  
  const [activeTab, setActiveTab] = useState(OVERVIEW_TAB_ID);
  const [rootTerms, setRootTerms] = useState([]);
  const [skosRootIndividuals, setSkosRootIndividuals] = useState([]);
  const [rootProps, setRootProps] = useState([]);
  const [obsoleteTerms, setObsoleteTerms] = useState([]);
  const [obsoleteProps, setObsoleteProps] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [lastIrisHistory, setLastIrisHistory] = useState({"terms": "", "properties": "", "individuals": "", "termList": ""});
  const [lastTabsStates, setLastTabsStates] = useState({"terms": null, "properties": null, "gitIssues": ""});  
  const [isSkosOntology, setIsSkosOntology] = useState(false);  
  



  async function loadOntologyData(){
    let ontologyId = props.match.params.ontologyId;
    let ontologyApi = new OntologyApi({ontologyId:ontologyId});
    await ontologyApi.fetchOntology();    
    if(!ontologyApi.ontology){      
      setError("Can not load this ontology");   
      return true;
    }
    let isSkos = ontologyApi.ontology['config']?.['skos'];
    let skosIndividuals = [];
    if(isSkos){
      skosIndividuals = await getSkosOntologyRootConcepts(ontologyId);
      skosIndividuals = await shapeSkosConcepts(skosIndividuals);
    }
    
    setOntology(ontologyApi.ontology);
    setIsSkosOntology(isSkos);
    setRootTerms(ontologyApi.rootClasses);
    setRootProps(ontologyApi.rootProperties);   
    setObsoleteTerms(ontologyApi.obsoleteClasses);
    setObsoleteProps(ontologyApi.obsoleteProperties); 
    setSkosRootIndividuals(skosIndividuals);    
  }



  function setTabOnLoad(){
    let requestedTab = props.match.params.tab;    
    if (requestedTab === lastRequestedTab){
      return true;
    }

    let activeTabId = TAB_ID_MAP_TO_TAB_ENDPOINT[requestedTab] ? TAB_ID_MAP_TO_TAB_ENDPOINT[requestedTab] : OVERVIEW_TAB_ID;   
    let irisHistory = {...lastIrisHistory};    
    let urlParams = new URLSearchParams(window.location.search);
    irisHistory[requestedTab] = urlParams.get("iri");  

    setActiveTab(activeTabId);
    setWaiting(false);
    setLastRequestedTab(requestedTab);
    setLastIrisHistory(irisHistory);    
  }



  function tabChange(e, v){
    try{
      let selectedTabId = e.target.dataset.value;         
      setWaiting(true);
      setActiveTab(parseInt(selectedTabId));
      setWaiting(false);
    } 
    catch(e){
      setActiveTab(OVERVIEW_TAB_ID);
      setWaiting(false);     
    }      
  }




  function changeInputIri(iri, componentId){  
    /**
     * Store the last input iri for tabs
     */ 
    let irisHistory = {...lastIrisHistory};
    irisHistory[componentId] = iri;
    setLastIrisHistory(irisHistory);    
  }



  function tabsStateKeeper(domContent, stateObject, componentId, iri){         
    /**
    * Stores the last state in for tabs components to prevent reload on tab change
    */
    let tabsStates = {...lastTabsStates};    
    tabsStates[componentId] = {"html": domContent, "states": stateObject, "lastIri": iri};
    setLastTabsStates(tabsStates);    
  }

  
  useEffect(() => {
    loadOntologyData();
    setTabOnLoad();
  }, []);




  if (error) {
    return <div>Error: {error.message}</div>
  }
  else if (!ontology) {
    return <div>Loading...</div>
  } 
  else{
    return (        
      <div className='justify-content-center ontology-page-container'>
          {Toolkit.createHelmet(ontology.ontologyId)}            
          {createOntologyPageHeadSection(ontology)}          
          <div className='col-sm-12'>
              <ul className="nav nav-tabs">
                  {renderOntologyPageTabs(ontologyPageTabConfig, tabChange, ontology.ontologyId, activeTab)}
              </ul>
              {!waiting && (activeTab === OVERVIEW_TAB_ID) &&
                              <OntologyOverview 
                                  ontology={ontology}
                              />
              }
              {!waiting && (activeTab === TERM_TREE_TAB_ID) &&
                              <DataTree
                                rootNodes={rootTerms}
                                obsoleteTerms={obsoleteTerms}
                                rootNodesForSkos={skosRootIndividuals}
                                componentIdentity={'terms'}
                                iri={lastIrisHistory['terms']}
                                key={'termTreePage'}                    
                                ontology={ontology}                                
                                iriChangerFunction={changeInputIri}
                                lastState={lastTabsStates['terms']}
                                domStateKeeper={tabsStateKeeper}
                                isSkos={isSkosOntology}
                                isIndividuals={false}
                              />
              }

              {!waiting && (activeTab === PROPERTY_TREE_TAB_ID) &&
                              <DataTree
                                rootNodes={rootProps}
                                obsoleteTerms={obsoleteProps}
                                rootNodesForSkos={[]}
                                componentIdentity={'properties'}
                                iri={lastIrisHistory['properties']}
                                key={'propertyTreePage'}
                                ontology={ontology}                               
                                iriChangerFunction={changeInputIri}
                                lastState={lastTabsStates['properties']}
                                domStateKeeper={tabsStateKeeper}
                                isIndividuals={false}
                              />
              }
              {!waiting && (activeTab === INDIVIDUAL_LIST_TAB_ID) &&
                              <IndividualsList
                                rootNodes={rootTerms}
                                rootNodesForSkos={skosRootIndividuals}                                                    
                                iri={lastIrisHistory['individuals']}
                                componentIdentity={'individuals'}
                                key={'individualsTreePage'}
                                ontology={ontology}                              
                                iriChangerFunction={changeInputIri}
                                lastState={""}
                                domStateKeeper={tabsStateKeeper}
                                isSkos={isSkosOntology}                                                               
                              />
              }
              {!waiting && (activeTab === TERM_LIST_TAB_ID) &&
                              <TermList                              
                                iri={lastIrisHistory['termList']}
                                componentIdentity={'termList'}
                                key={'termListPage'}
                                ontology={ontology.ontologyId}                              
                                iriChangerFunction={changeInputIri}                              
                                isSkos={isSkosOntology}                              
                              />
              }             
              {!waiting && (activeTab === NOTES_TAB_ID) &&
                              <NoteList                                
                                key={'notesPage'}
                                ontology={ontology}                                                                
                              />
              }                                      
              {!waiting && (activeTab === GIT_ISSUE_LIST_ID) &&                            
                              <IssueList                                                           
                                componentIdentity={'gitIssues'}
                                key={'gitIssueList'}
                                ontology={ontology}                              
                                isSkos={isSkosOntology}
                                lastState={lastTabsStates['gitIssues']}                                  
                                storeListOfGitIssuesState={tabsStateKeeper}
                              />
              } 

              {waiting && <i class="fa fa-circle-o-notch fa-spin"></i>}
          </div>                    
      </div>

    )
  }

}


export default OntologyPage;
