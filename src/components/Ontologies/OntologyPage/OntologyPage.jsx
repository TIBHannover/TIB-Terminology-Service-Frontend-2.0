import React from 'react';
import DataTree from '../DataTree/DataTree';
import {getOntologyRootTerms, getOntologyRootProperties, getSkosOntologyRootConcepts, isSkosOntology, getObsoleteTerms} from '../../../api/fetchData';
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



class OntologyPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      ontologyId: "",
      lastRequestedTab: "",
      ontology: null,
      error: null,
      isLoaded: false,
      isRootTermsLoaded: false,
      errorRootTerms: null,      
      activeTab: OVERVIEW_TAB_ID,
      rootTerms: [],
      skosRootIndividuals: [],
      rootProps: [],
      obsoleteTerms: [],
      obsoleteProps: [],
      waiting: false,
      lastIrisHistory: {"terms": "", "properties": "", "individuals": "", "termList": ""},
      lastTabsStates: {"terms": null, "properties": null, "gitIssues": ""},
      rootNodeNotExist: false,
      isSkosOntology: false,
      ontologyShowAll: false,
      showMoreLessOntologiesText: "+ Show More",      
      isSkosOntology: false
    })
    this.tabChange = this.tabChange.bind(this);
    this.setTabOnLoad = this.setTabOnLoad.bind(this);
    this.setOntologyData = this.setOntologyData.bind(this);
    this.changeInputIri = this.changeInputIri.bind(this);
    this.tabsStateKeeper = this.tabsStateKeeper.bind(this);  
    document.getElementById('application_content').style.width = '100%';  
  }


  /**
   * Get the ontology detail from the backend
   */
  async getOntology (ontologyId) {
    let ontologyApi = new OntologyApi({ontologyId:ontologyId});
    await ontologyApi.fetchOntology();    
    if (ontologyApi.ontology){
      this.setState({
        isLoaded: true,
        ontology: ontologyApi.ontology,
        isSkosOntology: ontologyApi.ontology['config']?.['skos']
      });
    }
    else{
      this.setState({
        isLoaded: true,
        error: 'Can not get this ontology'
      });
    }

  }


  /**
   * Set ontology related data
   */
  setOntologyData (){
    let ontologyId = this.props.match.params.ontologyId;
    if(this.state.ontologyId != ontologyId){
      this.getOntology(ontologyId);
      this.getRootTerms(ontologyId);
      this.getRootProps(ontologyId);
      this.setState({
        ontologyId: ontologyId
      });
    }    
  }



  /**
   * Set the active tab and its page on load
   */
  setTabOnLoad(){
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



  /**
     * Get the ontology root classes 
     */
  async getRootTerms (ontologyId) {       
    let rootTerms = [];
    let skosRootIndividuals = [];    
    let isSkos = await isSkosOntology(ontologyId);    
    if(isSkos){
      skosRootIndividuals = await getSkosOntologyRootConcepts(ontologyId);
      skosRootIndividuals = await shapeSkosConcepts(skosRootIndividuals);
    }
    rootTerms = await getOntologyRootTerms(ontologyId);
    let obsoleteTerms = await getObsoleteTerms(ontologyId, "terms"); 
    if (typeof(rootTerms) != undefined){
      if (rootTerms.length !== 0){
        this.setState({
          isRootTermsLoaded: true,
          rootTerms: rootTerms,
          skosRootIndividuals: skosRootIndividuals,
          rootNodeNotExist: false,          
          obsoleteTerms: obsoleteTerms          
        });
      }
      else{
        this.setState({
          isRootTermsLoaded: true,
          rootTerms: rootTerms,
          skosRootIndividuals: skosRootIndividuals,
          rootNodeNotExist: true,
          isSkosOntology: isSkos,
          obsoleteTerms: obsoleteTerms
        });
      }      
    }
    else{
      this.setState({
        isRootTermsLoaded: true,
        errorRootTerms: 'Can not get this ontology root terms',
        skosRootIndividuals: [],
        rootNodeNotExist: true,
        isSkosOntology: isSkos,
        rootTermsWithObsoletes: []
      });
    }
  }



  /**
     * Get the ontology root properties from the backend
     */
  async getRootProps (ontologyId) {
    let rootProps = await getOntologyRootProperties(ontologyId);
    let obsoleteProps = await getObsoleteTerms(ontologyId, "properties"); 
    if (typeof rootProps != undefined){
      if(rootProps.length !== 0){
        this.setState({
          rootProps: rootProps,
          rootNodeNotExist: false,
          obsoleteProps: obsoleteProps
        });
      }
      else{
        this.setState({
          rootProps: rootProps,
          rootNodeNotExist: true,
          obsoleteProps: []
        });
      }
    }
   
  }


  /**
     * Handle the tab change in the ontology detail Top menu
     *
     * @param {*} e
     * @param {*} value
     */
  tabChange = (e, v) => {
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

/**
 * Change the selected iri in the dataTree component.
 * Need to pass it to the DataTree component
 */
  changeInputIri(iri, componentId){   
    let irisHistory = this.state.lastIrisHistory;
    irisHistory[componentId] = iri;
    this.setState({
      lastIrisHistory: irisHistory
    });
  }


  
  /**
   * Stores the last state in for tabs components to prevent reload on tab change
   */
  tabsStateKeeper(domContent, stateObject, componentId, iri){         
    let lastTabsStates = this.state.lastTabsStates;    
    lastTabsStates[componentId] = {"html": domContent, "states": stateObject, "lastIri": iri};
    this.setState({
      lastTabsStates: lastTabsStates
    });
  }

  
  componentDidMount () {
    this.setOntologyData();
    this.setTabOnLoad();
  }

  componentDidUpdate(){
    this.setOntologyData();
    this.setTabOnLoad();
  }



  render () {    
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
}


export default OntologyPage;
