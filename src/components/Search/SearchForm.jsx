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

}

export default SearchForm;