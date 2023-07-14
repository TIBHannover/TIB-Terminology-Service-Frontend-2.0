

class AuthTool{

    static setHeaderForTsMicroBackend(withAccessToken=false) {
        let header = {};
        header["X-TS-Frontend-Id"] = process.env.REACT_APP_PROJECT_ID;
        header["X-TS-Auth-Provider"] = localStorage.getItem('authProvider');
        header['X-TS-Orcid-Id'] = localStorage.getItem("orcid_id");
         
        if (withAccessToken){
            header["Authorization"] = localStorage.getItem("token");            
        }
        return header;
    }


    static setAuthResponseInLocalStorage(response){
        let authProvider = localStorage.getItem('authProvider');
        if(authProvider === 'github'){            
            localStorage.setItem("name", response["name"]);
            localStorage.setItem("company", response["company"]);
            localStorage.setItem("github_home", response["github_home"]);                    
            localStorage.setItem("token", response["token"]);
            localStorage.setItem("ts_username", response["ts_username"]);
            localStorage.setItem("isLoginInTs", 'true');
        }
        else if(authProvider === "orcid"){
            localStorage.setItem("name", response["name"]);                    
            localStorage.setItem("token", response["token"]);
            localStorage.setItem("orcid_id", response["orcid_id"]);
            localStorage.setItem("ts_username", response["ts_username"]);
            localStorage.setItem("isLoginInTs", 'true');
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