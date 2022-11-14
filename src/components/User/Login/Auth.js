import {withRouter} from 'react-router-dom';

export function auth(){
    let cUrl = window.location.href;
    if(cUrl.includes("code=")){
        let code = cUrl.split("code=")[1];
        let data = new FormData();
        data.append("code", code);
        fetch(`http://localhost:5000/login`, {method: "POST", body: data})
            .then((resp) => resp.json())
            .then((resp) => {
                if(resp["data"]){
                    localStorage.setItem("name", resp["data"]["name"]);
                    localStorage.setItem("company", resp["data"]["company"]);
                    localStorage.setItem("github_home", resp["data"]["github_home"]);
                    localStorage.setItem("avatar", resp["data"]["avatar"]);
                    localStorage.setItem("token", resp["data"]["token"]);
                    window.location.replace("/ts");
                    return true;                              
                }
                return false;
            })
            .catch((e) => {
                return false;
            })
    }   
}



export function isLogin(){
    if(localStorage.getItem("token")){
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
        window.location.replace("/ts");
    }    
}
