import React from 'react'
import { Link } from 'react-router-dom';
import '../layout/Search.css'
import {  TextField, IconButton } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import Button from '@mui/material/Button';


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
        this.createJumpResultList = this.createJumpResultList.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.submitJumpHandler = this.submitJumpHandler.bind(this);  
        this.suggestionHandler = this.suggestionHandler.bind(this);  
      }
      

      async handleChange(enteredTerm){
          enteredTerm = enteredTerm.target.value;
        if (enteredTerm.length > 0){
            let searchResult = await fetch(`https://service.tib.eu/ts4tib/api/suggest?q=${enteredTerm}`)
            searchResult =  (await searchResult.json())['response']['docs'];
            let jumpResult = await fetch(`https://service.tib.eu/ts4tib/api/select?q=${enteredTerm}`)
            jumpResult = (await jumpResult.json())['response']['docs'];
         this.setState({
             searchResult: searchResult,
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
      for(let i=0; i < this.state.jumpResult.length; i++){
      window.location.replace('/ontologies/' + this.state.jumpResult[i]['ontology_name'] + '/terms?iri=' + this.state.jumpResult[i]['iri']);
      }
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
                    <div className="autocomplete-item">
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
            <Link to={'/ontologies/' + encodeURIComponent(this.state.jumpResult[i]['ontology_name']) +'/terms?iri=' + encodeURIComponent(this.state.jumpResult[i]['iri'])} key={i} className="container">
              <div className="jump-autocomplete-item">
                {this.state.jumpResult[i]['label']}
                <Button style={{backgroundColor: "#873593", marginLeft:"20px"}} variant="contained">{this.state.jumpResult[i]['ontology_prefix']}</Button>
                <Button style={{backgroundColor: "#00617c", fontColor: "white", marginLeft:"20px"}}variant="contained">{this.state.jumpResult[i]['short_form']}</Button>
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
                <div id = "autocomplete-container" className="col-md-12 justify-content-md-center" onClick={this.suggestionHandler}>{this.createResultList()}</div>}
                {this.state.result &&
                <div id = "jumpresult-container" className="col-md-12 justify-content-md-center">
                  <div>
                    <h4 className='font-weight-bold'>Jump To</h4>
                   {this.createJumpResultList()}
                  </div>
                </div>}
              </div>
          )
      }

}

export default SearchForm;