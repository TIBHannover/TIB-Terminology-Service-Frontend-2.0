import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import '../../../layout/ontologies.css';

function OntoHeader(props){
  const [ontologyObject, setOntologyObject]  = useState(props.ontology);
  const ontology = props.ontology;
  if (!ontology || ontology === null) {
    return false
  }

return(
  <div>
    {ontology.config.title}
  </div>
  )
}

export default OntoHeader;