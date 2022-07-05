import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import DownloadIcon from '@mui/icons-material/Download';


function formatCreators (creators) {
  let answer = ''
  for (let i = 0; i < creators.length; i++) {
    answer += (creators[i] + ', ')
  }
  return answer
}


function OntologyInfoBox (props) {
  const [ontologyIriCopied, setOntologyIriCopied]  = useState(false);
  const [ontologyVersionCopied, setOntologyVersionCopied]  = useState(false);
  const [ontologyHomepageCopied, setOntologyHomepageCopied]  = useState(false);
  const [ontologyTrackerCopied, setOntologyTrackerCopied]  = useState(false);
  const [ontologyObject, setOntologyObject]  = useState(props.ontology);
  const ontology = props.ontology;
  if (!ontology || ontology === null) {
    return false
  }

  return (
    <div className="ontology-detail-table-wrapper">
      <div className='row'>
        <div className='col-sm-12 ontology-detail-text'>
          <h4><b>{ontology.config.title}</b></h4>
          <p>
            {ontology.config.description}
          </p>
        </div>
      </div>
      
      <table className="ontology-detail-table">
        <tbody>
          <tr>
            <td className="ontology-overview-table-id-column"><b>IRI</b></td>
            <td>
              <a href={ontology.config.id}  className="anchor-in-table"  target="_blank" rel="noopener noreferrer">{ontology.config.id}</a>
              {typeof(ontology.config.id) !== 'undefined' && ontology.config.id !== null
                ? <Button 
                variant="contained" 
                className='copy-link-btn'                                
                onClick={() => {                  
                  navigator.clipboard.writeText(ontology.config.id);
                  setOntologyIriCopied(true);
                  setOntologyVersionCopied(false);
                  setOntologyHomepageCopied(false);
                  setOntologyTrackerCopied(false);
                }}
              >copy</Button>
              : ""
              }
              {ontologyIriCopied && 
                  <CheckIcon 
                    fontSize="large"                    
                  />
              }            
            </td>
          </tr>
          {/* <tr>
            <td className="ontology-overview-table-id-column"><b>Version IRI</b></td>
            <td>
              <a href={ontology.config.versionIri} target="_blank" rel="noopener noreferrer">{ontology.config.versionIri}</a>
              {typeof(ontology.config.versionIri) !== 'undefined' && ontology.config.versionIri !== null
                  ? <Button 
                  variant="contained" 
                  className='copy-link-btn'                                
                  onClick={() => {                  
                    navigator.clipboard.writeText(ontology.config.versionIri);
                    setOntologyVersionCopied(true);
                    setOntologyIriCopied(false);                  
                    setOntologyHomepageCopied(false);
                    setOntologyTrackerCopied(false);
                  }}            
                >copy</Button>
                : ""
              }
              {ontologyVersionCopied && 
                  <CheckIcon 
                    fontSize="large"                    
                  />
              }      
            </td>
          </tr> */}
          <tr>
            <td className="ontology-overview-table-id-column"><b>HomePage</b></td>
            <td>
              <a href={ontology.config.homepage} className="anchor-in-table" target="_blank" rel="noopener noreferrer">{ontology.config.homepage}</a>
              {typeof(ontology.config.homepage) !== 'undefined' && ontology.config.homepage !== null
                  ? <Button 
                  variant="contained" 
                  className='copy-link-btn'                                 
                  onClick={() => {                  
                    navigator.clipboard.writeText(ontology.config.homepage);
                    setOntologyHomepageCopied(true);
                    setOntologyIriCopied(false);
                    setOntologyVersionCopied(false);                  
                    setOntologyTrackerCopied(false);
                  }}            
                >copy</Button>
                : ""
              }
              {ontologyHomepageCopied && 
                  <CheckIcon 
                    fontSize="large"                    
                  />
              }
            </td>
          </tr>
          <tr>
            <td className="ontology-overview-table-id-column"><b>Issue tracker</b></td>
            <td>
              <a href={ontology.config.tracker} className="anchor-in-table" target="_blank" rel="noopener noreferrer">{ontology.config.tracker}</a>
              {typeof(ontology.config.tracker) !== 'undefined' && ontology.config.tracker !== null
                ? <Button 
                  variant="contained" 
                  className='copy-link-btn'                                
                  onClick={() => {                  
                    navigator.clipboard.writeText(ontology.config.tracker);
                    setOntologyTrackerCopied(true);
                    setOntologyIriCopied(false);
                    setOntologyVersionCopied(false);
                    setOntologyHomepageCopied(false);                
                  }}            
                >copy</Button>
                : ""
                }
              {ontologyTrackerCopied && 
                  <CheckIcon 
                    fontSize="large"       
                  />
              }
            </td>
          </tr>
          {/* <tr>
            <td className="ontology-overview-table-id-column"><b>Version</b></td>
            <td>
              {ontology.config.version}
            </td>
          </tr> */}
          <tr>
            <td className="ontology-overview-table-id-column"><b>License</b></td>
            <td>
              <a href={ontology.config.annotations.license} target="_blank" rel="noopener noreferrer">{ontology.config.annotations.license}</a>
            </td>
          </tr>
          <tr>
            <td className="ontology-overview-table-id-column"><b>Creator</b></td>
            <td>
              {formatCreators(ontology.config.creators)}
            </td>
          </tr>
          <tr>
            <td className="ontology-overview-table-id-column"><b>Download</b></td>
            <td>
              <Button 
                  variant="contained" 
                  className='download-ontology-btn'
                  startIcon={<DownloadIcon />}
                  href={ontology.config.id}                                                  
                >owl</Button>
              <Button 
                  variant="contained" 
                  className='download-ontology-btn'
                  startIcon={<DownloadIcon />}
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
                >Ontology metadata as JSON</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default OntologyInfoBox
