import AuthLib from "../../../../Libs/AuthLib";


export function auth(){
    let cUrl = window.location.href;
    if(cUrl.includes("code=")){
        AuthLib.enableLoginAnimation();
        let code = cUrl.split("code=")[1];        
        let headers = AuthLib.setHeaderForTsMicroBackend();
        headers["X-TS-Auth-APP-Code"] = code;                       
        fetch(process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/auth/login', {method: "POST", headers:headers})
            .then((resp) => resp.json())
            .then((resp) => {                
                if(resp["_result"]){                                                            
                    let userData = AuthLib.createUserDataObjectFromAuthResponse(resp["_result"]);
                    localStorage.setItem('user', JSON.stringify(userData)); 
                    let redirectUrl = localStorage.getItem("redirectUrl") ? localStorage.getItem("redirectUrl") : process.env.REACT_APP_PROJECT_SUB_PATH;
                    window.location.replace(redirectUrl);                    
                    return true;
                }
                AuthLib.disableLoginAnimation();                
                return false;
            })
            .catch((e) => {
                AuthLib.disableLoginAnimation();                
                return false;
            })
    }
    else{
        return false;
    }      
}



export async function isLogin(){      
    if(process.env.REACT_APP_AUTH_FEATURE !== "true"){
        return false;
    } 
    let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;     
    if(user && user.token){        
        let data = new FormData();             
        let headers = AuthLib.setHeaderForTsMicroBackend(true);
        data.append("username", user.username);
        let result = await fetch(process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/auth/validate_login', {method: "POST", headers:headers, body: data});
        if (result.status !== 200){            
            return false;
        }
        result = await result.json()
        result = result["_result"]
        if(result && result["valid"] === true){            
            return user;
        }        
        return null;
    }
    else{        
        return null;
    }
}



export async function checkIsSystemAdmin(){               
    let headers = AuthLib.setHeaderForTsMicroBackend({withAccessToken:true});    
    let result = await fetch(process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/admin/is_system_admin', {method: "POST", headers:headers});    
    if (result.status !== 200){
        return false;
    }
    result = await result.json();
    result = result["_result"];
    if(result && result["is_system_admin"] === true){        
        return true
    }    
    return false;
}



export function Logout(){    
    localStorage.setItem("user", null);   
    window.location.replace(process.env.REACT_APP_PROJECT_SUB_PATH);
}
