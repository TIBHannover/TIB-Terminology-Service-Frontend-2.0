export function auth(){
    let cUrl = window.location.href;
    if(cUrl.includes("code=")){
        document.getElementsByClassName("App")[0].style.filter = "blur(10px)";
        document.getElementById("login-loading").style.display = "block";
        let code = cUrl.split("code=")[1];
        let data = new FormData();
        data.append("code", code);
        data.append("auth_provider", 'github');
        data.append("frontend_id", process.env.REACT_APP_PROJECT_ID);
        fetch(process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/auth/login', {method: "POST", body: data})
            .then((resp) => resp.json())
            .then((resp) => {                
                if(resp["_result"]){
                    resp = resp["_result"];
                    localStorage.setItem("name", resp["name"]);
                    localStorage.setItem("company", resp["company"]);
                    localStorage.setItem("github_home", resp["github_home"]);                    
                    localStorage.setItem("token", resp["token"]);
                    window.location.replace("/ts");
                    return true;               
                }
                document.getElementsByClassName("App")[0].style.filter = "";
                document.getElementById("login-loading").style.display = "none";
                return false;
            })
            .catch((e) => {
                document.getElementsByClassName("App")[0].style.filter = "";
                document.getElementById("login-loading").style.display = "none";
                return false;
            })
    }   
}



export async function isLogin(){        
    if(localStorage.getItem("token")){        
        let data = new FormData();
        data.append("token", localStorage.getItem("token"));
        data.append("auth_provider", 'github');
        let result = await fetch(process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/auth/validate_login', {method: "POST", body: data});
        result = await result.json()
        result = result["_result"]
        if(result && result["valid"] === true){
            return true
        }
        return false;
    }
    else{        
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
    if(localStorage.getItem("token")){
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("company");
        localStorage.removeItem("github_home");  
        localStorage.removeItem("avatar");  
        localStorage.removeItem("isLoginInTs");  
        // --> send a logout request to backend to destroy the token
        window.location.replace("/ts");
    }    
}
