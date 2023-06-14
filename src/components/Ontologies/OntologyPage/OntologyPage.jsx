import React from 'react';
import DataTreePage from '../DataTree/DataTreePage';
import { Link } from 'react-router-dom';
import {getOntologyDetail, getOntologyRootTerms, getOntologyRootProperties, getSkosOntologyRootConcepts, isSkosOntology} from '../../../api/fetchData';
import IndividualsList from '../IndividualList/IndividualList';
import TermList from '../TermList/TermList';
import queryString from 'query-string'; 
import OntologyOverview from '../OntologyOverview/OntologyOverview';
import ontologyPageTabConfig from './listOfComponentsAsTabs.json';
import { shapeSkosConcepts, renderOntologyPageTabs, createOntologyPageHeadSection } from './helpers';
import Toolkit from '../../common/Toolkit';


const OVERVIEW_TAB_ID = 0;
const TERM_TREE_TAB_ID = 1;
const PROPERTY_TREE_TAB_ID = 2;
const INDIVIDUAL_LIST_TAB_ID = 3;
const TERM_LIST_TAB_ID = 4;



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
      waiting: false,
      targetTermIri: " ",
      targetPropertyIri: " ",
      targetIndividualIri: " ",
      targetTermListIri: " ",
      rootNodeNotExist: false,
      classTreeDomLastState: "",
      propertyTreeDomLastState: "",
      isSkosOntology: false
    })
    this.tabChange = this.tabChange.bind(this);
    this.setTabOnLoad = this.setTabOnLoad.bind(this);
    this.setOntologyData = this.setOntologyData.bind(this);
    this.changeInputIri = this.changeInputIri.bind(this);
    this.changeTreeContent = this.changeTreeContent.bind(this);
  }




  /**
   * Get the ontology detail from the backend
   */
  async getOntology (ontologyId) {
    let theOntology = await getOntologyDetail(ontologyId);
    if (typeof theOntology != undefined){
      this.setState({
        isLoaded: true,
        ontology: theOntology
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
    let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
    let lastRequestedTab = this.state.lastRequestedTab;    
    if (requestedTab !== lastRequestedTab && requestedTab === 'terms'){
      this.setState({        
        activeTab: TERM_TREE_TAB_ID,
        waiting: false,
        lastRequestedTab: requestedTab,
        targetTermIri: targetQueryParams.iri
      });
    }
    else if (requestedTab !== lastRequestedTab && requestedTab === 'props'){
      this.setState({       
        activeTab: PROPERTY_TREE_TAB_ID,
        waiting: false,
        lastRequestedTab: requestedTab,
        targetPropertyIri: targetQueryParams.iri

      });      
    }
    else if (requestedTab !== lastRequestedTab && requestedTab === 'individuals'){    
      let lastIri = this.state.targetIndividualIri;
      this.setState({        
        activeTab: INDIVIDUAL_LIST_TAB_ID,
        waiting: false,
        lastRequestedTab: requestedTab,
        targetIndividualIri: (typeof(targetQueryParams.iri) !== "undefined" ? targetQueryParams.iri : lastIri)

      });
    }
    else if (requestedTab !== lastRequestedTab && requestedTab === 'termList'){    
      let lastIri = this.state.targetTermListIri;
      this.setState({       
        activeTab: TERM_LIST_TAB_ID,
        waiting: false,
        lastRequestedTab: requestedTab,
        targetTermListIri: (typeof(targetQueryParams.iri) !== "undefined" ? targetQueryParams.iri : lastIri)

      });
    }
    else if (requestedTab !== lastRequestedTab){
      this.setState({        
        activeTab: OVERVIEW_TAB_ID,
        waiting: false,
        lastRequestedTab: requestedTab

      });
    }
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

    if (typeof(rootTerms) != undefined){
      if (rootTerms.length !== 0){
        this.setState({
          isRootTermsLoaded: true,
          rootTerms: rootTerms,
          skosRootIndividuals: skosRootIndividuals,
          rootNodeNotExist: false,
          isSkosOntology: isSkos
        });
      }
      else{
        this.setState({
          isRootTermsLoaded: true,
          rootTerms: rootTerms,
          skosRootIndividuals: skosRootIndividuals,
          rootNodeNotExist: true,
          isSkosOntology: isSkos
        });
      }      
    }
    else{
      this.setState({
        isRootTermsLoaded: true,
        errorRootTerms: 'Can not get this ontology root terms',
        skosRootIndividuals: [],
        rootNodeNotExist: true,
        isSkosOntology: isSkos
      });
    }
  }



  /**
     * Get the ontology root properties from the backend
     */
  async getRootProps (ontologyId) {
    let rootProps = await getOntologyRootProperties(ontologyId);
    if (typeof rootProps != undefined){
      if(rootProps.length !== 0){
        this.setState({
          rootProps: rootProps,
          rootNodeNotExist: false
        });
      }
      else{
        this.setState({
          rootProps: rootProps,
          rootNodeNotExist: true
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
    if(componentId === "term"){
      this.setState({
        targetTermIri: iri
      });
    }
    else if (componentId === "property"){
      this.setState({
        targetPropertyIri: iri
      });
    }
    else if (componentId === "individual"){            
      this.setState({
        targetIndividualIri: iri
      });
    }
    else if (componentId === "termList"){            
      this.setState({
        targetTermListIri: iri
      });
    }
    
  }


  /**
   * Change the data tree last state when the tree changes
   * It keep the tree last state and keep it open on tab switch
   * @param {*} domContent 
   * @param {*} treeId: It is class or property tree (term/property)
   */
  changeTreeContent(domContent, stateObject, treeId){
    typeof(domContent) !== "undefined" ? stateObject.treeDomContent = domContent : stateObject.treeDomContent = ""; 
    if(treeId === "term"){      
      this.setState({classTreeDomLastState: stateObject});
    }
    else if (treeId === "property"){
      this.setState({propertyTreeDomLastState: stateObject});
    }
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
        <div className='row justify-content-center'>
            {Toolkit.createHelmet(this.state.ontology.ontologyId)}            
            {createOntologyPageHeadSection(this.state.ontology)}          
            <div className='col-sm-8'>
                <ul className="nav nav-tabs">
                    {renderOntologyPageTabs(ontologyPageTabConfig, this.tabChange, this.state.ontologyId, this.state.activeTab)}
                </ul>
                {!this.state.waiting && (this.state.activeTab === OVERVIEW_TAB_ID) &&
                                <OntologyOverview 
                                    ontology={this.state.ontology}
                                />
                }
                {!this.state.waiting && (this.state.activeTab === TERM_TREE_TAB_ID) &&
                                <DataTreePage
                                rootNodes={this.state.rootTerms}
                                componentIdentity={'term'}
                                iri={this.state.targetTermIri}
                                key={'termTreePage'}                    
                                ontology={this.state.ontologyId}
                                rootNodeNotExist={this.state.rootNodeNotExist}
                                iriChangerFunction={this.changeInputIri}
                                lastState={this.state.classTreeDomLastState}
                                domStateKeeper={this.changeTreeContent}
                                isSkos={this.state.isSkosOntology}
                                isIndividuals={false}
                                />
                }

                {!this.state.waiting && (this.state.activeTab === PROPERTY_TREE_TAB_ID) &&
                                <DataTreePage
                                rootNodes={this.state.rootProps}
                                componentIdentity={'property'}
                                iri={this.state.targetPropertyIri}
                                key={'propertyTreePage'}
                                ontology={this.state.ontologyId}
                                rootNodeNotExist={this.state.rootNodeNotExist}
                                iriChangerFunction={this.changeInputIri}
                                lastState={this.state.propertyTreeDomLastState}
                                domStateKeeper={this.changeTreeContent}
                                isIndividuals={false}
                                />
                }
                {!this.state.waiting && (this.state.activeTab === INDIVIDUAL_LIST_TAB_ID) &&
                                <IndividualsList
                                rootNodes={this.state.skosRootIndividuals}                                                    
                                iri={this.state.targetIndividualIri}
                                componentIdentity={'individual'}
                                key={'individualsTreePage'}
                                ontology={this.state.ontologyId}                              
                                iriChangerFunction={this.changeInputIri}
                                lastState={""}
                                domStateKeeper={this.changeTreeContent}
                                isSkos={this.state.isSkosOntology}
                                individualTabChanged={this.state.individualTabChanged}                                
                                />
                }
                {!this.state.waiting && (this.state.activeTab === TERM_LIST_TAB_ID) &&
                                <TermList                              
                                iri={this.state.targetTermListIri}
                                componentIdentity={'termList'}
                                key={'termListPage'}
                                ontology={this.state.ontologyId}                              
                                iriChangerFunction={this.changeInputIri}                              
                                isSkos={this.state.isSkosOntology}                              
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
