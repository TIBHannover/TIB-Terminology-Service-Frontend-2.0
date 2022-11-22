import React from 'react'
import OntologyInfoBox from './widgets/infoBox'
import OntologyStatsBox from './widgets/stats';
import DataTree from '../DataTree/DataTree';
import { Link } from 'react-router-dom';
import queryString from 'query-string'; 
import {getOntologyDetail, getOntologyRootTerms, getOntologyRootProperties} from '../../../api/fetchData';




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
      overViewTab: true,
      termsTab: false,
      propTab: false,
      activeTab: 0,
      rootTerms: [],
      rootProps: [],
      waiting: false,
      targetTermIri: " ",
      targetPropertyIri: " ",
      rootNodeNotExist: false,
      classTreeDomLastState: "",
      propertyTreeDomLastState: ""
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
    if (requestedTab != lastRequestedTab && requestedTab == 'terms'){
      this.setState({
        overViewTab: false,
        termsTab: true,
        propTab: false,
        activeTab: 1,
        waiting: false,
        lastRequestedTab: requestedTab,
        targetTermIri: targetQueryParams.iri
      });
    }
    else if (requestedTab != lastRequestedTab && requestedTab == 'props'){
      this.setState({
        overViewTab: false,
        termsTab: false,
        propTab: true,
        activeTab: 2,
        waiting: false,
        lastRequestedTab: requestedTab,
        targetPropertyIri: targetQueryParams.iri

      });
    }
    else if (requestedTab != lastRequestedTab){
      this.setState({
        overViewTab: true,
        termsTab: false,
        propTab: false,
        activeTab: 0,
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
    let rootTerms = await getOntologyRootTerms(ontologyId);
    if (typeof(rootTerms) != undefined){
      if (rootTerms.length !== 0){
        this.setState({
          isRootTermsLoaded: true,
          rootTerms: rootTerms,
          rootNodeNotExist: false
        });
      }
      else{
        this.setState({
          isRootTermsLoaded: true,
          rootTerms: rootTerms,
          rootNodeNotExist: true
        });
      }      
    }
    else{
      this.setState({
        isRootTermsLoaded: true,
        errorRootTerms: 'Can not get this ontology root terms',
        rootNodeNotExist: true
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
    let value = e.target.dataset.value;    
    this.setState({
      waiting: true
    });
    if (value === "0") { // overview
      this.setState({
        overViewTab: true,
        termsTab: false,
        propTab: false,
        activeTab: 0,
        waiting: false
      })
    } else if (value === "1") { // terms (classes)
      this.setState({
        overViewTab: false,
        termsTab: true,
        propTab: false,
        activeTab: 1,
        waiting: false
      })
    } else { // properties
      this.setState({
        overViewTab: false,
        termsTab: false,
        propTab: true,
        activeTab: 2,
        waiting: false
      })
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
    else{
      this.setState({
        targetPropertyIri: iri
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
    else{
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
          <div className='col-sm-8'>
              <ul className="nav nav-tabs">
                <li className="nav-item ontology-detail-nav-item" key={"overview-tab"}>
                  <Link onClick={this.tabChange} data-value="0" className={this.state.overViewTab ? "nav-link active" : "nav-link"} to={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + this.state.ontologyId}>Overview</Link>
                </li>
                <li class="nav-item ontology-detail-nav-item" key={"class-tab"}>
                  <Link onClick={this.tabChange} data-value='1' className={this.state.termsTab ? "nav-link active" : "nav-link"} to={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + this.state.ontologyId + "/terms"}>Classes</Link>
                </li>
                <li class="nav-item ontology-detail-nav-item" key={"prop-tab"}>
                  <Link onClick={this.tabChange} data-value="2" className={this.state.propTab ? "nav-link active" : "nav-link"} to={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + this.state.ontologyId + "/props"}>Properties</Link>
                </li>            
              </ul>             
              {!this.state.waiting && this.state.overViewTab &&
                          <div  key={'ontolofyOverviewPage'} className="row ontology-detail-page-container">
                            <div className='col-sm-9'>
                              <OntologyInfoBox ontology={this.state.ontology} />
                            </div>
                            <div className='col-sm-3'>
                              <OntologyStatsBox ontology={this.state.ontology} />
                            </div>
                          </div>
              }
              {!this.state.waiting && this.state.termsTab &&
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
                            />
              }

              {!this.state.waiting && this.state.propTab &&
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
