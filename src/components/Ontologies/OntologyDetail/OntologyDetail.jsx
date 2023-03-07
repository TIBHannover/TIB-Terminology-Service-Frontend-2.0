import React from 'react'
import OntologyInfoBox from './widgets/infoBox'
import OntologyStatsBox from './widgets/stats';
import DataTree from '../DataTree/DataTree';
import { Link } from 'react-router-dom';
import queryString from 'query-string'; 
import {getOntologyDetail, getOntologyRootTerms, getOntologyRootProperties, getSkosOntologyRootConcepts, isSkosOntology} from '../../../api/fetchData';
import { shapeSkosConcepts } from './helpers';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import IndividualsList from '../IndividualList/IndividualList';
import TermList from '../TermList/TermList';


const OVERVIEW_TAB_ID = 0;
const TERM_TREE_TAB_ID = 1;
const PROPERTY_TREE_TAB_ID = 2;
const INDIVIDUAL_LIST_TAB_ID = 3;
const TERM_LIST_TAB_ID = 4;



class OntologyDetail extends React.Component {
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
        targetIndividualIri: (typeof(targetQueryParams.iri) !== "undefined" ? targetQueryParams.iri : lastIri)

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
     * Get the ontology root classes 
     */
  async getRootTerms (ontologyId) {    
    let rootTerms = [];
    let isSkos = await isSkosOntology(ontologyId);    
    if(isSkos){
      rootTerms = await getSkosOntologyRootConcepts(ontologyId);
      rootTerms = shapeSkosConcepts(rootTerms);
    }
    else{
      rootTerms = await getOntologyRootTerms(ontologyId);
    }    
    if (typeof(rootTerms) != undefined){
      if (rootTerms.length !== 0){
        this.setState({
          isRootTermsLoaded: true,
          rootTerms: rootTerms,
          rootNodeNotExist: false,
          isSkosOntology: isSkos
        });
      }
      else{
        this.setState({
          isRootTermsLoaded: true,
          rootTerms: rootTerms,
          rootNodeNotExist: true,
          isSkosOntology: isSkos
        });
      }      
    }
    else{
      this.setState({
        isRootTermsLoaded: true,
        errorRootTerms: 'Can not get this ontology root terms',
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
          <HelmetProvider>
          <div>
            <Helmet>
              <title>{this.state.ontology.config.preferredPrefix}</title>
            </Helmet>
          </div>
          </HelmetProvider>
          <div className= "ont-info-bar">
            <div>
              <h4><Link className={"ont-info-bar-title"} to = {process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + this.state.ontologyId}>{this.state.ontology.config.title}</Link></h4>
            </div>
            <div>
              <a href={this.state.ontology.config.id}>{this.state.ontology.config.id}</a>
            </div>
          </div>
          <div className='col-sm-8'>
              <ul className="nav nav-tabs">
                <li className="nav-item ontology-detail-nav-item" key={"overview-tab"}>
                  <Link onClick={this.tabChange} data-value="0" className={(this.state.activeTab === OVERVIEW_TAB_ID) ? "nav-link active" : "nav-link"} to={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + this.state.ontologyId}>Overview</Link>
                </li>
                <li class="nav-item ontology-detail-nav-item" key={"class-tab"}>
                  <Link onClick={this.tabChange} data-value='1' className={(this.state.activeTab === TERM_TREE_TAB_ID) ? "nav-link active" : "nav-link"} to={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + this.state.ontologyId + "/terms"}>Classes</Link>
                </li>
                <li class="nav-item ontology-detail-nav-item" key={"prop-tab"}>
                  <Link onClick={this.tabChange} data-value="2" className={(this.state.activeTab === PROPERTY_TREE_TAB_ID) ? "nav-link active" : "nav-link"} to={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + this.state.ontologyId + "/props"}>Properties</Link>
                </li>
                <li class="nav-item ontology-detail-nav-item" key={"indv-tab"}>
                  <Link onClick={this.tabChange} data-value="3" className={(this.state.activeTab === INDIVIDUAL_LIST_TAB_ID) ? "nav-link active" : "nav-link"} to={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + this.state.ontologyId + "/individuals"}>individuals</Link>
                </li>
                <li class="nav-item ontology-detail-nav-item" key={"termList-tab"}>
                  <Link onClick={this.tabChange} data-value="4" className={(this.state.activeTab === TERM_LIST_TAB_ID) ? "nav-link active" : "nav-link"} to={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + this.state.ontologyId + "/termList"}>Class List</Link>
                </li>            
              </ul>             
              {!this.state.waiting && (this.state.activeTab === OVERVIEW_TAB_ID) &&
                          <div  key={'ontolofyOverviewPage'} className="row ontology-detail-page-container">
                            <div className='col-sm-9'>
                              <OntologyInfoBox ontology={this.state.ontology} />
                            </div>
                            <div className='col-sm-3'>
                              <OntologyStatsBox ontology={this.state.ontology} />
                            </div>
                          </div>
              }
              {!this.state.waiting && (this.state.activeTab === TERM_TREE_TAB_ID) &&
                            <DataTree
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
                            <DataTree
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
                              rootNodes={this.state.rootTerms}                                                    
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
                              iri={this.state.targetIndividualIri}
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


export default OntologyDetail
