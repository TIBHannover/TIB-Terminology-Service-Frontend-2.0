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
      isSkos: false,
      showDataAsJsonBtnHref: ""
    })
    this.setComponentData = this.setComponentData.bind(this);
    this.createRow = this.createRow.bind(this);
    this.createTable = this.createTable.bind(this);
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



  componentDidMount(){
    if(this.state.data && this.state.prevNode !== this.props.iri){
      this.setComponentData();      
    }
  }


  componentDidUpdate(){    
    if(this.state.prevNode !== this.props.iri){
      this.setComponentData();
    }
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
