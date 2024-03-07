import { getCallSetting} from "./constants";




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



export async function getObsoleteTermsForTermList(ontologyId, termType, page, size) {
  try{
    let OntologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL;
    let url = OntologiesBaseServiceUrl + "/";  
    url += ontologyId + "/" + termType + "/roots?includeObsoletes=true&size=" + size + "&page=" + page;    
    let res =  await (await fetch(url, getCallSetting)).json();
    let totalTermsCount = res['page']['totalElements'];
    res = res['_embedded'];
    return {"results": res['terms'], "totalTermsCount":totalTermsCount };
  }
  catch(e){
    return {"results": [], "totalTermsCount":0};
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









