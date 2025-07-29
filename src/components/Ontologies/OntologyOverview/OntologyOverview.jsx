import OntologyInfoTable from './widgets/OntologyInfo';
import OntologyStatsBox from './widgets/stats';
import {useContext, useState} from 'react';
import {OntologyPageContext} from '../../../context/OntologyPageContext';
import CollectionSuggestion from './widgets/CollectionSuggestion';
import Login from "../../User/Login/TS/Login";
import {AppContext} from "../../../context/AppContext";


const OntologyOverview = () => {
  /*
    This component is responsible for rendering the overview page of an ontology.
  */
  
  const ontologyPageContext = useContext(OntologyPageContext);
  const appContext = useContext(AppContext);
  
  const [showCollectionSuggestionModal, setShowCollectionSuggestionModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  
  let ontoPageHeader = document.getElementById('ontology-page-header');
  if (ontoPageHeader) {
    ontoPageHeader.scrollIntoView();
  }
  
  
  return (
    <>
      <div key={'ontolofyOverviewPage'} className="row ontology-detail-page-container">
        <div className='col-sm-9 '>
          <OntologyInfoTable/>
        </div>
        <div className='col-sm-3'>
          <OntologyStatsBox/>
          <br></br>
          <div className='row'>
            <div className='col-sm-12'>
              <a
                href={`${process.env.REACT_APP_API_URL}/v2/ontologies/${ontologyPageContext.ontology.ontologyId}?lang=${ontologyPageContext.ontoLang}`}
                target='_blank'
                rel="noreferrer"
                className='btn btn-secondary download-ontology-btn w-75 stour-overview-page-show-metadata-as-json-btn'
              >
                Show Ontology Metadata as JSON
              </a>
            </div>
          </div>
          <br/>
          {process.env.REACT_APP_PROJECT_ID === "general" && process.env.REACT_APP_ONTOLOGY_SUGGESTION === "true" &&
            <div className='row'>
              <div className='col-sm-12'>
                <button
                  type="button"
                  className={"btn btn-secondary w-75 download-ontology-btn stour-overview-page-add-to-collection"}
                  onClick={() => {
                    if (appContext.user) {
                      setShowCollectionSuggestionModal(true);
                    } else {
                      setLoginModal(true);
                      setTimeout(() => setLoginModal(false), 1000);
                    }
                  }}
                >
                  Add to Collection
                </button>
              </div>
            </div>
          }
        </div>
      </div>
      <CollectionSuggestion
        showModal={showCollectionSuggestionModal}
        setShowModal={setShowCollectionSuggestionModal}
      />
      <Login isModal={true} showModal={loginModal} withoutButton={true}/>
    </>
  );
  
}

export default OntologyOverview;
