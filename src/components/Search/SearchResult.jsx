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
          term: "",
          result: false,
          searchResult: []
        })
    }

    async searching(term){
      term = term.target.value;
    if (term.length > 0){
        let searchResult = await fetch(`https://service.tib.eu/ts4tib/api/search?q=${term}`)
        searchResult =  (await searchResult.json())['response']['docs'];
     this.setState({
         searchResult: searchResult,
         result: true
     });
    }
    else if (term.length == 0){
        this.setState({
            result: false
        });
        
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
    return (Math.ceil(this.state.ontologies.length / this.state.pageSize))
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
        <Link to={''} key={i} className="result-term-link">
        <div>
            {this.state.searchResult[i]['search results']}
        </div>
    </Link>
      )
    }

    return SearchResultList
  }

  render(){
    return(
      <div id="searchterm-wrapper">
        
      </div>
    )
  }
}

export default SearchResult;