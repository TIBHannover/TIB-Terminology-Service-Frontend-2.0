import AuthLib from "../Libs/AuthLib";
import { CollectionData,
    CollectionDataResponse
 } from "./types/collectionTypes";


const baseUrl:string|undefined = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT;




export async function saveCollection(collectionData:CollectionData):Promise<CollectionDataResponse|null>{
    try{
        let headers:any = AuthLib.setHeaderForTsMicroBackend();
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