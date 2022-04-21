import React from 'react'
import { Link } from 'react-router-dom';
import './SearchResult.css'

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

  render(){
    return(
      <div id="searchterm-wrapper">
        
      </div>
    )
  }
}

export default SearchResult;