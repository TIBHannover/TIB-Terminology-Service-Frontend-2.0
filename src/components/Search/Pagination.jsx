import React from 'react'


class Pagination extends React.Component{
  constructor(props){
    super(props)
    this.setState({
      searchResult: [],
      paginated: false,
      searchTerm: '',
      startIndex: 0,
      endIndex: 9
    })
    this.paginating = this.paginating.bind(this)
    this.prevClick = this.prevClick.bind(this)
    this.nextClick = this.nextClick.bind(this)
  }

  async paginating(searchTerm){
    let searchResult = await fetch(`https://service.tib.eu/ts4tib/api/search?q=${searchTerm}`)
        let resultJson = (await searchResult.json());
        searchResult =  resultJson['response']['docs'];
        let paginationFields = resultJson['response']; 
        this.state.startIndex = paginationFields['start']
        let totalResults = paginationFields['numsFound'] 
      this.setState({
         searchResult: searchResult,
         paginationFields: paginationFields,
         totalResults: totalResults,
         paginated: true
      })    
  }

  prevClick(){
    let searchResult = this.state.searchResult + `&start=${this.state.startIndex}`
    this.setState({
      searchResult: searchResult,
      startIndex : this.state.startIndex - 10,
      endIndex : this.state.endIndex - 10
  })
  }

  nextClick(){
    let searchResult = this.state.searchResult + `&start=${this.state.startIndex}`
    this.setState({
      searchResult: searchResult, 
      startIndex : this.state.startIndex + 10,
      endIndex : this.state.endIndex + 10
  })
  }
  
  render(){
    return(
      <div className="pagination-elements">
        <h4> Showing results from {this.state.startIndex} to {this.state.endIndex} of {this.state.totalResults} results</h4>
         <div className="click-elements">
            <h4>Previous{this.prevClick}</h4>
            <h4>Next{this.nextClick}</h4>
         </div>
      </div>
    )
  }

}

export default Pagination
