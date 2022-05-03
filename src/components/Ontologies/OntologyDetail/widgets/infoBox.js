/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';




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
  const ontology = props.ontology;
  if (!ontology || ontology === null) {
    return false
  }

  return (
    <div id="info-table-wrapper">
      <h4><b>Detail</b></h4>
      <table>
        <tbody>
          <tr>
            <td className="ontology-info-table-prop"><b>Ontology IRI</b></td>
            <td>
              <a href={ontology.config.id} target="_blank" rel="noopener noreferrer">{ontology.config.id}</a>
              <Button 
                variant="contained" 
                className='copy-link-btn'                
                targetlink={ontology.config.id} 
                onClick={() => {                  
                  navigator.clipboard.writeText(ontology.config.id);
                  setOntologyIriCopied(true);
                }}            
              >copy</Button>
              {ontologyIriCopied && 
                  <CheckIcon 
                    fontSize="large"
                    id=""
                  />
              }            
            </td>
          </tr>
          <tr>
            <td className="ontology-info-table-prop"><b>Version IRI</b></td>
            <td>
              <a href={ontology.config.versionIri} target="_blank" rel="noopener noreferrer">{ontology.config.versionIri}</a>
              <Button 
                variant="contained" 
                className='copy-link-btn'                
                targetlink={ontology.config.versionIri} 
                onClick={() => {                  
                  navigator.clipboard.writeText(ontology.config.versionIri);
                  setOntologyVersionCopied(true);
                }}            
              >copy</Button>
              {ontologyVersionCopied && 
                  <CheckIcon 
                    fontSize="large"
                    id=""
                  />
              }      
            </td>
          </tr>
          <tr>
            <td className="ontology-info-table-prop"><b>Description</b></td>
            <td>
              {ontology.config.description}
            </td>
          </tr>
          <tr>
            <td className="ontology-info-table-prop"><b>HomePage</b></td>
            <td>
              <a href={ontology.config.homepage} target="_blank" rel="noopener noreferrer">{ontology.config.homepage}</a>
            </td>
          </tr>
          <tr>
            <td className="ontology-info-table-prop"><b>Issue tracker</b></td>
            <td>
              <a href={ontology.config.tracker} target="_blank" rel="noopener noreferrer">{ontology.config.tracker}</a>
            </td>
          </tr>
          <tr>
            <td className="ontology-info-table-prop"><b>Version</b></td>
            <td>
              {ontology.config.version}
            </td>
          </tr>
          <tr>
            <td className="ontology-info-table-prop"><b>License</b></td>
            <td>
              <a href={ontology.config.annotations.license} target="_blank" rel="noopener noreferrer">{ontology.config.annotations.license}</a>
            </td>
          </tr>
          <tr>
            <td className="ontology-info-table-prop"><b>Creator</b></td>
            <td>
              {formatCreators(ontology.config.creators)}
            </td>
          </tr>
          <tr>
            <td className="ontology-info-table-prop"><b>Download</b></td>
            <td>
              {ontology.download}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default OntologyInfoBox
