import OntologyInfoTable from './widgets/OntologyInfo';
import OntologyStatsBox from './widgets/stats';
import { useContext, useState } from 'react';
import { OntologyPageContext } from '../../../context/OntologyPageContext';
import CollectionSuggestion from './widgets/CollectionSuggestion';
import Login from "../../User/Login/TS/Login";
import { AppContext } from "../../../context/AppContext";

import OntologyAdopters from './widgets/OntologyAdopters';

const OntologyOverview = () => {
  /*
    This component is responsible for rendering the overview page of an ontology.
  */

  const ontologyPageContext = useContext(OntologyPageContext);
  const appContext = useContext(AppContext);

  const [showCollectionSuggestionModal, setShowCollectionSuggestionModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  // current ontology object (already fetched and placed in context)
  const ontology = ontologyPageContext?.ontology;

  // show adopters only if there is at least one use entry with a usedBy block
  const hasAdopters =
    Array.isArray(ontology.ontologyJsonData?.ontology_use) &&
    ontology.ontologyJsonData.ontology_use.some((u) => u && u.usedBy);

  // new state to control the adopters modal
  const [showOntologyAdopters, setShowOntologyAdopters] = useState(false);

  let ontoPageHeader = document.getElementById('ontology-page-header');
  if (ontoPageHeader) {
    ontoPageHeader.scrollIntoView();
  }

  return (
    <>
      <div key={'ontolofyOverviewPage'} className="row">
        <div className='col-sm-9 '>
          <OntologyInfoTable />
        </div>
        <div className='col-sm-3'>
          <OntologyStatsBox />
          <br />
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
          <br />
          {process.env.REACT_APP_PROJECT_ID === "general" && process.env.REACT_APP_ONTOLOGY_SUGGESTION === "true" &&
            <div className='row'>
              <div className='col-sm-12'>
                <button
                  type="button"
                  className={"btn btn-secondary w-75 download-ontology-btn stour-overview-page-add-to-collection"}
                  onClick={() => {
                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                    }
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

          {/* Ontology adopters button (only when feature flag is on AND there is at least one adopter) */}
          {process.env.REACT_APP_SHOW_ONTOLOGY_ADOPTERS === "true" && hasAdopters && (
            <div className='row' style={{ marginTop: 10 }}>
              <div className='col-sm-12'>
                <button
                  type="button"
                  className="btn btn-secondary w-75 download-ontology-btn stour-overview-page-add-to-collection"
                  onClick={() => {
                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                    }
                    setShowOntologyAdopters(true)
                  }}
                >
                  Ontology adopters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CollectionSuggestion
        showModal={showCollectionSuggestionModal}
        setShowModal={setShowCollectionSuggestionModal}
      />

      {/* Mount the modal only when the flag is on AND there are adopters */}
      {process.env.REACT_APP_SHOW_ONTOLOGY_ADOPTERS === "true" && hasAdopters && (
        <OntologyAdopters
          showModal={showOntologyAdopters}
          setShowModal={setShowOntologyAdopters}
        />
      )}

      <Login isModal={true} showModal={loginModal} withoutButton={true} />
    </>
  );
}

export default OntologyOverview;
