import React from 'react';
import '../../layout/ontologies.css';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import {getNodeByIri} from '../../../api/fetchData';
import {classMetaData} from './helpers';


class NodePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      data: true,
      label_xs: 2,
      value_xs: 10,
      iriIsCopied: false,
      prevTerm: "",
      componentIdentity: "",
      baseUrl: "https://service.tib.eu/ts4tib/api/ontologies/"
    })
    this.initiateTheTableView = this.initiateTheTableView.bind(this);
    this.createRow = this.createRow.bind(this);
    this.createTable = this.createTable.bind(this);
  }


  /**
   * Format the text. check if a text input is a link to a simple text. 
   * @param {*} text 
   * @param {*} isLink 
   * @returns 
   */
  formatText (text, isLink = false) {
    if (text === null || text === '') {
      return 'null'
    } else if (isLink) {
      return (<a href={text} target='_blank' rel="noreferrer">{text}</a>)
    }
    return text
  }


  /**
   * Get the target term metadata. Initiate the detail table. 
   */
 async initiateTheTableView(){
    let targetIri = this.props.iri;
    let ontology = this.props.ontology;
    let extractKey = this.props.extractKey;
    let componentIdentity = this.props.componentIdentity;
    let node = await getNodeByIri(ontology, encodeURIComponent(targetIri), extractKey);    
    this.setState({
      prevTerm: node.iri,
      data: node,
      iriIsCopied: false,
      componentIdentity: componentIdentity
    });
  }


  /**
   * create a table row 
   */
  createRow(metadataLabel, metadataValue, copyButton){
    let row = [
      <Grid item xs={12} spacing={4} className="node-detail-table-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="node-metadata-label">{metadataLabel}</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="node-metadata-value">
              {this.formatText(metadataValue)}
              {copyButton &&
                <Button 
                  variant="contained" 
                  className='copy-link-btn'                                
                  onClick={() => {                  
                    navigator.clipboard.writeText(metadataValue);
                    this.setState({
                      iriIsCopied: true
                    });
                  }}            
                >copy</Button>          
              }
              {copyButton && this.state.iriIsCopied && 
                    <CheckIcon 
                      fontSize="large"                    
                    />
              }    
            </Grid>
          </Grid>
        </Grid>
    ];

    return row;
  }


  /**
   * Create the view to render 
   */
  createTable(){
    let metadataToRender = "";
    if(this.state.componentIdentity === "term"){
      metadataToRender = classMetaData(this.state.data);
    }
    let result = [];
    for(let key of Object.keys(metadataToRender)){
      let row = this.createRow(key, metadataToRender[key][0], metadataToRender[key][1]);
      result.push(row);
    }
    return result;
  }



  componentDidMount(){
    if(this.state.data && this.state.prevTerm !== this.props.iri){
      this.initiateTheTableView();      
    }
  }


  componentDidUpdate(){
    if(this.state.data && this.state.prevTerm !== this.props.iri){
      this.initiateTheTableView();
    }
  }


  render () {    
    return (
      <Grid container spacing={2}>
        {this.createTable()}
        <Grid item xs={12} className="node-detail-table-row">
          <Grid container>
            <a href={this.state.baseUrl + this.state.data.ontology_name + "/" + this.state.extractKey + "?iri=" + this.state.data.iri} 
              target='_blank' rel="noreferrer"><Button variant="contained">Show Data as JSON</Button></a>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default NodePage;
