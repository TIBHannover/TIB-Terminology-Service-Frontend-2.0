import React from 'react'
import { Link } from 'react-router-dom';
import '../layout/Search.css'
import {  TextField, IconButton } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';


class SearchForm extends React.Component{
    constructor (props) {
        super(props)
        this.state = ({
          enteredTerm: "",
          result: false,
          searchResult: [],
          jumpResult: []
        })
        this.handleChange = this.handleChange.bind(this);
        this.createResultList = this.createResultList.bind(this);
        this.submitHandler = this.submitHandler.bind(this);  
        this.suggestionHandler = this.suggestionHandler.bind(this);  
      }
      

      async handleChange(enteredTerm){
          enteredTerm = enteredTerm.target.value;
        if (enteredTerm.length > 0){
            let searchResult = await fetch(`https://service.tib.eu/ts4tib/api/suggest?q=${enteredTerm}`)
            searchResult =  (await searchResult.json())['response']['docs'];
            let jumpResult = await fetch(`https://service.tib.eu/ts4tib/api/select?q=${enteredTerm}`)
            jumpResult = (await jumpResult.json())['response']['docs'];
            let jumpIRI = jumpResult.iri;
            let jumpOntoName = jumpResult.ontology_name;
         this.setState({
             searchResult: searchResult,
             jumpIRI: jumpIRI,
             jumpOntoName: jumpOntoName,
             jumpResult: jumpResult,
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


    submitHandler(event){  
        let enteredTerm = document.getElementById('search-input').value;
        window.location.replace('/search?q=' + enteredTerm);
    }

    submitJumpHandler(e){
      let enteredTerm = document.getElementById('search-input').value;
      window.location.replace('/ontologies/' + this.state.jumpOntoName + '/terms?iri=' + this.state.jumpIRI);
    }
    
    
    async suggestionHandler(selectedTerm){
        let selection = await fetch(`https://service.tib.eu/ts4tib/api/search?q=${selectedTerm}`)
        selection =  (await selection.json())['response']['docs'];
        this.setState({
            selection: selection,
            result: true
          });
      }
      

      createResultList(){
          const resultList = []          
          for(let i=0; i < this.state.searchResult.length; i++){
            resultList.push(
                <Link to={'/search?q=' + encodeURIComponent(this.state.searchResult[i]['autosuggest'])} key={i} className="container">
                    <div>
                         {this.state.searchResult[i]['autosuggest']}
                    </div>
                </Link>)
          }
          return resultList
      }

      createJumpResultList(){
        const jumpResultList = []
        for(let i=0; i < this.state.jumpResult.length; i++){
          jumpResultList.push(
            <Link to={'/ontologies/' + encodeURIComponent(this.state.searchResult[i]['autosuggest'])} key={i} className="container">
              <div>
                {this.state.jumpResult[i]['label']}
                {this.state.jumpResult[i]['ontology_prefix']}
                {this.state.jumpResult[i]['obo_id']}
              </div>
            </Link>
          )
        }
        return jumpResultList
      }

      _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          this.submitHandler();
        }
      }

      render(){
          return(
              <div>
                   <TextField className="col-md-12 input" id="search-input" variant="outlined" style={{marginTop: 3.8}}
                    onChange={this.handleChange}
                    onKeyDown={this._handleKeyDown}
                    placeholder="Search NFDI4Chem TS"
                    InputProps={{
                        endAdornment: (
                          <IconButton>
                            <SearchOutlined onClick={this.submitHandler}/>
                          </IconButton>
                        ),
                      }}
                    />
                    
                    {this.state.result &&
                <div id = "autocomplete-container" className="col-md-12 justify-content-md-center" onClick={this.suggestionHandler}>{this.createResultList()}</div> &&
                <div id="jumpresult-container" className="col-md-12 justify-content-md-center" onClick={this.submitJumpHandler}>{this.createJumpResultList}</div>}
              </div>
          )
      }

}

export default SearchForm;