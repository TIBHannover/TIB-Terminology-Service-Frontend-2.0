import {useState, useEffect} from 'react';
import DataTree from '../DataTree/DataTree';
import {getSkosOntologyRootConcepts, isSkosOntology, getObsoleteTerms} from '../../../api/fetchData';
import OntologyApi from '../../../api/ontology';
import IndividualsList from '../IndividualList/IndividualList';
import TermList from '../TermList/TermList';
import queryString from 'query-string'; 
import OntologyOverview from '../OntologyOverview/OntologyOverview';
import ontologyPageTabConfig from './listOfComponentsAsTabs.json';
import { shapeSkosConcepts, renderOntologyPageTabs, createOntologyPageHeadSection } from './helpers';
import Toolkit from '../../../Libs/Toolkit';
import IssueList from '../IssueList/IssueList';
import NoteList from '../Note/NoteList';
import '../../layout/ontologyHomePage.css';
import '../../layout/tree.css';
import '../../layout/note.css';
import '../../layout/githubPanel.css';
import '../../layout/termList.css';
import '../../layout/reactAutoSuggestLib.css';
import '../../layout/jumpTo.css';




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
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRootTermsLoaded, setIsRootTermsLoaded] = useState(false);
  const [errorRootTerms, setErrorRootTerms] = useState(null);
  const [activeTab, setActiveTab] = useState(OVERVIEW_TAB_ID);
  const [rootTerms, setRootTerms] = useState([]);
  const [skosRootIndividuals, setSkosRootIndividuals] = useState([]);
  const [rootProps, setRootProps] = useState([]);
  const [obsoleteTerms, setObsoleteTerms] = useState([]);
  const [obsoleteProps, setObsoleteProps] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [lastIrisHistory, setLastIrisHistory] = useState({"terms": "", "properties": "", "individuals": "", "termList": ""});
  const [lastTabsStates, setLastTabsStates] = useState({"terms": null, "properties": null, "gitIssues": ""});
  const [rootNodeNotExist, setRootNodeNotExist] = useState(false);
  const [isSkosOntology, setIsSkosOntology] = useState(false);
  const [ontologyShowAll, setOntologyShowAll] = useState(false);
  const [showMoreLessOntologiesText, setShowMoreLessOntologiesText] = useState("+ Show More");
  



  async function loadOntologyData(){
    let ontologyId = this.props.match.params.ontologyId;
    let ontologyApi = new OntologyApi({ontologyId:ontologyId});
    await ontologyApi.fetchOntology();
    if(!ontologyApi.ontology){
      setIsLoaded(true);
      setError("Can not load this ontology");   
      return true;
    }
    let isSkos = ontologyApi.ontology['config']?.['skos'];
    let skosIndividuals = [];
    if(isSkos){
      skosIndividuals = await getSkosOntologyRootConcepts(ontologyId);
      skosIndividuals = await shapeSkosConcepts(skosIndividuals);
    }

    setIsLoaded(true);
    setOntology(ontologyApi.ontology);
    setIsSkosOntology(isSkos);
    setRootTerms(ontologyApi.rootClasses);
    setRootProps(ontologyApi.rootProperties);   
    setObsoleteTerms(ontologyApi.obsoleteClasses);
    setObsoleteProps(ontologyApi.obsoleteProperties); 
    setSkosRootIndividuals(skosIndividuals);
    setRootNodeNotExist(ontologyApi.rootClasses.length === 0);  
    setIsRootTermsLoaded(true);
   
  }



  function setTabOnLoad(){
    let requestedTab = this.props.match.params.tab;    
    let lastRequestedTab = this.state.lastRequestedTab;
    if (requestedTab === lastRequestedTab){
      return true;
    }

    let activeTabId = TAB_ID_MAP_TO_TAB_ENDPOINT[requestedTab] ? TAB_ID_MAP_TO_TAB_ENDPOINT[requestedTab] : OVERVIEW_TAB_ID;   
    let irisHistory = this.state.lastIrisHistory;
    let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
    irisHistory[requestedTab] = targetQueryParams.iri;  

    this.setState({        
      activeTab: activeTabId,
      waiting: false,
      lastRequestedTab: requestedTab,
      lastIrisHistory: irisHistory
    });
  }


  function tabChange(e, v){
    try{
      let selectedTabId = e.target.dataset.value;         
      this.setState({
        waiting: true
      });
  
      this.setState({
        activeTab: parseInt(selectedTabId),
        waiting: false
      });
    } 
    catch(e){
      this.setState({
        activeTab: OVERVIEW_TAB_ID,
        waiting: false
      });
    }      
  }




  function changeInputIri(iri, componentId){   
    let irisHistory = this.state.lastIrisHistory;
    irisHistory[componentId] = iri;
    this.setState({
      lastIrisHistory: irisHistory
    });
  }


  
  /**
   * Stores the last state in for tabs components to prevent reload on tab change
   */
  function tabsStateKeeper(domContent, stateObject, componentId, iri){         
    let lastTabsStates = this.state.lastTabsStates;    
    lastTabsStates[componentId] = {"html": domContent, "states": stateObject, "lastIri": iri};
    this.setState({
      lastTabsStates: lastTabsStates
    });
  }

  
  useEffect(() => {
    loadOntologyData();
    setTabOnLoad();
  }, []);


  // function componentDidUpdate(){
  //   this.setOntologyData();
  //   this.setTabOnLoad();
  // }



  if (this.state.error) {
    return <div>Error: {this.state.error.message}</div>
  } else if (!this.state.isLoaded) {
    return <div>Loading...</div>
  } else {
    return (        
      <div className='justify-content-center ontology-page-container'>
          {Toolkit.createHelmet(this.state.ontology.ontologyId)}            
          {createOntologyPageHeadSection(this.state.ontology)}          
          <div className='col-sm-12'>
              <ul className="nav nav-tabs">
                  {renderOntologyPageTabs(ontologyPageTabConfig, this.tabChange, this.state.ontologyId, this.state.activeTab)}
              </ul>
              {!this.state.waiting && (this.state.activeTab === OVERVIEW_TAB_ID) &&
                              <OntologyOverview 
                                  ontology={this.state.ontology}
                              />
              }
              {!this.state.waiting && (this.state.activeTab === TERM_TREE_TAB_ID) &&
                              <DataTree
                                rootNodes={this.state.rootTerms}
                                obsoleteTerms={this.state.obsoleteTerms}
                                rootNodesForSkos={this.state.skosRootIndividuals}
                                componentIdentity={'terms'}
                                iri={this.state.lastIrisHistory['terms']}
                                key={'termTreePage'}                    
                                ontology={this.state.ontology}
                                rootNodeNotExist={this.state.rootNodeNotExist}
                                iriChangerFunction={this.changeInputIri}
                                lastState={this.state.lastTabsStates['terms']}
                                domStateKeeper={this.tabsStateKeeper}
                                isSkos={this.state.isSkosOntology}
                                isIndividuals={false}
                              />
              }

              {!this.state.waiting && (this.state.activeTab === PROPERTY_TREE_TAB_ID) &&
                              <DataTree
                                rootNodes={this.state.rootProps}
                                obsoleteTerms={this.state.obsoleteProps}
                                rootNodesForSkos={[]}
                                componentIdentity={'properties'}
                                iri={this.state.lastIrisHistory['properties']}
                                key={'propertyTreePage'}
                                ontology={this.state.ontology}
                                rootNodeNotExist={this.state.rootNodeNotExist}
                                iriChangerFunction={this.changeInputIri}
                                lastState={this.state.lastTabsStates['properties']}
                                domStateKeeper={this.tabsStateKeeper}
                                isIndividuals={false}
                              />
              }
              {!this.state.waiting && (this.state.activeTab === INDIVIDUAL_LIST_TAB_ID) &&
                              <IndividualsList
                                rootNodes={this.state.rootTerms}
                                rootNodesForSkos={this.state.skosRootIndividuals}                                                    
                                iri={this.state.lastIrisHistory['individuals']}
                                componentIdentity={'individuals'}
                                key={'individualsTreePage'}
                                ontology={this.state.ontology}                              
                                iriChangerFunction={this.changeInputIri}
                                lastState={""}
                                domStateKeeper={this.tabsStateKeeper}
                                isSkos={this.state.isSkosOntology}
                                individualTabChanged={this.state.individualTabChanged}                                
                              />
              }
              {!this.state.waiting && (this.state.activeTab === TERM_LIST_TAB_ID) &&
                              <TermList                              
                                iri={this.state.lastIrisHistory['termList']}
                                componentIdentity={'termList'}
                                key={'termListPage'}
                                ontology={this.state.ontologyId}                              
                                iriChangerFunction={this.changeInputIri}                              
                                isSkos={this.state.isSkosOntology}                              
                              />
              }             
              {!this.state.waiting && (this.state.activeTab === NOTES_TAB_ID) &&
                              <NoteList                  
                                componentIdentity={'notes'}
                                key={'notesPage'}
                                ontology={this.state.ontology}
                                isGeneric={true}                                  
                              />
              }                                      
              {!this.state.waiting && (this.state.activeTab === GIT_ISSUE_LIST_ID) &&                            
                              <IssueList                                                           
                                componentIdentity={'gitIssues'}
                                key={'gitIssueList'}
                                ontology={this.state.ontology}                              
                                isSkos={this.state.isSkosOntology}
                                lastState={this.state.lastTabsStates['gitIssues']}                                  
                                storeListOfGitIssuesState={this.tabsStateKeeper}
                              />
              } 

              {this.state.waiting && <i class="fa fa-circle-o-notch fa-spin"></i>}
          </div>                    
      </div>

    )
  }

}


export default OntologyPage;
