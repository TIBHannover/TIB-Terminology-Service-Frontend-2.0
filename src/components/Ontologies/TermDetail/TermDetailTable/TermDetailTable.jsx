import { useState, useEffect, useContext } from 'react';
import {classMetaData, propertyMetaData} from './metadataParser';
import AlertBox from '../../../common/Alerts/Alerts';
import CopyLinkButton from '../../../common/CopyButton/CopyButton';
import { CopyLinkButtonMarkdownFormat } from '../../../common/CopyButton/CopyButton';
import Toolkit from '../../../../Libs/Toolkit';
import { OntologyPageContext } from '../../../../context/OntologyPageContext';



export const TermDetailTable = (props) => {

  const ontologyPageContext = useContext(OntologyPageContext);

  const [showDataAsJsonBtnHref, setShowDataAsJsonBtnHref] = useState("");


  function setComponentData(){ 
    let showDataAsJsonBtnHref = "";
    if(ontologyPageContext.isSkos && props.componentIdentity === "individual"){          
      showDataAsJsonBtnHref = process.env.REACT_APP_API_BASE_URL + "/" + props.node.ontology_name + "/individuals" + "?iri=" + encodeURIComponent(props.node.iri);
    }
    else{           
      showDataAsJsonBtnHref = process.env.REACT_APP_API_BASE_URL + "/" + props.node.ontology_name + "/" + props.extractKey + "?iri=" + encodeURIComponent(props.node.iri);
    }        
    if(props.node){      
      setShowDataAsJsonBtnHref(showDataAsJsonBtnHref);
    }   
  }


  function  setLabelAsLink(){    
    let baseUrl = process.env.REACT_APP_PUBLIC_URL + 'ontologies/' + encodeURIComponent(props.node.ontology_name);
    let targetHref = baseUrl + '/terms?iri=' + encodeURIComponent(props.node.iri);  
    if(props.componentIdentity === 'props'){
        targetHref = baseUrl +'/props?iri=' + encodeURIComponent(props.node.iri);        
    }
    else if (props.componentIdentity === 'individuals'){
      targetHref = baseUrl +'/individuals?iri=' + encodeURIComponent(props.node.iri); 
    }        
    return targetHref         
  }



  function createTable(){    
    let metadataToRender = "";
    if(props.componentIdentity === "terms"){
      metadataToRender =  classMetaData(props.node, "class");
    }
    else if(props.componentIdentity === "individuals"){
      metadataToRender =  classMetaData(props.node, "individual");
    }
    else{
      metadataToRender = propertyMetaData(props.node);
    }

    let result = [];
    for(let key of Object.keys(metadataToRender)){
      if (!metadataToRender[key].value || typeof(metadataToRender[key].value) === "undefined" || metadataToRender[key].value === '') {
        continue;
      }    
      
      let row = createRowInTable(key, metadataToRender[key].value, metadataToRender[key].isLink);
      result.push(row);
    }
    return result;
  }



  function createRowInTable(metadataLabel, metadataValue, isLink){   
    let row = [
      <div className="col-sm-12 node-detail-table-row" key={metadataLabel}>
          <div className='row'>
            <div className="col-sm-4 col-md-3" key={metadataLabel + "-label"}>
              <div className="node-metadata-label">{metadataLabel}</div>
            </div>
            <div  className="col-sm-8 col-md-9 node-metadata-value"  key={metadataLabel + "-value"}>
              {formatText(metadataLabel, metadataValue, isLink)}
              {isLink && metadataLabel !== "Label" && <CopyLinkButton  valueToCopy={metadataValue} />}
              {metadataLabel === "Label" && 
                <CopyLinkButtonMarkdownFormat  
                    label={props.node.ontology_prefix + ":" + props.node.label} 
                    url={setLabelAsLink()}
                    tooltipText={"This will copy the label of the term (in markdown format) and add the ontology id as a prefix to be able to link to this term within this terminology service, e.g. " + props.node.ontology_prefix + ":" + props.node.label}
                />
              }
            </div>
          </div>
        </div>
    ];

    return row;
  }



  function formatText (metadataLabel, metadataValue, isLink = false) {     
    if (isLink) {
      return (<a href={metadataValue} target='_blank' rel="noreferrer">{metadataValue}</a>)
    }
    else if (["Used in axiom", "Equivalent to", "SubClass Of", "has curation status"].includes(metadataLabel)){           
      return (<span  dangerouslySetInnerHTML={{ __html: metadataValue }}></span>)
    }    
    else if (["Type", "Description", "Imported From", "Also In", "Instances"].includes(metadataLabel)){
      return metadataValue;
    }
    
    let formatedText = Toolkit.transformLinksInStringToAnchor(metadataValue);    
    return (<span  dangerouslySetInnerHTML={{ __html: formatedText }}></span>)
  }


  useEffect(()=>{
    setComponentData();
  }, []);


  useEffect(()=>{
    setComponentData();
  }, [props.node]);



  return(
    <div>
      {Toolkit.createHelmet(`${props.node.ontology_name}:${props.node.short_form}`)}      
      {props.node.is_obsolete &&
        <AlertBox  
          type="danger"
         message="Attention: This term is deprecated!"
          alertColumnClass="col-sm-12"
        />
      }
      {createTable()}
      <div className='col-sm-12'  key={"json-button-row"}>
       <div className='row'>
         <div className='col-sm-12 node-metadata-value'>
           <a 
             href={showDataAsJsonBtnHref} 
             target='_blank' 
             rel="noreferrer"
             className='btn btn-secondary btn-dark download-ontology-btn'
            >
              Show Data as JSON
           </a>
         </div>            
       </div>
     </div>
    </div>
  )
}
