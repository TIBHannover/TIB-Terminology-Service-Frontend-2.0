import React from 'react'
import '../layout/Search.css'
import {  TextField} from '@material-ui/core';
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
            let searchResult = await fetch(`https://service.tib.eu/ts4tib/api/suggest?q=${enteredTerm}&rows=5`)
            searchResult =  (await searchResult.json())['response']['docs'];
            let jumpResult = await fetch(`https://service.tib.eu/ts4tib/api/select?q=${enteredTerm}&rows=5`)
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
        let enteredTerm = document.getElementById('s-field').value;
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
                <div className="autocomplete-item">
                  <a href={'/search?q=' + encodeURIComponent(this.state.searchResult[i]['autosuggest'])} key={i} className="container">                      
                          {this.state.searchResult[i]['autosuggest']}
                  </a>
                </div>
                )
          }
          return resultList
      }

      createJumpResultList(){
        const jumpResultList = []
        for(let i=0; i < this.state.jumpResult.length; i++){
          jumpResultList.push(
            <div className="jump-autocomplete-item">
            {(() => {
              if(this.state.jumpResult[i]["type"] === 'class'){
                return(
                  <a href={'/ontologies/' + encodeURIComponent(this.state.jumpResult[i]['ontology_name']) +'/terms?iri=' + encodeURIComponent(this.state.jumpResult[i]['iri'])} key={i} className="container">            
                     {this.state.jumpResult[i]['label']}
                     <Button style={{backgroundColor: "#0E6668", fontColor: "white", marginLeft:"20px"}}variant="contained">{this.state.jumpResult[i]['short_form']}</Button>
                     <Button style={{backgroundColor: "#E86161", marginLeft:"20px"}} variant="contained">{this.state.jumpResult[i]['ontology_prefix']}</Button>                  
                  </a>
                )
              }
              if(this.state.jumpResult[i]["type"] === 'property'){
                return(
                  <a href={'/ontologies/' + encodeURIComponent(this.state.jumpResult[i]['ontology_name']) +'/props?iri=' + encodeURIComponent(this.state.jumpResult[i]['iri'])} key={i} className="container">            
                     {this.state.jumpResult[i]['label']}
                     <Button style={{backgroundColor: "#0E6668", fontColor: "white", marginLeft:"20px"}}variant="contained">{this.state.jumpResult[i]['short_form']}</Button>
                     <Button style={{backgroundColor: "#E86161", marginLeft:"20px"}} variant="contained">{this.state.jumpResult[i]['ontology_prefix']}</Button>                  
                  </a>
                )
              }
              if(this.state.jumpResult[i]["type"] === 'individual'){
                return(
                  <a href={'/ontologies/' + encodeURIComponent(this.state.jumpResult[i]['ontology_name']) +'/terms?iri=' + encodeURIComponent(this.state.jumpResult[i]['iri'])} key={i} className="container">            
                     {this.state.jumpResult[i]['label']}
                     <Button style={{backgroundColor: "#0E6668", fontColor: "white", marginLeft:"20px"}}variant="contained">{this.state.jumpResult[i]['short_form']}</Button>
                     <Button style={{backgroundColor: "#E86161", marginLeft:"20px"}} variant="contained">{this.state.jumpResult[i]['ontology_prefix']}</Button>                  
                  </a>
                )
              }
              if(this.state.jumpResult[i]["type"] === 'ontology'){
                return(
                  <a href={'/ontologies/' + encodeURIComponent(this.state.jumpResult[i]['ontology_name'])} key={i} className="container">            
                     {this.state.jumpResult[i]['label']}
                     <Button style={{backgroundColor: "#0E6668", fontColor: "white", marginLeft:"20px"}}variant="contained">{this.state.jumpResult[i]['short_form']}</Button>
                     <Button style={{backgroundColor: "#E86161", marginLeft:"20px"}} variant="contained">{this.state.jumpResult[i]['ontology_prefix']}</Button>                  
                  </a>
                )
              }

            })()} 
            </div>          
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
                   <TextField className="col-md-12 input" id="s-field" variant="outlined" 
                    onChange={this.handleChange}
                    onKeyDown={this._handleKeyDown}
                    placeholder="Search for ontology, term, properties"                    
                    InputProps={{
                        endAdornment: (
                          <button className='btn btn-default search-btn' onClick={this.submitHandler}>Search </button>                      
                        ),
                        autocomplete: 'new-password'                    
                      }}                
                    />
                    
                    {this.state.result &&
                <div id = "autocomplete-container" className="col-md-12" onClick={this.suggestionHandler}>{this.createResultList()}</div>}
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