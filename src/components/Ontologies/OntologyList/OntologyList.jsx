import {useState, useEffect} from 'react';
import '../../layout/facet.css';
import '../../layout/ontologyList.css';
import CollectionApi from '../../../api/collection';
import OntologyApi from '../../../api/ontology';
import { OntologyListRender } from './OntologyListRender';
import { OntologyListFacet } from './OntologyListFacet';
import Toolkit from '../../../Libs/Toolkit';
import OntologyListUrlFactory from '../../../UrlFactory/OntologyListUrlFactory';



const TITLE_SORT_KEY = "title";



const OntologyList = (props) => {

  /* 
    This component is responsible for rendering the list of ontologies.
  */

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [ontologies, setOntologies] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);  
  const [pageSize, setPageSize] = useState(10);
  const [ontologiesHiddenStatus, setOntologiesHiddenStatus] = useState([]);  
  const [unFilteredOntologies, setUnFilteredOntologies] = useState([]);  
  const [sortField, setSortField] = useState(TITLE_SORT_KEY);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [allCollections, setAllCollections] = useState([]);  
  const [keywordFilterString, setKeywordFilterString] = useState("");
  const [exclusiveCollections, setExclusiveCollections] = useState(false);



  async function setComponentData (){    
    try{      
      let ontologyApi = new OntologyApi({});      
      await ontologyApi.fetchOntologyList();                          
      let sortedOntologies = sortArrayOfOntologiesBasedOnKey(ontologyApi.list, sortField);                 
      setOntologies(sortedOntologies);
      setUnFilteredOntologies(sortedOntologies);              
      setIsLoaded(true);      
    }
    catch(error){            
      setIsLoaded(true);
      setError(error);        
    }
  }


  async function setCollectionData(){
    let collectionApi = new CollectionApi();
    let allCollections = [];          
    await collectionApi.fetchCollectionsWithStats();       
    allCollections =  collectionApi.collectionsList;    
    setAllCollections(allCollections);        
  }



  function setStateBasedOnUrlParams(){
    let ontologyListUrlFactory = new OntologyListUrlFactory();    
    let collectionsInUrl = ontologyListUrlFactory.collections
    let sortByInUrl = ontologyListUrlFactory.sortedBy;
    let pageInUrl = ontologyListUrlFactory.page;
    let sizeInUrl = ontologyListUrlFactory.size;
    let keywordFilterInUrl = ontologyListUrlFactory.keywordFilter;
    collectionsInUrl = collectionsInUrl ? collectionsInUrl : [...selectedCollections];    
    keywordFilterInUrl = keywordFilterInUrl ? keywordFilterInUrl : keywordFilterString;
    sortByInUrl = sortByInUrl ? sortByInUrl : sortField;
    pageInUrl = pageInUrl ? parseInt(pageInUrl) : pageNumber; 
    sizeInUrl = sizeInUrl ? parseInt(sizeInUrl) : pageSize; 
    setSelectedCollections(collectionsInUrl);
    setKeywordFilterString(keywordFilterInUrl);
    setSortField(sortByInUrl);      
    setPageNumber(pageInUrl);
    setPageSize(sizeInUrl);
  }



  function ontology_has_searchKey(ontology, value){
    try{
        value = value.toLowerCase();
        if (ontology.ontologyId.includes(value)) {
            return true;
        }
        if (ontology.config.title.toLowerCase().includes(value)) {
            return true;
        }
        if (ontology.config.description != null &&  ontology.config.description.toLowerCase().includes(value)) {
            return true;
        }
  
        return false;
    }
    catch (e){        
        return false;
    }
  }



  function sortArrayOfOntologiesBasedOnKey(ontologiesArray, key) {    
    if(key === "title"){
        return Toolkit.sortListOfObjectsByKey(ontologiesArray, key, true, 'config');        
    }
    else if(key === 'ontologyId'){
        return Toolkit.sortListOfObjectsByKey(ontologiesArray, key, true);         
    }
    return Toolkit.sortListOfObjectsByKey(ontologiesArray, key);    
  }



  function handlePagination (value) {    
    setPageNumber(parseInt(value));    
  }



  function showInPageRangeOntologies(){
    let down = (pageNumber - 1) * pageSize;
    let up = down + pageSize;
    if (up > ontologies.length){
      up = ontologies.length;
    }    
    let hiddenStatus = new Array(ontologies.length).fill(false);
    for (let i = down; i < up; i++) {
      hiddenStatus[i] = true;
    }
    setOntologiesHiddenStatus(hiddenStatus);   
  }



  function handlePageSizeDropDownChange(e){
    setPageSize(parseInt(e.target.value));    
  }



  function handleSortChange(e, value){
    let newSortField = e.target.value;    
    let sortedOntology = sortArrayOfOntologiesBasedOnKey(ontologies, newSortField);
    setSortField(newSortField);
    setOntologies(sortedOntology);     
  }


  
  function filterWordChange(e){
    setKeywordFilterString(e.target.value);
    setPageNumber(1);    
  }



  function handleSwitchange(e){
    setExclusiveCollections(e.target.checked); 
    setPageNumber(1);      
  }


  function handleFacetCollection(e, value){        
    let collection = e.target.value.trim();    
    let currentSelectedCollections = [...selectedCollections];     
    if(e.target.checked){            
      currentSelectedCollections.push(collection);         
    }
    else{      
      let index = currentSelectedCollections.indexOf(collection);
      currentSelectedCollections.splice(index, 1);      
    }        
    setSelectedCollections(currentSelectedCollections);
    setPageNumber(1);       
  }



  async function runFilter(){     
    let collectionApi = new CollectionApi();
    let ontologiesList = [...unFilteredOntologies];
    let keywordOntologies = [];          
    if(keywordFilterString !== ""){                   
      for (let i = 0; i < ontologiesList.length; i++) {
        let ontology = ontologiesList[i];                
        if (ontology_has_searchKey(ontology, keywordFilterString)) {
          keywordOntologies.push(ontology)
        }
      }
      ontologiesList = keywordOntologies;    
    }
    if(selectedCollections.length !== 0){      
      let collectionOntologies = await collectionApi.fetchOntologyListForCollections(selectedCollections, exclusiveCollections);
      let collectionFilteredOntologies = [];
      for (let onto of collectionOntologies){
        if(typeof(ontologiesList.find(o => o.ontologyId === onto.ontologyId)) !== "undefined"){
          collectionFilteredOntologies.push(onto);
        }
      }
      ontologiesList = collectionFilteredOntologies;  
    }
  
    ontologiesList = sortArrayOfOntologiesBasedOnKey(ontologiesList, sortField);           
    setOntologies(ontologiesList);        
  }



  function updateUrl(){     
    let ontologyListUrl = new OntologyListUrlFactory();
    ontologyListUrl.update({
      keywordFilter: keywordFilterString,
      collections: selectedCollections,
      sortedBy: sortField,
      page: pageNumber,
      size: pageSize,
      andOpValue: exclusiveCollections
    });
    
    // history.push(updatedUrl);    
  }



  useEffect(() => {
    setComponentData();
    if(process.env.REACT_APP_PROJECT_NAME === ""){
      // If TIB General, fetch all the collections. Otherwise not needed.
      setCollectionData();
    }    
    setStateBasedOnUrlParams();      
  }, []);



  useEffect(() => {
    if(isLoaded){      
      updateUrl();
      runFilter();      
    }              
  }, [pageNumber, pageSize, keywordFilterString, selectedCollections, sortField, exclusiveCollections, isLoaded]);


  useEffect(() => {          
      showInPageRangeOntologies();
  }, [ontologies]);


  
    if (error) {
      return <div>Error: Something Went Wrong!</div>
    }     
    return (
      <>
        {Toolkit.createHelmet("Ontologies")}          
        <div className='row justify-content-center ontology-list-container' id="ontologyList-wrapper-div">
          <div className='col-sm-11'>
          {!isLoaded && <div className="is-loading-term-list isLoading"></div>}
           {isLoaded &&  
            <div className='row'>
                <div className='col-sm-4'>
                    <OntologyListFacet 
                      enteredKeyword={keywordFilterString}
                      filterWordChange={filterWordChange}
                      onSwitchChange={handleSwitchange}
                      handleFacetCollection={handleFacetCollection}
                      selectedCollections={selectedCollections}
                      allCollections={allCollections}

                    />
                </div>
                <div className='col-sm-8'>
                    <OntologyListRender 
                      handlePagination={handlePagination}
                      pageCount={Math.ceil(ontologies.length / pageSize)}
                      pageNumber={pageNumber}
                      pageSize={pageSize}
                      handlePageSizeDropDownChange={handlePageSizeDropDownChange}
                      sortField={sortField}
                      handleSortChange={handleSortChange}
                      ontologies={ontologies}
                      ontologiesHiddenStatus={ontologiesHiddenStatus}
                      isLoaded={isLoaded}
                    />
                </div>
            </div>
           }
          </div>            
        </div>          
      </>
    )
}


export default OntologyList;