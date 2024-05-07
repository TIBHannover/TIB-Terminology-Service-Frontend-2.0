import AuthLib from "../Libs/AuthLib";
import { LoginResponse } from "./types/userTypes";



export async function runLogin(authCode:string):Promise<LoginResponse|[]>{
    try{
        let headers:any = AuthLib.setHeaderForTsMicroBackend();
        headers["X-TS-Auth-APP-Code"] = authCode;
        let result:any = await fetch(process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/user/login", {method: "POST", headers:headers});
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




export async function isLogin(username:string):Promise<boolean>{
    try{
        let data = new FormData();             
        let headers:any = AuthLib.setHeaderForTsMicroBackend(true);
        data.append("username", username);
        let result:any = await fetch(process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/user/validate_login', {method: "POST", headers:headers, body: data});
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