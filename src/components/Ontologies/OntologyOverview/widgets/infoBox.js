import { useState } from 'react';
import CopyLinkButton from '../../../common/CopyButton/CopyButton';





function formatCreators (creators) {
  let answer = []
  let value = []
  for (let i = 0; i < creators.length; i++) {
    value.push(creators[i])
  }
  answer = value.join(',\n')
  return answer
}

function formatSubject(Subject){
  let answer = []
  let value = []
  for(let i=0; i< Subject.length; i++){
    value.push(Subject[i])
  }
  answer = value.join(',\n')
  return answer
}

function alphabeticSort(item){
   return item.sort();
}

function skosValue(skos){
  return JSON.parse(skos);
}



function HandleShowMoreLess(){
  const [ontologyShowAll, setOntologyShowAll] = useState(false);
  const [showMoreLessOntologiesText, setshowMoreLessOntologiesText] = useState("+ Show additional information")
  return (
    <div className="text-center" id="search-facet-show-more-ontology-btn">
            <a className="show-more-btn" onClick={() => setOntologyShowAll(true)}>{setshowMoreLessOntologiesText}</a>
  </div>
  )  
}



const OntologyInfoBox = (props) => {  
  const [ontologyObject, setOntologyObject]  = useState(props.ontology);
  const ontology = props.ontology;
  if (!ontology || ontology === null) {
    return false
  }
  
  // let entries = Object.entries(ontology.config.annotations);
  // let annotations = [];
  // for(let [key,value] of entries){
  //   annotations.push(
  //     <tr>
  //       <td className="ontology-overview-table-id-column"><b>{key}</b></td>
  //       <td>{(value).join(',\n')}</td>
  //     </tr>
  //   )
  // }    

  return (
    <div className="ontology-detail-table-wrapper">
      <div className='row'>
        <div className='col-sm-11 ontology-detail-text'>
          <h4><b>{ontology.config.title}</b></h4>
          <p>
            {ontology.config.description}
          </p>
        </div>
      </div>
      
      <table className="ontology-detail-table" striped="columns">
        <tbody>
          <tr>
            <td className="ontology-overview-table-id-column"><b>IRI</b></td>
            <td>
              <a href={ontology.config.id}  className="anchor-in-table"  target="_blank" rel="noopener noreferrer">{ontology.config.id}</a>
              {typeof(ontology.config.id) !== 'undefined' && ontology.config.id !== null
                ? <CopyLinkButton  valueToCopy={ontology.config.id}  />                         
                : ""
              }              
            </td>
          </tr>         
          <tr>
            <td className="ontology-overview-table-id-column"><b>HomePage</b></td>
            <td>
              <a href={ontology.config.homepage} className="anchor-in-table" target="_blank" rel="noopener noreferrer">{ontology.config.homepage}</a>
              {typeof(ontology.config.homepage) !== 'undefined' && ontology.config.homepage !== null
                  ? <CopyLinkButton  valueToCopy={ontology.config.homepage}  />                   
                  : ""
              }              
            </td>
          </tr>
          <tr>
            <td className="ontology-overview-table-id-column"><b>Issue tracker</b></td>
            <td>
              <a href={ontology.config.tracker} className="anchor-in-table" target="_blank" rel="noopener noreferrer">{ontology.config.tracker}</a>
              {typeof(ontology.config.tracker) !== 'undefined' && ontology.config.tracker !== null
                ?  <CopyLinkButton  valueToCopy={ontology.config.tracker}  />                
                : ""
              }
            </td>
          </tr>         
          <tr>
            <td className="ontology-overview-table-id-column"><b>License</b></td>
            <td>
              <a href={ontology.config.license.url} target="_blank" rel="noopener noreferrer">{ontology.config.license.label}</a>
            </td>
          </tr>
          <tr>
            <td className="ontology-overview-table-id-column"><b>Creator</b></td>
            <td>
              {formatCreators(ontology.config.creators)}
            </td>
          </tr>
          <tr>
            <td className="ontology-overview-table-id-column"><b>Subject</b></td>
            <td>
              {formatSubject(ontology.config.classifications[1].Subject)}
            </td>
          </tr>
          <tr>
            <td className="ontology-overview-table-id-column"><b>Is Skos</b></td>
            <td>
              {skosValue(ontology.config.skos)}
            </td>
          </tr>
          <tr>
            <td className="ontology-overview-table-id-column"><b>Download</b></td>
            <td>                     
              <a                
                href={"https://service.tib.eu/ts4tib/ontologies/" + ontology.ontologyId + "/download"}
                className='btn btn-primary btn-dark download-ontology-btn'
                target="_blank"                               
                >
                <i class="fa fa-download"></i>OWL
              </a>
              <a 
                className='btn btn-primary btn-dark download-ontology-btn'                                
                  onClick={async () => {                    
                    const jsonFile = JSON.stringify(ontologyObject);
                    const blob = new Blob([jsonFile],{type:'application/json'});
                    const href = await URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = href;
                    link.download = ontologyObject.ontologyId + "_metadata.json";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                <i class="fa fa-download"></i>Ontology metadata as JSON</a>
            </td>
          </tr>                
          {/* {alphabeticSort(annotations)}                      */}
        </tbody>
      </table>
    </div>
  )
}

export default OntologyInfoBox
