import React from 'react'

class SearchForm extends React.Component{
    constructor (props) {
        super(props)
        this.state = ({
          term: "",
          result: false
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

      render(){
          return(
            <div className="container">
            {this.state.result &&
            <input type="text" className="col-md-12 input" style={{marginTop: 10}}
            onChange={this.handleChange}
            placeholder="Search NFDI4Chem TS"
          />}
          </div>
          )
      }

}

export default SearchForm;