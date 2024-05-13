import AuthLib from "../Libs/AuthLib";
import { LoginResponse
    , UserSettings
 } from "./types/userTypes";


const baseUrl:string|undefined = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT;


export async function runLogin(authCode:string):Promise<LoginResponse|[]>{
    try{
        let headers:any = AuthLib.setHeaderForTsMicroBackend();
        headers["X-TS-Auth-APP-Code"] = authCode;
        let result:any = await fetch(baseUrl + "/user/login", {method: "POST", headers:headers});
        result = await result.json();
        result = result['_result'];
        if(result && result["issue"]){
            return [];
        }        
        return result;
    }
    catch(e){
        return [];
    }
}




export async function isLogin():Promise<boolean>{
    try{        
        let headers:any = AuthLib.setHeaderForTsMicroBackend(true);        
        let result:any = await fetch(baseUrl + '/user/validate_login', {method: "POST", headers:headers});
        if (result.status !== 200){            
            return false;
        }
        result = await result.json()
        result = result["_result"]
        if(result && result["valid"] === true){            
            return true;
        }        
        return false;
    }
    catch(e){
        return false;
    }
}



export async function storeUserSettings(settings:UserSettings):Promise<boolean>{
    try{
        let headers:any = AuthLib.setHeaderForTsMicroBackend(true);
        headers["Content-Type"] = "application/json";        
        let result:any = await fetch(baseUrl + "/user/save_settings", {method: "POST", headers:headers, body: JSON.stringify(settings)});
        result = await result.json();
        result = result['_result']['saved'];
        if(result || result === "true"){
            // update local settings
            let userJson = localStorage.getItem('user');
            let user:any = userJson ? JSON.parse(userJson) : null;
            if(user){
                user.settings = settings
                localStorage.setItem('user', JSON.stringify(user));
            }            
        }        
        return result;
    }
    catch(e){
        return false;
    }
}