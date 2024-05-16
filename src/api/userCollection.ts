import AuthLib from "../Libs/AuthLib";
import { CollectionData,
    CollectionDataResponse
 } from "./types/collectionTypes";


const baseUrl:string|undefined = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT;




export async function saveCollection(collectionData:CollectionData):Promise<CollectionDataResponse|null>{
    try{
        let headers:any = AuthLib.setHeaderForTsMicroBackend(true);
        headers["Content-Type"] = "application/json";        
        let result:any = await fetch(baseUrl + "/collection/create", {method: "POST", headers:headers, body: JSON.stringify(collectionData)});
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
        let headers:any = AuthLib.setHeaderForTsMicroBackend(true);
        let result:any = await fetch(baseUrl + "/collection/get_list", {method: "GET", headers:headers});
        result = await result.json();
        result = result['_result']['collections'];        
        return result;
    }
    catch(e){
        return [];
    }
}


export async function deleteCollection(collectionId:string):Promise<boolean>{
    try{
        let headers:any = AuthLib.setHeaderForTsMicroBackend(true);
        headers["Content-Type"] = "application/json";
        let result:any = await fetch(baseUrl + "/collection/delete/" + collectionId, {method: "POST", headers:headers});
        result = await result.json();
        result = result['_result']['deleted'];        
        return result;
    }
    catch(e){
        return false;
    }
}