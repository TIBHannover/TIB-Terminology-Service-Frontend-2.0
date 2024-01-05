import { useState, useEffect } from 'react';
import {setJumpResultButtons} from './SearchFormHelpers';
import {keyboardNavigationForJumpto} from '../Ontologies/JumpTo/KeyboardNavigation';
import { searchOls, getAutoCompleteResult } from '../../api/fetchData';
import '../layout/jumpTo.css';
import '../layout/searchBar.css';



const SearchForm = (props) => {

  let currentUrlParams = new URL(window.location).searchParams;
  let obsoleteFlagInUrl = currentUrlParams.get('obsoletes') === "true" ? true : false; 
  let exactFlagInUrl = currentUrlParams.get('exact') === "true" ? true : false;
  
  let currentUrlPath = window.location.pathname;
  currentUrlPath = currentUrlPath.split('ontologies/');
  let ontologyIdInUrl = null;
  if(currentUrlPath.length === 2 && currentUrlPath[1] !== ""){
    ontologyIdInUrl = currentUrlPath.includes('/') ? currentUrlPath.split('/')[0].trim() : currentUrlPath.trim();;
  }


  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [obsoletes, setObsoletes] = useState(obsoleteFlagInUrl);
  const [exact, setExact] = useState(exactFlagInUrl);
  const [ontologyId, setOntologyId] = useState(ontologyIdInUrl);
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const [jumpToResult, setJumpToResult] = useState([]);



  function setPlaceHolder(){    
    if(ontologyId){
      return ("Search in \n" + ontologyId);
    }
    return("Search for ontology, term, properties and individuals");    
  }


  async function handleSearchInputChange(e){
    let searchQuery = e.target.value;



    
  }


  function handleKeyDown(e){
    if (e.key === 'Enter') {
      this.submitHandler();
    }
  }


  function submitHandler(){                      
      let enteredTerm = document.getElementById('s-field').value;        
      if(enteredTerm !== ""){
        let url = new URL(window.location);    
        url.searchParams.delete('q');
        url.searchParams.delete('page');
        url.searchParams.append('q', enteredTerm);
        url.searchParams.append('page', 1);
        url.pathname = "/ts/search";
        window.location.replace(url);
      }
      if(enteredTerm !== "" && ontologyId){
        let url = new URL(window.location);    
        url.searchParams.delete('q');
        url.searchParams.delete('page');
        url.searchParams.append('q', enteredTerm);
        url.searchParams.append('ontology', (ontologyId).toUpperCase());
        url.searchParams.append('page', 1);
        url.pathname = "/ts/search";
        window.location.replace(url);
      }
  }


  function renderAutoCompleteResult(){
    let resultList = [];
    let key = 0;
    for(let result of autoCompleteResult){
      let resultLink = process.env.REACT_APP_PROJECT_SUB_PATH + '/search?q=' + encodeURIComponent(result['autosuggest']);
      resultLink = (ontologyId) ? (resultLink + `&ontology=${(ontologyId).toUpperCase()}`) : resultLink;
      resultList.push(
        <a href={resultLink} key={key} className="container">   
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
    return true;
  }


  function handleObsoletesCheckboxClick(e){
    return true;
  }




  



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
              <button className='btn btn-outline-secondary search-btn' type='button' onClick={submitHandler}>Search </button>  
            </div>
          </div>
                                
          {autoCompleteResult.length !== 0 &&
            <div id = "autocomplete-container" className="col-md-12">
              {renderAutoCompleteResult()}
            </div>
          }
          {/* {jumpToResult.length !== 0 && !this.state.urlPath &&
            <div ref={this.autoRef} id = "jumpresult-container" className="col-md-12 justify-content-md-center"></div>
          } */}
          {jumpToResult.length !== 0 && !ontologyId &&
            <div className="col-md-12 justify-content-md-center jumpto-container jumpto-search-container" id="jumpresult-container" >
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
            <input type="checkbox" className='label-pos' id="obsoletes-checkbox" value="Obsolete results" onClick={handleObsoletesCheckboxClick()}/><label className="exact-label">Obsolete terms</label>
          </div>
      </div>
    </>            
  )
}

export default SearchForm;
  

      // async handleChange(enteredTerm){
      //   enteredTerm = enteredTerm.target.value               
      //   if (enteredTerm.length > 0 && !this.state.urlPath){ 
      //     let params = new URLSearchParams(document.location.search);
      //     let selectedType = params.getAll("type");
      //     selectedType = selectedType.map(onto => onto.toLowerCase());       
      //     let selectedOntology = params.getAll("ontology")         
      //     selectedOntology = selectedOntology.map(onto => onto.toLowerCase());
      //     let selectedCollection = params.getAll("collection") 
      //     let obsoletes = params.get('obsoletes')           
      //     if(process.env.REACT_APP_PROJECT_ID == "general"){                        
      //       let searchResult =  await searchOls(enteredTerm, selectedOntology);
      //       let jumpResult =  await getAutoCompleteResult(enteredTerm, selectedOntology, selectedType, obsoletes);
      //       this.setState({
      //         searchResult: searchResult,
      //         jumpResult: jumpResult,
      //         result: true,
      //         enteredTerm: enteredTerm
      //       });         
      //       else if(selectedType || selectedOntology){
      //         let jumpResult = await fetch(process.env.REACT_APP_API_URL + `/select?q=${enteredTerm}&rows=5&type=${selectedType}&ontology=${selectedOntology}`,{
      //           mode: 'cors',
      //           headers: apiHeaders(),
      //         })
      //         jumpResult = (await jumpResult.json())['response']['docs']
      //         this.setState({
      //           jumpResult: jumpResult,
      //           result: true,
      //           enteredTerm: enteredTerm
      //         });
      //       }
      //       else if(selectedCollection){
      //       let searchResult = await fetch(process.env.REACT_APP_API_URL + `/suggest?q=${enteredTerm}&schema=collection&classification=${selectedCollection}&rows=5`,{
      //         mode: 'cors',
      //         headers: apiHeaders(),
      //       })
      //       searchResult =  (await searchResult.json())['response']['docs'];
      //       let jumpResult = await fetch(process.env.REACT_APP_API_URL + `/select?q=${enteredTerm}&schema=collection&classification=${selectedCollection}&rows=5`,{
      //         mode: 'cors',
      //         headers: apiHeaders(),
      //       })
      //       jumpResult = (await jumpResult.json())['response']['docs'];
      //       this.setState({
      //         searchResult: searchResult,
      //         jumpResult: jumpResult,
      //         result: true,
      //         enteredTerm: enteredTerm
      //       });
      //       }
      //       if(obsoletes){
      //         let jumpResult = await fetch(process.env.REACT_APP_API_URL + `/select?q=${enteredTerm}&obsoletes=true&rows=5`,{
      //           mode: 'cors',
      //           headers: apiHeaders(),
      //         })
      //         jumpResult = (await jumpResult.json())['response']['docs'];
      //         console.info(jumpResult)
      //         this.setState({
      //           jumpResult: jumpResult,
      //           result: true,
      //           enteredTerm: enteredTerm
      //         });

      //       }
      //       else {
      //       let searchResult = await fetch(process.env.REACT_APP_API_URL + `/suggest?q=${enteredTerm}&rows=5`,{
      //         mode: 'cors',
      //         headers: apiHeaders(),
      //       })
      //       searchResult =  (await searchResult.json())['response']['docs'];
      //       let jumpResult = await fetch(process.env.REACT_APP_API_URL + `/select?q=${enteredTerm}&rows=5`,{
      //         mode: 'cors',
      //         headers: apiHeaders(),
      //       })
      //       jumpResult = (await jumpResult.json())['response']['docs'];
      //       this.setState({
      //         searchResult: searchResult,
      //         jumpResult: jumpResult,
      //         result: true,
      //         enteredTerm: enteredTerm
      //       });

      //       }           
      //     }
      //     else { 
      //       let col = (process.env.REACT_APP_PROJECT_ID).toUpperCase();
      //       if(selectedOntology){
      //         let searchResult = await fetch(process.env.REACT_APP_API_URL + `/suggest?q=${enteredTerm}&rows=5&ontology=${selectedOntology}`,{
      //           mode: 'cors',
      //           headers: apiHeaders(),
      //         })
      //         searchResult =  (await searchResult.json())['response']['docs'];
      //         let jumpResult = await fetch(process.env.REACT_APP_API_URL + `/select?q=${enteredTerm}&rows=5&ontology=${selectedOntology}`,{
      //           mode: 'cors',
      //           headers: apiHeaders(),
      //         })
      //         jumpResult = (await jumpResult.json())['response']['docs'];
      //         this.setState({
      //           searchResult: searchResult,
      //           jumpResult: jumpResult,
      //           result: true,
      //           enteredTerm: enteredTerm
      //         });
      //       }
      //       else {
      //         let searchResult = await fetch(process.env.REACT_APP_API_URL + `/suggest?q=${enteredTerm}&schema=collection&classification=${col}&rows=5`,{
      //           mode: 'cors',
      //           headers: apiHeaders(),
      //         })
      //         searchResult =  (await searchResult.json())['response']['docs'];
      //         let jumpResult = await fetch(process.env.REACT_APP_API_URL + `/select?q=${enteredTerm}&schema=collection&classification=${col}&rows=5`,{
      //           mode: 'cors',
      //           headers: apiHeaders(),
      //         })
      //         jumpResult = (await jumpResult.json())['response']['docs'];
      //         this.setState({
      //           searchResult: searchResult,
      //           jumpResult: jumpResult,
      //           result: true,
      //           enteredTerm: enteredTerm
      //         });
      //       }            
      //     }
      //   }
      //   else if(enteredTerm.length > 0 && this.state.urlPath){
      //     let ontoSearchResult = await fetch(process.env.REACT_APP_API_URL + `/suggest?q=${enteredTerm}&rows=5&ontology=${this.state.ontologyId}`,{
      //       mode: 'cors',
      //       headers: apiHeaders(),
      //     })
      //     ontoSearchResult = (await ontoSearchResult.json())['response']['docs'];
      //     this.setState({
      //       searchResult: ontoSearchResult,
      //       result: true 
      //     });
      //   }
      //   else if (enteredTerm.length == 0){
      //       this.setState({
      //           result: false,
      //           enteredTerm: ""
      //       });          
      //   }
      // }
