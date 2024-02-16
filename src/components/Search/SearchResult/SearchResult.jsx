import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import {getAllCollectionsIds} from '../../../api/fetchData';
import { olsSearch } from '../../../api/search';
import Facet from '../Facet/facet';
import Pagination from "../../common/Pagination/Pagination";
import {setResultTitleAndLabel} from './SearchHelpers';
import TermLib from '../../../Libs/TermLib';
import Toolkit from '../../../Libs/Toolkit';
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
  const [expandedResults, setExpandedResults] = useState([]);
  const [totalResultsCount, setTotalResultsCount] = useState([]);  
  const [exact, setExact] = useState(currentUrlParams.get('exact') === "true" ? true : false);  
  const [allCollectionIds, setAllCollectionIds] = useState([]);
  const [filterTags, setFilterTags] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchInValues, setSearchInValues] = useState(currentUrlParams.get('searchin') ? currentUrlParams.getAll('searchin') : []);
  const [searchUnderIris, setSearchUnderIris] = useState(currentUrlParams.get('searchunder') ? currentUrlParams.getAll('searchunder') : []);

  const history = useHistory();

  const PAGE_SIZES_FOR_DROPDOWN = [{label: "10", value:10}, {label: "20", value:20}, {label: "30", value:30}, {label: "40", value:40}];


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
      let obsoletes = Toolkit.getObsoleteFlagValue();      
      let result = await olsSearch({
        searchQuery: searchQuery,
        page:pageNumber,
        size: pageSize,
        selectedOntologies: selectedOntologies,
        selectedTypes: selectedTypes,
        selectedCollections: selectedCollections,
        obsoletes: obsoletes,
        exact: exact,
        searchInValues: searchInValues,
        searchUnderIris: searchUnderIris
      });
    
      // This part is for updating the facet counts. 
      // First we search only with selected ontologies to set types counts and then search with selected types to set ontologies counts.          
      let searchResultForFacetCount = await olsSearch({
        searchQuery: searchQuery,
        page:pageNumber,
        size: pageSize,
        selectedOntologies: selectedOntologies,
        selectedTypes: [],
        selectedCollections: selectedCollections,
        obsoletes: obsoletes,
        exact: exact,
        searchInValues: searchInValues,
        searchUnderIris: searchUnderIris
      });
      result['facet_counts']['facet_fields']['type'] = searchResultForFacetCount['facet_counts']['facet_fields']['type'];
      
      searchResultForFacetCount = await olsSearch({
        searchQuery: searchQuery,
        page:pageNumber,
        size: pageSize,
        selectedOntologies: [],
        selectedTypes: selectedTypes,
        selectedCollections: selectedCollections,
        obsoletes: obsoletes,
        exact: exact,
        searchInValues: searchInValues,
        searchUnderIris: searchUnderIris
      });
      result['facet_counts']['facet_fields']['ontology_name'] = searchResultForFacetCount['facet_counts']['facet_fields']['ontology_name'];

      setSearchResult(result['response']['docs']);
      setTotalResultsCount(result['response']['numFound']);
      setFacetFields(result['facet_counts']);
      setExpandedResults(result['expanded'])
      setLoading(false);
    }
    catch(e){
      setSearchResult([]);
      setTotalResultsCount(0);
      setFacetFields([]);
      setExpandedResults([]);
      setLoading(false);
    }    
  }



  function alsoInResult(iri){    
    let otherOntologies = [];
    if(expandedResults && expandedResults[iri]){
      let allTags = expandedResults[iri]['docs'];
      for(let term of allTags){              
        otherOntologies.push(
          <div className='also-in-ontologies'>
            {TermLib.createOntologyTagWithTermURL(term['ontology_name'], term['iri'], term['type'])} 
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
              {setResultTitleAndLabel(searchResult[i], Toolkit.getObsoleteFlagValue())}                
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
    searchUrl.searchParams.set('page', 1);
    history.replace({...history.location, search: searchUrl.searchParams.toString()});  
    setSelectedTypes(selectedTypeList);
    setPageNumber(1);          
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
    searchUrl.searchParams.set('page', 1);
    history.replace({...history.location, search: searchUrl.searchParams.toString()});    
    setSelectedOntologies(selectedOntologiesList);  
    setPageNumber(1);                  
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
    searchUrl.searchParams.set('page', 1);
    history.replace({...history.location, search: searchUrl.searchParams.toString()});
    setSelectedCollections(selectedCollectionsList);
    setPageNumber(1);       
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
    setFilterTags("");
  } 


  function handleRemoveTagClick(e){
    try{
      let tagType = e.target.dataset.type;
      let tagValue = e.target.dataset.value;
      e.target.checked = false;
      e.target.value = tagValue;
      if(document.getElementById('search-checkbox-' + tagValue)){
        document.getElementById('search-checkbox-' + tagValue).checked = false;
      }          
      if(tagType === "type"){      
        handleTypeFacetSelection(e);      
      }
      else if(tagType === "ontology"){      
        handleOntologyFacetSelection(e);      
      }
      else if(tagType === "collection"){      
        handleCollectionFacetSelection(e);      
      }
    }
    catch(e){
      // console.info(e);
    }
  }



  function createFilterTags(){
    let tagsList = [];
    for(let type of selectedTypes){
      let newTag = <div className='search-filter-tags' key={type}>{type} <i onClick={handleRemoveTagClick} data-type={"type"} data-value={type} class="fa fa-close remove-tag-icon"></i></div>;
      tagsList.push(newTag);
    }
    for(let ontologyId of selectedOntologies){
      let newTag = <div className='search-filter-tags' key={ontologyId}>{ontologyId} <i onClick={handleRemoveTagClick} data-type={"ontology"} data-value={ontologyId} class="fa fa-close remove-tag-icon"></i></div>;
      tagsList.push(newTag);
    }
    for(let collection of selectedCollections){
      let newTag = <div className='search-filter-tags' key={collection}>{collection} <i onClick={handleRemoveTagClick} data-type={"collection"} data-value={collection} class="fa fa-close remove-tag-icon"></i></div>;
      tagsList.push(newTag);
    }    
    setFilterTags(tagsList);
  }


  useEffect(() => {
    search();
    getAllCollectionIds();
  }, []);


  useEffect(() => {
      setLoading(true);
      setSearchResult([]);
      search();
      createFilterTags();
  }, [pageNumber, pageSize, selectedOntologies, selectedTypes, selectedCollections]);



  return(
    <div className='row justify-content-center search-result-container' id="searchterm-wrapper">
      {Toolkit.createHelmet(searchQuery)}        
      <div className='col-sm-11'>            
        <div className='row'>
          <div className='col-sm-4'>          
            {searchResult.length > 0  && !loading &&
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
            {searchResult.length > 0 && <h3 className="text-dark">{`${totalResultsCount} results found for"${searchQuery}"`}</h3>}
               <div className='row'>{filterTags}</div>  
               <div className='row'>                                     
                  <div className='col-sm-12 text-right zero-padding-col'>
                    <DropDown 
                        options={PAGE_SIZES_FOR_DROPDOWN}
                        dropDownId="list-result-per-page"                        
                        dropDownTitle="Result Per Page"
                        dropdownClassName={"white-dropdown"} 
                        dropDownValue={pageSize}
                        dropDownChangeHandler={handlePageSizeDropDownChange}                                
                    />                   
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
            {!loading && searchResult.length === 0 && <h3 className="text-dark">{'No search results for "' + searchQuery + '"'   }</h3>} 
            </div>
          </div>
          <div className='row text-center'>
            {loading && <div className="is-loading-term-list isLoading"></div>}
          </div>
      </div>                
    </div>
  );

}

export default SearchResult;