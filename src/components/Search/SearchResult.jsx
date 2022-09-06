import React from 'react'
import { Link } from 'react-router-dom';
import '../layout/Search.css'
import Grid from '@material-ui/core/Grid';
import queryString from 'query-string';
import {getAllCollectionsIds} from '../../api/fetchData';
import Facet from './Facet/facet';
import Pagination from "../common/Pagination/Pagination";


class SearchResult extends React.Component{
    constructor(props){
        super(props)
        this.state = ({
          enteredTerm: "",
          newEnteredTerm: "",
          result: false,
          suggestResult: false,
          searchResult: [],
          exactResult: [],
          suggestionResult: [],
          originalSearchResult: [],
          selectedOntologies: [],
          selectedTypes: [],
          facetFields: [],
          startIndex: 0,
          endIndex: 4,  
          pageNumber: 1,
          pageSize: 5,       
          isLoaded: false,
          isFiltered: false,
          collections: [],
          ontologies: [],
          types: [],
          totalResults: []
        })
        this.createSearchResultList = this.createSearchResultList.bind(this)
        this.handlePagination = this.handlePagination.bind(this)
        this.searching = this.searching.bind(this)
        this.handleSelection = this.handleSelection.bind(this);
        this.createResultList = this.createResultList.bind(this);
        this.suggestionChange = this.suggestionChange.bind(this);
        this.suggestionHandler = this.suggestionHandler.bind(this);
        this.paginationHandler = this.paginationHandler.bind(this);
        this.handleExact = this.handleExact.bind(this);
        this.updateURL = this.updateURL.bind(this);
    }

    async searching(){
      let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
      let enteredTerm = targetQueryParams.q
      if (enteredTerm.length > 0){
        let searchUrl = "https://service.tib.eu/ts4tib/api/search?q=" + enteredTerm + "&rows=" + this.state.pageSize;
        let searchResult = await fetch(searchUrl)
        let resultJson = (await searchResult.json());
        let allCollections = await getAllCollectionsIds();        
        searchResult =  resultJson['response']['docs'];
        let facetFields = resultJson['facet_counts'];
        let paginationResult = resultJson['response']
        let totalResults = paginationResult['numFound']
        this.setState({
          searchResult: searchResult,
          originalSearchResult: searchResult,
          facetFields: facetFields,
          paginationResult: paginationResult,
          totalResults: totalResults,
          result: true,
          isLoaded: true,
          enteredTerm: enteredTerm,
          collections: allCollections
        });  
      }
      else if (enteredTerm.length == 0){
          this.setState({
              result: false,
              searchResult: [],
              facetFields: [],
              originalSearchResult: [],
              isLoaded: true,
              enteredTerm: enteredTerm,
              collections: []
          });  
      }
  }


  async suggestionChange(newEnteredTerm){
    newEnteredTerm = newEnteredTerm.target.value;
  if (newEnteredTerm.length > 0){
      let suggestionResult = await fetch(`https://service.tib.eu/ts4tib/api/suggest?q=${newEnteredTerm}`)
      suggestionResult =  (await suggestionResult.json())['response']['docs'];
   this.setState({
       suggestionResult: suggestionResult,
       suggestResult: true,
       newEnteredTerm: newEnteredTerm
   });
  }
  else if (newEnteredTerm.length == 0){
      this.setState({
          suggestResult: false,
          newEnteredTerm: ""
      });
      
  }
}

async handleExact(){
  if(this.state.enteredTerm.length > 0){
    let searchUrl = `https://service.tib.eu/ts4tib/api/search?q=${this.state.enteredTerm}` + "&exact=on&rows=" + this.state.pageSize;
    let exactResult = await fetch(searchUrl)
    exactResult = (await exactResult.json())['response']['docs'];
    this.setState({
      searchResult: exactResult,
      result: true,
      isLoaded: true 
    })
  }
}

async suggestionHandler(selectedTerm){
  let newSearchResult = await fetch(`https://service.tib.eu/ts4tib/api/search?q=${selectedTerm}`)
  newSearchResult =  (await newSearchResult.json())['response']['docs'];
  this.setState({
      searchResult: newSearchResult,
      suggestResult: true
    });
}

  createResultList(){
    const resultList = []          
    for(let i=0; i < this.state.suggestionResult.length; i++){
      resultList.push(
          <Link to={'/search?q=' + encodeURIComponent(this.state.suggestionResult[i]['autosuggest'])} key={i} className="container">
              <div>
                   {this.state.suggestionResult[i]['autosuggest']}
              </div>
          </Link>)
    }
    return resultList
}

  componentDidMount(){
    if(!this.state.isLoaded && !this.state.isFiltered){
      this.searching();
    } 
  }


  /**
     * Create the search results list view
     *
     * @returns
     */
   createSearchResultList () {   
     if(this.state.result){
      let searchResultItem = this.state.searchResult
      const SearchResultList = [];
      for (let i = 0; i < searchResultItem.length; i++) {
        SearchResultList.push(
          <Grid container className="result-card" key={searchResultItem[i]['id']}>
            <Grid item xs={12}>
                {(() => {
                  if(searchResultItem[i]["type"] === 'class'){
                    return(
                      <div className="search-card-title"> 
                      <a href={'/ontologies/' + encodeURIComponent(this.state.searchResult[i]['ontology_name']) +'/terms?iri=' + encodeURIComponent(this.state.searchResult[i]['iri'])} className="search-result-title">
                        <h4>{searchResultItem[i].label}</h4>
                      </a>
                      <a className="btn btn-default term-button" href={'/ontologies/' + encodeURIComponent(this.state.searchResult[i]['ontology_name']) +'/terms?iri=' + encodeURIComponent(this.state.searchResult[i]['iri'])} >
                      {searchResultItem[i].short_form}
                      </a>
                      </div>
                    )     
                }
                else if(searchResultItem[i]["type"] === 'property'){
                  return(
                    <div className="search-card-title"> 
                      <a href={'/ontologies/' + encodeURIComponent(this.state.searchResult[i]['ontology_name']) +'/props?iri=' + encodeURIComponent(this.state.searchResult[i]['iri'])} className="search-result-title">
                        <h4>{searchResultItem[i].label}</h4>
                      </a>
                      <a className="btn btn-default term-button" href={'/ontologies/' + encodeURIComponent(this.state.searchResult[i]['ontology_name']) +'/props?iri=' + encodeURIComponent(this.state.searchResult[i]['iri'])} >
                      {searchResultItem[i].short_form}
                      </a>
                      </div>

                  )         
                }
                else if(searchResultItem[i]["type"] === 'ontology'){
                  return(
                    <div className="search-card-title"> 
                      <a href={'/ontologies/' + encodeURIComponent(this.state.searchResult[i]['ontology_name'])} className="search-result-title">
                        <h4>{searchResultItem[i].label}</h4>
                      </a>
                      <a className="btn btn-default term-button" href={'/ontologies/' + encodeURIComponent(this.state.searchResult[i]['ontology_name'])} >
                      {searchResultItem[i].short_form}
                      </a>
                      </div>

                  )      
                }
                else if(searchResultItem[i]["type"] === 'individual'){
                  return(
                    <div className="search-card-title"> 
                      <a href={'/ontologies/' + encodeURIComponent(this.state.searchResult[i]['ontology_name']) +'/terms?iri=' + encodeURIComponent(this.state.searchResult[i]['iri'])} className="search-result-title">
                        <h4>{searchResultItem[i].label}</h4>
                      </a>
                      <a className="btn btn-default term-button" href={'/ontologies/' + encodeURIComponent(this.state.searchResult[i]['ontology_name']) +'/terms?iri=' + encodeURIComponent(this.state.searchResult[i]['iri'])} >
                      {searchResultItem[i].short_form}
                      </a>
                      </div>

                  )    
                }
                })()}                        
              <div className="searchresult-iri">
                {searchResultItem[i].iri}
              </div>
              <div className="searchresult-card-description">
                <p>{searchResultItem[i].description}</p>
              </div>
              <div className="searchresult-ontology">
                <span><b>Ontology: </b></span>
                <a className='btn btn-default ontology-button' href={'/ontologies/' + this.state.searchResult[i]['ontology_name']} target="_blank">
                  {searchResultItem[i].ontology_prefix}
                </a>
              </div>
            </Grid>
          </Grid>   
        )
      }       
        return SearchResultList
     }
  }

  /**
    * Update the url based on facet values
    */
   updateURL(ontologies, types, collections){
    let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
    let page = targetQueryParams.page;
    this.props.history.push(window.location.pathname);
    let currentUrlParams = new URLSearchParams();

    
      for(let typ of types){
        currentUrlParams.append('type', typ);
      }
    

    
      for(let ontos of ontologies){
        currentUrlParams.append('ontology', ontos);
      }
    

    currentUrlParams.append('page', this.state.pageNumber);
    this.props.history.push(window.location.pathname + "?q=" + this.state.enteredTerm + "&" + currentUrlParams.toString());

   }

  
  /**
   * Runs the facet when a filter is selected
   * @param {*} ontologies 
   * @param {*} types 
   * @param {*} collections 
   */
  async handleSelection(ontologies, types, collections){
    let rangeCount = (this.state.pageNumber - 1) * this.state.pageSize
    let baseUrl = `https://service.tib.eu/ts4tib/api/search?q=${this.state.enteredTerm}` + `&start=${rangeCount}` + "&rows=" + this.state.pageSize;
      ontologies.forEach(item => {
          baseUrl = baseUrl + `&ontology=${item.toLowerCase()}`
        }) 
      types.forEach(item => {
          baseUrl = baseUrl + `&type=${item.toLowerCase()}`
        })      
      let targetUrl = await fetch(baseUrl)
      let filteredSearchResults = (await targetUrl.json())['response']['docs']; 
      this.updateURL(ontologies, types, collections)
      this.setState({
        searchResult: filteredSearchResults,
        ontologies: ontologies,
        types: types 
       })
     }
  
  /**
     * Handle the click on the pagination
     * @param {*} value
     */
   handlePagination (value) {
    this.setState({
      pageNumber: value
    }, () => {
      this.paginationHandler()
    })
  }



  /**
     * Count the number of pages for the pagination
     * @returns
     */
  pageCount () {    
    if (isNaN(Math.ceil(this.state.totalResults / this.state.pageSize))){
      return 0;
    }
    return (Math.ceil(this.state.totalResults / this.state.pageSize))
  }


  /**
    * Handle the pagination change. This function has to be passed to the Pagination component
    */
   async paginationHandler () {
    let ontologies = this.state.ontologies;
    let types = this.state.types;
    let rangeCount = (this.state.pageNumber - 1) * this.state.pageSize;
    let baseUrl = `https://service.tib.eu/ts4tib/api/search?q=${this.state.enteredTerm}` + `&start=${rangeCount}` + "&rows=" + this.state.pageSize
    if(ontologies.length > 0 || types.length > 0){
      ontologies.forEach(item => {
        baseUrl = baseUrl + `&ontology=${item.toLowerCase()}`
      }) 
      types.forEach(item => {
        baseUrl = baseUrl + `&type=${item.toLowerCase()}`
      })
      let targetUrl = await fetch(baseUrl)
      let newResults = (await targetUrl.json())['response']['docs']
      this.updateURL(ontologies, types)
      this.setState({
        searchResult: newResults
     })
     }
     else{
      let targetUrl = await fetch(baseUrl)
      let resultJson = (await targetUrl.json());
      let newResults = resultJson['response']['docs']
      this.setState({
        searchResult: newResults
     })
     }
     
  }


  submitHandler(event){  
    let newEnteredTerm = document.getElementById('search-input').value;
    window.location.replace('/search?q=' + newEnteredTerm);
}

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.submitHandler();
    }
  }

  render(){
    return(
      <div id="searchterm-wrapper">
        {/* <div>
        <a className='btn btn-primary' onClick={this.handleExact}>Exact Match</a>
              {this.state.suggestResult &&
            <div id = "autocomplete-container" className="col-md-9 justify-content-md-center" onClick={this.suggestionHandler}>{this.createResultList()}</div>}
        </div>         */}
        <Grid container spacing={2}>
          <Grid item xs={4}>{this.state.result && 
            <Facet
               facetData = {this.state.facetFields}
               handleChange = {this.handleSelection}
               collections = {this.state.collections}
            />}
            
          </Grid>
          <Grid item xs={8} id="search-list-grid">
              <h3 className="text-dark">{'Search Results for "' + this.state.enteredTerm + '"'   }</h3>
              {this.createSearchResultList()}              
              <Pagination 
                clickHandler={this.handlePagination} 
                count={this.pageCount()}
                initialPageNumber={this.state.pageNumber}          
              />
            </Grid>
          </Grid>
        
      </div>
    )
  }
}

export default SearchResult;