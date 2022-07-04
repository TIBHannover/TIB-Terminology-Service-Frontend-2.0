import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
      <b>{ontology.config.title}</b><Link to={ontology.config.homepage}><HomeIcon fontSize="large" style={{float: 'right'}}></HomeIcon></Link><Link to={ontology.config.tracker}><ArticleIcon fontSize="large" style={{float: 'right'}}></ArticleIcon></Link>
      <div className='onto-icons'></div>
    </div>
    
      
    
  </div>
  )
}

export default OntoHeader;