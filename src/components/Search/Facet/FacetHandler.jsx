import React from 'react'
import Facet from './Facet/facet';

class FacetHandler extends React.Component{
    constructor(props){
        super(props)
        this.state = ({
        enteredTerm: "",
        newEnteredTerm: "",
        selectedOntologies: [],
        selectedTypes: [],
        facetFields: [],
        searchResult: [],
        pageNumber: 1,
        pageSize: 10,
        isLoaded: false,
        isFiltered: false
        })
    }
    async handleSelection(ontologies, types){
        let rangeCount = (this.state.pageNumber - 1) * this.state.pageSize
        let baseUrl = `https://service.tib.eu/ts4tib/api/search?q=${this.state.enteredTerm}` + `&start=${rangeCount}`
          ontologies.forEach(item => {
              baseUrl = baseUrl + `&ontology=${item.toLowerCase()}`
            }) 
          types.forEach(item => {
              baseUrl = baseUrl + `&type=${item.toLowerCase()}`
            })      
          let targetUrl = await fetch(baseUrl)
          let filteredSearchResults = (await targetUrl.json())['response']['docs']; 
          this.setState({
            searchResult: filteredSearchResults,
            ontologies: ontologies,
            types: types 
           })
         }
}
export default FacetHandler;