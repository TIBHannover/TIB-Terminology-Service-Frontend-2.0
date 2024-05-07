import UserModel from "../models/user";


class AuthLib{

    static setHeaderForTsMicroBackend(withAccessToken=false) { 
        let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;                    
        let header = {};
        header["X-TS-Frontend-Id"] = process.env.REACT_APP_PROJECT_ID;
        header["X-TS-Frontend-Token"] = process.env.REACT_APP_MICRO_BACKEND_TOKEN;
        header["X-TS-Auth-Provider"] = localStorage.getItem('authProvider');
        header['X-TS-Orcid-Id'] = user?.orcidId;
        header["X-TS-User-Name"] = user?.username;
         
        if (withAccessToken){
            header["Authorization"] = user?.token;
            header["X-TS-User-Token"] = user?.userToken;
        }
        return header;
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

}

export default AuthLib;