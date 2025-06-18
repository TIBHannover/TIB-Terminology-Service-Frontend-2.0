import {useEffect, useState, useContext} from "react";
import {AppContext} from "../../../context/AppContext";
import OntologyLib from "../../../Libs/OntologyLib";


const Facet = (props) => {
  
  const appContext = useContext(AppContext);
  
  const DEFAULT_NUMBER_OF_SHOWN_ONTOLOGIES = 5;
  
  const [resultTypes, setResultTypes] = useState([]);
  const [ontologyFacetData, setOntologyFacetData] = useState([]);
  const [ontologyListShowAll, setOntologyListShowAll] = useState(false);
  const [countOfShownOntologies, setCountOfShownOntologies] = useState(DEFAULT_NUMBER_OF_SHOWN_ONTOLOGIES);
  const [showMoreLessOntologiesText, setShowMoreLessOntologiesText] = useState("+ Show More");
  const [showMoreIsNeededForOntologies, setShowMoreIsNeededForOntologies] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [typesCheckBoxesToRender, setTypesCheckBoxesToRender] = useState(null);
  const [ontologyCheckBoxesToRender, setOntologyCheckBoxesToRender] = useState(null);
  const [collectionCheckBoxesToRender, setCollectionCheckBoxesToRender] = useState(null);
  const [ontoCollectionMap, setOntoCollectionMap] = useState(new Map());
  
  
  function setComponentData() {
    if (!props.facetData) {
      setResultTypes({});
      setOntologyFacetData({});
    } else {
      let facetData = props.facetData;
      let allOntologies = facetData["ontologyId"];
      let ontologyFacetData = {};
      for (let onto in allOntologies) {
        if (appContext.userSettings.userCollectionEnabled && !appContext.userSettings.activeCollection['ontology_ids'].includes(onto.toLowerCase())) {
          continue;
        }
        ontologyFacetData[onto.toUpperCase()] = allOntologies[onto];
      }
      
      
      setResultTypes(facetData["type"]);
      setOntologyFacetData(ontologyFacetData);
    }
  }
  
  
  function createTypesCheckboxList() {
    let result = [];
    for (let type in resultTypes) {
      if (parseInt(resultTypes[type]) !== 0) {
        result.push(
          <div className="row typeRow facet-item-row" key={type}>
            <div className="col-sm-9">
              <div className="form-check">
                <input
                  className="form-check-input search-facet-checkbox"
                  type="checkbox"
                  value={type}
                  id={"search-checkbox-" + type}
                  key={type}
                  onClick={props.handleTypesCheckBoxClick}
                  data-ischecked={props.selectedTypes.includes(type)}
                />
                <label className="form-check-label" htmlFor={"search-checkbox-" + type}>
                  {type}
                </label>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="facet-result-count">{resultTypes[type]}</div>
            </div>
          </div>
        );
      }
    }
    setTypesCheckBoxesToRender(result);
  }
  
  
  function createOntologiesCheckboxList() {
    
    let result = [];
    let counter = 1;
    
    for (let ontologyId in ontologyFacetData) {
      if (counter > countOfShownOntologies && !ontologyListShowAll) {
        break;
      }
      // let skip = false;
      // if (props.selectedCollections.length && ontoCollectionMap.size > 0) {
      //   for (let col of props.selectedCollections) {
      //     if (!ontoCollectionMap.get(ontologyId)?.includes(col)) {
      //       skip = true;
      //       break;
      //     }
      //   }
      // }
      // if (skip) {
      //   continue;
      // }
      
      if (parseInt(ontologyFacetData[ontologyId]) !== 0) {
        result.push(
          <div key={ontologyId}>
            <div className="row ontoloyRow facet-item-row">
              <div className="col-sm-9">
                <div className="form-check">
                  <input
                    className="form-check-input search-facet-checkbox ontology-facet-checkbox"
                    type="checkbox"
                    value={ontologyId}
                    id={"search-checkbox-" + ontologyId.toLowerCase()}
                    key={ontologyId}
                    onClick={props.handleOntologyCheckBoxClick}
                    data-isChecked={props.selectedOntologies.includes(ontologyId.toLowerCase())}
                  />
                  <label className="form-check-label" htmlFor={"search-checkbox-" + ontologyId}>
                    {ontologyId}
                  </label>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="facet-result-count">{ontologyFacetData[ontologyId]}</div>
              </div>
            </div>
          </div>
        );
      }
      counter += 1;
    }
    setOntologyCheckBoxesToRender(result);
  }
  
  
  function createCollectionsCheckBoxes() {
    let result = [];
    for (let col in props.allCollections) {
      for (let onto of props.allCollections[col]) {
        let ontoId = onto['ontologyId'];
        if (props.selectedOntologies.includes(ontoId.toLowerCase()) || props.selectedOntologies.length === 0) {
          result.push(
            <div className="row facet-item-row">
              <div className='col-sm-9'>
                <div className="form-check">
                  <input
                    className="form-check-input search-facet-checkbox"
                    type="checkbox"
                    value={col}
                    id={"search-checkbox-" + col}
                    key={col}
                    onClick={props.handleCollectionsCheckboxClick}
                    data-ischecked={props.selectedCollections.includes(col)}
                  />
                  <label className="form-check-label" htmlFor={"search-checkbox-" + col}>
                    {col}
                  </label>
                </div>
              </div>
            </div>
          );
          break;
        }
      }
    }
    setCollectionCheckBoxesToRender(result);
  }
  
  
  function handleOntologyShowMoreClick(e) {
    if (ontologyListShowAll) {
      setShowMoreLessOntologiesText("+ Show More");
      setOntologyListShowAll(false);
    } else {
      setShowMoreLessOntologiesText("- Show Less");
      setOntologyListShowAll(true);
    }
    
  }
  
  
  function updateCountOfShownOntologies() {
    let lastSelectedOntologyIndex = 0;
    let counter = 1;
    let ontologiesInFacetLength = 0;
    for (let ontoId in ontologyFacetData) {
      console.log(ontoId)
      console.log(props.selectedOntologies)
      if (props.selectedOntologies.includes(ontoId.toLowerCase())) {
        lastSelectedOntologyIndex = counter;
      }
      if (ontologyFacetData[ontoId] !== 0) {
        ontologiesInFacetLength += 1;
      }
      counter += 1;
    }
    
    let numberOfShownOntologies = DEFAULT_NUMBER_OF_SHOWN_ONTOLOGIES;
    if (lastSelectedOntologyIndex > countOfShownOntologies) {
      setCountOfShownOntologies(lastSelectedOntologyIndex);
      numberOfShownOntologies = lastSelectedOntologyIndex;
    }
    
    if (ontologiesInFacetLength > numberOfShownOntologies) {
      setShowMoreIsNeededForOntologies(true);
    } else {
      setShowMoreIsNeededForOntologies(false);
    }
    
  }
  
  
  function enableSelectedCheckBoxesOnLoad() {
    let allFacetCheckBoxes = document.getElementsByClassName('search-facet-checkbox');
    for (let checkbox of allFacetCheckBoxes) {
      if (checkbox.dataset.ischecked === "true") {
        document.getElementById(checkbox.id).checked = true;
      }
      delete checkbox.dataset.ischecked;
    }
  }
  
  
  useEffect(() => {
    setComponentData();
    updateCountOfShownOntologies();
  }, []);
  
  
  useEffect(() => {
    if (!appContext.userSettings.userCollectionEnabled) {
      createCollectionsCheckBoxes();
      setIsLoading(false);
    }
    const ontoColMap = new Map();
    for (let col in props.allCollections) {
      for (let onto of props.allCollections[col]) {
        if (!ontoColMap.has(onto['preferredPrefix'])) {
          ontoColMap.set(onto['preferredPrefix'], [col]);
        } else {
          let temp = ontoColMap.get(onto['preferredPrefix']);
          temp.push(col);
          ontoColMap.set(onto['preferredPrefix'], [col]);
        }
      }
    }
    setOntoCollectionMap(ontoColMap);
  }, [props.allCollections]);
  
  
  useEffect(() => {
    setComponentData();
    createTypesCheckboxList();
    createOntologiesCheckboxList();
    !appContext.userSettings.userCollectionEnabled && createCollectionsCheckBoxes();
    setIsLoading(false);
  }, [props.facetData]);
  
  
  useEffect(() => {
    createTypesCheckboxList();
  }, [resultTypes]);
  
  
  useEffect(() => {
    createOntologiesCheckboxList();
    updateCountOfShownOntologies();
  }, [ontologyFacetData]);
  
  
  useEffect(() => {
    createOntologiesCheckboxList();
    setIsLoading(false);
  }, [countOfShownOntologies, ontologyListShowAll]);
  
  
  useEffect(() => {
    enableSelectedCheckBoxesOnLoad();
  }, [typesCheckBoxesToRender, ontologyCheckBoxesToRender, collectionCheckBoxesToRender]);
  
  
  return (
    <div className="row" id="search-facet-container-box">
      {isLoading &&
        <div className="d-flex justify-content-center">
          <div className="spinner-grow text-info facet-loading-effect" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>}
      {!isLoading &&
        <div className="col-sm-12">
          <h2>Filter Results</h2>
          <div className="row">
            <div className="col-sm-12 clear-filter-link-box">
              <a onClick={props.clearFacet}>Clear All Filters</a>
              <br></br>
            </div>
          </div>
          <h4>{"Type"}</h4>
          <div className="facet-box" id="facet-types-list">
            {typesCheckBoxesToRender}
          </div>
          <h4>{"Ontologies"}</h4>
          <div className="facet-box">
            {ontologyCheckBoxesToRender}
            {showMoreIsNeededForOntologies &&
              <div className="text-center" id="search-facet-show-more-ontology-btn">
                <a className="show-more-btn" onClick={handleOntologyShowMoreClick}>{showMoreLessOntologiesText}</a>
              </div>
            }
          </div>
          {process.env.REACT_APP_COLLECTION_FACET_SHOWN === "true" &&
            <>
              <h4>{"Collections"}</h4>
              <div className="facet-box" id="facet-collections-list">
                {!appContext.userSettings.userCollectionEnabled && collectionCheckBoxesToRender}
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
            </>}
        </div>}
    </div>
  );
  
  
}

export default Facet;