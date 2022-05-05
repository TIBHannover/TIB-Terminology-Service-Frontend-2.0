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

  async paginating(){
    let searchResult = await fetch(`https://service.tib.eu/ts4tib/api/search?q=${searchTerm}`)
        let resultJson = (await searchResult.json());
        searchResult =  resultJson['response']['docs'];
        let paginationFields = resultJson['response'];     
  }

  handlePageClick(){

  }
  
  render(){
    return(
      <div className="pagination-elements">
        <ReactPaginate
           previousLabel={"previous"}
           nextLabel={"next"}
           onPageChange={handlePageClick}   
        />

      </div>
    )
  }

}

export default Pagination
