import React from 'react'
import { Link } from 'react-router-dom';

class SearchForm extends React.Component{
    constructor (props) {
        super(props)
        this.state = ({
          term: "",
          result: false,
          searchResult: []
        })
      }

      async handleChange(term){
          console.info(term)
        if (term.length > 0){
            let searchResult = await fetch(`https://service.tib.eu/ts4tib/api/suggest?q=${term}`)
            searchResult =  (await searchResult.json()).results;
            
         this.setState({
             searchResult: searchResult,
             result: true
         });
        }
      }

      createResultList(){
          const resultList = []
          for(let i=0; i < this.state.searchResult.length; i++){
            resultList.push(
                <Link to={''} key={i} className="container"/>)
          }
          return resultList
      }

      render(){
          return(
            <div className="container">
                <input type="text" className="col-md-12 input" style={{marginTop: 10}}
                    onChange={this.handleChange}
                    placeholder="Search NFDI4Chem TS"
                />
            {this.state.result &&
                <div>{this.createResultList()}</div>}
          </div>
          )
      }

}

export default SearchForm;