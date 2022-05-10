import React from 'react'
import { Link } from 'react-router-dom';
import '../layout/Search.css'
import { Form, Input, Button, InputGroup } from 'reactstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';


class SearchForm extends React.Component{
    constructor (props) {
        super(props)
        this.state = ({
          enteredTerm: "",
          result: false,
          searchResult: []
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
         this.setState({
             searchResult: searchResult,
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

      render(){
          return(
              <div>
                   <Input type="text" className="col-md-12 input" id="search-input" style={{marginTop: 3.8}}
                    onChange={this.handleChange}
                    placeholder="Search NFDI4Chem TS"
                    />
                    <Button id="button-main-search" className="ps-2 pe-2 search-icon" type="submit" onClick={this.submitHandler}>
                        <Icon icon={faSearch}/>
                    </Button>
                    {this.state.result &&
                <div id = "autocomplete-container" className="col-md-12 justify-content-md-center" onClick={this.suggestionHandler}>{this.createResultList()}</div>}
              </div>
          )
      }

}

export default SearchForm;