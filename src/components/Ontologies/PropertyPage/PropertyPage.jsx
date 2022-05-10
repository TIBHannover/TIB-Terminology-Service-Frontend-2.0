import React from 'react';
import '../../layout/ontologies.css';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';

class PropertyPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      label_xs: 2,
      value_xs: 10,
      iriIsCopied: false,
      prevProperty: this.props.property.label
    })
  }

  formatText (text, isLink = false) {
    if (text == null || text === '') {
      return 'null'
    } else if (isLink) {
      return (<a href={text} target='_blank' rel="noreferrer">{text}</a>)
    }
    return text
  }


  componentDidUpdate(){
    if(this.state.prevProperty != this.props.property.label){
      this.setState({
        iriIsCopied: false,
        prevProperty: this.props.property.label
      });
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
              {this.formatText(this.props.property.label)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="node-detail-table-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="node-metadata-label">Short Form</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="node-metadata-value">
              {this.formatText(this.props.property.short_form)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="node-detail-table-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="node-metadata-label">Description</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="node-metadata-value">
              {this.formatText(this.props.property.description)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="node-detail-table-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="node-metadata-label">Definition</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="node-metadata-value">
              {this.formatText(this.props.property['annotation']['definition source'])}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="node-detail-table-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="node-metadata-label">Iri</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="node-metadata-value">
              {this.formatText(this.props.property.iri, true)}
              <Button 
                variant="contained" 
                className='copy-link-btn'                                
                onClick={() => {                  
                  navigator.clipboard.writeText(this.props.property.iri);
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
              {this.formatText(this.props.property.ontology_name)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="node-detail-table-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="node-metadata-label">Curation Status</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="node-metadata-value">
              {this.formatText(this.props.property['annotation']['has curation status'])}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="node-detail-table-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="node-metadata-label">Editor</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="node-metadata-value">
              {this.formatText(this.props.property['annotation']['term editor'])}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="node-detail-table-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="node-metadata-label">Is Defined By</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="node-metadata-value">
              {this.formatText(this.props.property['annotation']['isDefinedBy'])}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default PropertyPage
