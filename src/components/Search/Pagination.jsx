import React from 'react'
import ReactPaginate from 'react-paginate'


class Pagination extends React.Component{
  constructor(props){
    super(props)
    this.setState({
      searchResult: [],
      searchTerm: ''
    })
    this.paginating = this.paginating.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
  }

  async paginating(searchTerm){
    let totalResults = this.props.totalResults;
    let searchResult = await fetch(`https://service.tib.eu/ts4tib/api/search?q=${searchTerm}`)
        let resultJson = (await searchResult.json());
        searchResult =  resultJson['response']['docs'];
        let paginationFields = resultJson['response']; 
        paginationFields = searchResult + ['start']
        totalResults = totalResults['numsFound'] 
      this.setState({
         searchResult: searchResult,
         paginationFields: paginationFields
      })    
  }

  handlePageClick(){

  }
  
  render(){
    return(
      <div className="pagination-elements">
        <ReactPaginate
           previousLabel={"previous"}
           nextLabel={"next"}
           onPageChange={''}   
        />

      </div>
    )
  }

}

export default Pagination
