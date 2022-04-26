import React from 'react'
import { Link } from 'react-router-dom';
import './SearchResult.css'
import Grid from '@material-ui/core/Grid';
import PaginationCustom from './Pagination';
import queryString from 'query-string';

class SearchResult extends React.Component{
    constructor(props){
        super(props)
        this.state = ({
          enteredTerm: "",
          result: false,
          searchResult: [],
          pageNumber: 1,
          pageSize: 5,
          searchResults: [],
          isLoaded: false
        })
        this.createSearchResultList = this.createSearchResultList.bind(this)
        this.handlePagination = this.handlePagination.bind(this)
        this.searching = this.searching.bind(this)
        this.transportTerm = this.transportTerm.bind(this)
    }

    async searching(){
      let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
      let enteredTerm = targetQueryParams.q
      if (enteredTerm.length > 0){
        let searchResult = await fetch(`https://service.tib.eu/ts4tib/api/search?q=${enteredTerm}`)
        searchResult =  (await searchResult.json())['response']['docs'];
      this.setState({
         searchResult: searchResult,
         result: true,
         isLoaded: true
     });  
    }
    else if (enteredTerm.length == 0){
        this.setState({
            result: false,
            isLoaded: true,
            searchResult: []
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
    return (Math.ceil(this.state.searchResult.length / this.state.pageSize))
  }

  /**
       * Handle the pagination change. This function has to be passed to the Pagination component
       */
   paginationHandler () {
    const down = (this.state.pageNumber - 1) * this.state.pageSize
    const up = down + (this.state.pageSize - 1)
    const hiddenStatus = new Array(this.state.searchResult.length).fill(false)
    for (let i = down; i <= up; i++) {
      hiddenStatus[i] = true
    }
  }

  componentDidMount(){
    if(!this.state.isLoaded ){
      this.searching()
    } 
    this.transportTerm()
  }

  componentDidUpdate(){
    if(!this.state.isLoaded ){
      this.searching()
    } 
    this.transportTerm()
  }


  /**
     * Create the search results list view
     *
     * @returns
     */
   createSearchResultList () {
     let searchResultItem = this.state.searchResult
     console.info(this.state.searchResult)
    const SearchResultList = []
    for (let i = 0; i < searchResultItem.length; i++) {
      SearchResultList.push(
        <Link to={this.transportTerm(searchResultItem[i])} key={i} className="result-term-link">
        <Grid container className="search-result-card" key={searchResultItem}>
          <Grid item xs={8}>
            <div className="search-card-title">
              <h4><b>{searchResultItem[i].label} {searchResultItem[i].short_form} </b></h4>
            </div>
            <div className="searchresult-iri">
              {searchResultItem[i].iri}
            </div>
            <div className="searchresult-card-description">
              <p>{searchResultItem[i].description}</p>
            </div>
            <div className="searchresult-ontology">
              <p>{searchResultItem[i].ontology_prefix}</p>
            </div>
          </Grid>
        </Grid>
    </Link>
      )
    }
     return SearchResultList
    
  }

  render(){
    return(
      <div id="searchterm-wrapper">
        <Grid container spacing={3}>
            <Grid item xs={10} id="search-list-grid">
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