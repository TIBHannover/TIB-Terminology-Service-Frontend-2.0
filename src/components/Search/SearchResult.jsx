import React from 'react'
import queryString from 'query-string';
import {getCollectionOntologies} from '../../api/fetchData';
import Facet from './Facet/facet';
import Pagination from "../common/Pagination/Pagination";
import {setResultTitleAndLabel} from './SearchHelpers';
import { Helmet, HelmetProvider } from 'react-helmet-async';

class SearchResult extends React.Component{
    constructor(props){
        super(props)
        this.state = ({
          enteredTerm: "",
          newEnteredTerm: "",          
          searchResult: [],
          exactResult: [],
          originalSearchResult: [],
          selectedOntologies: [],
          selectedTypes: [],
          selectedCollections: [],
          facetFields: [],
          pageNumber: 1,
          pageSize: 5, 
          isLoaded: false,
          isFiltered: false,          
          totalResults: [],
          facetIsSelected: false
        })
        this.createSearchResultList = this.createSearchResultList.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
        this.searching = this.searching.bind(this);
        this.handleSelection = this.handleSelection.bind(this);                      
        this.paginationHandler = this.paginationHandler.bind(this);
        this.handleExact = this.handleExact.bind(this);
        this.updateURL = this.updateURL.bind(this);
        this.processUrlProps = this.processUrlProps.bind(this);
    }

    /**
     * Run the search based on entered term in the search url.
     */
    async searching(){
      let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
      let enteredTerm = targetQueryParams.q;
      if (enteredTerm.length > 0){
        let searchUrl = process.env.REACT_APP_SEARCH_URL + "?q=" + enteredTerm + "&rows=" + this.state.pageSize;
        let collectionOntologies = await getCollectionOntologies([process.env.REACT_APP_PROJECT_NAME], false);          
        collectionOntologies.forEach(onto => {
          searchUrl = searchUrl + `&ontology=${onto["ontologyId"].toLowerCase()}`;
        });
        
        let searchResult = await fetch(searchUrl)
        let resultJson = (await searchResult.json());              
        searchResult =  resultJson['response']['docs'];
        let facetFields = resultJson['facet_counts'];      
        let totalResults = resultJson['response']['numFound'];        
        this.setState({
          searchResult: searchResult,
          originalSearchResult: searchResult,
          facetFields: facetFields,          
          totalResults: totalResults,          
          isLoaded: true,
          enteredTerm: enteredTerm,
        }, ()=>{this.processUrlProps()});  
      }
      else if (enteredTerm.length === 0){
          this.setState({              
              searchResult: [],
              facetFields: [],
              originalSearchResult: [],
              isLoaded: true,
              enteredTerm: enteredTerm,
              collections: []
          });  
      }
  }


  /**
   * Process the url to check the facet field given in it.
   */
  processUrlProps(){
    let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
    let ontologies = targetQueryParams.ontology;
    let page = targetQueryParams.page;
    let types = targetQueryParams.type;
    let collections = targetQueryParams.collection;
    let facetSelected = false;
    if(typeof(ontologies) === "string"){
      ontologies = [ontologies];
      facetSelected= true;
    }
    else if(typeof(ontologies) === "undefined"){
      ontologies = [];
    }

    if(typeof(types) === "string"){
      types = [types];
      facetSelected= true;
    }
    else if(typeof(types) === "undefined"){
      types = [];
    }

    if(typeof(collections) === "string"){
      collections = [collections];
      facetSelected= true;
    }
    else if(typeof(collections) === "undefined"){
      collections = [];
    }

    if(typeof(page) === "undefined"){
      page = 1;
    }

    this.setState({
      selectedCollections: collections,
      selectedOntologies: ontologies,
      selectedTypes: types,
      pageNumber: parseInt(page),
      facetIsSelected: facetSelected
    }, () => {
      this.handleSelection(ontologies, types, collections);
    });
  }

/**
 * Handle the exact search when chosen by the user (Exact match)
 */
async handleExact(){
  if(this.state.enteredTerm.length > 0){
    let searchUrl = process.env.REACT_APP_SEARCH_URL + `?q=${this.state.enteredTerm}` + "&exact=on&rows=" + this.state.pageSize;
    let collectionOntologies = await getCollectionOntologies([process.env.REACT_APP_PROJECT_NAME], false);      
    collectionOntologies.forEach(onto => {
      searchUrl = searchUrl + `&ontology=${onto["ontologyId"].toLowerCase()}`
    });
    
    let exactResult = await fetch(searchUrl)
    exactResult = (await exactResult.json())['response']['docs'];
    this.setState({
      searchResult: exactResult,
      isLoaded: true 
    })
  }
}

/**
   * Create the search results list view
   *
   * @returns
*/
createSearchResultList () {   
      let searchResultItem = this.state.searchResult;
      const SearchResultList = [];
      for (let i = 0; i < searchResultItem.length; i++) {
        SearchResultList.push(
          <div className="row result-card" key={searchResultItem[i]['id']}>
            <div className='col-sm-10'>
              {setResultTitleAndLabel(searchResultItem[i])}                
              <div className="searchresult-iri">
                {searchResultItem[i].iri}
              </div>
              <div className="searchresult-card-description">
                <p>{searchResultItem[i].description}</p>
              </div>
              <div className="searchresult-ontology">
                <span><b>Ontology: </b></span>
                <a className='btn btn-default ontology-button' href={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + this.state.searchResult[i]['ontology_name']} target="_blank">
                  {searchResultItem[i].ontology_prefix}
                </a>
              </div>
            </div>            
          </div>   
        )
      }       
      return SearchResultList
  }

  /**
    * Update the url based on facet values
    */
   updateURL(ontologies, types, collections){
    let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
    let page = targetQueryParams.page;
    this.props.history.push(window.location.pathname);
    let currentUrlParams = new URLSearchParams();
    for(let typ of types){
      currentUrlParams.append('type', typ);
    }
  
    for(let ontos of ontologies){
      currentUrlParams.append('ontology', ontos);
    }

    for(let col of collections){
      currentUrlParams.append('collection', col);
    }
    
    currentUrlParams.append('page', this.state.pageNumber);
    this.props.history.push(window.location.pathname + "?q=" + this.state.enteredTerm + "&" + currentUrlParams.toString());

   }

  
  /**
   * Runs the facet when a filter is selected
   * @param {*} ontologies 
   * @param {*} types 
   * @param {*} collections 
   */
  async handleSelection(ontologies, types, collections){    
    let rangeCount = (this.state.pageNumber - 1) * this.state.pageSize
    let baseUrl = process.env.REACT_APP_SEARCH_URL + `?q=${this.state.enteredTerm}` + `&start=${rangeCount}` + "&rows=" + this.state.pageSize;
    let totalResultBaseUrl = process.env.REACT_APP_SEARCH_URL + `?q=${this.state.enteredTerm}`;
    let collectionOntologies = [];
    let facetSelected = true;
    
    if(process.env.REACT_APP_PROJECT_ID !== "general" && ontologies.length === 0){          
      /**
       * No ontologies selected. search only in the target project ontologies
       */
       collectionOntologies = await getCollectionOntologies([process.env.REACT_APP_PROJECT_NAME], false);
       collectionOntologies.forEach(onto => {
         baseUrl = baseUrl + `&ontology=${onto["ontologyId"].toLowerCase()}`;
         totalResultBaseUrl +=  `&ontology=${onto["ontologyId"].toLowerCase()}`;
       });
    }   
    else{
      if(collections.length !== 0){
        collectionOntologies = await getCollectionOntologies(collections, false);        
      }
      collectionOntologies.forEach(onto => {
        baseUrl = baseUrl + `&ontology=${onto["ontologyId"].toLowerCase()}`;
        totalResultBaseUrl +=  `&ontology=${onto["ontologyId"].toLowerCase()}`;
      });
    }
    
    ontologies.forEach(item => {
        baseUrl = baseUrl + `&ontology=${item.toLowerCase()}`;
        totalResultBaseUrl += `&ontology=${item.toLowerCase()}`;
    });
    types.forEach(item => {
        baseUrl = baseUrl + `&type=${item.toLowerCase()}`;
        totalResultBaseUrl += `&type=${item.toLowerCase()}`;
    });

    if(ontologies.length === 0 && types.length === 0 && collections.length === 0){
      // no facet field selected
      facetSelected = false;
    }
    
    let targetUrl = await fetch(baseUrl);
    let filteredSearchResults = (await targetUrl.json())['response']['docs'];
    let totalSearch = await fetch(totalResultBaseUrl);
    let totalSaerchResults = (await totalSearch.json())['response'];
    // let facetFields = resultJson['facet_counts'];
    this.setState({
      searchResult: filteredSearchResults,
      selectedOntologies: ontologies,
      selectedTypes: types,
      selectedCollections: collections,
      facetIsSelected: facetSelected,
      totalResults: totalSaerchResults['numFound'] 
      }, () => {
        this.updateURL(ontologies, types, collections);
      });
     }
  
  /**
     * Handle the click on the pagination
     * @param {*} value
     */
   handlePagination (value) {
    this.setState({
      pageNumber: value,
      paginationReset: false
    }, () => {
      this.updateURL(this.state.selectedOntologies,this.state.selectedTypes,this.state.selectedCollections)
      this.paginationHandler()
    })
  }



  /**
     * Count the number of pages for the pagination
     * @returns
     */
  pageCount () {    
    if (isNaN(Math.ceil(this.state.totalResults / this.state.pageSize))){
      return 0;
    }
    return (Math.ceil(this.state.totalResults / this.state.pageSize))
  }


  /**
    * Handle the pagination change. This function has to be passed to the Pagination component
    */
   async paginationHandler () {
    let ontologies = this.state.selectedOntologies;
    let types = this.state.selectedTypes;
    let collections = this.state.selectedCollections;
    let rangeCount = (this.state.pageNumber - 1) * this.state.pageSize;
    let baseUrl = process.env.REACT_APP_SEARCH_URL + `?q=${this.state.enteredTerm}` + `&start=${rangeCount}` + "&rows=" + this.state.pageSize;
    if(ontologies.length > 0 || types.length > 0 || collections.length > 0){
      // Add other selected filters 
        ontologies.forEach(item => {
          baseUrl = baseUrl + `&ontology=${item.toLowerCase()}`
        }) 
        types.forEach(item => {
          baseUrl = baseUrl + `&type=${item.toLowerCase()}`
        })
       let collectionOntologies = await getCollectionOntologies(collections, false);
        collectionOntologies.forEach(onto => {
          baseUrl = baseUrl + `&ontology=${onto["ontologyId"].toLowerCase()}`
        });
        this.updateURL(ontologies, types, collections)        
     }
     else{
      // No extra filter. Get the target project ontologies
      let collectionOntologies = await getCollectionOntologies([process.env.REACT_APP_PROJECT_NAME], false);
      collectionOntologies.forEach(onto => {
        baseUrl = baseUrl + `&ontology=${onto["ontologyId"].toLowerCase()}`
      });
     }

    let targetUrl = await fetch(baseUrl)
    let resultJson = (await targetUrl.json());
    let newResults = resultJson['response']['docs']
    this.setState({
      searchResult: newResults
    })
     
  }

  
  componentDidMount(){
    if(!this.state.isLoaded && !this.state.isFiltered){
      this.searching();
      let cUrl = window.location.href;        
      if(cUrl.includes("q=")){
        cUrl = cUrl.split("q=")[1];
        cUrl = cUrl.split("&")[0];
        cUrl = decodeURIComponent(cUrl);
        cUrl = cUrl.replaceAll("+", " ");
        document.getElementById("s-field").value = cUrl;
      }       
    }     
  }

  render(){
    return(
      <div className='row justify-content-center' id="searchterm-wrapper">
        <HelmetProvider>
        <div>
          <Helmet>
            <title>{this.state.enteredTerm}</title>
          </Helmet>
        </div>
        </HelmetProvider>
        <div className='col-sm-8'>            
          <div className='row'>
            <div className='col-sm-4'>          
              {(this.state.searchResult.length > 0 || (this.state.searchResult.length === 0 && this.state.facetIsSelected)) &&
                <Facet
                  facetData = {this.state.facetFields}
                  handleChange = {this.handleSelection}              
                  selectedCollections = {this.state.selectedCollections}
                  selectedOntologies = {this.state.selectedOntologies}
                  selectedTypes = {this.state.selectedTypes}
                />
              }              
            </div>
            <div className='col-sm-8' id="search-list-grid">
              {this.state.searchResult.length > 0 && <h3 className="text-dark">{this.state.totalResults + ' results found for "' + this.state.enteredTerm + '"'   }</h3>}              
              {this.state.searchResult.length > 0 && this.createSearchResultList()} 
              {this.state.searchResult.length > 0 && 
                <Pagination 
                  clickHandler={this.handlePagination} 
                  count={this.pageCount()}
                  initialPageNumber={this.state.pageNumber}          
                />
              } 

              {this.state.searchResult.length === 0 && <h3 className="text-dark">{'No search results for "' + this.state.enteredTerm + '"'   }</h3>} 
              </div>
            </div>
        </div>                
      </div>
    )
  }
}

export default SearchResult;