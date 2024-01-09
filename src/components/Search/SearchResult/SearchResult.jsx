import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import {getCollectionOntologies, getAllOntologies, getAllCollectionsIds} from '../../../api/fetchData';
import Facet from '../Facet/facet';
import Pagination from "../../common/Pagination/Pagination";
import {setResultTitleAndLabel, createEmptyFacetCounts, setOntologyForFilter, setFacetCounts} from './SearchHelpers';
import Toolkit from '../../common/Toolkit';
import { AlsoInHelpers } from "./AlsoInHelpers";
import { apiHeaders } from '../../../api/headers';
import '../../layout/searchResult.css';
import '../../layout/facet.css';



const SearchResult = (props) => {

  let currentUrlParams = new URL(window.location).searchParams;
  let searchQueryInUrl = currentUrlParams.get('q') ? currentUrlParams.get('q') : "";
  let ontologiesInUrl = currentUrlParams.get('ontology') ? currentUrlParams.getAll('ontology') : [];
  let collectionsInUrl = currentUrlParams.get('collection') ? currentUrlParams.getAll('collection') : [];
  let typesInUrl = currentUrlParams.get('type') ? currentUrlParams.getAll('type') : [];
  let obsoleteFlagInUrl = currentUrlParams.get('obsoletes') === "true" ? true : false; 
  let exactFlagInUrl = currentUrlParams.get('exact') === "true" ? true : false;
  let pageInUrl = currentUrlParams.get('page') ? currentUrlParams.get('page') : 1;
  let sizeInUrl = currentUrlParams.get('size') ? currentUrlParams.get('size') : 10;


  const [searchQuery, setSearchQuery] = useState(searchQueryInUrl);
  const [searchResult, setSearchResult] = useState([]);
  const [selectedOntologies, setSelectedOntologies] = useState(ontologiesInUrl);
  const [selectedTypes, setSelectedTypes] = useState(typesInUrl);
  const [selectedCollections, setSelectedCollections] = useState(collectionsInUrl);
  const [facetFields, setFacetFields] = useState([]);
  const [pageNumber, setPageNumber] = useState(parseInt(pageInUrl));
  const [pageSize, setPageSize] = useState(parseInt(sizeInUrl));
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [expandedResults, setExpandedResults] = useState([]);
  const [totalResultsCount, setTotalResultsCount] = useState([]);
  const [facetIsSelected, setFacetIsSelected] = useState(false);
  const [exact, setExact] = useState(exactFlagInUrl);
  const [obsoletes, setObsoletes] = useState(obsoleteFlagInUrl);
  const [allCollectionIds, setAllCollectionIds] = useState([]);

  const history = useHistory();


  async function getAllCollectionIds(){
    // Fetch all collection Ids for TIB General to show in the facet.
    if(process.env.REACT_APP_PROJECT_ID === "general"){
      let collectionIds = await getAllCollectionsIds(false);
      setAllCollectionIds(collectionIds);
      return true;
    }
    return []; 
  }


  async function search(){    
    let rangeStart = (pageNumber - 1) * pageSize
    let baseUrl = process.env.REACT_APP_SEARCH_URL + `?q=${searchQuery}` + `&start=${rangeStart}` + `&groupField=iri` + "&rows=" + pageSize;     
    if(selectedOntologies.length !== 0){
      baseUrl += `&ontology=${selectedOntologies.join(',')}`
    }
    if(selectedTypes.length !== 0){
      baseUrl += `&type=${selectedTypes.join(',')}`
    }
    if(process.env.REACT_APP_PROJECT_NAME === "" && selectedCollections.length !== 0){
      // If TIB General. Set collections if exist in filter
      baseUrl += `&schema=collection&classification=${selectedCollections.join(',')}`;
    }
    if(process.env.REACT_APP_PROJECT_NAME !== ""){
      // Projects such as NFDI$CHEM. pre-set the target collection on each search
      baseUrl += `&schema=collection&classification=${process.env.REACT_APP_PROJECT_NAME}`;
    }

    if(obsoletes){
      baseUrl += "&obsoletes=true";
    }
 
    if(exact){
      baseUrl += "&exact=true";
    }

    let result = await (await fetch(baseUrl, {mode: 'cors', headers: apiHeaders()})).json();    
    setSearchResult(result['response']['docs']);
    setTotalResultsCount(result['response']['numFound']);
    setFacetFields(result['facet_counts']);
  }


  function alsoInResult(iri){
    let expanded = expandedResults;
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


  function handleAlsoResult(iri){
    if((alsoInResult(iri)).length !== 0){
      return true;
    }
    else{
      return false
    }
  }



  function createSearchResultList () {         
      const SearchResultList = [];
      for (let i = 0; i < searchResult.length; i++) {
        SearchResultList.push(
          <div className="row result-card" key={searchResult[i]['id']}>
            <div className='col-sm-10'>
              {setResultTitleAndLabel(searchResult[i])}                
              <div className="searchresult-iri">
                {searchResult[i].iri}
              </div>
              <div className="searchresult-card-description">
                <p>{searchResult[i].description}</p>
              </div>
              <div className="searchresult-ontology">
                <span><b>Ontology: </b></span>
                <a className='btn btn-default ontology-button' href={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + searchResult[i]['ontology_name']} target="_blank">
                  {searchResult[i].ontology_prefix}
                </a>
              </div>
              <br/>
              {handleAlsoResult(searchResult[i].iri) &&
              <div className = "also-in-design">
                  <b>Also in:</b>
                </div>}
              {alsoInResult(searchResult[i].iri)}
            </div>            
          </div>   
        )
      }       
      return SearchResultList
  }



  function handlePageSizeDropDownChange(e){
    let size = parseInt(e.target.value);
    setPageSize(size);  
    let searchUrl = new URL(window.location);
    searchUrl.searchParams.set('size', size); 
    history.replace({...history.location, search: searchUrl.searchParams.toString()});    
  }



  function  handlePagination (value) {
    setPageNumber(value);
    let searchUrl = new URL(window.location);
    searchUrl.searchParams.set('page', value); 
    history.replace({...history.location, search: searchUrl.searchParams.toString()});    
  }



  function pageCount () {    
    if (isNaN(Math.ceil(totalResultsCount / pageSize))){
      return 0;
    }
    return (Math.ceil(totalResultsCount / pageSize))
  }



  function handleTypeFacetSelection(e){
    let targetType = e.target.value;   
    let searchUrl = new URL(window.location); 
    let selectedTypeList = [...selectedTypes];
    if(e.target.checked){
      searchUrl.searchParams.append('type', targetType);
      selectedTypeList.push(targetType);            
    }
    else{
        let index = selectedTypeList.indexOf(targetType);
        selectedTypeList.splice(index, 1);    
        searchUrl.searchParams.delete('type');        
    }    
    history.replace({...history.location, search: searchUrl.searchParams.toString()});  
    setSelectedTypes(selectedTypeList);
  }
  
  
  
  function  handleOntologyFacetSelection(e){
    let searchUrl = new URL(window.location);     
    let selectedOntologiesList = [...selectedOntologies];
    let targetOntologyId = e.target.value.toLowerCase();
    if(e.target.checked){
        searchUrl.searchParams.append('ontology', targetOntologyId);
        selectedOntologiesList.push(targetOntologyId);
    }
    else{
        let index = selectedOntologiesList.indexOf(targetOntologyId);
        selectedOntologiesList.splice(index, 1);            
        searchUrl.searchParams.delete('ontology', targetOntologyId);
    }    
    history.replace({...history.location, search: searchUrl.searchParams.toString()});    
    setSelectedOntologies(selectedOntologiesList);             
  }


  function handleCollectionFacetSelection(e){
    let searchUrl = new URL(window.location);  
    let selectedCollectionsList = [...selectedCollections];
    let targetCollection =  e.target.value.trim();
    if(e.target.checked){
        selectedCollectionsList.push(targetCollection);
        searchUrl.searchParams.append('collection', targetCollection);         
    }
    else{
        let index = selectedCollectionsList.indexOf(targetCollection);
        selectedCollectionsList.splice(index, 1); 
        searchUrl.searchParams.delete('collection', targetCollection);           
    }
    history.replace({...history.location, search: searchUrl.searchParams.toString()});
    setSelectedCollections(selectedCollectionsList);
  }


  function handleOntoDelete(){
    let ontologies = selectedOntologies
    let params = new URLSearchParams(window.location.search)
    for(let i=0; i< ontologies.length; i++){
      params.delete('ontology', ontologies[i])
    }
    
    window.location.replace(window.location.pathname + "?" + params.toString());
  }

  
  function handleTypDelete(){
    let types = selectedTypes;
    let params = new URLSearchParams(window.location.search)
    for(let i=0; i< types.length; i++){
      params.delete('type', types[i])
    }
    
    window.location.replace(window.location.pathname + "?" + params.toString());
  }

  
  function handleColDelete(){
    let collections = selectedCollections;
    let params = new URLSearchParams(window.location.search)
    for(let i=0; i< collections.length; i++){
      params.delete('collection', collections[i])
    }
    
    window.location.replace(window.location.pathname + "?" + params.toString());
  }



  function facetButton(){    
    let facetRow = [];
    for(let onto of selectedOntologies){     
        facetRow.push(
          <div className='col-sm-2'>
            <a className='facet-btn' href>{onto}
              <i onClick={handleOntoDelete} className="fa fa-remove remove-btn \n"></i>
            </a>
          </div>
        )     
    }
    for(let typ of selectedTypes){    
        facetRow.push(
          <div className='col-sm-2'>
            <a className='facet-btn' href>{typ}
              <i onClick={handleTypDelete} className="fa fa-remove remove-btn \n"></i>
            </a>
          </div>
        )
      }
      if(process.env.REACT_APP_PROJECT_ID === "general"){
        for(let col of selectedCollections){    
          facetRow.push(
            <div className='col-sm-2'>
              <a className='facet-btn' href>{col}
                <i onClick={handleColDelete} className="fa fa-remove remove-btn \n"></i>
              </a>
            </div>
          )
        }
      }
    
    return facetRow;

  }


  useEffect(() => {
    search();
    getAllCollectionIds();
  }, []);


  useEffect(() => {
      search();
  }, [pageNumber, pageSize, selectedOntologies, selectedTypes, selectedCollections]);



  return(
    <div className='row justify-content-center search-result-container' id="searchterm-wrapper">
      {Toolkit.createHelmet(searchQuery)}        
      <div className='col-sm-11'>            
        <div className='row'>
          <div className='col-sm-4'>          
            {(searchResult.length > 0 || (searchResult.length === 0 && facetIsSelected)) &&
              <Facet
                facetData = {facetFields}
                handleChange = {search}             
                selectedCollections = {selectedCollections}
                selectedOntologies = {selectedOntologies}
                selectedTypes = {selectedTypes}
                allCollections={allCollectionIds}
                handleOntologyCheckBoxClick={handleOntologyFacetSelection}
                handleTypesCheckBoxClick={handleTypeFacetSelection}
                handleCollectionsCheckboxClick={handleCollectionFacetSelection}
              />
            }              
          </div>
          <div className='col-sm-8' id="search-list-grid">
            {searchResult.length > 0 && <h3 className="text-dark">{totalResultsCount + ' results found for "' + searchQuery + '"'   }</h3>}
               <div className='row'>
                 {facetButton()} 
                </div>  
               <div className='row'>                                                      
                  <div className='col-sm-4 search-dropdown'>     
                    <div class="form-group">
                      <label for="list-result-per-page" className='col-form-label'>Results Per Page</label>
                        <select className='site-dropdown-menu list-result-per-page-dropdown-menu dropdown-colour' id="list-result-per-page" value={pageSize} onChange={handlePageSizeDropDownChange}>
                          <option value={10} key="10">10</option>
                          <option value={20} key="20">20</option>
                          <option value={30} key="30">30</option>
                          <option value={40} key="40">40</option>
                        </select>  
                     </div>
                  </div> 
                </div>
               
            {searchResult.length > 0 && createSearchResultList()}              
            {searchResult.length > 0 && 
              <Pagination 
                clickHandler={handlePagination} 
                count={pageCount()}
                initialPageNumber={pageNumber}          
              />
            } 

            {searchResult.length === 0 && <h3 className="text-dark">{'No search results for "' + searchQuery + '"'   }</h3>} 
            </div>
          </div>
      </div>                
    </div>
  );

}

export default SearchResult;