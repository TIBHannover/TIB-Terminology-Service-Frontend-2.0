import UserModel from "../models/user";
import { runLogin, isLogin } from "../api/user";
import { getTsPluginHeaders } from "../api/header";


class AuthLib{

    static run(){
        let cUrl = window.location.href;
        if(cUrl.includes("code=")){
            AuthLib.enableLoginAnimation();
            let code = cUrl.split("code=")[1];        
            runLogin(code).then((resp) => {
                if(resp){                    
                    let userData = AuthLib.createUserDataObjectFromAuthResponse(resp);
                    localStorage.setItem('user', JSON.stringify(userData));                     
                    let redirectUrl = localStorage.getItem("redirectUrl") ? localStorage.getItem("redirectUrl") : process.env.REACT_APP_PROJECT_SUB_PATH;
                    window.location.replace(redirectUrl);                    
                    return true;
                }
                AuthLib.disableLoginAnimation();                
                return false;
            });                                   
        }
        else{
            return false;
        }      
    }


    static createUserDataObjectFromAuthResponse(response){
        try{
            let authProvider = localStorage.getItem('authProvider');
            let user = new UserModel();            
            user.setToken(response["token"]);
            user.setFullName(response["name"]);
            user.setUsername(response["ts_username"]);
            user.setUserToken(response["ts_user_token"]);
            user.setSystemAdmin(response["system_admin"]);
            user.setSettings(response["settings"]);            
            user.setAuthProvider(authProvider);        
            if(authProvider === 'github'){            
                user.setGithubInfo({company: response["company"], homeUrl: response["github_home"]});            
            }
            else if(authProvider === "orcid"){
                user.setOrcidInfo({orcidId:response["orcid_id"]});                        
            }
            return user;
        }
        catch(e){
            return null;
        }        
    }


    static enableLoginAnimation(){
        document.getElementsByClassName("App")[0].style.filter = "blur(10px)";
        document.getElementById("login-loading").style.display = "block";
    }


    static disableLoginAnimation(){
        document.getElementsByClassName("App")[0].style.filter = "";
        document.getElementById("login-loading").style.display = "none";
    }


    static getUserName(internalUserName){
        if (!internalUserName){
            return internalUserName;
        }
        else if(internalUserName.includes("github")){
            return internalUserName.split("github_")[1];
        }
        else if (internalUserName.includes("orcid")){
            return internalUserName.split("orcid_")[1];
        }
        return internalUserName;
    }


    static async userIsLogin(){      
        if(process.env.REACT_APP_AUTH_FEATURE !== "true"){
            return false;
        } 
        let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;     
        if(user && user.token){        
            let validation = await isLogin();                        
            if(validation){
                return user;
            }
            else{
                return null;
            }
        }
        else{        
            return null;
        }
    }


    static async userIsSysAdmin(){               
        let headers = getTsPluginHeaders({withAccessToken: true});
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


    static runLogout(){    
        localStorage.setItem("user", null);
        let redirectUrl = localStorage.getItem("redirectUrl") ? localStorage.getItem("redirectUrl") : process.env.REACT_APP_PROJECT_SUB_PATH;   
        window.location.replace(redirectUrl);
    }

}

export default AuthLib;