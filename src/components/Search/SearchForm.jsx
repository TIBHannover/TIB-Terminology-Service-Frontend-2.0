import React from 'react'
import { Link } from 'react-router-dom';
import './SearchForm.css'
import { Form, Input, Button, InputGroup } from 'reactstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';

class SearchForm extends React.Component{
    constructor (props) {
        super(props)
        this.state = ({
          term: "",
          result: false,
          searchResult: []
        })
        this.handleChange = this.handleChange.bind(this);
        this.createResultList = this.createResultList.bind(this);
      }
      

      async handleChange(term){
          term = term.target.value;
        if (term.length > 0){
            let searchResult = await fetch(`https://service.tib.eu/ts4tib/api/suggest?q=${term}`)
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

      createResultList(term){
          const resultList = []
          console.info(this.state);
          for(let i=0; i < this.state.searchResult.length; i++){
            resultList.push(
                <Link to={`https://service.tib.eu/ts4tib/api/search?q=${term}`} key={i} className="container">
                    <div>
                        {this.state.searchResult[i]['autosuggest']}
                    </div>
                </Link>)
          }
          return resultList
      }

      render(){
          return(
            <Form className="mt-2 mt-md-0 mx-2 search-box mb-2 mb-md-0" inline onSubmit={''} style={{ minWidth: 57 }}>
                <InputGroup>
                <input type="text" className="col-md-12 input" style={{marginTop: 10}}
                    onChange={this.handleChange}
                    placeholder="Search NFDI4Chem TS"
                />
                <Button id="button-main-search" className="ps-2 pe-2 search-icon" type="submit">
                    <Icon icon={faSearch} />
                </Button>
                </InputGroup>

            {this.state.result &&
                <div id = "autocomplete-container" className="col-md-12 justify-content-md-center">{this.createResultList()}</div>}
          </Form>
          )
      }

}

export default SearchForm;