import {useState, useEffect, useContext} from "react";
import {AppContext} from "../../../context/AppContext";


export const OntologyListFacet = (props) => {
  
  const appContext = useContext(AppContext);
  const [collectionBoxes, setCollectionBoxes] = useState('');
  
  
  function createCollectionsCheckBoxes() {
    let result = [];
    for (let col in props.allCollections) {
      result.push(
        <div className="row facet-item-row">
          <div className='col-sm-9'>
            <div className="form-check">
              <input
                className="form-check-input collection-checkbox"
                type="checkbox"
                value={col}
                id={"col-checkbox-" + col}
                key={col}
                onClick={props.handleFacetCollection}
                checked={props.selectedCollections.includes(col)}
                onChange={() => {
                }}
              />
              <label className="form-check-label" htmlFor={"col-checkbox-" + col}>
                {col}
              </label>
            </div>
          </div>
          <div className='col-sm-3'>
            <span className="facet-result-count" id={"result-count-" + col}>{props.allCollections[col]}</span>
          </div>
        </div>
      );
    }
    setCollectionBoxes(result);
  }
  
  
  useEffect(() => {
    createCollectionsCheckBoxes();
  }, []);
  
  
  useEffect(() => {
    createCollectionsCheckBoxes();
  }, [props.selectedCollections, props.allCollections]);
  
  
  return (
    <div className="row">
      <div className='col-sm-12 ' id="ontology-list-facet-grid">
        <h3 className='ontology-list-facet-header'>Filter</h3>
        <div className='row'>
          <div className='col-sm-12 stour-onto-list-filter-keyword' id="ontologylist-search-grid">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                aria-label="By keyword"
                aria-describedby="By keyword"
                placeholder='By keyword'
                value={props.enteredKeyword !== "" ? props.enteredKeyword : ""}
                onChange={props.filterWordChange}
              />
            </div>
          </div>
        </div>
        {process.env.REACT_APP_COLLECTION_FACET_SHOWN === "true" &&
          <div className='row ontology-list-facet-section-box stour-onto-list-filter-collectin'>
            <h3 className='h-headers ontology-list-facet-header'>Collection</h3>
            <div className="col-sm-12 facet-box">
              {!appContext.userSettings.userCollectionEnabled &&
                <>
                  <div className='facet-switch-holder'>
                    <div className="form-switch">
                      <input className="form-check-input toggle-input" type="checkbox" role="switch" id="facet-switch"
                             onChange={props.onSwitchChange}/>
                      <label className="form-check-label ms-2" htmlFor="facet-switch">Intersection</label>
                    </div>
                  </div>
                  <div>
                    {collectionBoxes}
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
      </div>
    </div>
  );
}