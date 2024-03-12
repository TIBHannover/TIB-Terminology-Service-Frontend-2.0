import { getCallSetting } from "./constants";



export async function olsSearch({
        searchQuery, 
        page, 
        size, 
        selectedOntologies, 
        selectedTypes, 
        selectedCollections, 
        obsoletes, 
        exact,
        isLeaf, 
        searchInValues, 
        searchUnderIris,
        searchUnderAllIris
    }) 
    {
    try{        
        let rangeStart = (page - 1) * size;
        let searchUrl = process.env.REACT_APP_SEARCH_URL + `?q=${searchQuery}&start=${rangeStart}&groupField=iri&rows=${size}`;
        searchUrl = selectedOntologies.length !== 0 ? (searchUrl + `&ontology=${selectedOntologies.join(',')}`) : searchUrl;
        searchUrl = selectedTypes.length !== 0 ? (searchUrl + `&type=${selectedTypes.join(',')}`) : searchUrl;
        searchUrl = searchInValues.length !== 0 ? (searchUrl + `&queryFields=${searchInValues.join(',')}`) : searchUrl;
        searchUrl = searchUnderIris.length !== 0 ? (searchUrl + `&childrenOf=${searchUnderIris.join(',')}`) : searchUrl;
        searchUrl = searchUnderAllIris.length !== 0 ? (searchUrl + `&allChildrenOf=${searchUnderAllIris.join(',')}`) : searchUrl;
        searchUrl = obsoletes ? (searchUrl + "&obsoletes=true") : searchUrl;
        searchUrl = exact ? (searchUrl + "&exact=true") : searchUrl;
        searchUrl = isLeaf ? (searchUrl + "&isLeaf=true") : searchUrl;
        if(process.env.REACT_APP_PROJECT_NAME === "" && selectedCollections.length !== 0){
            // If TIB General. Set collections if exist in filter
            searchUrl += `&schema=collection&classification=${selectedCollections.join(',')}`;
        }
        else if(process.env.REACT_APP_PROJECT_NAME !== ""){
            // Projects such as NFDI4CHEM. pre-set the target collection on each search
            searchUrl += `&schema=collection&classification=${process.env.REACT_APP_PROJECT_NAME}`;
        }
        let result = await (await fetch(searchUrl, getCallSetting)).json(); 
        return result;
    }
    catch(e){        
        return [];
    }
}




export async function getJumpToResult(inputData, count=10){
    try{
      let autocompleteApiBaseUrl =  process.env.REACT_APP_SEARCH_URL;
      autocompleteApiBaseUrl = autocompleteApiBaseUrl.split('search')[0] + "select";
      let url = `${autocompleteApiBaseUrl}?q=${inputData['searchQuery']}&rows=${count}`;    
      url = inputData['ontologyIds'] ? (url + `&ontology=${inputData['ontologyIds']}`) : url;
      url = inputData['types'] ? (url + `&type=${inputData['types']}`) : url;
      url = inputData['obsoletes'] ? (url + "&obsoletes=true") : url;
      url = inputData['collectionIds'] ? (url + `&schema=collection&classification=${inputData['collectionIds']}`) : url;    
      let result = await fetch(url, getCallSetting);
      result = await result.json();
      result = result['response']['docs'];
      return result;
    }
    catch(e){
      // throw e
      return [];
    }
}



export async function getAutoCompleteResult(inputData, count=5){
    try{
      let url =  process.env.REACT_APP_API_URL + `/suggest?q=${inputData['searchQuery']}&rows=${count}`;
      url = inputData['ontologyIds'] ? (url + `&ontology=${inputData['ontologyIds']}`) : url;
      url = inputData['types'] ? (url + `&type=${inputData['types']}`) : url;
      url = inputData['obsoletes'] ? (url + "&obsoletes=true") : url;
      url = inputData['collectionIds'] ? (url + `&schema=collection&classification=${inputData['collectionIds']}`) : url;  
      let searchResult = await fetch(url, getCallSetting);
      searchResult =  (await searchResult.json())['response']['docs'];
      return searchResult;
    }
    catch(e){
      return [];
    }
  }