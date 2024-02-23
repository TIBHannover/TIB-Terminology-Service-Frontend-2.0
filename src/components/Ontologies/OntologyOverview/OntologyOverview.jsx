import OntologyInfoTable from './widgets/OntologyInfo';
import OntologyStatsBox from './widgets/stats';
import { useContext } from 'react';
import { OntologyPageContext } from '../../../context/OntologyPageContext';




const OntologyOverview = () => {

  const ontologyPageContext = useContext(OntologyPageContext);


  return(
      <div  key={'ontolofyOverviewPage'} className="row ontology-detail-page-container">        
        <div className='col-sm-9'>
          <OntologyInfoTable />
        </div>
        <div className='col-sm-3'>
          <OntologyStatsBox />
          <br></br>          
          <div className='row'>
              <div className='col-sm-12 node-metadata-value'>
                <a 
                  href={process.env.REACT_APP_API_BASE_URL + "/" + ontologyPageContext.ontology.ontologyId} 
                  target='_blank' 
                  rel="noreferrer"
                  className='btn btn-secondary btn-dark download-ontology-btn'
                  >
                    Show Ontology Metdata as JSON
                </a>
              </div>            
            </div>
        </div>
    </div>
  );

 }

export default OntologyOverview;
