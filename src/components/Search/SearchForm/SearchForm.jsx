import { useState, useEffect, useRef, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import RenderSearchForm from './RenderSearchForm';
import AdvancedSearch from './AdvancedSearch';
import { keyboardNavigationForJumpto } from './KeyboardNavigation';
import { getJumpToResult, getAutoCompleteResult } from '../../../api/search';
import Toolkit from '../../../Libs/Toolkit';
import OntologyLib from '../../../Libs/OntologyLib';
import '../../layout/jumpTo.css';
import '../../layout/searchBar.css';
import SearchUrlFactory from '../../../UrlFactory/SearchUrlFactory';
import { AppContext } from '../../../context/AppContext';
import { storeUserSettings } from '../../../api/user';
import SearchLib from '../../../Libs/searchLib';


const SearchForm = () => {

  /* 
    The search form component is used to render the search form and handle the search input. 
    It also handles the search input change, search input keydown, search trigger, 
    exact checkbox click, obsoletes checkbox click, advanced search toggle, 
    and search url creation.
  */

  const appContext = useContext(AppContext);
  const navigator = useHistory();
  const location = useLocation();

  const searchUrlFactory = new SearchUrlFactory();

  let advSearchEnabledLoad = searchUrlFactory.advancedSearchEnabled === "true" ? true : appContext.userSettings.advancedSearchEnabled;
  advSearchEnabledLoad = advSearchEnabledLoad ? true : false;

  const [searchQuery, setSearchQuery] = useState(searchUrlFactory.searchQuery ? searchUrlFactory.searchQuery : "");
  const [ontologyId, setOntologyId] = useState(OntologyLib.getCurrentOntologyIdFromUrlPath());
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const [jumpToResult, setJumpToResult] = useState([]);
  const [advSearchEnabled, setAdvSearchEnabled] = useState(advSearchEnabledLoad);

  const resultCount = 5;
  const autoCompleteRef = useRef(null);
  const jumptToRef = useRef(null);
  const exact = (searchUrlFactory.exact === "true");

  const searchUnderIris = SearchLib.decodeSearchUnderIrisFromUrl();
  const searchUnderAllIris = SearchLib.decodeSearchUnderAllIrisFromUrl();


  async function handleSearchInputChange(e) {
    let inputForAutoComplete = {};
    let searchQuery = e.target.value;
    if (searchQuery.length === 0) {
      setJumpToResult([]);
      setAutoCompleteResult([]);
      return true;
    }
    setSearchQuery(searchQuery);
    inputForAutoComplete['searchQuery'] = searchQuery;
    inputForAutoComplete['obsoletes'] = Toolkit.getObsoleteFlagValue();
    if (appContext.userSettings.userCollectionEnabled) {
      inputForAutoComplete['ontologyIds'] = appContext.userSettings.activeCollection.ontology_ids.join(',');
    }
    inputForAutoComplete['ontologyIds'] = searchUrlFactory.ontologies.length !== 0 ? searchUrlFactory.ontologies.join(',') : inputForAutoComplete['ontologyIds'];
    inputForAutoComplete['ontologyIds'] = ontologyId ? ontologyId : inputForAutoComplete['ontologyIds'];
    inputForAutoComplete['types'] = searchUrlFactory.types.length !== 0 ? searchUrlFactory.types.join(',') : null;
    if (process.env.REACT_APP_PROJECT_NAME === "") {
      /* check if it is TIB General to read the collection ids from url. Else, set the project ID such as NFDI4CHEM.        
      */
      inputForAutoComplete['collectionIds'] = searchUrlFactory.collections.length !== 0 ? searchUrlFactory.collections.join(',') : null;
    } else if (!ontologyId && !appContext.userSettings.userCollectionEnabled) {
      /* 
        If ontologyId exist, it means the user is doing the search from an ontology page and collection is NOT needed.
        If userCollectionEnabled is true, it means the user is doing the search from the user collection page and collection is NOT needed.
      */
      inputForAutoComplete['collectionIds'] = process.env.REACT_APP_PROJECT_NAME;
    }
    inputForAutoComplete['searchUnderIris'] = searchUnderIris;
    inputForAutoComplete['searchUnderAllIris'] = searchUnderAllIris;

    let [autoCompleteResult, jumpToResult] = await Promise.all([
      getAutoCompleteResult(inputForAutoComplete, resultCount),
      getJumpToResult(inputForAutoComplete, resultCount)
    ]);
    setJumpToResult(!ontologyId ? jumpToResult : []);
    setAutoCompleteResult(autoCompleteResult);
  }


  function handleKeyDown(e) {
    if (document.getElementsByClassName("selected-by-arrow-key").length !== 0) {
      return;
    }
    if (e.key === 'Enter') {
      triggerSearch();
    }
  }


  function setSearchUrl(label) {
    let obsoletesFlag = Toolkit.getObsoleteFlagValue();
    return searchUrlFactory.createSearchUrlForAutoSuggestItem({
      label: label,
      ontologyId: ontologyId,
      obsoleteFlag: obsoletesFlag,
      exact: exact,
      fromOntologyPage: !!ontologyId
    });
  }


  function triggerSearch() {
    if (searchQuery.length === 0) {
      return true;
    }
    let searchUrl = setSearchUrl(searchQuery);
    setAutoCompleteResult([]);
    setJumpToResult([]);
    navigator.push(searchUrl);
  }


  function handleJumptoAutocompleteClick(e) {
    let selectedQuery = e.currentTarget.getAttribute("data-value");
    if (selectedQuery) {
      setSearchQuery(selectedQuery);
      document.getElementById("s-field").value = selectedQuery;
    }
    setAutoCompleteResult([]);
    setJumpToResult([]);
  }


  function closeResultBoxWhenClickedOutside(e) {
    if (!autoCompleteRef.current?.contains(e.target) && !jumptToRef.current?.contains(e.target)) {
      setAutoCompleteResult([]);
      setJumpToResult([]);
    }
  }


  function handleExactCheckboxClick(e) {
    searchUrlFactory.setExact({ exact: e.target.checked });
  }

  function handleIncludeImprtedCheckboxClick(e) {
    searchUrlFactory.setIncludeImported({ includeImported: e.target.checked });
    appContext.setIncludeImportedTerms(e.target.checked);
  }

  function handleObsoletesCheckboxClick(e) {
    Toolkit.setObsoleteInStorageAndUrl(e.target.checked);
  }


  async function handleAdvancedSearchToggle() {
    searchUrlFactory.setAdvancedSearchEnabled({ enabled: !advSearchEnabled });
    setAdvSearchEnabled(!advSearchEnabled);
    let userSettings = { ...appContext.userSettings };
    userSettings.advancedSearchEnabled = !advSearchEnabled;
    appContext.setUserSettings(userSettings);
    await storeUserSettings(userSettings);
  }


  useEffect(() => {
    document.getElementById("s-field").value = searchUrlFactory.decodeSearchQuery();
    document.addEventListener('mousedown', closeResultBoxWhenClickedOutside, true);
    document.addEventListener("keydown", keyboardNavigationForJumpto, false);
    if (Toolkit.getObsoleteFlagValue()) {
      document.getElementById("obsoletes-checkbox").checked = true;
    }
    document.getElementById("exact-checkbox").checked = exact;
    appContext.setIncludeImportedTerms(!(searchUrlFactory.includeImported === "false"));
    document.getElementById("include-imported-checkbox").checked = !(searchUrlFactory.includeImported === "false");
    return () => {
      document.removeEventListener('mousedown', closeResultBoxWhenClickedOutside, true);
      document.removeEventListener("keydown", keyboardNavigationForJumpto, false);
    }
  }, []);

  useEffect(() => {
    if (appContext.userSettings.advancedSearchEnabled) {
      setAdvSearchEnabled(appContext.userSettings.advancedSearchEnabled);
    }
  }, [appContext.userSettings.advancedSearchEnabled]);

  useEffect(() => {
    setOntologyId(OntologyLib.getCurrentOntologyIdFromUrlPath());
  }, [location.pathname]);


  return (
    <>
      <RenderSearchForm
        ontologyId={ontologyId}
        handleSearchInputChange={handleSearchInputChange}
        handleKeyDown={handleKeyDown}
        triggerSearch={triggerSearch}
        autoCompleteResult={autoCompleteResult}
        autoCompleteRef={autoCompleteRef}
        setSearchUrl={setSearchUrl}
        jumpToResult={jumpToResult}
        jumptToRef={jumptToRef}
        handleExactCheckboxClick={handleExactCheckboxClick}
        handleObsoletesCheckboxClick={handleObsoletesCheckboxClick}
        handleIncludeImprtedCheckboxClick={handleIncludeImprtedCheckboxClick}
        advSearchEnabled={advSearchEnabled}
        handleAdvancedSearchToggle={handleAdvancedSearchToggle}
        optionClickCallback={handleJumptoAutocompleteClick}
      />
      <AdvancedSearch advSearchEnabled={advSearchEnabled} />
    </>
  );
}

export default SearchForm;
