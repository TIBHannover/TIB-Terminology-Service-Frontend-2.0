import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import {setJumpResultButtons} from './SearchFormHelpers';
import { keyboardNavigationForJumpto } from '../../Ontologies/JumpTo/KeyboardNavigation';
import { getAutoCompleteResult, getJumpToResult } from '../../../api/fetchData';
import '../../layout/jumpTo.css';
import '../../layout/searchBar.css';



const SearchForm = (props) => {

  let currentUrlParams = new URL(window.location).searchParams;
  let obsoleteFlagInUrl = currentUrlParams.get('obsoletes') === "true" ? true : false; 
  let exactFlagInUrl = currentUrlParams.get('exact') === "true" ? true : false;
  let searchQueryInUrl = currentUrlParams.get('q') ? currentUrlParams.get('q') : "";
  
  let currentUrlPath = window.location.pathname;
  currentUrlPath = currentUrlPath.split('ontologies/');
  let ontologyIdInUrl = null;
  if(currentUrlPath.length === 2 && currentUrlPath[1] !== ""){
    ontologyIdInUrl = currentUrlPath[1].includes('/') ? currentUrlPath[1].split('/')[0].trim() : currentUrlPath[1].trim();;
  }


  const [searchQuery, setSearchQuery] = useState(searchQueryInUrl);  
  const [obsoletes, setObsoletes] = useState(obsoleteFlagInUrl);
  const [exact, setExact] = useState(exactFlagInUrl);
  const [ontologyId, setOntologyId] = useState(ontologyIdInUrl);
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const [jumpToResult, setJumpToResult] = useState([]);

  const resultCount = 5;
  const resultBoxesRef = useRef(null);
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
    inputForAutoComplete['collectionIds'] = currentUrlParams.get('collection') ? currentUrlParams.getAll('collection').join(',') : null;    
    let [autoCompleteResult, jumpToResult] = await Promise.all([
      getAutoCompleteResult(inputForAutoComplete, resultCount),
      getJumpToResult(inputForAutoComplete, resultCount)
    ]);        
    setJumpToResult(jumpToResult);
    setAutoCompleteResult(autoCompleteResult);
    setSearchQuery(inputForAutoComplete['searchQuery']);
  }


  function handleKeyDown(e){
    if (e.key === 'Enter') {
      triggerSearch();
    }
  }


  function triggerSearch(){
    if(searchQuery.length === 0){
      return true;
    }
    let searchUrl = new URL(window.location);
    searchUrl.pathname = "/ts/search";          
    searchUrl.searchParams.set('q', searchQuery);
    searchUrl.searchParams.set('page', 1);    
    ontologyId && searchUrl.searchParams.set('ontology', ontologyId.toUpperCase());       
    setOntologyId(null);  
    window.location.replace(searchUrl);
  }



  function renderAutoCompleteResult(){
    let resultList = [];
    let key = 0;
    for(let result of autoCompleteResult){
      let resultLink = process.env.REACT_APP_PROJECT_SUB_PATH + '/search?q=' + encodeURIComponent(result['autosuggest']);
      resultLink = (ontologyId) ? (resultLink + `&ontology=${(ontologyId).toUpperCase()}`) : resultLink;
      resultList.push(
        <a href={''} key={key} className="container">   
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
    setExact(e.target.checked);
  }


  function handleObsoletesCheckboxClick(e){
    let searchUrl = new URL(window.location);
    setObsoletes(e.target.checked);
    searchUrl.searchParams.set('obsoletes', e.target.checked); 
    history.replace({...history.location, search: searchUrl.searchParams.toString()});
  }


  function closeResultBoxWhenClickedOutside(e){    
    if(!resultBoxesRef.current?.contains(e.target)){
      setAutoCompleteResult([]);
      setJumpToResult([]);
    }
  }



  useEffect(() => {
    document.addEventListener('mousedown', closeResultBoxWhenClickedOutside, true);
    document.addEventListener("keydown", keyboardNavigationForJumpto, false);
    if(obsoletes){ document.getElementById("obsoletes-checkbox").checked = true;}   
    return () => {
      document.removeEventListener('mousedown', closeResultBoxWhenClickedOutside, true);
      document.removeEventListener("keydown", keyboardNavigationForJumpto, false);
    }
  }, []);




  return(
    <>
      <div className='row site-header-searchbox-holder'>
        <div className='col-sm-12 search-bar-container'>
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
            <div id = "autocomplete-container" className="col-md-12" ref={resultBoxesRef}>
              {renderAutoCompleteResult()}
            </div>
          }         
          {jumpToResult.length !== 0 && !ontologyId &&
            <div ref={resultBoxesRef} className="col-md-12 justify-content-md-center jumpto-container jumpto-search-container" id="jumpresult-container" >
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
