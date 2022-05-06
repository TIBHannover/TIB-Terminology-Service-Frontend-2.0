import React from 'react'
import ReactPaginate from 'react-paginate'


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
        let startIndex = paginationFields['start']
        let totalResults = paginationFields['numsFound'] 
      this.setState({
         searchResult: searchResult,
         paginationFields: paginationFields,
         paginated: true
      })    
  }

  prevClick(prevstate){
    this.setState({
      startIndex : prevstate.startIndex - 10,
      endIndex : prevstate.endIndex - 10
  })
  }

  nextClick(prevstate){
    this.setState({
      startIndex : prevstate.startIndex + 10,
      endIndex : prevstate.endIndex + 10
  })
  }

  handlePageClick(){

  }
  
  render(){
    return(
      <div className="pagination-elements">
        <h4> Showing results from {this.startIndex} to {this.endIndex} of {this.totalResults} results</h4>
        <ReactPaginate
           previousLabel={"Previous"}{...this.prevClick}
           nextLabel={"Next"}{...this.nextClick}
           onPageChange={''}   
        />

      </div>
    )
  }

}

export default Pagination
