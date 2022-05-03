import React from 'react'
import { Link } from 'react-router-dom';
import './SearchResult.css'
import Grid from '@material-ui/core/Grid';
import PaginationCustom from './Pagination';
import queryString from 'query-string';
import Button from '@mui/material/Button';
import Facet from './Facet/facet';

class SearchResult extends React.Component{
    constructor(props){
        super(props)
        this.state = ({
          enteredTerm: "",
          result: false,
          searchResult: [],
          originalSearchResult: [],
          selectedOntologies: [],
          selectedTypes: [],
          facetFields: [],
          pageNumber: 1,
          pageSize: 5,         
          isLoaded: false,
          isFiltered: false
        })
        this.createSearchResultList = this.createSearchResultList.bind(this)
        // this.handlePagination = this.handlePagination.bind(this)
        this.searching = this.searching.bind(this)
        //this.transportTerm = this.transportTerm.bind(this)
        this.handleSelection = this.handleSelection.bind(this);
    }

    async searching(){
      let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
      let enteredTerm = targetQueryParams.q
      if (enteredTerm.length > 0){
        let searchResult = await fetch(`https://service.tib.eu/ts4tib/api/search?q=${enteredTerm}`)
        let resultJson = (await searchResult.json());
        searchResult =  resultJson['response']['docs'];
        let facetFields = resultJson['facet_counts'];
        this.setState({
          searchResult: searchResult,
          originalSearchResult: searchResult,
          facetFields: facetFields,
          result: true,
          isLoaded: true
        });  
      }
      else if (enteredTerm.length == 0){
          this.setState({
              result: false,
              searchResult: [],
              facetFields: [],
              originalSearchResult: [],
              isLoaded: true
          });  
      }
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
  //  handlePagination (value) {
  //   this.setState({
  //     pageNumber: value,
  //     paginationReset: false
  //   }, () => {
  //     this.paginationHandler()
  //   })
  // }



  /**
     * Count the number of pages for the pagination
     * @returns
     */
  pageCount () {
    return (Math.ceil(this.state.searchResult.length / this.state.pageSize))
  }

  /**
       * Handle the pagination change. This function has to be passed to the Pagination component
       */
  //  paginationHandler () {
  //   const down = (this.state.pageNumber - 1) * this.state.pageSize
  //   const up = down + (this.state.pageSize - 1)
  //   const hiddenStatus = new Array(this.state.searchResult.length).fill(false)
  //   for (let i = down; i <= up; i++) {
  //     hiddenStatus[i] = true
  //   }
  // }

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
      for(let i=0; i<currentResults.length; i++){
         if(ontologies.includes(currentResults[i]['ontology_name'])){
           filteredSearchResult.push(currentResults[i]);
         }
      }
     this.setState({
       searchResult: filteredSearchResult,
       result: true,
       isFiltered: true
     })
    }
  }

  render(){
    return(
      <div id="searchterm-wrapper">
        <div id="search-title">
        <h2>Search Results</h2>
        </div>
        <Grid container spacing={8}>
          <Grid item xs={4}>{this.state.result && <Facet
               facetData = {this.state.facetFields}
               handleChange = {this.handleSelection}
            />}
            
          </Grid>
          <Grid item xs={8} id="search-list-grid">
              {this.createSearchResultList()}
              {/* <PaginationCustom
                count={this.pageCount()}
                clickHandler={this.props.handlePageClick}
                page={this.state.pageNumber}
              /> */}
            </Grid>
          </Grid>
        
      </div>
    )
  }
}

export default SearchResult;