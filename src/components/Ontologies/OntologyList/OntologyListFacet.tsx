import { useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import SearchFacetBox from "../../common/Facet/SearchFacet";

type OntologyListFacetProps = {
  enteredKeyword: string;
  filterWordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFacetCollection: (e: React.MouseEvent<HTMLInputElement>) => void;
  handleFacetSubject: (e: React.MouseEvent<HTMLInputElement>) => void;
  selectedCollections: string[];
  selectedSubjects: string[];
  allCollections: Record<string, number>;
  allSubjects: Record<string, number>;
}


export const OntologyListFacet = (props: OntologyListFacetProps) => {

  const appContext = useContext(AppContext);

  return (
    <div className="row">
      <div className='col-sm-12 ms-0 ps-0' id="ontology-list-facet-grid">
        <div className="row">
          <div className="col-sm-12 ps-0">
            <div className="mb-2 d-flex flex-column stour-onto-list-filter-keyword" id="ontologylist-search-grid">
              <label className="input-group-text" htmlFor="ontology-list-search-input" id="ontology-list-search-label">
                Filter this list by keyword
              </label>
              <input
                type="text"
                className="form-control"
                aria-label="Filter this list by keyword"
                aria-describedby="Filter this list by keyword"
                placeholder='Enter your keyword ...'
                id="ontology-list-search-input"
                value={props.enteredKeyword !== "" ? props.enteredKeyword : ""}
                onChange={props.filterWordChange}
              />
            </div>

          </div>
        </div>
        {process.env.REACT_APP_COLLECTION_FACET_SHOWN === "true" &&
          <div className='row ontology-list-facet-section-box stour-onto-list-filter-collectin'>
            <div className="col-sm-12 facet-box">
              <h4 className='h-headers ontology-list-facet-header text-center'>Filter by Collection</h4>
              {!appContext.userSettings.userCollectionEnabled &&
                <>
                  <div className='facet-switch-holder'>
                    <div className="form-switch">
                      <input className="form-check-input toggle-input" type="checkbox" role="switch" id="facet-switch"
                        onChange={props.onSwitchChange} />
                      <label className="form-check-label ms-2" htmlFor="facet-switch">Intersection</label>
                    </div>
                  </div>
                  <div>
                    <SearchFacetBox
                      data={props.allCollections}
                      selectedFacetFields={props.selectedCollections}
                      handleFacetFieldClick={props.handleFacetCollection}
                      className={"collection-checkbox"}
                      idPrefix={"col-checkbox-"}
                    />
                  </div>
                </>
              }
              {appContext.userSettings.userCollectionEnabled &&
                <>
                  <p>
                    Your collection named "{appContext.userSettings.activeCollection.title}" is enabled.
                  </p>
                  <p>
                    Disable it by clicking <i className="fa fa-close"></i>
                    in case you wish to see the full list of collections and ontologies.
                  </p>
                </>
              }
            </div>
          </div>
        }
        <div className='row ontology-list-facet-section-box stour-onto-list-filter-collectin'>
          <div className="col-sm-12 facet-box">
            <h4 className='h-headers ontology-list-facet-header text-center'>Filter by Subject</h4>
            <SearchFacetBox
              data={props.allSubjects}
              selectedFacetFields={props.selectedSubjects}
              handleFacetFieldClick={props.handleFacetSubject}
              className={"subject-checkbox"}
              idPrefix={"subj-checkbox-"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}