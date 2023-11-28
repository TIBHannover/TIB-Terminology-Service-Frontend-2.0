import {useState, useEffect} from 'react';
import { useHistory } from 'react-router';
import queryString from 'query-string'; 
import { getAllOntologies, getCollectionOntologies } from '../../../api/fetchData';
import { OntologyListRender } from './OntologyListRender';
import { OntologyListFacet } from './OntologyListFacet';
import Toolkit from '../../common/Toolkit';



const TITLE_SORT_KEY = "title";



const OntologyList = (props) => {
  let url = new URL(window.location);   
  let collectionsInUrl = url.searchParams.get('collection');
  let sortBy = url.searchParams.get('sorting');
  let page = url.searchParams.get('page');
  let keywordFilter = url.searchParams.get('keyword');
  collectionsInUrl = typeof(collectionsInUrl) === "string" ? [collectionsInUrl] : [];
  keywordFilter = keywordFilter ? keywordFilter : "";
  sortBy = sortBy ? sortBy : TITLE_SORT_KEY;
  page = page ? parseInt(page) : 1;


  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [ontologies, setOntologies] = useState([]);
  const [pageNumber, setPageNumber] = useState(page);  
  const [pageSize, setPageSize] = useState(10);
  const [ontologiesHiddenStatus, setOntologiesHiddenStatus] = useState([]);  
  const [unFilteredOntologies, setUnFilteredOntologies] = useState([]);  
  const [sortField, setSortField] = useState(sortBy);
  const [selectedCollections, setSelectedCollections] = useState(collectionsInUrl);  
  const [keywordFilterString, setKeywordFilterString] = useState(keywordFilter);
  const [exclusiveCollections, setExclusiveCollections] = useState(false);

  const history = useHistory();



  async function setComponentData (){    
    try{      
      let allOntologies = await getAllOntologies();      
      allOntologies = sortArrayOfOntologiesBasedOnKey(allOntologies, sortField);           
      setIsLoaded(true);
      setOntologies(allOntologies);
      setUnFilteredOntologies(allOntologies);      
    }
    catch(error){      
      setIsLoaded(true);
      setError(error);        
    }
  
  }


  function handlePagination (value) {    
    setPageNumber(parseInt(value));     
  }


  function showInPageRangeOntologies(){
    let down = (pageNumber - 1) * pageSize;
    let up = down + (pageSize - 1);
    let hiddenStatus = new Array(ontologies.length).fill(false);
    for (let i = down; i <= up; i++) {
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

  
  function filterWordChange(e, value){
    setKeywordFilterString(e.target.value);
  }


  function handleSwitchange(e){
    setExclusiveCollections(e.target.checked);    
  }


  function handleFacetCollection(e, value){    
    let collection = e.target.value.trim();         
    let currentSelectedCollections = [...selectedCollections];
    if(e.target.checked){      
      currentSelectedCollections.push(collection);
      document.getElementById(e.target.id).checked = true;
    }
    else{      
      let index = currentSelectedCollections.indexOf(collection);
      currentSelectedCollections.splice(index, 1);        
      document.getElementById(e.target.id).checked = false;    
    }        
    setSelectedCollections(currentSelectedCollections);    
  }


  async function runFacet(){     
    let ontologiesList = [...unFilteredOntologies]; 
    let keywordOntologies = [];
    if(keywordFilterString !== ""){
      // run keyword filter    
      for (let i = 0; i < ontologiesList.length; i++) {
        let ontology = ontologiesList[i];
        if (ontology_has_searchKey(ontology, keywordFilterString)) {
          keywordOntologies.push(ontology)
        }
      }
      ontologiesList = keywordOntologies;
    }
  
    if(selectedCollections.length !== 0){
      // run collection filter
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
    setPageNumber(1);    
  }


  function updateUrl(){       
    let currentUrlParams = new URLSearchParams();

    if(keywordFilterString !== ""){
      currentUrlParams.append('keyword', keywordFilterString);
    }

    if(selectedCollections.length !== 0){
      for(let col of selectedCollections){
        currentUrlParams.append('collection', col);        
      }
      currentUrlParams.append('and', exclusiveCollections);
    }

    if(sortField !== TITLE_SORT_KEY){
      currentUrlParams.append('sorting', sortField);
    }

    currentUrlParams.append('page', pageNumber);    
    history.push(window.location.pathname + "?" + currentUrlParams.toString());    
  }



  useEffect(() => {
    setComponentData();
    showInPageRangeOntologies();
    let allCollections = document.getElementsByClassName('collection-checkbox');
    for(let checkbox of allCollections){
      if(checkbox.dataset.ischecked === "true"){
        document.getElementById(checkbox.id).checked = true;
      }
      delete checkbox.dataset.ischecked;
    }
  }, []);



  useEffect(() => {    
      updateUrl();
      runFacet();
      showInPageRangeOntologies();
  }, [keywordFilterString, selectedCollections, sortField, exclusiveCollections]);


  useEffect(() => {
    updateUrl();    
    showInPageRangeOntologies();
  }, [pageNumber, pageSize]);

  
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else {
      return (
        <>
          {Toolkit.createHelmet("Ontologies")}          
          <div className='row justify-content-center' id="ontologyList-wrapper-div">
            <div className='col-sm-4'>
              <OntologyListFacet 
                enteredKeyword={keywordFilterString}
                filterWordChange={filterWordChange}
                onSwitchChange={handleSwitchange}
                handleFacetCollection={handleFacetCollection}
                selectedCollections={selectedCollections}

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
              />
            </div>
          </div>          
        </>
      )
    }

}


export default OntologyList;




/**
 * Search in an ontology metadata to check if it contains a value
 * @param {ontology} ontology
 * @param {string} value 
 * @returns boolean
 */
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


export function sortArrayOfOntologiesBasedOnKey(ontologiesArray, key) {    
  if(key === "title"){
      return Toolkit.sortListOfObjectsByKey(ontologiesArray, key, true, 'config');        
  }
  else if(key === 'ontologyId'){
      return Toolkit.sortListOfObjectsByKey(ontologiesArray, key, true);         
  }
  return Toolkit.sortListOfObjectsByKey(ontologiesArray, key);    
}