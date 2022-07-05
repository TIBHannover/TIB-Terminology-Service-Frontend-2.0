import React from 'react';
import '../../layout/ontologies.css';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import {getNodeByIri} from '../../../api/fetchData';
import { Link } from 'react-router-dom';


class TermPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      data: true,
      label_xs: 2,
      value_xs: 10,
      iriIsCopied: false,
      prevTerm: ""
    })
    this.initiateTheTableView = this.initiateTheTableView.bind(this);
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
        <Grid item xs={12} spacing={4} className="node-detail-table-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="node-metadata-label">Label</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="node-metadata-value">
              {this.formatText(this.state.data.label)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="node-detail-table-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="node-metadata-label">Short Form</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="node-metadata-value">
              {this.formatText(this.state.data.short_form)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="node-detail-table-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="node-metadata-label">Description</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="node-metadata-value">
              {this.formatText(this.state.data.description)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="node-detail-table-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="node-metadata-label">Definition</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="node-metadata-value">
              {this.formatText(this.state.data.annotation ? this.state.data.annotation.definition : "")}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="node-detail-table-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="node-metadata-label">Iri</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="node-metadata-value">
              {this.formatText(this.state.data.iri, true)}
              <Button 
                variant="contained" 
                className='copy-link-btn'                                
                onClick={() => {                  
                  navigator.clipboard.writeText(this.state.data.iri);
                  this.setState({
                    iriIsCopied: true
                  });
                }}            
              >copy</Button>
              {this.state.iriIsCopied && 
                  <CheckIcon 
                    fontSize="large"                    
                  />
              }      
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="node-detail-table-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="node-metadata-label">Ontology</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="node-metadata-value">
              {this.formatText(this.state.data.ontology_name)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="node-detail-table-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="node-metadata-label">SubClass of</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="node-metadata-value">
                
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="node-detail-table-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="node-metadata-label">Example Usage</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="node-metadata-value">
              {this.formatText(this.state.data.annotation ? this.state.data.annotation.example_usage : "")}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="node-detail-table-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="node-metadata-label">Editor Note</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="node-metadata-value">
              {this.formatText(this.state.data.annotation ? this.state.data.annotation.editor_note : "")}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="node-detail-table-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="node-metadata-label">Is Defined By</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="node-metadata-value">
              {this.formatText(this.state.data.annotation ? this.state.data.annotation.isDefinedBy : "")}
            </Grid>
          </Grid>
        </Grid>
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
