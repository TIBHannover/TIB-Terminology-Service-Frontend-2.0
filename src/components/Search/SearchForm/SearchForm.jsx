import { useState, useEffect, useRef } from 'react';
import RenderSearchForm from './RenderSearchForm';
import AdvancedSearch from './AdvancedSearch';
import { useHistory } from 'react-router';
import { keyboardNavigationForJumpto } from '../../Ontologies/JumpTo/KeyboardNavigation';
import { getAutoCompleteResult, getJumpToResult } from '../../../api/fetchData';
import Toolkit from '../../../Libs/Toolkit';
import '../../layout/jumpTo.css';
import '../../layout/searchBar.css';




const SearchForm = (props) => {

  let currentUrlParams = new URL(window.location).searchParams;  
  let exactFlagInUrl = currentUrlParams.get('exact') === "true" ? true : false;
  let searchQueryInUrl = currentUrlParams.get('q') ? currentUrlParams.get('q') : "";
  
  let currentUrlPath = window.location.pathname;
  currentUrlPath = currentUrlPath.split('ontologies/');
  let ontologyIdInUrl = null;
  if(currentUrlPath.length === 2 && currentUrlPath[1] !== ""){
    ontologyIdInUrl = currentUrlPath[1].includes('/') ? currentUrlPath[1].split('/')[0].trim() : currentUrlPath[1].trim();;
  }


  const [searchQuery, setSearchQuery] = useState(searchQueryInUrl);  
  const [exact, setExact] = useState(exactFlagInUrl);
  const [ontologyId, setOntologyId] = useState(ontologyIdInUrl);
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const [jumpToResult, setJumpToResult] = useState([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const resultCount = 5;
  const autoCompleteRef = useRef(null);
  const jumptToRef = useRef(null);
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



  function handleExactCheckboxClick(e){
    let searchUrl = new URL(window.location);
    setExact(e.target.checked);
    searchUrl.searchParams.set('exact', e.target.checked); 
    history.replace({...history.location, search: searchUrl.searchParams.toString()});
  }


  function handleObsoletesCheckboxClick(e){        
    let newUrl = Toolkit.setObsoleteAndReturnNewUrl(e.target.checked);
    history.replace({...history.location, search: newUrl.searchParams.toString()});    
  }


  function closeResultBoxWhenClickedOutside(e){       
    if(!autoCompleteRef.current?.contains(e.target) && !jumptToRef.current?.contains(e.target)){
      setAutoCompleteResult([]);
      setJumpToResult([]);
    }
  }



  function handleAdvancedSearchShowHide(){
    setShowAdvancedSearch(!showAdvancedSearch);
  }



  useEffect(() => {
    document.addEventListener('mousedown', closeResultBoxWhenClickedOutside, true);
    document.addEventListener("keydown", keyboardNavigationForJumpto, false);
    if(Toolkit.getObsoleteFlagValue()){ document.getElementById("obsoletes-checkbox").checked = true;}   
    if(exact){ document.getElementById("exact-checkbox").checked = true;}
    let cUrl = window.location.href;        
    if(cUrl.includes("q=")){
      cUrl = cUrl.split("q=")[1];
      cUrl = cUrl.split("&")[0];
      cUrl = decodeURIComponent(cUrl);
      cUrl = cUrl.replaceAll("+", " ");
      document.getElementById("s-field").value = cUrl;
    }      
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
        handleAdvancedSearchShowHide={handleAdvancedSearchShowHide}
        showAdvancedSearch={showAdvancedSearch}
      />            
      {showAdvancedSearch &&
        <div className='row adv-search-container'>
          <div className='col-sm-12'>
            <AdvancedSearch />
          </div>
        </div>                     
      }      
    </>     
  );
}

export default SearchForm;
