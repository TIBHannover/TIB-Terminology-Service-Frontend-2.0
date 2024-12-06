import OntologyInfoTable from './widgets/OntologyInfo';
import OntologyStatsBox from './widgets/stats';
import { useContext } from 'react';
import { OntologyPageContext } from '../../../context/OntologyPageContext';
import CollectionSuggestion from './widgets/CollectionSuggestion';




const OntologyOverview = () => {
  /*
    This component is responsible for rendering the overview page of an ontology.
  */

  const ontologyPageContext = useContext(OntologyPageContext);


  return (
    <>
      <div key={'ontolofyOverviewPage'} className="row ontology-detail-page-container">
        <div className='col-sm-9 '>
          <OntologyInfoTable />
        </div>
        <div className='col-sm-3'>
          <OntologyStatsBox />
          <br></br>
          <div className='row'>
            <div className='col-sm-12'>
              <a
                href={process.env.REACT_APP_API_BASE_URL + "/" + ontologyPageContext.ontology.ontologyId}
                target='_blank'
                rel="noreferrer"
                className='btn btn-secondary download-ontology-btn w-75 stour-overview-page-show-metadata-as-json-btn'
              >
                Show Ontology Metdata as JSON
              </a>
            </div>
          </div>
          <br />
          {process.env.REACT_APP_PROJECT_ID === "general" && process.env.REACT_APP_ONTOLOGY_SUGGESTION === "true" &&
            <div className='row'>
              <div className='col-sm-12'>
                <button
                  type="button"
                  className={"btn btn-secondary w-75 download-ontology-btn stour-overview-page-add-to-collection"}
                  data-toggle="modal"
                  data-target={"#collectionSuggestionModal"}
                  data-backdrop="static"
                >
                  Add to Collection
                </button>
              </div>
            </div>
          }
        </div>
      </div>
      <CollectionSuggestion />
    </>
  );

}

export default OntologyOverview;
