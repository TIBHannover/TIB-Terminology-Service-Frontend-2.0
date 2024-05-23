import { CollectionData,
    CollectionDataResponse
 } from "./types/collectionTypes";
 import { TsPluginHeader } from "./types/headerTypes";
 import { getTsPluginHeaders } from "./header";


const baseUrl:string|undefined = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT;




export async function saveCollection(collectionData:CollectionData):Promise<CollectionDataResponse|null>{
    try{
        let headers:TsPluginHeader = getTsPluginHeaders({isJson: true, withAccessToken: true});             
        let result:any = await fetch(baseUrl + "/collection/create", {method: "POST", headers:headers, body: JSON.stringify(collectionData)});
        result = await result.json();
        result = result['_result']['collection'];        
        return result;
    }
    catch(e){
        return null;
    }
}


export async function updateCollection(collectionId:string|number, collectionData:CollectionData):Promise<CollectionDataResponse|null>{
    try{
        let headers:TsPluginHeader = getTsPluginHeaders({isJson: true, withAccessToken: true});        
        let result:any = await fetch(baseUrl + "/collection/update/" + collectionId, {method: "POST", headers:headers, body: JSON.stringify(collectionData)});
        result = await result.json();
        result = result['_result']['collection'];        
        return result;
    }
    catch(e){
        return null;
    }
}



export async function fetchCollectionList():Promise<Array<CollectionDataResponse>|[]>{
    try{
        let headers:TsPluginHeader = getTsPluginHeaders({isJson: false, withAccessToken: true});
        let result:any = await fetch(baseUrl + "/collection/get_list", {method: "GET", headers:headers});
        result = await result.json();
        result = result['_result']['collections'];        
        return result;
    }
    catch(e){
        return [];
    }
}
