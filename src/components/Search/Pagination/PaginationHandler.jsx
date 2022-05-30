import React from 'react'

class Pagination extends React.Component{
    constructor(props){
        super(props)
        this.state = ({
        startIndex: 0,
        endIndex: 9,  
        pageNumber: 1,
        pageSize: 10,
        selectedOntologies: [],
        selectedTypes: []
        })
    }
    /**
     * Handle the click on the pagination
     * @param {*} value
     */
   handlePagination (value) {
    this.setState({
      pageNumber: value
    }, () => {
      this.paginationHandler()
    })
  }



  /**
     * Count the number of pages for the pagination
     * @returns
     */
  pageCount () {
    return (Math.ceil(this.state.totalResults / this.state.pageSize))
  }

  /**
       * Handle the pagination change. This function has to be passed to the Pagination component
       */
   async paginationHandler () {
    let ontologies = this.state.ontologies
    let types = this.state.types
    let rangeCount = (this.state.pageNumber - 1) * this.state.pageSize
    let baseUrl = `https://service.tib.eu/ts4tib/api/search?q=${this.state.enteredTerm}` + `&start=${rangeCount}`
    if(ontologies > 0 && types > 0){
      ontologies.forEach(item => {
        baseUrl = baseUrl + `&ontology=${item.toLowerCase()}`
      }) 
      types.forEach(item => {
        baseUrl = baseUrl + `&type=${item.toLowerCase()}`
      })
      console.info(baseUrl)
      let targetUrl = await fetch(baseUrl)
      let newResults = (await targetUrl.json())['response']['docs']
      this.setState({
        searchResult: newResults
     })
     }
     else{
      let targetUrl = await fetch(baseUrl)
      console.info(targetUrl)
      let resultJson = (await targetUrl.json());
      let newResults = resultJson['response']['docs']
      this.setState({
        searchResult: newResults
     })
     }
     
  }
}

export default Pagination;