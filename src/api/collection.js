import { getCallSetting } from "./constants";


class CollectionApi{

    constructor(){
        this.collectionsList = [];        
    }


    async fetchCollectionsWithStats(){
        try{
          let ontologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL;  
          let url = ontologiesBaseServiceUrl + '/getstatisticsbyschema?schema=collection';
          let result = await fetch(url, getCallSetting);
          result = await result.json();
          let collections = [];
          for(let colMultiKey in result){      
            let record = {
              "collection": colMultiKey.split(',')[1].split(']')[0].trim(), // ket format example: MultiKey[collection, NFDI4Energy]
              "ontologiesCount": result[colMultiKey]['numberOfOntologies']
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


    async fetchAllCollectionWithOntologyList() {
        try{
          let url =  process.env.REACT_APP_COLLECTION_IDS_BASE_URL;          
          let cols =  await fetch(url, getCallSetting);
          cols = await cols.json();
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



    async fetchOntologyListForCollections (collectionsIds, exclusive){
        /*
            Fetch ontology list for a given list of collections Ids. 
            Can be used to get ontology list based on collection filter
            or get the ontology list for one collection 
        */

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
            result = await result.json();
            return result['_embedded']['ontologies'];        
        }
        catch(e){
            return [];
        }        
    }
}

export default CollectionApi;