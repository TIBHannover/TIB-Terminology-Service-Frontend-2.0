import React from 'react'
import { Link } from 'react-router-dom';
import '../layout/Search.css'
import Grid from '@material-ui/core/Grid';
import PaginationCustom from './Pagination/Pagination';
import queryString from 'query-string';
import Button from '@mui/material/Button';
import Facet from './Facet/facet';
import {  TextField, IconButton } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ExactResult from './Exact/Exact';
import SearchForm from './SearchForm';

class SearchResult extends React.Component{
    constructor(props){
        super(props)
        this.state = ({
          enteredTerm: "",
          newEnteredTerm: "",
          result: false,
          suggestResult: false,
          searchResult: [],
          suggestionResult: [],
          originalSearchResult: [],
          selectedOntologies: [],
          selectedTypes: [],
          facetFields: [],
          startIndex: 0,
          endIndex: 9,  
          pageNumber: 1,
          pageSize: 10,       
          isLoaded: false,
          isFiltered: false
        })
        this.createSearchResultList = this.createSearchResultList.bind(this)
        this.handlePagination = this.handlePagination.bind(this)
        this.searching = this.searching.bind(this)
        this.handleSelection = this.handleSelection.bind(this);
        this.createResultList = this.createResultList.bind(this);
        this.suggestionChange = this.suggestionChange.bind(this);
        this.suggestionHandler = this.suggestionHandler.bind(this);
        this.paginationHandler = this.paginationHandler.bind(this);
    }

    async searching(){
      let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
      let enteredTerm = targetQueryParams.q
      if (enteredTerm.length > 0){
        let searchResult = await fetch(`https://service.tib.eu/ts4tib/api/search?q=${enteredTerm}`)
        let resultJson = (await searchResult.json());
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
          enteredTerm: enteredTerm
        });  
      }
      else if (enteredTerm.length == 0){
          this.setState({
              result: false,
              searchResult: [],
              facetFields: [],
              originalSearchResult: [],
              isLoaded: true,
              enteredTerm: enteredTerm
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

  // componentDidUpdate(){
  //   // if(!this.state.isLoaded ){
  //   //   this.searching()
  //   // } 
  //   // this.transportTerm()
  // }


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
          <Grid container className="search-result-card" key={searchResultItem[i]['id']}>
            <Grid item xs={8}>
              <div className="search-card-title">
                <h4><b><Link to={'/ontologies/' + encodeURIComponent(this.state.searchResult[i]['ontology_name']) +'/terms?iri=' + encodeURIComponent(this.state.searchResult[i]['iri'])} className="result-term-link">{searchResultItem[i].label}</Link> <Button style={{backgroundColor: "#873593"}}variant="contained">{searchResultItem[i].short_form}</Button></b></h4>
              </div>
              <div className="searchresult-iri">
                {searchResultItem[i].iri}
              </div>
              <div className="searchresult-card-description">
                <p>{searchResultItem[i].description}</p>
              </div>
              <div className="searchresult-ontology">
                <span class="font-weight-bold">Ontology:</span><Button style={{backgroundColor: "#00617c", fontColor:"white"}} variant="contained">{searchResultItem[i].ontology_prefix}</Button>
              </div>
            </Grid>
          </Grid>   
        )
      }       
        return SearchResultList
     }
  }

  async handleSelection(ontologies, types){
    let rangeCount = (this.state.pageNumber - 1) * this.state.pageSize
    let baseUrl = `https://service.tib.eu/ts4tib/api/search?q=${this.state.enteredTerm}` + `&start=${rangeCount}`
      ontologies.forEach(item => {
          baseUrl = baseUrl + `&ontology=${item.toLowerCase()}`
        }) 
      types.forEach(item => {
          baseUrl = baseUrl + `&type=${item.toLowerCase()}`
        })      
      let targetUrl = await fetch(baseUrl)
      let filteredSearchResults = (await targetUrl.json())['response']['docs']; 
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
    return (Math.ceil(this.state.totalResults / this.state.pageSize))
  }

  /**
       * Handle the pagination change. This function has to be passed to the Pagination component
       */
   async paginationHandler () {
    let ontologies = this.state.ontologies
    let types = this.state.types
    let rangeCount = (this.state.pageNumber - 1) * this.state.pageSize
    let baseUrl = `https://service.tib.eu/ts4tib/api/search?q=${this.state.enteredTerm}` + `&start=${rangeCount}`
    if(ontologies > 0 && types > 0){
      ontologies.forEach(item => {
        baseUrl = baseUrl + `&ontology=${item.toLowerCase()}`
      }) 
      types.forEach(item => {
        baseUrl = baseUrl + `&type=${item.toLowerCase()}`
      })
      console.info(baseUrl)
      let targetUrl = await fetch(baseUrl)
      let newResults = (await targetUrl.json())['response']['docs']
      this.setState({
        searchResult: newResults
     })
     }
     else{
      let targetUrl = await fetch(baseUrl)
      console.info(targetUrl)
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
        <div>
        <SearchForm/>
        <FormGroup>
            <FormControlLabel onClick={ExactResult} control={<Checkbox />} label="Exact Match" />
        </FormGroup>
              {this.state.suggestResult &&
            <div id = "autocomplete-container" className="col-md-9 justify-content-md-center" onClick={this.suggestionHandler}>{this.createResultList()}</div>}
        </div>
        <div id="search-title">
        <h4>{'Search Results for the term "' + this.state.enteredTerm + '"'   }</h4>
        </div>
        <Grid container spacing={8}>
          <Grid item xs={3}>{this.state.result && <Facet
               facetData = {this.state.facetFields}
               handleChange = {this.handleSelection}
            />}
            
          </Grid>
          <Grid item xs={9} id="search-list-grid">
              {this.createSearchResultList()}
              <PaginationCustom
                count={this.pageCount()}
                clickHandler={this.handlePagination}
                page={this.state.pageNumber}
              />
            </Grid>
          </Grid>
        
      </div>
    )
  }
}

export default SearchResult;