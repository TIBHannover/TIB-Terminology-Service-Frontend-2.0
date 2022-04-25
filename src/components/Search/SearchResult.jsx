import React from 'react'
import { Link } from 'react-router-dom';
import './SearchResult.css'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import PaginationCustom from '../Pagination/Pagination';

class SearchResult extends React.Component{
    constructor(props){
        super(props)
        this.state = ({
          enteredTerm: "",
          result: false,
          searchResult: [],
          pageNumber: 1,
          pageSize: 5
        })
    }

    async searching(enteredTerm){
      enteredTerm = enteredTerm.target.value;
    if (enteredTerm.length > 0){
        let searchResult = await fetch(`https://service.tib.eu/ts4tib/api/search?q=${enteredTerm}`)
        searchResult =  (await searchResult.json())['response']['docs'];
     this.setState({
         searchResult: searchResult,
         result: true
     });
    }
    else if (enteredTerm.length == 0){
        this.setState({
            result: false
        });
        
    }
  }

  async transportTerm(searchResultItem){
      if(searchResultItem.type === 'class'){
        url = 'https://service.tib.eu/ts4tib/api/ontologies/' + searchResultItem.ontology_name + '/terms/' + searchResultItem.iri
      }
      else if(searchResultItem.type === 'properties'){
        url = 'https://service.tib.eu/ts4tib/api/ontologies/' + searchResultItem.ontology_name + '/properties/' + searchResultItem.iri
      } 
      
      else if(searchResultItem.type === 'ontology'){
        url = 'https://service.tib.eu/ts4tib/api/ontologies/' + searchResultItem.ontology
      }
      else(searchResultItem.type === 'individuals'){
        url = 'https://service.tib.eu/ts4tib/api/ontologies/' + searchResultItem.ontology_name + '/individuals/' + searchResultItem.iri
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
     * Create the search results list view
     *
     * @returns
     */
   createSearchResultList () {
    const SearchResultList = []
    for (let i = 0; i < this.state.searchResult.length; i++) {
      SearchResultList.push(
        <Link to={this.transportTerm(this.state.searchResult[i])} key={i} className="result-term-link">
        <Grid container className="search-result-card" key={enteredTerm}>
         <div>
            {this.state.searchResult[i]['search results']}
         </div>
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
              {this.SearchResultList()}
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