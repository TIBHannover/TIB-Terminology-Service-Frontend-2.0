export function auth(){
    let cUrl = window.location.href;
    if(cUrl.includes("code=")){
        // document.getElementsByClassName("App")[0].style.filter = "blur(10px)";
        // document.getElementById("login-loading").style.display = "block";
        let code = cUrl.split("code=")[1];
        let data = new FormData();
        data.append("code", code);       
        fetch('https://github.com/login/oauth/access_token', {method: "POST", body: data})
            .then((resp) => resp.json())
            .then((resp) => {                
                console.info(resp)
                return true;
            })
            .catch((e) => {
                return false;
            })
    }   
}



export async function isLogin(){    
    if(localStorage.getItem("token")){
        let data = new FormData();
        data.append("token", localStorage.getItem("token"));
        let result = await fetch(process.env.REACT_APP_AUTH_BACKEND_ENDPOINT + '/validate_login', {method: "POST", body: data});
        result = await result.json();
        if(result && result["valid"] === true){
            return true
        }
        return false;
    }
    else{
        return false;
    }
}


export function UserIsLogin(){    
    
    // if(!keycloak.authenticated){
    //     return false;
    // }
    return false;
}


export function Logout(){
    if(localStorage.getItem("token")){
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("company");
        localStorage.removeItem("github_home");  
        localStorage.removeItem("avatar");  
        // --> send a logout request to backend to destroy the token
        window.location.replace("/ts");
    }    
}
