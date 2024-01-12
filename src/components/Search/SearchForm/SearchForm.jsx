import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import {setJumpResultButtons} from './SearchFormHelpers';
import { keyboardNavigationForJumpto } from '../../Ontologies/JumpTo/KeyboardNavigation';
import { getAutoCompleteResult, getJumpToResult } from '../../../api/fetchData';
import '../../layout/jumpTo.css';
import '../../layout/searchBar.css';
import Toolkit from '../../common/Toolkit';



const SearchForm = (props) => {

  let currentUrlParams = new URL(window.location).searchParams;
  let obsoleteFlag = Toolkit.getObsoleteFlagValue();
  let exactFlagInUrl = currentUrlParams.get('exact') === "true" ? true : false;
  let searchQueryInUrl = currentUrlParams.get('q') ? currentUrlParams.get('q') : "";
  
  let currentUrlPath = window.location.pathname;
  currentUrlPath = currentUrlPath.split('ontologies/');
  let ontologyIdInUrl = null;
  if(currentUrlPath.length === 2 && currentUrlPath[1] !== ""){
    ontologyIdInUrl = currentUrlPath[1].includes('/') ? currentUrlPath[1].split('/')[0].trim() : currentUrlPath[1].trim();;
  }


  const [searchQuery, setSearchQuery] = useState(searchQueryInUrl);  
  const [obsoletes, setObsoletes] = useState(obsoleteFlag);
  const [exact, setExact] = useState(exactFlagInUrl);
  const [ontologyId, setOntologyId] = useState(ontologyIdInUrl);
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const [jumpToResult, setJumpToResult] = useState([]);

  const resultCount = 5;
  const autoCompleteRef = useRef(null);
  const jumptToRef = useRef(null);
  const history = useHistory();


  function setPlaceHolder(){    
    if(ontologyId){
      return ("Search in \n" + ontologyId);
    }
    return("Search for ontology, term, properties and individuals");    
  }


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
    inputForAutoComplete['obsoletes'] = obsoletes;
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
    searchUrl.pathname = "/ts/search";          
    searchUrl.searchParams.set('q', label);
    searchUrl.searchParams.set('page', 1);    
    ontologyId && searchUrl.searchParams.set('ontology', ontologyId); 
    obsoletes && searchUrl.searchParams.set('obsoletes', obsoletes);
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


  function renderAutoCompleteResult(){
    let resultList = [];
    let key = 0;
    for(let result of autoCompleteResult){      
      resultList.push(
        <a href={setSearchUrl(result['autosuggest'])} key={key} className="container">   
          <div className="autocomplete-item item-for-navigation">
                {result['autosuggest']}
          </div>
        </a>             
      )
      key++;      
    }
    return resultList
  }


  function renderJumpToResult(){
    let resultList = []
    for(let result of jumpToResult){
      resultList.push(
        <div className="jump-autocomplete-container">
           {setJumpResultButtons(result)}
        </div>          
      )
    }
    return resultList;
  }


  function handleExactCheckboxClick(e){
    let searchUrl = new URL(window.location);
    setExact(e.target.checked);
    searchUrl.searchParams.set('exact', e.target.checked); 
    history.replace({...history.location, search: searchUrl.searchParams.toString()});
  }


  function handleObsoletesCheckboxClick(e){
    let searchUrl = new URL(window.location);
    setObsoletes(e.target.checked);
    searchUrl.searchParams.set('obsoletes', e.target.checked); 
    history.replace({...history.location, search: searchUrl.searchParams.toString()});
    localStorage.setItem("obsoletes", e.target.checked);
  }


  function closeResultBoxWhenClickedOutside(e){       
    if(!autoCompleteRef.current?.contains(e.target) && !jumptToRef.current?.contains(e.target)){
      setAutoCompleteResult([]);
      setJumpToResult([]);
    }
  }



  useEffect(() => {
    document.addEventListener('mousedown', closeResultBoxWhenClickedOutside, true);
    document.addEventListener("keydown", keyboardNavigationForJumpto, false);
    if(obsoletes){ document.getElementById("obsoletes-checkbox").checked = true;}   
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
      <div className='row site-header-searchbox-holder'>
        <div className='col-sm-9 search-bar-container'>
          <div class="input-group input-group-lg">                              
            <input 
                type="text" 
                class="form-control search-input" 
                placeholder={setPlaceHolder()}
                aria-describedby="basic-addon2"
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyDown}
                id="s-field"                    
              />
            <div class="input-group-append">
              <button className='btn btn-outline-secondary search-btn' type='button' onClick={triggerSearch}>Search </button>  
            </div>
          </div>
                                
          {autoCompleteResult.length !== 0 &&
            <div id = "autocomplete-container" className="col-md-12" ref={autoCompleteRef}>
              {renderAutoCompleteResult()}
            </div>
          }         
          {jumpToResult.length !== 0 && !ontologyId &&
            <div ref={jumptToRef} className="col-md-12 justify-content-md-center jumpto-container jumpto-search-container" id="jumpresult-container" >
              <div>
                <h4>Jump To</h4>
                {renderJumpToResult()}
              </div>
            </div>
          }                                    

          {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" &&
            <p>
              <span class="examples" >Examples: <a class="example-link" href="search?q=electric+vehicle">electric vehicle</a>,
              <a class="example-link" href="search?q=agent">agent</a></span>
            </p>
          }
        </div>
      </div>
      <div className='row site-header-search-filters-container'>
          <div className='col-lg-2 col-sm-3'>
            <input type="checkbox" className='label-pos' id="exact-checkbox" value="exact match" onClick={handleExactCheckboxClick}/><label className="exact-label">Exact Match</label> 
          </div>
          <div className='col-lg-2 col-sm-3'>
            <input type="checkbox" className='label-pos' id="obsoletes-checkbox" value="Obsolete results" onClick={handleObsoletesCheckboxClick}/><label className="exact-label">Obsolete terms</label>
          </div>
      </div>
    </>            
  )
}

export default SearchForm;
