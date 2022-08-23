import React from 'react'
import queryString from 'query-string';
import Facet from './Facet/facet';
import { Link } from 'react-router-dom';


class SearchTermDetail extends React.Component{
    constructor(props){
        super(props)
        this.state=({
            enteredTerm: "",
            result: false,
            searchResult: [],
            ontologies: [],
            types: []
        })
        this.redirectResults = this.redirectResults.bind(this);
    }

    async redirectResults(){
      let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
      let enteredTerm = targetQueryParams.q
      if (enteredTerm.length > 0){
        let searchUrl = "https://service.tib.eu/ts4tib/api/search?q=" + enteredTerm;
        let searchResult = await fetch(searchUrl);
        let resultJson = (await searchResult.json());
        searchResult =  resultJson['response']['docs'];
        this.setState({
            searchResult: searchResult,
            result: true                 
        })
    }
    else if (enteredTerm.length == 0){
        this.setState({
            result: false,
            searchResult: []
        });  
    }
  }

  handleRedirect(){
    let searchResultItem = this.state.searchResult
      for(let i=0; i < searchResultItem.length; i++){
        if('type' == 'class'){
            <a href={'/ontologies/' + encodeURIComponent(this.state.searchResult[i]['ontology_name']) +'/terms?iri=' + encodeURIComponent(this.state.searchResult[i]['iri'])} style={{textDecoration: "none", color: "inherit"}}>
              {searchResultItem[i].label}
            </a>
        }
        else if('type' == 'property'){
            <a href={'/ontologies/' + encodeURIComponent(this.state.searchResult[i]['ontology_name']) +'/props?iri=' + encodeURIComponent(this.state.searchResult[i]['iri'])} style={{textDecoration: "none", color: "inherit"}}>
              {searchResultItem[i].label}
            </a>
          }
        else if('type' == 'ontology'){
            <a href={'/ontologies/' + encodeURIComponent(this.state.searchResult[i]['ontology_name'])} style={{textDecoration: "none", color: "inherit"}}>
              {searchResultItem[i].label}
            </a>
          }
        else if('type' == 'individuals'){
            <a href={'/ontologies/' + encodeURIComponent(this.state.searchResult[i]['ontology_name']) +'/terms?iri=' + encodeURIComponent(this.state.searchResult[i]['iri'])} style={{textDecoration: "none", color: "inherit"}}>
              {searchResultItem[i].label}
            </a>
          }
      }

  }

  render(){
    return(
        <div>

        </div>
    )
  }
}

export default SearchTermDetail