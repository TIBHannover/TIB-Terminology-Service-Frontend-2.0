import {useState, useEffect} from 'react';
import '../../layout/facet.css';
import '../../layout/ontologyList.css';
import { useHistory } from 'react-router';
import {getCollectionOntologies, getAllCollectionsIds } from '../../../api/fetchData';
import OntologyApi from '../../../api/ontology';
import { OntologyListRender } from './OntologyListRender';
import { OntologyListFacet } from './OntologyListFacet';
import Toolkit from '../../../Libs/Toolkit';



const TITLE_SORT_KEY = "title";



const OntologyList = (props) => {

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

  const history = useHistory();



  async function setComponentData (){    
    try{      
      let ontologyApi = new OntologyApi({});
      await ontologyApi.fetchOntologyList(); 
      let allCollections = [];
      if(process.env.REACT_APP_PROJECT_NAME === ""){
        // If TIB General, fetch all the collections. Otherwise not needed.
        allCollections = await getAllCollectionsIds();
      }           
      
      let sortedOntologies = sortArrayOfOntologiesBasedOnKey(ontologyApi.list, sortField);                 
      setOntologies(sortedOntologies);
      setUnFilteredOntologies(sortedOntologies);      
      setAllCollections(allCollections);      
      setIsLoaded(true);
    }
    catch(error){            
      setIsLoaded(true);
      setError(error);        
    }
  
  }



  function setStateBasedOnUrlParams(){
    let url = new URL(window.location);   
    let collectionsInUrl = url.searchParams.getAll('collection');      
    let sortByInUrl = url.searchParams.get('sorting');
    let pageInUrl = url.searchParams.get('page');
    let sizeInUrl = url.searchParams.get('size');
    let keywordFilterInUrl = url.searchParams.get('keyword');
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
      let collectionOntologies = await getCollectionOntologies(selectedCollections, exclusiveCollections);
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
    let currentUrlParams = new URLSearchParams(window.location.search);  
    currentUrlParams.delete('keyword');

    if(keywordFilterString !== ""){
      currentUrlParams.set('keyword', keywordFilterString);
    }
    
    currentUrlParams.delete('collection');
    for(let col of selectedCollections){      
      currentUrlParams.append('collection', col);        
    }
    currentUrlParams.set('and', exclusiveCollections);
    currentUrlParams.set('sorting', sortField);
    currentUrlParams.set('page', pageNumber);  
    currentUrlParams.set('size', pageSize);            
    history.push(window.location.pathname + "?" + currentUrlParams.toString());    
  }



  useEffect(() => {
    setComponentData();    
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