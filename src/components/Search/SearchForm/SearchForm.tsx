import { useState, useEffect, useRef, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import RenderSearchForm from "./RenderSearchForm";
import AdvancedSearch from "./AdvancedSearch";
import { keyboardNavigationForJumpto } from "./KeyboardNavigation";
import {
  getJumpToResult,
  getAutoCompleteResult,
  getOntologyJumpToResult,
} from "../../../api/search";
import Toolkit from "../../../Libs/Toolkit";
import OntologyLib from "../../../Libs/OntologyLib";
import "../../layout/jumpTo.css";
import "../../layout/searchBar.css";
import SearchUrlFactory from "../../../UrlFactory/SearchUrlFactory";
import { AppContext } from "../../../context/AppContext";
import { storeUserSettings } from "../../../api/user";
import SearchLib from "../../../Libs/searchLib";
import { SuggestAndSelectApiInput } from "../../../api/types/searchApiTypes";
import { TsOntology } from "../../../concepts";
import * as SiteUrlParamNames from "../../../UrlFactory/UrlParamNames";

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

  let advSearchEnabledLoad =
    searchUrlFactory.advancedSearchEnabled === "true"
      ? true
      : appContext.userSettings.advancedSearchEnabled;
  advSearchEnabledLoad = advSearchEnabledLoad ? true : false;

  const [searchQuery, setSearchQuery] = useState(
    searchUrlFactory.searchQuery ? searchUrlFactory.searchQuery : "",
  );
  const [ontologyId, setOntologyId] = useState(
    OntologyLib.getCurrentOntologyIdFromUrlPath(),
  );
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const [jumpToResult, setJumpToResult] = useState([]);
  const [advSearchEnabled, setAdvSearchEnabled] =
    useState(advSearchEnabledLoad);
  const [ontologyJumpToResult, setOntologyJumpToResult] = useState<
    TsOntology[]
  >([]);

  const resultCount = 5;
  const autoCompleteRef = useRef(null);
  const jumptToRef = useRef(null);
  const lastSearchQuery = useRef(searchQuery);
  const exact = searchUrlFactory.exact === "true";
  const obsoletes = Toolkit.getObsoleteFlagValue();

  const searchUnderIris = SearchLib.decodeSearchUnderIrisFromUrl();
  const searchUnderAllIris = SearchLib.decodeSearchUnderAllIrisFromUrl();

  const debouncingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function closeResultBoxes() {
    setAutoCompleteResult([]);
    setJumpToResult([]);
    setOntologyJumpToResult([]);
  }

  function cancelPendingSuggestions() {
    if (debouncingTimer.current) {
      clearTimeout(debouncingTimer.current);
      debouncingTimer.current = null;
    }
    lastSearchQuery.current = "";
  }

  function cancelSuggestions() {
    cancelPendingSuggestions();
    closeResultBoxes();
  }

  async function runAutoCompleteAndJumpTo(searchQuery: string) {
    let inputForAutoComplete: SuggestAndSelectApiInput = {};
    if (searchQuery.length === 0) {
      closeResultBoxes();
      return true;
    }
    setSearchQuery(searchQuery);
    inputForAutoComplete["searchQuery"] = searchQuery.trim();
    inputForAutoComplete["obsoletes"] = Toolkit.getObsoleteFlagValue();
    if (appContext.userSettings.userCollectionEnabled) {
      inputForAutoComplete["ontologyIds"] =
        appContext.userSettings.activeCollection.ontology_ids.join(",");
    }
    inputForAutoComplete["ontologyIds"] =
      searchUrlFactory.ontologies.length !== 0
        ? searchUrlFactory.ontologies.join(",")
        : inputForAutoComplete["ontologyIds"];
    inputForAutoComplete["ontologyIds"] = ontologyId
      ? ontologyId
      : inputForAutoComplete["ontologyIds"];
    inputForAutoComplete["types"] =
      searchUrlFactory.types.length !== 0
        ? searchUrlFactory.types.join(",")
        : null;
    if (process.env.REACT_APP_PROJECT_NAME === "") {
      /* check if it is TIB General to read the collection ids from url. Else, set the project ID such as NFDI4CHEM.
       */
      inputForAutoComplete["collectionIds"] =
        searchUrlFactory.collections.length !== 0
          ? searchUrlFactory.collections.join(",")
          : null;
    } else if (!ontologyId && !appContext.userSettings.userCollectionEnabled) {
      /* 
        If ontologyId exist, it means the user is doing the search from an ontology page and collection is NOT needed.
        If userCollectionEnabled is true, it means the user is doing the search from the user collection page and collection is NOT needed.
      */
      inputForAutoComplete["collectionIds"] =
        process.env.REACT_APP_PROJECT_NAME;
    }
    inputForAutoComplete["searchUnderIris"] = searchUnderIris;
    inputForAutoComplete["searchUnderAllIris"] = searchUnderAllIris;

    let [autoCompleteResult, jumpToResult, ontologyJumpToResult] =
      await Promise.all([
      getAutoCompleteResult(inputForAutoComplete, resultCount),
      getJumpToResult(inputForAutoComplete, resultCount),
      getOntologyJumpToResult(searchQuery),
    ]);
    if (lastSearchQuery.current.trim() !== searchQuery.trim()) {
      return;
    }
    setJumpToResult(!ontologyId ? jumpToResult : []);
    setAutoCompleteResult(autoCompleteResult);
    setOntologyJumpToResult(ontologyJumpToResult);
  }

  async function handleSearchInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const searchQuery = e.target.value;
    setSearchQuery(searchQuery);
    lastSearchQuery.current = searchQuery;
    if (debouncingTimer.current) {
      clearTimeout(debouncingTimer.current);
    }
    if (!searchQuery.trim()) {
      closeResultBoxes();
      return;
    }
    debouncingTimer.current = setTimeout(() => {
      runAutoCompleteAndJumpTo(searchQuery);
    }, 200);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      closeResultBoxes();
      return;
    }
    if (document.getElementsByClassName("selected-by-arrow-key").length !== 0) {
      return;
    }
    if (e.key === "Enter") {
      triggerSearch();
    }
  }

  function setSearchUrl(label: string) {
    return searchUrlFactory.createSearchUrlForAutoSuggestItem({
      label: label.trim(),
      ontologyId: ontologyId,
      obsoleteFlag: obsoletes,
      exact: exact,
      fromOntologyPage: !!ontologyId,
    });
  }

  function triggerSearch() {
    if (searchQuery.trim().length === 0) {
      cancelSuggestions();
      return true;
    }
    let searchUrl = setSearchUrl(searchQuery);
    cancelSuggestions();
    navigator.push(searchUrl);
  }

  function handleJumptoAutocompleteClick(e: React.MouseEvent) {
    let selectedQuery = e.currentTarget.getAttribute("data-value");
    if (selectedQuery) {
      setSearchQuery(selectedQuery);
      document.getElementById("s-field").value = selectedQuery;
    }
    cancelSuggestions();
  }

  function closeResultBoxWhenClickedOutside(e: MouseEvent) {
    if (
      !autoCompleteRef.current?.contains(e.target) &&
      !jumptToRef.current?.contains(e.target)
    ) {
      closeResultBoxes();
    }
  }

  function closeResultBoxOnEscape(e: KeyboardEvent) {
    if (e.key === "Escape") {
      closeResultBoxes();
    }
  }

  function setSearchCheckboxUrl(name: string, checked: boolean) {
    const params = new URLSearchParams(location.search);
    params.set(name, String(checked));
    navigator.push(location.pathname + "?" + params.toString());
  }

  function handleExactCheckboxClick(e: React.MouseEvent<HTMLInputElement>) {
    setSearchCheckboxUrl(SiteUrlParamNames.Exact, e.currentTarget.checked);
  }

  function handleIncludeImprtedCheckboxClick(
    e: React.MouseEvent<HTMLInputElement>,
  ) {
    setSearchCheckboxUrl(
      SiteUrlParamNames.IncludeImported,
      e.currentTarget.checked,
    );
    appContext.setIncludeImportedTerms(e.currentTarget.checked);
  }

  function handleObsoletesCheckboxClick(e: React.MouseEvent<HTMLInputElement>) {
    localStorage.setItem("obsoletes", String(e.currentTarget.checked));
    setSearchCheckboxUrl(SiteUrlParamNames.Obsoletes, e.currentTarget.checked);
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
    document.getElementById("s-field").value =
      searchUrlFactory.decodeSearchQuery();
    document.addEventListener(
      "mousedown",
      closeResultBoxWhenClickedOutside,
      true,
    );
    document.addEventListener("keydown", keyboardNavigationForJumpto, false);
    document.addEventListener("keydown", closeResultBoxOnEscape, false);
    return () => {
      cancelPendingSuggestions();
      document.removeEventListener(
        "mousedown",
        closeResultBoxWhenClickedOutside,
        true,
      );
      document.removeEventListener(
        "keydown",
        keyboardNavigationForJumpto,
        false,
      );
      document.removeEventListener("keydown", closeResultBoxOnEscape, false);
    };
  }, []);

  useEffect(() => {
    appContext.setIncludeImportedTerms(
      new SearchUrlFactory().includeImported !== "false",
    );
  }, [location.search]);

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
        ontologyJumpToResult={ontologyJumpToResult}
        exact={exact}
        obsoletes={obsoletes}
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
};

export default SearchForm;
