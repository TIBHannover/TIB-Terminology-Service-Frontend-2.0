import { getCallSetting } from "./constants";
import { OntologyData } from "./types/ontologyTypes";
import { CollectionWithItsOntologyListData } from "./types/collectionTypes";


/* react query key:  allCollectionsWithTheirStats   */
export async function fetchCollectionsWithStats():Promise<Array<object>>{
  type CollectionStatsResponseType = {
      [key: string]: {
          numberOfOntologies: number
      }
  }

  try{
    let ontologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL;  
    let url = ontologiesBaseServiceUrl + '/getstatisticsbyschema?schema=collection';
    let result = await fetch(url, getCallSetting);
    if(!result.ok){
      return Promise.reject(new Error(result.statusText));
    }
    let colStats:Array<CollectionStatsResponseType> = await result.json();
    let collections = [];
    for(let colMultiKey in colStats){      
      let record = {
        "collection": colMultiKey.split(',')[1].split(']')[0].trim(), // format example: MultiKey[collection, NFDI4Energy]
        "ontologiesCount": colStats[colMultiKey]['numberOfOntologies']
      };    
      collections.push(record)    
    }    
    return collections;
  }
  catch(e){    
    return Promise.reject(e);
  }
}


/* react query key: allCollectionsWithTheirOntologies  */
export async function fetchAllCollectionWithOntologyList():Promise<Array<CollectionWithItsOntologyListData>> {
  type CollectionIdsResponseType = {
      _embedded: {
          strings: Array<{
              content: string
          }>
      }
  }

  try{
    let url = `${process.env.REACT_APP_COLLECTION_IDS_BASE_URL}`;          
    let resp = await fetch(url, getCallSetting);
    if(!resp.ok){
      return Promise.reject(new Error(resp.statusText));
    }
    let cols:CollectionIdsResponseType = await resp.json();
    let collections = cols['_embedded']["strings"];
    let result = [];
    for( let col of collections ){                      
      let collectionOntologies = await fetchOntologyListForCollections([col['content']], false);
      let collectionOntologiesIds = [];
      for(let onto of collectionOntologies){
        let temp = {"ontologyId": onto['ontologyId'].toUpperCase(), "purl": onto?.config?.id};
        collectionOntologiesIds.push(temp)
      }
      let record = {"collection": col['content'], "ontologies": collectionOntologiesIds};    
      result.push(record);
    }    
    return result;    
  }
  catch(e){
    return Promise.reject(e);
  }  
}



export async function fetchOntologyListForCollections (collectionsIds:Array<string>, exclusive:boolean):Promise<Array<OntologyData>>{
  /*
      Fetch ontology list for a given list of collections Ids. 
      Can be used to get ontology list based on collection filter
      or get the ontology list for one collection 
  */

  type CollectionOntologiesResponseType = {
      _embedded: {
          ontologies: Array<OntologyData>
      }
  }

  try{
      let OntologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL;  
      let ontologiesCount = 100000;
      let targetUrl = `${OntologiesBaseServiceUrl}/filterby?schema=collection&page=0&size=${ontologiesCount}&exclusive=${exclusive}`;
      let urlPros = "";
      for(let col of collectionsIds){
      if (col !== ""){
          urlPros += ("&classification=" + encodeURIComponent(col));
      }
      }
      targetUrl += urlPros;
      let result = await fetch(targetUrl, getCallSetting);      
      let collectionOntologiesList:CollectionOntologiesResponseType = await result.json();      
      return collectionOntologiesList['_embedded']['ontologies'];        
  }
  catch(e){
      return [];
  }        
}