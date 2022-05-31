import React from 'react'
import queryString from 'query-string';

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
        this.handlePagination = this.handlePagination.bind(this);
        this.pageCount = this.pageCount.bind(this);
        this.searching = this.searching.bind(this);
        this.paginationHandler = this.paginationHandler.bind(this);
    }
    /**
     * Fetch the json terms
     */
    async searching(){
        let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
        let enteredTerm = targetQueryParams.q
        if (enteredTerm.length > 0){
          let searchResult = await fetch(`https://service.tib.eu/ts4tib/api/search?q=${enteredTerm}`)
          let resultJson = (await searchResult.json());
          searchResult =  resultJson['response']['docs'];
          let facetFields = resultJson['facet_counts'];
          let paginationResult = resultJson['response']
          let totalResults = paginationResult['numFound']
          this.setState({
            searchResult: searchResult,
            originalSearchResult: searchResult,
            facetFields: facetFields,
            paginationResult: paginationResult,
            totalResults: totalResults,
            result: true,
            isLoaded: true,
            enteredTerm: enteredTerm
          });  
        }
        else if (enteredTerm.length == 0){
            this.setState({
                result: false,
                searchResult: [],
                facetFields: [],
                originalSearchResult: [],
                isLoaded: true,
                enteredTerm: enteredTerm
            });  
        }
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