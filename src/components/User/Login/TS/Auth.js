import AuthTool from "../authTools";


export function auth(){
    let cUrl = window.location.href;
    if(cUrl.includes("code=")){
        AuthTool.enableLoginAnimation();
        let code = cUrl.split("code=")[1];        
        let headers = AuthTool.setHeaderForTsMicroBackend();
        headers["X-TS-Auth-APP-Code"] = code;                       
        fetch(process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/auth/login', {method: "POST", headers:headers})
            .then((resp) => resp.json())
            .then((resp) => {                
                if(resp["_result"]){
                    AuthTool.setAuthResponseInLocalStorage(resp["_result"])
                    window.location.replace(process.env.REACT_APP_PROJECT_SUB_PATH);
                    return true;               
                }
                AuthTool.disableLoginAnimation();
                localStorage.setItem("isLoginInTs", 'false');
                return false;
            })
            .catch((e) => {
                AuthTool.disableLoginAnimation();
                localStorage.setItem("isLoginInTs", 'false');
                return false;
            })
    }   
}



export async function isLogin(){      
    if(process.env.REACT_APP_AUTH_FEATURE !== "true"){
        return false;
    }  
    if(localStorage.getItem("token")){        
        let data = new FormData();        
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});
        data.append("username", localStorage.getItem('ts_username'));
        let result = await fetch(process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/auth/validate_login', {method: "POST", headers:headers, body: data});
        result = await result.json()
        result = result["_result"]
        if(result && result["valid"] === true){
            localStorage.setItem("isLoginInTs", 'true');
            return true
        }
        localStorage.setItem("isLoginInTs", 'false');
        return false;
    }
    else{
        localStorage.setItem("isLoginInTs", 'false');
        return false;
    }
}


export function userIsLoginByLocalStorage(){
    if(localStorage.getItem('isLoginInTs') && localStorage.getItem('isLoginInTs') === "true"){
        return true;
    }
    return false;
}


export function Logout(){    
    localStorage.setItem("token", "");
    localStorage.setItem("isLoginInTs", "false");  
    localStorage.setItem("ts_username", "");    
    localStorage.setItem("name", "");
    localStorage.setItem("company", "");
    localStorage.setItem("github_home", "");
    localStorage.setItem("orcid_id", "");             
    localStorage.setItem("authProvider", "undefined");
    window.location.replace(process.env.REACT_APP_PROJECT_SUB_PATH);
        
}
