

class AuthTool{

    static setHeaderForTsMicroBackend(withAccessToken=false) {
        let header = {};
        header["X-TS-Frontend-Id"] = process.env.REACT_APP_PROJECT_ID;
        header["X-TS-Frontend-Token"] = process.env.REACT_APP_MICRO_BACKEND_TOKEN;
        header["X-TS-Auth-Provider"] = localStorage.getItem('authProvider');
        header['X-TS-Orcid-Id'] = localStorage.getItem("orcid_id");
        header["X-TS-User-Name"] = localStorage.getItem("ts_username");
         
        if (withAccessToken){
            header["Authorization"] = localStorage.getItem("token");
            header["X-TS-User-Token"] = localStorage.getItem("ts_user_token");
        }
        return header;
    }


    static setAuthResponseInLocalStorage(response){
        let authProvider = localStorage.getItem('authProvider');
        localStorage.setItem("token", response["token"]);
        localStorage.setItem("ts_username", response["ts_username"]);
        localStorage.setItem("ts_user_token", response["ts_user_token"]);
        localStorage.setItem("isLoginInTs", 'true');
        if(authProvider === 'github'){            
            localStorage.setItem("name", response["name"]);
            localStorage.setItem("company", response["company"]);
            localStorage.setItem("github_home", response["github_home"]);                                
        }
        else if(authProvider === "orcid"){
            localStorage.setItem("name", response["name"]);            
            localStorage.setItem("orcid_id", response["orcid_id"]);            
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

}

export default AuthTool;