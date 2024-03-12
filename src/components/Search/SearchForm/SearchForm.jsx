import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import RenderSearchForm from './RenderSearchForm';
import AdvancedSearch from './AdvancedSearch';
import { keyboardNavigationForJumpto } from '../../Ontologies/JumpTo/KeyboardNavigation';
import { getJumpToResult, getAutoCompleteResult } from '../../../api/search';
import Toolkit from '../../../Libs/Toolkit';
import OntologyLib from '../../../Libs/OntologyLib';
import '../../layout/jumpTo.css';
import '../../layout/searchBar.css';




const SearchForm = () => {

  let currentUrlParams = new URL(window.location).searchParams;    
  let searchQueryInUrl = currentUrlParams.get('q') ? currentUrlParams.get('q') : "";

  const [searchQuery, setSearchQuery] = useState(searchQueryInUrl);    
  const [ontologyId, setOntologyId] = useState(OntologyLib.getCurrentOntologyIdFromUrlPath());
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const [jumpToResult, setJumpToResult] = useState([]);  
  const [advSearchEnabled, setAdvSearchEnabled] = useState(currentUrlParams.get('advsearch') === "true" ? true : false);  

  const resultCount = 5;
  const autoCompleteRef = useRef(null);
  const jumptToRef = useRef(null);
  const exact = currentUrlParams.get('exact') === "true" ? true : false;

  const history = useHistory();



  async function handleSearchInputChange(e){
    let currentUrlParams = new URL(window.location).searchParams; 
    let inputForAutoComplete = {};    
    let searchQuery = e.target.value;    
    if(searchQuery.length === 0){      
      setJumpToResult([]);
      setAutoCompleteResult([]);
      return true;
    }
    inputForAutoComplete['searchQuery'] = searchQuery;    
    inputForAutoComplete['obsoletes'] = Toolkit.getObsoleteFlagValue();
    inputForAutoComplete['ontologyIds'] = currentUrlParams.get('ontology') ? currentUrlParams.getAll('ontology').join(',') : null;
    inputForAutoComplete['ontologyIds'] = ontologyId ? ontologyId : inputForAutoComplete['ontologyIds'];
    inputForAutoComplete['types'] = currentUrlParams.get('type') ? currentUrlParams.getAll('type').join(',') : null;    
    if(process.env.REACT_APP_PROJECT_NAME === "" ){
      // check if it is TIB General to read the collection ids from url. Else, set the project ID such as NFDI4CHEM
      inputForAutoComplete['collectionIds'] = currentUrlParams.get('collection') ? currentUrlParams.getAll('collection').join(',') : null;
    }
    else{
      inputForAutoComplete['collectionIds'] = process.env.REACT_APP_PROJECT_NAME;
    }
    
    let [autoCompleteResult, jumpToResult] = await Promise.all([
      getAutoCompleteResult(inputForAutoComplete, resultCount),
      getJumpToResult(inputForAutoComplete, resultCount)
    ]);        
    setJumpToResult(!ontologyId ? jumpToResult : []);
    setAutoCompleteResult(autoCompleteResult);
    setSearchQuery(inputForAutoComplete['searchQuery']);
  }



  function handleKeyDown(e){
    if (e.key === 'Enter') {
      triggerSearch();
    }
  }


  
  function setSearchUrl(label){
    let searchUrl = new URL(window.location);
    let obsoletesFlag = Toolkit.getObsoleteFlagValue();
    searchUrl.pathname =  process.env.REACT_APP_PROJECT_SUB_PATH + "/search";          
    searchUrl.searchParams.delete('iri');
    searchUrl.searchParams.delete('issueType');
    searchUrl.searchParams.set('q', label);
    searchUrl.searchParams.set('page', 1);    
    ontologyId && searchUrl.searchParams.set('ontology', ontologyId); 
    obsoletesFlag && searchUrl.searchParams.set('obsoletes', obsoletesFlag);
    exact && searchUrl.searchParams.set('exact', exact);
    return searchUrl.toString();
  }
  
  
  
  function triggerSearch(){
    if(searchQuery.length === 0){
      return true;
    }
    let searchUrl = setSearchUrl(searchQuery);    
    setOntologyId(null);  
    window.location.replace(searchUrl);
  }


  function closeResultBoxWhenClickedOutside(e){       
    if(!autoCompleteRef.current?.contains(e.target) && !jumptToRef.current?.contains(e.target)){
      setAutoCompleteResult([]);
      setJumpToResult([]);
    }
  }


  function handleExactCheckboxClick(e){
    let searchUrl = new URL(window.location);    
    searchUrl.searchParams.set('exact', e.target.checked); 
    history.replace({...history.location, search: searchUrl.searchParams.toString()});
  }



  function handleObsoletesCheckboxClick(e){        
    let newUrl = Toolkit.setObsoleteAndReturnNewUrl(e.target.checked);
    history.replace(newUrl);    
  }


  function handleAdvancedSearchToggle(){
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set('advsearch', !advSearchEnabled);
    history.push(window.location.pathname + "?" + currentUrlParams.toString());     
    setAdvSearchEnabled(!advSearchEnabled);
}



  useEffect(() => {
    document.addEventListener('mousedown', closeResultBoxWhenClickedOutside, true);
    document.addEventListener("keydown", keyboardNavigationForJumpto, false);    
    let cUrl = window.location.href;        
    if(cUrl.includes("q=")){
      cUrl = cUrl.split("q=")[1];
      cUrl = cUrl.split("&")[0];
      cUrl = decodeURIComponent(cUrl);
      cUrl = cUrl.replaceAll("+", " ");
      document.getElementById("s-field").value = cUrl;
    }
    if(Toolkit.getObsoleteFlagValue()){ document.getElementById("obsoletes-checkbox").checked = true;}   
    if(exact){ document.getElementById("exact-checkbox").checked = true;}
    // if(advSearchEnabled){document.getElementById("adv-search-toggle").checked = true}      
    return () => {
      document.removeEventListener('mousedown', closeResultBoxWhenClickedOutside, true);
      document.removeEventListener("keydown", keyboardNavigationForJumpto, false);
    }
  }, []);


  return(
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
        advSearchEnabled={advSearchEnabled}
        handleAdvancedSearchToggle={handleAdvancedSearchToggle}
      />
      <AdvancedSearch  advSearchEnabled={advSearchEnabled} />                    
    </>     
  );
}

export default SearchForm;
