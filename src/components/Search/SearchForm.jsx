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

      async autoSearch(){
        let result = await fetch(`https://service.tib.eu/ts4tib/api/suggest?q=`)
        return (await result.json()).results;
      }

      async handleChange(term){
        if (term > 0){
         this.setState({
             result: true
         });
        }
      }

      createResultList(){
          const resultList = []
          for(let i=0; i < this.state.term.length; i++){
            const item = this.state.term[i]
            resultList.push(this.state.term &&
                <Link to={''} key={i} className=""/>)
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