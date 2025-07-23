import {useState, useEffect, useRef, useContext} from 'react';
import Multiselect from 'multiselect-react-dropdown';
import {getJumpToResult} from '../../../api/search';
import SearchLib from '../../../Libs/searchLib';
import Toolkit from '../../../Libs/Toolkit';
import OntologyLib from '../../../Libs/OntologyLib';
import SearchUrlFactory from '../../../UrlFactory/SearchUrlFactory';
import {AppContext} from '../../../context/AppContext';
import StoreUpdateSearchSetting from './StoreSettings';
import LoadSetting from './LoadSetting';
import {storeUserSettings} from '../../../api/user';


const AdvancedSearch = (props) => {
  
  const appContext = useContext(AppContext);
  
  const [selectedMetaData, setSelectedMetaData] = useState(SearchLib.getSearchInMetadataFieldsFromUrl());
  const [selectedSearchUnderTerms, setSelectedSearchUnderTerms] = useState(SearchLib.getSearchUnderTermsFromUrl());
  const [selectedSearchUnderAllTerms, setSelectedSearchUnderAllTerms] = useState(SearchLib.getSearchUnderAllTermsFromUrl());
  const [termListForSearchUnder, setTermListForSearchUnder] = useState([]);
  const [loadingResult, setLoadingResult] = useState(true);
  const [placeHolderExtraText, setPlaceHolderExtraText] = useState(createOntologyListForPlaceholder([]));
  const [loadedSettingName, setLoadedSettingName] = useState(false);
  const [searchSettingIsModified, setSearchSettingIsModified] = useState(false);
  
  const searchUrlFactory = new SearchUrlFactory();
  
  const searchInMetaDataOptions = ['label', 'description', 'synonym', 'short_form', 'obo_id', 'annotations', 'iri'];
  
  // The check to see whether we are on an ontology page or not.
  const ontologyPageId = OntologyLib.getCurrentOntologyIdFromUrlPath();
  
  const ontologyIdsInUrl = SearchLib.getFilterAndAdvancedOntologyIdsFromUrl();
  
  const searchUnderRef = useRef(null);
  const searchUnderAllRef = useRef(null);
  const searchInMetadataSelectRef = useRef(null);
  
  
  async function loadTermsForSelection(query) {
    setLoadingResult(true);
    if (query === "") {
      setTermListForSearchUnder([]);
      return true;
    }
    let inputQuery = {
      "searchQuery": query,
      "types": "class,property",
      "ontologyIds": ontologyIdsInUrl,
      "obsoletes": Toolkit.getObsoleteFlagValue(),
    };
    if (appContext.userSettings.userCollectionEnabled) {
      inputQuery['ontologyIds'] = appContext.userSettings.activeCollection.ontology_ids.join(',');
    }
    if (ontologyPageId) {
      // restrict the term search to the current opened ontology
      inputQuery['ontologyIds'] = [ontologyPageId];
    }
    let terms = await getJumpToResult(inputQuery, 20);
    let options = [];
    for (let term of terms) {
      let opt = {};
      opt['text'] = `${term['ontology_prefix']}:${term['label']} (${term['type']})`;
      opt['iri'] = term['iri'];
      options.push(opt);
    }
    setLoadingResult(false);
    setTermListForSearchUnder(options);
  }
  
  
  function handleSearchInMultiSelect(selectedList, selectedItem) {
    if (appContext.userSettings.activeSearchSetting.setting !== undefined) {
      changeSearchSettingIsModified(true, {
        selectedMetaData: selectedList,
        selectedSearchUnderTerms,
        selectedSearchUnderAllTerms
      });
    }
    setSelectedMetaData(selectedList);
  }
  
  
  function handleTermSelectionSearchUnder(selectedList, selectedItem) {
    if (appContext.userSettings.activeSearchSetting.setting !== undefined) {
      changeSearchSettingIsModified(true, {
        selectedMetaData,
        selectedSearchUnderTerms: selectedList,
        selectedSearchUnderAllTerms
      });
    }
    setSelectedSearchUnderTerms(selectedList);
    setLoadingResult(true);
    setTermListForSearchUnder([]);
  }
  
  
  function handleTermSelectionSearchUnderAll(selectedList, selectedItem) {
    if (appContext.userSettings.activeSearchSetting.setting !== undefined) {
      changeSearchSettingIsModified(true, {
        selectedMetaData,
        selectedSearchUnderTerms,
        selectedSearchUnderAllTerms: selectedList
      });
    }
    setSelectedSearchUnderAllTerms(selectedList);
    setLoadingResult(true);
    setTermListForSearchUnder([]);
  }
  
  
  function createOntologyListForPlaceholder(ontologyList) {
    let selectedOntologyIdsText = (ontologyList.length !== 0 ? "in " : "");
    for (let ontology of ontologyList) {
      selectedOntologyIdsText += (ontology['id'] + ",")
    }
    if (selectedOntologyIdsText !== "") {
      selectedOntologyIdsText = selectedOntologyIdsText.slice(0, -1);
    }
    return selectedOntologyIdsText;
  }
  
  
  async function reset() {
    setSelectedMetaData([]);
    searchInMetadataSelectRef.current.resetSelectedValues();
    setSelectedSearchUnderTerms([]);
    setSelectedSearchUnderAllTerms([]);
    setPlaceHolderExtraText("");
    searchUrlFactory.resetAdvancedSearchUrlParams();
    setLoadedSettingName(false);
    let userSettings = {...appContext.userSettings};
    userSettings.activeSearchSetting = {};
    userSettings.activeSearchSettingIsModified = false;
    appContext.setUserSettings(userSettings);
    await storeUserSettings(userSettings);
  }
  
  
  function handleClickOutsideSelectionBox(e) {
    let advSearchUnderBox = document.getElementById("adv-s-search-under-term");
    let advSearchUnderAllBox = document.getElementById("adv-s-search-under-all-term");
    if (!advSearchUnderBox?.contains(e.target) && !advSearchUnderAllBox?.contains(e.target)) {
      setTermListForSearchUnder([]);
      setLoadingResult(true);
    }
  }
  
  
  async function loadSettings(setting) {
    if (setting === undefined) {
      return;
    }
    let {selectedMetaData, selectedSearchUnderTerms, selectedSearchUnderAllTerms} = setting['setting'];
    let loadedSettingName = setting['title'];
    setSelectedMetaData(selectedMetaData);
    setSelectedSearchUnderTerms(selectedSearchUnderTerms);
    setSelectedSearchUnderAllTerms(selectedSearchUnderAllTerms);
    setLoadedSettingName(loadedSettingName);
    let userSettings = {...appContext.userSettings};
    userSettings.activeSearchSetting = setting;
    userSettings.activeSearchSettingIsModified = false;
    appContext.setUserSettings(userSettings);
    await storeUserSettings(userSettings);
  }
  
  
  async function changeSearchSettingIsModified(isModified, setting) {
    // setting has changed. The user did not update the current setting yet. We need to track this to inform the user.
    let userSettings = {...appContext.userSettings};
    userSettings.activeSearchSettingIsModified = isModified;
    userSettings.activeSearchSetting.setting = setting;
    appContext.setUserSettings(userSettings);
    setSearchSettingIsModified(isModified);
    await storeUserSettings(userSettings);
  }
  
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideSelectionBox, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideSelectionBox, true);
    }
  }, []);
  
  
  useEffect(() => {
    if (!props.advSearchEnabled) {
      searchUrlFactory.resetAdvancedSearchUrlParams();
    } else {
      searchUrlFactory.updateAdvancedSearchUrl({
        searchInValues: selectedMetaData,
        searchUnderTerms: selectedSearchUnderTerms,
        searchUnderAllTerms: selectedSearchUnderAllTerms
      });
    }
  }, [props.advSearchEnabled]);
  
  
  useEffect(() => {
    props.advSearchEnabled && searchUrlFactory.updateAdvancedSearchUrl({
      searchInValues: selectedMetaData,
      searchUnderTerms: selectedSearchUnderTerms,
      searchUnderAllTerms: selectedSearchUnderAllTerms
    });
  }, [selectedMetaData, selectedSearchUnderTerms, selectedSearchUnderAllTerms]);
  
  
  useEffect(() => {
    if (appContext.user && appContext.userSettings.activeSearchSetting.setting !== undefined) {
      setSelectedMetaData(appContext.userSettings.activeSearchSetting?.setting?.selectedMetaData);
      setSelectedSearchUnderTerms(appContext.userSettings.activeSearchSetting?.setting?.selectedSearchUnderTerms);
      setSelectedSearchUnderAllTerms(appContext.userSettings.activeSearchSetting?.setting?.selectedSearchUnderAllTerms);
      setLoadedSettingName(appContext.userSettings.activeSearchSetting.title);
      setSearchSettingIsModified(appContext.userSettings.activeSearchSettingIsModified);
    }
  }, [appContext.userSettings.activeSearchSetting]);
  
  
  if (process.env.REACT_APP_ADVANCED_SEARCH !== "true") {
    return "";
  }
  
  
  return (
    <>
      {props.advSearchEnabled &&
        <div className='row'>
          <div className='col-sm-8 adv-search-container'>
            <br></br>
            <div className="row">
              <div className="col-sm-12">
                <div className='row'>
                  <div className={'col-sm-12 adv-search-label-holder ' + (searchSettingIsModified && "warning-text")}>
                    {loadedSettingName &&
                      <h5>
                        Loaded: {loadedSettingName + (searchSettingIsModified ? " *" : "")}
                        <small>{searchSettingIsModified && "Setting is modified but not updated."}</small>
                        {/* <StoreSearchSettings 
                                                    editMode={true} 
                                                    settings={{
                                                        selectedMetaData,
                                                        selectedSearchUnderTerms,
                                                        selectedSearchUnderAllTerms
                                                    
                                                    }}                                                    
                                                    setLoadedSettingName={setLoadedSettingName}
                                                />                                                                                                 */}
                      </h5>
                    }
                  </div>
                </div>
                <br></br>
                <div className='row'>
                  <div className='col-sm-11 adv-search-label-holder'>
                    <label htmlFor='adv-s-search-in-select'
                           title='Search based on specific Metadata such as label or description.'>
                      Search in metadata
                      <i className="fa fa-question-circle tooltip-questionmark" aria-hidden="true"></i>
                    </label>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-sm-12 adv-search-input-holder'>
                    <Multiselect
                      isObject={false}
                      options={searchInMetaDataOptions}
                      selectedValues={selectedMetaData}
                      onSelect={handleSearchInMultiSelect}
                      onRemove={handleSearchInMultiSelect}
                      avoidHighlightFirstOption={true}
                      ref={searchInMetadataSelectRef}
                      closeIcon={"cancel"}
                      id="adv-s-search-in-select"
                      placeholder="label, description, ..."
                    />
                  </div>
                </div>
              </div>
            </div>
            <br></br>
            <div className="row">
              <div className="col-sm-12">
                <div className='row'>
                  <div className='col-sm-12 adv-search-label-holder'>
                    <label htmlFor='adv-s-search-under-term'
                           title='In this field, you can set the classes or properties that are supposed to be the parent(s) of the one you search for (Is-a relation).'>
                      Search under parent
                      <i className="fa fa-question-circle tooltip-questionmark" aria-hidden="true"></i>
                    </label>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-sm-12 adv-search-input-holder'>
                    <Multiselect
                      isObject={true}
                      options={termListForSearchUnder}
                      selectedValues={selectedSearchUnderTerms}
                      onSelect={handleTermSelectionSearchUnder}
                      onRemove={handleTermSelectionSearchUnder}
                      onSearch={loadTermsForSelection}
                      displayValue={"text"}
                      avoidHighlightFirstOption={true}
                      loading={loadingResult}
                      closeIcon={"cancel"}
                      id="adv-s-search-under-term"
                      placeholder={"class, property " + placeHolderExtraText}
                      ref={searchUnderRef}
                    />
                  </div>
                </div>
              </div>
            </div>
            <br></br>
            <div className="row">
              <div className="col-sm-12">
                <div className='row'>
                  <div className='col-sm-12 adv-search-label-holder'>
                    <label htmlFor='adv-s-search-under-term'
                           title='Includes is-a, part-of, and develops-from relations.'>
                      Search under all transitive parent
                      <i className="fa fa-question-circle tooltip-questionmark" aria-hidden="true"></i>
                    </label>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-sm-12 adv-search-input-holder'>
                    <Multiselect
                      isObject={true}
                      options={termListForSearchUnder}
                      selectedValues={selectedSearchUnderAllTerms}
                      onSelect={handleTermSelectionSearchUnderAll}
                      onRemove={handleTermSelectionSearchUnderAll}
                      onSearch={loadTermsForSelection}
                      displayValue={"text"}
                      avoidHighlightFirstOption={true}
                      loading={loadingResult}
                      closeIcon={"cancel"}
                      id="adv-s-search-under-all-term"
                      placeholder={"class, property " + placeHolderExtraText}
                      ref={searchUnderAllRef}
                    />
                  </div>
                </div>
              </div>
            </div>
            <br></br>
            <div className='row'>
              <div className='col-sm-12 text-start'>
                <button className='btn btn-secondary' onClick={reset}>Reset</button>
                <LoadSetting
                  loadFunc={loadSettings}
                  resetAdvancedSearch={reset}
                  loadedSettingNameSetter={setLoadedSettingName}
                />
                <StoreUpdateSearchSetting
                  settings={{
                    selectedMetaData,
                    selectedSearchUnderTerms,
                    selectedSearchUnderAllTerms
                    
                  }}
                  setSearchSettingIsModified={setSearchSettingIsModified}
                />
              
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
  
  
}

export default AdvancedSearch;