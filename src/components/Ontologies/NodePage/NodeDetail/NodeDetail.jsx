import React from 'react';
import {classMetaData, propertyMetaData, formatText} from '../helpers';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import CopyLinkButton from '../../../common/CopyButton/CopyButton';
import { CopyLinkButtonMarkdownFormat } from '../../../common/CopyButton/CopyButton';



class NodeDetail extends React.Component{
    constructor (props) {
        super(props)
        this.state = ({
          data: {"iri": null},                
          componentIdentity: "",
          isSkos: false,          
          showDataAsJsonBtnHref: ""
        })
        this.setComponentData = this.setComponentData.bind(this);
        this.createRow = this.createRow.bind(this);
        this.createTable = this.createTable.bind(this);
      }

      async setComponentData(){        
        let extractKey = this.props.extractKey;
        let componentIdentity = this.props.componentIdentity;
        let isSkos = this.props.isSkos;
        let node = this.props.node;
        let showDataAsJsonBtnHref = "";
        if(isSkos){          
          showDataAsJsonBtnHref = process.env.REACT_APP_API_BASE_URL + "/" + node.ontology_name + "/individuals" + "?iri=" + encodeURIComponent(node.iri);
        }
        else{           
          showDataAsJsonBtnHref = process.env.REACT_APP_API_BASE_URL + "/" + node.ontology_name + "/" + extractKey + "?iri=" + encodeURIComponent(node.iri);
        }        
        if(node){
          this.setState({            
            data: node,            
            componentIdentity: componentIdentity,
            isSkos: isSkos,
            showDataAsJsonBtnHref:showDataAsJsonBtnHref
          });
        }
       
      }


      setLabelAsLink(){
        let node = this.state.data;
        let baseUrl = process.env.REACT_APP_PUBLIC_URL + 'ontologies/' + encodeURIComponent(node.ontology_name);
        let targetHref = baseUrl + '/terms?iri=' + encodeURIComponent(node.iri);  
        if(this.state.componentIdentity === 'property'){
            targetHref = baseUrl +'/props?iri=' + encodeURIComponent(node.iri);        
        }
        else if (this.state.componentIdentity === 'individual'){
          targetHref = baseUrl +'/individuals?iri=' + encodeURIComponent(node.iri); 
        }      
        return targetHref         
      }
    
    
      /**
       * create a table row 
       */
      createRow(metadataLabel, metadataValue, isLink){
        let row = [
          <div className="col-sm-12 node-detail-table-row" key={metadataLabel}>
              <div className='row'>
                <div className="col-sm-4 col-md-3" key={metadataLabel + "-label"}>
                  <div className="node-metadata-label">{metadataLabel}</div>
                </div>
                <div  className="col-sm-8 col-md-9 node-metadata-value"  key={metadataLabel + "-value"}>
                  {formatText(metadataLabel, metadataValue, isLink)}
                  {isLink && metadataLabel !== "Label" && <CopyLinkButton  valueToCopy={metadataValue} />}
                  {metadataLabel === "Label" && <CopyLinkButtonMarkdownFormat  label={metadataValue} url={this.setLabelAsLink()}/>}
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
        this.setComponentData();       
      }
    
    
      componentDidUpdate(){    
        if(this.props.node.iri !== this.state.data.iri){
          this.setComponentData();
        }      
      }

      render(){
        return(
          <div>
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

export default NodeDetail