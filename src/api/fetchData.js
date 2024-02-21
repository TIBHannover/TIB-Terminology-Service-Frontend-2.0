import { getCallSetting} from "./constants";




export async function getCollectionOntologies (collections, exclusive){
  let OntologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL;  
  let ontologiesCount = 100000;
  let targetUrl = OntologiesBaseServiceUrl + "/filterby?schema=collection&page=0&size=" + ontologiesCount + "&exclusive=" + exclusive + "&";
  let urlPros = "";
  for(let col of collections){
    if (col !== ""){
      urlPros += ("classification=" + encodeURIComponent(col) + "&");
    }
  }
  targetUrl += urlPros;
  return fetch(targetUrl, getCallSetting)
    .then((s) => s.json())
    .then((s) => {
      return s['_embedded']['ontologies'];
    })
    .catch((s) => {
      return [];
    })
}



export async function getAllCollectionsIds(withStats=true) {
  try{
    let url =  process.env.REACT_APP_COLLECTION_IDS_BASE_URL;
    let StatsBaseUrl =  process.env.REACT_APP_STATS_API_URL;
    let cols =  await fetch(url, getCallSetting);
    cols = await cols.json();
    let collections = cols['_embedded']["strings"];
    let result = [];
    for( let col of collections ){
      let ontologiesCountForCollection = 0;
      if(withStats){
        let statsUrl = StatsBaseUrl + "byclassification?schema=collection&" + "classification=" + col['content'];
        let statsResult = await fetch(statsUrl, getCallSetting);
        statsResult = await statsResult.json();
        ontologiesCountForCollection = statsResult["numberOfOntologies"];
      }
      
      let collectionOntologies = await getCollectionOntologies([col['content']], false);
      let collectionOntologiesIds = [];
      for(let onto of collectionOntologies){
        collectionOntologiesIds.push(onto['ontologyId'].toUpperCase())
      }
      let record = {"collection": col['content'], "ontologiesCount": ontologiesCountForCollection, "ontolgies": collectionOntologiesIds};    
      result.push(record);
    }
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









