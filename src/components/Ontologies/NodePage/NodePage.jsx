import React from 'react';
import {getNodeByIri, getSkosNodeByIri} from '../../../api/fetchData';
import {classMetaData, propertyMetaData, formatText} from './helpers';
import { Helmet, HelmetProvider } from 'react-helmet-async';


class NodePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      data: true,
      iriIsCopied: false,
      prevNode: "",
      componentIdentity: "",
      isSkos: false
    })
    this.initiateTheTableView = this.initiateTheTableView.bind(this);
    this.createRow = this.createRow.bind(this);
    this.createTable = this.createTable.bind(this);
  }



  /**
   * Get the target term metadata. Initiate the detail table. 
   */
 async initiateTheTableView(){
    let targetIri = this.props.iri;
    let ontology = this.props.ontology;
    let extractKey = this.props.extractKey;
    let componentIdentity = this.props.componentIdentity;
    let isSkos = this.props.isSkos;
    let node = {};
    if(isSkos){
      node = await getSkosNodeByIri(ontology, encodeURIComponent(targetIri));    
    }
    else{      
      node = await getNodeByIri(ontology, encodeURIComponent(targetIri), extractKey);    
    }
    
    this.setState({
      prevNode: node.iri,
      data: node,
      iriIsCopied: false,
      componentIdentity: componentIdentity,
      isSkos: isSkos
    });
  }


  /**
   * create a table row 
   */
  createRow(metadataLabel, metadataValue, copyButton){
    let row = [
      <div className="col-sm-12 node-detail-table-row" key={metadataLabel}>
          <div className='row'>
            <div className="col-sm-4 col-md-3 node-metadata-value" key={metadataLabel + "-label"}>
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
    if(this.state.componentIdentity === "term"){
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



  componentDidMount(){
    if(this.state.data && this.state.prevNode !== this.props.iri){
      this.initiateTheTableView();      
    }
  }


  componentDidUpdate(){
    if(this.state.data && this.state.prevNode !== this.props.iri){
      this.initiateTheTableView();
    }
  }


  render () {    
    return (
      <div className='row'>
        <HelmetProvider>
        <div>
          <Helmet>
            <title>{`${this.state.data.ontology_prefix} - ${this.state.data.short_form}`}</title>
          </Helmet>
        </div>
        </HelmetProvider>
        {this.createTable()}
        <div className='col-sm-12'  key={"json-button-row"}>
          <div className='row'>
            <div className='col-sm-12 node-metadata-value'>
              <a 
                href={process.env.REACT_APP_API_BASE_URL + "/" + this.state.data.ontology_name + "/" + this.props.extractKey + "?iri=" + encodeURIComponent(this.state.data.iri)} 
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
