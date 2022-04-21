import React from 'react'
import { Link } from 'react-router-dom';
import './SearchResult.css'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

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
     * Create the search results list view
     *
     * @returns
     */
   createSearchResultList () {
    const SearchResultList = []
    for (let i = 0; i < this.state.searchResult.length; i++) {
      const item = this.state.ontologies[i]
      SearchResultList.push(this.state.ontologiesHiddenStatus[i] &&
                    <Link to={'/ontologies/' + item.ontologyId} key={i} className="ontology-card-link">
                      <Grid container className="ontology-card" id={'ontology_' + i} key={item.ontologyId}>
                        <Grid item xs={8}>
                          <div className="ontology-card-title">
                            <h4><b>{item.config.title} ({item.ontologyId}) </b></h4>
                          </div>
                          <div className="ontology-card-description">
                            <p>{item.config.description}</p>
                          </div>
                        </Grid>
                        <Grid item xs={4} className="ontology-card-meta-data">
                          <div>
                            <h4>Last Update:</h4>
                            {item.updated}
                            <h4>Classes Count:</h4>
                            {item.numberOfTerms}
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
        
      </div>
    )
  }
}

export default SearchResult;