import React from 'react';
import {getNodeByIri, getSkosNodeByIri} from '../../../api/fetchData';
import {classMetaData, propertyMetaData, formatText, renderOntologyPageTabs} from './helpers';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import NodePageTabConfig from './listOfComponentsTabs.json';
import queryString from 'query-string'; 


const DETAIL_TAB_ID = 0;
const NOTES_TAB_ID = 1;

class NodePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      data: true,
      iriIsCopied: false,
      prevNode: "",
      componentIdentity: "",
      activeTab: DETAIL_TAB_ID,
      isSkos: false,
      lastRequestedTab: "",
      waiting: false,
      showDataAsJsonBtnHref: ""
    })
    this.setComponentData = this.setComponentData.bind(this);
    this.createRow = this.createRow.bind(this);
    this.createTable = this.createTable.bind(this);
    this.tabChange = this.tabChange.bind(this);
    this.setTabOnLoad = this.setTabOnLoad.bind(this);
  }


 async setComponentData(){
    let targetIri = this.props.iri;
    let ontology = this.props.ontology;
    let extractKey = this.props.extractKey;
    let componentIdentity = this.props.componentIdentity;
    let isSkos = this.props.isSkos;
    let node = {};
    let showDataAsJsonBtnHref = "";
    if(isSkos){
      node = await getSkosNodeByIri(ontology, encodeURIComponent(targetIri));
      showDataAsJsonBtnHref = process.env.REACT_APP_API_BASE_URL + "/" + node.ontology_name + "/individuals" + "?iri=" + encodeURIComponent(node.iri);
    }
    else{      
      node = await getNodeByIri(ontology, encodeURIComponent(targetIri), extractKey, this.props.isIndividual);
      showDataAsJsonBtnHref = process.env.REACT_APP_API_BASE_URL + "/" + node.ontology_name + "/" + extractKey + "?iri=" + encodeURIComponent(node.iri);
    }
    if(node.iri){
      this.setState({
        prevNode: node.iri,
        data: node,
        iriIsCopied: false,
        componentIdentity: componentIdentity,
        isSkos: isSkos,
        showDataAsJsonBtnHref:showDataAsJsonBtnHref
      });
    }
   
  }


  /**
   * create a table row 
   */
  createRow(metadataLabel, metadataValue, copyButton){
    let row = [
      <div className="col-sm-12 node-detail-table-row" key={metadataLabel}>
          <div className='row'>
            <div className="col-sm-4 col-md-3" key={metadataLabel + "-label"}>
              <div className="node-metadata-label">{metadataLabel}</div>
            </div>
            <div  className="col-sm-8 col-md-9 node-metadata-value"  key={metadataLabel + "-value"}>
              {formatText(metadataLabel, metadataValue, copyButton)}
              {copyButton &&
                <button 
                  type="button" 
                  class="btn btn-secondary btn-sm copy-link-btn"
                  key={"copy-btn"} 
                  onClick={() => {                  
                    navigator.clipboard.writeText(metadataValue);
                    this.setState({
                      iriIsCopied: true
                    });
                  }}
                  >
                  copy {this.state.iriIsCopied && <i class="fa fa-check" aria-hidden="true"></i>}
                </button>
              }
            </div>
          </div>
        </div>
    ];

    return row;
  }


  /**
   * Create the view to render 
   */
  createTable(){    
    let metadataToRender = "";
    if(this.state.componentIdentity === "term" || this.state.componentIdentity === "individual"){
      metadataToRender =  classMetaData(this.state.data);
    }
    else{
      metadataToRender = propertyMetaData(this.state.data);
    }
    let result = [];
    
    for(let key of Object.keys(metadataToRender)){    
      let row = this.createRow(key, metadataToRender[key][0], metadataToRender[key][1]);
      result.push(row);
    }
    return result;
  }

  /**
   * Set the active tab and its page on load
   */
  setTabOnLoad(){
    let requestedTab = this.props.match.params.tab;
    let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
    let lastRequestedTab = this.state.lastRequestedTab;    
    if (requestedTab !== lastRequestedTab && requestedTab === 'notes'){
      this.setState({        
        activeTab: NOTES_TAB_ID,
        waiting: false,
        lastRequestedTab: requestedTab,
        targetTermIri: targetQueryParams.iri
      });
    }
    else if (requestedTab !== lastRequestedTab){
      this.setState({        
        activeTab: DETAIL_TAB_ID,
        waiting: false,
        lastRequestedTab: requestedTab

      });
    }
  }

  /**
     * Handle the tab change in the node detail Top menu
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
        activeTab: DETAIL_TAB_ID,
        waiting: false
      });
    }      
  }



  componentDidMount(){
    if(this.state.data && this.state.prevNode !== this.props.iri){
      this.setComponentData();      
    }
    this.setTabOnLoad();
  }


  componentDidUpdate(){    
    if(this.state.prevNode !== this.props.iri){
      this.setComponentData();
    }
    this.setTabOnLoad();
  }


  render () {    
    return (
      <div className='row'>
        <HelmetProvider>
        <div>
          <Helmet>
            <title>{`${this.state.data.ontology_name} - ${this.state.data.short_form}`}</title>
          </Helmet>
        </div>
        </HelmetProvider>
        <ul className="nav nav-tabs">
          {renderOntologyPageTabs(NodePageTabConfig, this.tabChange, this.state.ontologyId, this.state.activeTab)}
        </ul>
        {this.createTable()}
        <div className='col-sm-12'  key={"json-button-row"}>
          <div className='row'>
            <div className='col-sm-12 node-metadata-value'>
              <a 
                href={this.state.showDataAsJsonBtnHref} 
                target='_blank' 
                rel="noreferrer"
                className='btn btn-primary btn-dark download-ontology-btn'
                >
                  Show Data as JSON
              </a>
            </div>            
          </div>
        </div>
      </div>
    )
  }
}

export default NodePage;
