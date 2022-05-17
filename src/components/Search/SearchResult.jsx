import React from 'react'
import { Link } from 'react-router-dom';
import '../layout/Search.css'
import Grid from '@material-ui/core/Grid';
import PaginationCustom from './Pagination';
import queryString from 'query-string';
import Button from '@mui/material/Button';
import Facet from './Facet/facet';
import { Form, Input, InputGroup } from 'reactstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';

class SearchResult extends React.Component{
    constructor(props){
        super(props)
        this.state = ({
          enteredTerm: "",
          result: false,
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
        //this.transportTerm = this.transportTerm.bind(this)
        this.handleSelection = this.handleSelection.bind(this);
        this.createResultList = this.createResultList.bind(this);
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
  async suggestionChange(enteredTerm){
    enteredTerm = enteredTerm.target.value;
  if (enteredTerm.length > 0){
      let suggestionResult = await fetch(`https://service.tib.eu/ts4tib/api/suggest?q=${enteredTerm}`)
      suggestionResult =  (await suggestionResult.json())['response']['docs'];
   this.setState({
       suggestionResult: suggestionResult,
       result: true,
       enteredTerm: enteredTerm
   });
  }
  else if (enteredTerm.length == 0){
      this.setState({
          result: false,
          enteredTerm: ""
      });
      
  }
}

  createResultList(){
    const resultList = []          
    for(let i=0; i < this.state.suggestionResult.length; i++){
      resultList.push(
          <Link to={'/search?q=' + encodeURIComponent(this.state.searchResult[i]['autosuggest'])} key={i} className="container">
              <div>
                   {this.state.searchResult[i]['autosuggest']}
              </div>
          </Link>)
    }
    return resultList
}

  async transportTerm(searchResultItem){
      let url = "";
      if(searchResultItem.type === 'class'){
        url = 'https://service.tib.eu/ts4tib/api/ontologies/' + searchResultItem.ontology_name + '/terms/' + searchResultItem.iri;
      }
      else if(searchResultItem.type === 'properties'){
        url = 'https://service.tib.eu/ts4tib/api/ontologies/' + searchResultItem.ontology_name + '/properties/' + searchResultItem.iri;
      } 
      
      else if(searchResultItem.type === 'ontology'){
        url = 'https://service.tib.eu/ts4tib/api/ontologies/' + searchResultItem.ontology;
      }
      else if(searchResultItem.type === 'individuals'){
        url = 'https://service.tib.eu/ts4tib/api/ontologies/' + searchResultItem.ontology_name + '/individuals/' + searchResultItem.iri;
      }
  }

  /**
     * Handle the click on the pagination
     * @param {*} value
     */
   handlePagination (value) {
    this.setState({
      pageNumber: value,
      paginationReset: false
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
     let rangeCount = (this.state.pageNumber - 1) * this.state.pageSize
     let targetUrl = await fetch (`https://service.tib.eu/ts4tib/api/search?q=${this.state.enteredTerm}` + `&start=${rangeCount}`)
     console.info(targetUrl)
     let resultJson = (await targetUrl.json());
     let newResults = resultJson['response']['docs']
     console.info(resultJson)
     this.setState({
       rangeCount: rangeCount,
       searchResult: newResults
    })
  }

  componentDidMount(){
    if(!this.state.isLoaded && !this.state.isFiltered){
      this.searching();
    } 
    //this.transportTerm()
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
                <h4><b><Link to={this.transportTerm(searchResultItem[i])} className="result-term-link">{searchResultItem[i].label}</Link> <Button style={{backgroundColor: "#873593"}}variant="contained">{searchResultItem[i].short_form}</Button></b></h4>
              </div>
              <div className="searchresult-iri">
                {searchResultItem[i].iri}
              </div>
              <div className="searchresult-card-description">
                <p>{searchResultItem[i].description}</p>
              </div>
              <div className="searchresult-ontology">
                <Button style={{backgroundColor: "#00617c", fontColor:"white"}} variant="contained">{searchResultItem[i].ontology_prefix}</Button>
              </div>
            </Grid>
          </Grid>   
        )
      }       
        return SearchResultList
     }
  }

  handleSelection(ontologies, types){
    if(ontologies.length === 0 && types.length === 0){
      this.setState({
        searchResult: this.state.originalSearchResult
      });
    } 
    else{
      let filteredSearchResult = [];
      let currentResults = this.state.originalSearchResult;
      if(ontologies.length === 0){
        filteredSearchResult = currentResults;
      }
      else{
        for(let i=0; i<currentResults.length; i++){        
          if(ontologies.includes(currentResults[i]['ontology_name'].toUpperCase())){
            filteredSearchResult.push(currentResults[i]);
          }
       }
      }
      
      let newFiltered = [];
      if(types.length === 0){
        newFiltered = filteredSearchResult;
      }
      else{
        for(let i=0; i<filteredSearchResult.length; i++){        
          if(types.includes(filteredSearchResult[i]['type'])){
            newFiltered.push(filteredSearchResult[i]);
          }
       }
      }
      
     this.setState({
       searchResult: newFiltered,
       result: true,
       isFiltered: true
     })
    }
  }

  render(){
    return(
      <div id="searchterm-wrapper">
        <div>
           <Input type="text" className="col-md-12 input" id="search-input" style={{marginTop: 3.8}}
              onChange={this.suggestionChange}
              placeholder="Search NFDI4Chem TS"
                />
            <Button id="button-main-search" className="ps-2 pe-2 search-icon" type="submit" onClick={this.submitHandler}>
                <Icon icon={faSearch}/>
            </Button>
              {this.state.result &&
            <div id = "autocomplete-container" className="col-md-12 justify-content-md-center" onClick={this.suggestionHandler}>{this.createResultList()}</div>}
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