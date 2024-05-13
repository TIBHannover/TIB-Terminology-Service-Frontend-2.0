import AuthLib from "../../../Libs/AuthLib";
import { runLogin, isLogin } from "../../../api/user";



class AuthFactory{

    static runAuthentication(){
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


    static runLogout(){    
        localStorage.setItem("user", null);
        let redirectUrl = localStorage.getItem("redirectUrl") ? localStorage.getItem("redirectUrl") : process.env.REACT_APP_PROJECT_SUB_PATH;   
        window.location.replace(redirectUrl);
    }


}

export default AuthFactory;