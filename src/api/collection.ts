import { getCallSetting } from "./constants";
import { OntologyData } from "./types/ontologyTypes";


class CollectionApi{

    collectionsList: Array<object>;

    constructor(){
        this.collectionsList = [];        
    }


    async fetchCollectionsWithStats():Promise<void>{
        type CollectionStatsResponseType = {
            [key: string]: {
                numberOfOntologies: number
            }
        }

        try{
          let ontologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL;  
          let url = ontologiesBaseServiceUrl + '/getstatisticsbyschema?schema=collection';
          let result = await fetch(url, getCallSetting);
          let colStats:Array<CollectionStatsResponseType> = await result.json();
          let collections = [];
          for(let colMultiKey in colStats){      
            let record = {
              "collection": colMultiKey.split(',')[1].split(']')[0].trim(), // format example: MultiKey[collection, NFDI4Energy]
              "ontologiesCount": colStats[colMultiKey]['numberOfOntologies']
            };    
            collections.push(record)    
          }
          this.collectionsList = collections;
        }
        catch(e){
          // throw e
          this.collectionsList = [];
        }
    }



    async fetchAllCollectionWithOntologyList():Promise<void> {
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
          let cols:CollectionIdsResponseType = await resp.json();
          let collections = cols['_embedded']["strings"];
          let result = [];
          for( let col of collections ){                      
            let collectionOntologies = await this.fetchOntologyListForCollections([col['content']], false);
            let collectionOntologiesIds = [];
            for(let onto of collectionOntologies){
              collectionOntologiesIds.push(onto['ontologyId'].toUpperCase())
            }
            let record = {"collection": col['content'], "ontolgies": collectionOntologiesIds};    
            result.push(record);
          }
          this.collectionsList = result;
        }
        catch(e){
          this.collectionsList = [];
        }  
    }



    async fetchOntologyListForCollections (collectionsIds:Array<string>, exclusive:boolean):Promise<Array<OntologyData>>{
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
            console.log(collectionOntologiesList);
            return collectionOntologiesList['_embedded']['ontologies'];        
        }
        catch(e){
            return [];
        }        
    }
}

export default CollectionApi;