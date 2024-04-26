import { getCallSetting } from "./constants";



type SearchApiInput = {
  searchQuery: string,
  page: number,
  size: number,
  selectedOntologies: string[],
  selectedTypes: string[],
  selectedCollections: string[],
  obsoletes: boolean,
  exact: boolean,
  isLeaf: boolean,
  searchInValues: string[],
  searchUnderIris: string[],
  searchUnderAllIris: string[]
};




export async function olsSearch(inputData: SearchApiInput) 
    {
    try{        
        let rangeStart:number = (inputData.page - 1) * inputData.size;
        let searchUrl:string = process.env.REACT_APP_SEARCH_URL + `?q=${inputData.searchQuery}&start=${rangeStart}&groupField=iri&rows=${inputData.size}`;
        searchUrl = inputData.selectedOntologies.length !== 0 ? (searchUrl + `&ontology=${inputData.selectedOntologies.join(',')}`) : searchUrl;
        searchUrl = inputData.selectedTypes.length !== 0 ? (searchUrl + `&type=${inputData.selectedTypes.join(',')}`) : searchUrl;
        searchUrl = inputData.searchInValues.length !== 0 ? (searchUrl + `&queryFields=${inputData.searchInValues.join(',')}`) : searchUrl;
        searchUrl = inputData.searchUnderIris.length !== 0 ? (searchUrl + `&childrenOf=${inputData.searchUnderIris.join(',')}`) : searchUrl;
        searchUrl = inputData.searchUnderAllIris.length !== 0 ? (searchUrl + `&allChildrenOf=${inputData.searchUnderAllIris.join(',')}`) : searchUrl;
        searchUrl = inputData.obsoletes ? (searchUrl + "&obsoletes=true") : searchUrl;
        searchUrl = inputData.exact ? (searchUrl + "&exact=true") : searchUrl;
        searchUrl = inputData.isLeaf ? (searchUrl + "&isLeaf=true") : searchUrl;
        if(process.env.REACT_APP_PROJECT_NAME === "" && inputData.selectedCollections.length !== 0){
            // If TIB General. Set collections if exist in filter
            searchUrl += `&schema=collection&classification=${inputData.selectedCollections.join(',')}`;
        }
        else if(inputData.selectedOntologies.length === 0 && process.env.REACT_APP_PROJECT_NAME !== ""){
            // Projects such as NFDI4CHEM. pre-set the target collection on each search
            // This should NOT be included when ontologies are selected.
            searchUrl += `&schema=collection&classification=${process.env.REACT_APP_PROJECT_NAME}`;
        }
        let result:any = await (await fetch(searchUrl, getCallSetting)).json(); 
        return result;
    }
    catch(e){        
        return [];
    }
}



type SuggestAndSelectApiInput = {
  searchQuery: string,
  ontologyIds: string[],
  types: string[],
  obsoletes: boolean,
  collectionIds: string[]
};



export async function getJumpToResult(inputData:SuggestAndSelectApiInput, count:number=10){
    try{
      let autocompleteApiBaseUrl:string =  process.env.REACT_APP_SEARCH_URL || '';
      autocompleteApiBaseUrl = autocompleteApiBaseUrl.split('search')[0] + "select";
      let url = `${autocompleteApiBaseUrl}?q=${inputData['searchQuery']}&rows=${count}`;    
      url = inputData['ontologyIds'] ? (url + `&ontology=${inputData['ontologyIds']}`) : url;
      url = inputData['types'] ? (url + `&type=${inputData['types']}`) : url;
      url = inputData['obsoletes'] ? (url + "&obsoletes=true") : url;
      url = inputData['collectionIds'] ? (url + `&schema=collection&classification=${inputData['collectionIds']}`) : url;    
      let result:any = await fetch(url, getCallSetting);
      result = await result.json();
      result = result['response']['docs'];
      return result;
    }
    catch(e){
      // throw e
      return [];
    }
}



export async function getAutoCompleteResult(inputData:SuggestAndSelectApiInput, count:number=5){
    try{
      let url:string =  process.env.REACT_APP_API_URL + `/suggest?q=${inputData['searchQuery']}&rows=${count}`;
      url = inputData['ontologyIds'] ? (url + `&ontology=${inputData['ontologyIds']}`) : url;
      url = inputData['types'] ? (url + `&type=${inputData['types']}`) : url;
      url = inputData['obsoletes'] ? (url + "&obsoletes=true") : url;
      url = inputData['collectionIds'] ? (url + `&schema=collection&classification=${inputData['collectionIds']}`) : url;  
      let searchResult:any = await fetch(url, getCallSetting);
      searchResult =  (await searchResult.json())['response']['docs'];
      return searchResult;
    }
    catch(e){
      return [];
    }
  }