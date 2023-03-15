import React from 'react';

class SearchInOntology extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
          enteredTerm: "",
          api_base_url: "https://service.tib.eu/ts4tib/api"
        })
    }


    render(){
        return(
            <div class="input-group-prepend">
              <div class="input-group-text">
                Search
                <a href={`${this.state.api_base_url}/search?q=${this.state.enteredTerm}`}>
                OntologyID
                </a>                     
                All
              </div>
            </div>
        )
    }

}

export default SearchInOntology