import React from 'react'
import queryString from 'query-string';
import {getCollectionOntologies, getAllOntologies} from '../../api/fetchData';
import Facet from './Facet/facet';
import Pagination from "../common/Pagination/Pagination";
import {setResultTitleAndLabel, createEmptyFacetCounts, setOntologyForFilter, setFacetCounts} from './SearchHelpers';
import Toolkit from '../common/Toolkit';
import { AlsoInHelpers } from "./AlsoInHelpers";
import { apiHeaders } from '../../api/headers';

class SearchResult extends React.Component{
    constructor(props){
        super(props)
        this.state = ({
          enteredTerm: "",
          newEnteredTerm: "",          
          searchResult: [],
          exactResult: [],
          obsoletesResult: [],
          originalSearchResult: [],
          selectedOntologies: [],
          selectedTypes: [],
          selectedCollections: [],
          facetFields: [],
          pageNumber: 1,
          pageSize: 10, 
          isLoaded: false,
          isFiltered: false,          
          totalResults: [],
          expandedResults: [],
          totalResultsCount: [],
          facetIsSelected: false,
          exact: false,
          obsoletes: false
        })
        this.createSearchResultList = this.createSearchResultList.bind(this);
        this.handlePagination = this.handlePagination.bind(this);        
        this.runSearch = this.runSearch.bind(this);                      
        this.paginationHandler = this.paginationHandler.bind(this);
        this.handleExact = this.handleExact.bind(this);
        this.updateURL = this.updateURL.bind(this);
        this.alsoInResult = this.alsoInResult.bind(this);
        this.setComponentData = this.setComponentData.bind(this);
        this.handleAlsoResult = this.handleAlsoResult.bind(this);
        this.handlePageSizeDropDownChange = this.handlePageSizeDropDownChange.bind(this);
        this.facetButton = this.facetButton.bind(this);
        this.handleOntoDelete = this.handleOntoDelete.bind(this);
        this.handleTypDelete = this.handleTypDelete.bind(this);
        this.handleColDelete = this.handleColDelete.bind(this);
        this.handleObsolete =  this.handleObsolete.bind(this);
    }


  
  setComponentData(){
    let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);  
    let enteredTerm = targetQueryParams.q;  
    let ontologies = targetQueryParams.ontology;
    let obsoletes = targetQueryParams.obsoletes;
    let exact = targetQueryParams.exact;
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
      obsoletes: obsoletes,
      exact: exact,
      pageNumber: parseInt(page),
      facetIsSelected: facetSelected,
      isLoaded: true,
      enteredTerm: enteredTerm
    }, () => {
      this.runSearch(ontologies, types, collections,obsoletes,exact, "");
    });
  }



 /**
   * Runs the Search and facet filtering (combination of the old searching() and handleSelection() functions)
   * @param {*} ontologies 
   * @param {*} types 
   * @param {*} collections 
   * @param {*} triggerField : which facet fields triggers the function. Values: type, ontology, collection
   */
 async runSearch(ontologies, types, collections, obsoletes,exact, triggerField){    
  let rangeCount = (this.state.pageNumber - 1) * this.state.pageSize
  let baseUrl = process.env.REACT_APP_SEARCH_URL + `?q=${this.state.enteredTerm}` + `&start=${rangeCount}` + `&groupField=iri` + "&rows=" + this.state.pageSize;
  let totalResultBaseUrl = process.env.REACT_APP_SEARCH_URL + `?q=${this.state.enteredTerm}`;
  let collectionOntologies = [];
  let facetSelected = true;
  let facetData = this.state.facetFields;
  let ontologiesForFilter = [];
  if(ontologies.length === 0 && types.length === 0 && collections.length === 0){
    // no facet field selected
    facetSelected = false;
  }
  if(process.env.REACT_APP_PROJECT_ID === "general"){
     // TIB general
    ontologiesForFilter = await setOntologyForFilter(ontologies, collections);
    if(ontologiesForFilter[0].length === 0 && ontologiesForFilter[1] !== "all"){
      // The result set has to be empty
      let allOntologies = await getAllOntologies();          
      let facetData = createEmptyFacetCounts(allOntologies);                              
      this.setState({
        searchResult: [],
        selectedOntologies: ontologies,
        selectedTypes: types,
        selectedCollections: collections,
        facetIsSelected: facetSelected,
        totalResultsCount: 0,
        facetFields: facetData
        }, () => {
          this.updateURL(ontologies, types, collections,obsoletes,exact);
        });
        return true;
    }   
    types.forEach(item => {
        baseUrl = baseUrl + `&type=${item.toLowerCase()}`;
        totalResultBaseUrl += `&type=${item.toLowerCase()}`;
    });
     
    ontologiesForFilter[0].forEach(item => {
        baseUrl = baseUrl + `&ontology=${item.toLowerCase()}`;
        totalResultBaseUrl += `&ontology=${item.toLowerCase()}`;
    });

  }
  else{    
    /**
     * NFDIs
     * Search only in the target project ontologies (not general)
     */    
    ontologiesForFilter = await setOntologyForFilter(ontologies, [process.env.REACT_APP_PROJECT_NAME]);    
    collections = [process.env.REACT_APP_PROJECT_NAME];
    types.forEach(item => {
        baseUrl = baseUrl + `&type=${item.toLowerCase()}`;
        totalResultBaseUrl += `&type=${item.toLowerCase()}`;
    });
    
    ontologiesForFilter[0].forEach(item => {
        baseUrl = baseUrl + `&ontology=${item.toLowerCase()}`;
        totalResultBaseUrl += `&ontology=${item.toLowerCase()}`;
    });
  }
  
  if(obsoletes){
    this.handleObsolete();
  }

  if(exact){
    this.handleExact();
  }
  
  let filteredSearch = await (await fetch(baseUrl, {
    mode: 'cors',
    headers: apiHeaders(),
  })).json();
  let filteredSearchResults = filteredSearch['response']['docs'];
  let expandedResults = await (await fetch(baseUrl,{mode: 'cors', headers: apiHeaders(),})).json();
  expandedResults = expandedResults['expanded'];    
  let totalSearch = await (await fetch(totalResultBaseUrl, {mode: 'cors', headers: apiHeaders(),})).json();
  let totalSaerchResultsCount = totalSearch['response']['numFound'];
  let filteredFacetFields = totalSearch['facet_counts'];
  filteredFacetFields = await setFacetCounts(triggerField, this.state.enteredTerm, filteredFacetFields, facetData, collections, types, ontologiesForFilter[0]);    
  this.setState({
    searchResult: filteredSearchResults,
    selectedOntologies: ontologies,
    selectedTypes: types,
    selectedCollections: collections,
    facetIsSelected: facetSelected,
    totalResultsCount: totalSaerchResultsCount,
    facetFields: filteredFacetFields,
    expandedResults: expandedResults
    }, () => {
      this.updateURL(ontologies, types, collections,obsoletes,exact);
    });
}


/**
 * Handle the exact search when chosen by the user (Exact match)
 */
async handleExact(){
  if(this.state.enteredTerm.length > 0){
    let searchUrl = process.env.REACT_APP_SEARCH_URL + `?q=${this.state.enteredTerm}` + "&exact=true&rows=" + this.state.pageSize; 
    let exactResult = await fetch(searchUrl, {mode: 'cors', headers: apiHeaders(),})
    exactResult = (await exactResult.json())['response']['docs'];
    this.setState({
      searchResult: exactResult,
      isLoaded: true 
    })
  }
}

/**
 * Handle the obsolete search term when chosen by the user
 */
async handleObsolete(){
  if(this.state.enteredTerm.length > 0){
    let searchUrl = process.env.REACT_APP_SEARCH_URL + `?q=${this.state.enteredTerm}` + "&obsoletes=true&rows=" + this.state.pageSize;
    let obsoletesResult = await fetch(searchUrl, {mode: 'cors', headers: apiHeaders(),})
    obsoletesResult = (await obsoletesResult.json())['response']['docs'];
    this.setState({
      searchResult: obsoletesResult,
      isLoaded: true 
    })
  }
}



/**
 * Displaying 'Also in' in search result items
 */

alsoInResult(iri){
  let expanded = this.state.expandedResults;
  let otherOntologies = [];
  if(typeof(expanded) !== "undefined"){
    for(let key in expanded){
      if(key === iri){
        let allTags = expanded[key]['docs']
             for(let j=0; j < allTags.length; j++){              
               otherOntologies.push(
                <div className='also-in-ontologies'>
                  {AlsoInHelpers(allTags[j])} 
                </div>                                             
               )
             }            
      }
    }     
  } 
  return otherOntologies;
}

handleAlsoResult(iri){
  if((this.alsoInResult(iri)).length !== 0){
    return true;
  }
  else{
    return false
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
              <br/>
              {this.handleAlsoResult(searchResultItem[i].iri) &&
              <div className = "also-in-design">
                  <b>Also in:</b>
                </div>}
               {this.alsoInResult(searchResultItem[i].iri)}
            </div>            
          </div>   
        )
      }       
      return SearchResultList
  }

  /**
    * Update the url based on facet values
    */
   updateURL(ontologies, types, collections, obsoletes, exact){
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

    if(obsoletes){
      currentUrlParams.set('obsoletes', true);
    }

    if(exact){
      currentUrlParams.set('exact', true);
    }
    this.props.history.push(window.location.pathname + "?q=" + this.state.enteredTerm + "&" + currentUrlParams.toString());

   }

  /**
    * Handles the page size values from dropdown
    * @param {*} value
    */
  handlePageSizeDropDownChange(e){
    let size = parseInt(e.target.value);
    let pageNumber = this.state.pageNumber + 1;
    this.setState({
      pageSize: size
    });
    this.setComponentData();
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
    if (isNaN(Math.ceil(this.state.totalResultsCount / this.state.pageSize))){
      return 0;
    }
    return (Math.ceil(this.state.totalResultsCount / this.state.pageSize))
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

    let targetUrl = await fetch(baseUrl,{
      mode: 'cors',
      headers: apiHeaders(),
    })
    let resultJson = (await targetUrl.json());
    let newResults = resultJson['response']['docs']
    this.setState({
      searchResult: newResults
    })
     
  }

  handleOntoDelete(){
    let ontologies = this.state.selectedOntologies
    let params = new URLSearchParams(window.location.search)
    for(let i=0; i< ontologies.length; i++){
      params.delete('ontology', ontologies[i])
    }
    
    window.location.replace(window.location.pathname + "?" + params.toString());
  }

  handleTypDelete(){
    let types = this.state.selectedTypes;
    let params = new URLSearchParams(window.location.search)
    for(let i=0; i< types.length; i++){
      params.delete('type', types[i])
    }
    
    window.location.replace(window.location.pathname + "?" + params.toString());
  }

  handleColDelete(){
    let collections = this.state.selectedCollections;
    let params = new URLSearchParams(window.location.search)
    for(let i=0; i< collections.length; i++){
      params.delete('collection', collections[i])
    }
    
    window.location.replace(window.location.pathname + "?" + params.toString());
  }

  /**
    * facet buttons listing as per facet selections
    */
  facetButton(){
    let ontologies = this.state.selectedOntologies;
    let types = this.state.selectedTypes;
    let collections = this.state.selectedCollections;
    let facetRow = [];
    for(let onto of ontologies){     
        facetRow.push(
          <div className='col-sm-2'>
            <a className='facet-btn' href>{onto}
              <i onClick={this.handleOntoDelete} className="fa fa-remove remove-btn \n"></i>
            </a>
          </div>
        )     
    }
    for(let typ of types){    
        facetRow.push(
          <div className='col-sm-2'>
            <a className='facet-btn' href>{typ}
              <i onClick={this.handleTypDelete} className="fa fa-remove remove-btn \n"></i>
            </a>
          </div>
        )
      }
      if(process.env.REACT_APP_PROJECT_ID === "general"){
        for(let col of collections){    
          facetRow.push(
            <div className='col-sm-2'>
              <a className='facet-btn' href>{col}
                <i onClick={this.handleColDelete} className="fa fa-remove remove-btn \n"></i>
              </a>
            </div>
          )
        }
      }
    
    return facetRow;

  }

  
  componentDidMount(){
    if(!this.state.isLoaded && !this.state.isFiltered){      
      this.setComponentData();
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
        {Toolkit.createHelmet(this.state.enteredTerm)}        
        <div className='col-sm-8'>            
          <div className='row'>
            <div className='col-sm-4'>          
              {(this.state.searchResult.length > 0 || (this.state.searchResult.length === 0 && this.state.facetIsSelected)) &&
                <Facet
                  facetData = {this.state.facetFields}
                  handleChange = {this.runSearch}             
                  selectedCollections = {this.state.selectedCollections}
                  selectedOntologies = {this.state.selectedOntologies}
                  selectedTypes = {this.state.selectedTypes}
                />
              }              
            </div>
            <div className='col-sm-8' id="search-list-grid">
              {this.state.searchResult.length > 0 && <h3 className="text-dark">{this.state.totalResultsCount + ' results found for "' + this.state.enteredTerm + '"'   }</h3>}
                 <div className='row'>
                   {this.facetButton()} 
                  </div>  
                 <div className='row'>                                                      
                    <div className='col-sm-4 search-dropdown'>     
                      <div class="form-group">
                        <label for="list-result-per-page" className='col-form-label'>Results Per Page</label>
                          <select className='site-dropdown-menu list-result-per-page-dropdown-menu dropdown-colour' id="list-result-per-page" value={this.state.pageSize} onChange={this.handlePageSizeDropDownChange}>
                            <option value={10} key="10">10</option>
                            <option value={20} key="20">20</option>
                            <option value={30} key="30">30</option>
                            <option value={40} key="40">40</option>
                          </select>  
                       </div>
                    </div> 
                  </div>
                 
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