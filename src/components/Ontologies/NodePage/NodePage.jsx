import React from 'react';
import '../../layout/ontologies.css';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import {getNodeByIri} from '../../../api/fetchData';
import {classMetaData, propertyMetaData, formatText} from './helpers';


class NodePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      data: true,
      label_xs: 4,
      value_xs: 8,
      iriIsCopied: false,
      prevNode: "",
      componentIdentity: ""
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
    let node = await getNodeByIri(ontology, encodeURIComponent(targetIri), extractKey);    
    this.setState({
      prevNode: node.iri,
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
      <Grid item xs={12}  className="node-detail-table-row" key={metadataLabel}>
          <Grid container>
            <Grid item sm={this.state.label_xs} md={this.state.label_xs - 1}  key={metadataLabel + "-label"}>
              <Typography className="node-metadata-label">{metadataLabel}</Typography>
            </Grid>
            <Grid item sm={this.state.value_xs} md={this.state.value_xs + 1} className="node-metadata-value" key={metadataLabel + "-value"}>
              {formatText(metadataLabel, metadataValue, copyButton)}
              {copyButton &&
                <Button 
                  variant="contained" 
                  className='copy-link-btn'
                  key={"copy-btn"}                             
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
                      key={"copy-check-sign"}           
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
      <Grid container spacing={2}>
        {this.createTable()}
        <Grid item xs={12}  key={"json-button-row"}>
          <Grid container>
            <a href={process.env.REACT_APP_API_BASE_URL + "/" + this.state.data.ontology_name + "/" + this.props.extractKey + "?iri=" + this.state.data.iri} 
              target='_blank' rel="noreferrer"><Button variant="contained">Show Data as JSON</Button></a>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default NodePage;
