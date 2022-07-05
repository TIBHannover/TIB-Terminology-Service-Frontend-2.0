import React, { useState } from 'react';
import '../../../layout/ontologies.css';
import HomeIcon from '@mui/icons-material/Home';
import ArticleIcon from '@mui/icons-material/Article';


function OntoHeader(props){
  const [ontologyObject, setOntologyObject]  = useState(props.ontology);
  const ontology = props.ontology;
  if (!ontology || ontology === null) {
    return false
  }

return(
  <div className='onto-header'>
    <div className='onto-header-title'>
      <b>{ontology.config.title}</b>
      <a href={ontology.config.homepage} target='_blank' rel="noreferrer">
        <HomeIcon fontSize="large" style={{float: 'right'}}></HomeIcon>
      </a>
      <a href={ontology.config.tracker} target='_blank' rel="noreferrer">
        <ArticleIcon fontSize="large" style={{float: 'right'}}></ArticleIcon>
      </a>
    </div>
    <br/> 
    <div className='onto-update'>
      Last Updated: {ontology.updated}
    </div>
  </div>
  )
}

export default OntoHeader;