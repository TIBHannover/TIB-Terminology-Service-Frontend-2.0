import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import {getAllCollectionsIds} from '../../../api/fetchData';
import { olsSearch } from '../../../api/search';
import Facet from '../Facet/facet';
import Pagination from "../../common/Pagination/Pagination";
import {setResultTitleAndLabel, makeAlsoInTag} from './SearchHelpers';
import Toolkit from '../../common/Toolkit';
import DropDown from '../../common/DropDown/DropDown';
import '../../layout/searchResult.css';
import '../../layout/facet.css';




const SearchResult = (props) => {

  let currentUrlParams = new URL(window.location).searchParams;
  const DEFAULT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_SIZE = 10;

  const [searchQuery, setSearchQuery] = useState(currentUrlParams.get('q') ? currentUrlParams.get('q') : "");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedOntologies, setSelectedOntologies] = useState(currentUrlParams.get('ontology') ? currentUrlParams.getAll('ontology') : []);
  const [selectedTypes, setSelectedTypes] = useState(currentUrlParams.get('type') ? currentUrlParams.getAll('type') : []);
  const [selectedCollections, setSelectedCollections] = useState(currentUrlParams.get('collection') ? currentUrlParams.getAll('collection') : []);
  const [facetFields, setFacetFields] = useState([]);
  const [pageNumber, setPageNumber] = useState(parseInt(currentUrlParams.get('page') ? currentUrlParams.get('page') : DEFAULT_PAGE_NUMBER));
  const [pageSize, setPageSize] = useState(parseInt(currentUrlParams.get('size') ? currentUrlParams.get('size') : DEFAULT_PAGE_SIZE));
  const [isLoaded, setIsLoaded] = useState(false);  
  const [expandedResults, setExpandedResults] = useState([]);
  const [totalResultsCount, setTotalResultsCount] = useState([]);
  const [facetIsSelected, setFacetIsSelected] = useState(false);
  const [exact, setExact] = useState(currentUrlParams.get('exact') === "true" ? true : false);
  const [obsoletes, setObsoletes] = useState(Toolkit.getObsoleteFlagValue());
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
    try{
      let result = await olsSearch(searchQuery, pageNumber, pageSize, selectedOntologies, selectedTypes, selectedCollections, obsoletes, exact);    
    
      // This part is for updating the facet counts. 
      // First we search only with selected ontologies to set types counts and then search with selected types to set ontologies counts.
      let searchResultForFacetCount = await olsSearch(searchQuery, pageNumber, pageSize, selectedOntologies, [], selectedCollections, obsoletes, exact);
      result['facet_counts']['facet_fields']['type'] = searchResultForFacetCount['facet_counts']['facet_fields']['type'];
      searchResultForFacetCount = await olsSearch(searchQuery, pageNumber, pageSize, [], selectedTypes, selectedCollections, obsoletes, exact);
      result['facet_counts']['facet_fields']['ontology_name'] = searchResultForFacetCount['facet_counts']['facet_fields']['ontology_name'];

      setSearchResult(result['response']['docs']);
      setTotalResultsCount(result['response']['numFound']);
      setFacetFields(result['facet_counts']);
      setExpandedResults(result['expanded'])
    }
    catch(e){
      setSearchResult([]);
      setTotalResultsCount(0);
      setFacetFields([]);
      setExpandedResults([]);
    }    
  }



  function alsoInResult(iri){    
    let otherOntologies = [];
    if(expandedResults && expandedResults[iri]){
      let allTags = expandedResults[iri]['docs'];
      for(let tag of allTags){              
        otherOntologies.push(
          <div className='also-in-ontologies'>
            {makeAlsoInTag(tag)} 
          </div>                                             
        );
      }  
    }
    return otherOntologies;
  }



  function createSearchResultList () {         
      let searchResultList = [];
      for (let i = 0; i < searchResult.length; i++) {
        let alsoInList = alsoInResult(searchResult[i].iri);
        searchResultList.push(
          <div className="row result-card" key={searchResult[i]['id']}>
            <div className='col-sm-10'>
              {setResultTitleAndLabel(searchResult[i], obsoletes)}                
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
              {alsoInList.length !== 0 &&
                <div className = "also-in-design">
                    <b>Also in:</b> {alsoInList}
                </div>
              }
              
            </div>            
          </div>   
        );
      }       
      return searchResultList;
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



  function clearFilters(){            
    let allFacetCheckBoxes = document.getElementsByClassName('search-facet-checkbox');                
    for(let checkbox of allFacetCheckBoxes){            
        if(checkbox.dataset.ischecked !== "true"){
            document.getElementById(checkbox.id).checked = false;
        }
        delete checkbox.dataset.ischecked;
    }
    let searchUrl = new URL(window.location);  
    searchUrl.searchParams.delete('type');
    searchUrl.searchParams.delete('ontology');
    searchUrl.searchParams.delete('collection');
    searchUrl.searchParams.set('page', 1);
    searchUrl.searchParams.set('size', 10);
    history.replace({...history.location, search: searchUrl.searchParams.toString()});    
    setSelectedTypes([]);
    setSelectedOntologies([]);
    setSelectedCollections([]);
    setPageNumber(1);
    setPageSize(10);       
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
                clearFacet={clearFilters}
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