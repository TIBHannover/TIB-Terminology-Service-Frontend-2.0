import AuthLib from "../../../Libs/AuthLib";
import { runLogin, isLogin } from "../../../api/user";
import UserModel from "../Model/user";



class AuthFactory{

    static runAuthentication(){
        let cUrl = window.location.href;
        if(cUrl.includes("code=")){
            AuthLib.enableLoginAnimation();
            let code = cUrl.split("code=")[1];
            if (code.includes("&")) {
                code = code.split("&")[0];
            }        
            runLogin(code).then((resp) => {
                if(resp){                    
                    let userData = AuthFactory.createUserDataObjectFromAuthResponse(resp);
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
            if(authProvider === 'github' || authProvider === 'gitlab'){            
                user.setGitInfo({company: response["company"], homeUrl: response["github_home"]});            
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



    static runLogout(){    
        localStorage.setItem("user", null);
        let redirectUrl = localStorage.getItem("redirectUrl") ? localStorage.getItem("redirectUrl") : process.env.REACT_APP_PROJECT_SUB_PATH;   
        window.location.replace(redirectUrl);
    }


}

export default AuthFactory;