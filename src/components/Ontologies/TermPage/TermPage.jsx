import React from 'react';
import '../../layout/ontologies.css';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import {getNodeByIri} from '../../../api/fetchData';



class TermPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      data: true,
      label_xs: 2,
      value_xs: 10,
      iriIsCopied: false,
      prevTerm: "",
    })
    this.initiateTheTableView = this.initiateTheTableView.bind(this);
    this.createRow = this.createRow.bind(this);
    this.whichMetaData = this.whichMetaData.bind(this);
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
    let node = await getNodeByIri(ontology, encodeURIComponent(targetIri), "terms");    
    this.setState({
      prevTerm: node.iri,
      data: node,
      iriIsCopied: false
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
   * Set the metadata to render
   */
  whichMetaData(){
    let metadata = {
      "Label": this.state.data.label,
      "Short Form":  this.state.data.short_form,
      "Description": this.state.data.description,
      "Definition": this.state.data.annotation ? this.state.data.annotation.definition : "",
      "Iri": this.state.data.iri,
      "Ontology": this.state.data.ontology_name,
      "SubClass of" : "",
      "Example Usage": this.state.data.annotation ? this.state.data.annotation.example_usage : "",
      "Editor Note": this.state.data.annotation ? this.state.data.annotation.editor_note : "",
      "Is Defined By": this.state.data.annotation ? this.state.data.annotation.isDefinedBy : ""
    };

    return metadata;
  }



  /**
   * Create the view to render 
   */
  createTable(){
    let metadataToRender = this.whichMetaData();
    let result = [];
    for(let key of Object.keys(metadataToRender)){
      let row = this.createRow(key, metadataToRender[key], false);
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
            <a href={"https://service.tib.eu/ts4tib/api/ontologies/"+ this.state.data.ontology_name + "/terms?iri=" + this.state.data.iri} target='_blank' rel="noreferrer"><Button variant="contained">Show Data as JSON</Button></a>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default TermPage
