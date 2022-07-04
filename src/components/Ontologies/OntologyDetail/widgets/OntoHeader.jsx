import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import '../../../layout/ontologies.css';
import HomeIcon from '@mui/icons-material/Home';

function OntoHeader(props){
  const [ontologyObject, setOntologyObject]  = useState(props.ontology);
  const ontology = props.ontology;
  if (!ontology || ontology === null) {
    return false
  }

return(
  <div className='onto-header'>
    <div className='onto-header-title'>
      <b>{ontology.config.title}</b><HomeIcon />
      <div className='onto-icons'></div>
    </div>
    
      
    
  </div>
  )
}

export default OntoHeader;