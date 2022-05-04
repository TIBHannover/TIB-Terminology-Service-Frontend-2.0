import React from 'react'
import ReactPaginate from 'react-paginate'


class Pagination extends React.Component{
  constructor(props){
    super(props)
    this.setState({

    })
  }

  async paginating(){
      
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
