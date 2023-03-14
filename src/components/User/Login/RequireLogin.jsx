import { useState } from "react";
import { isLogin } from "./Auth"
import {Route} from 'react-router-dom';
import Login from "./Login";


function RequireLoginRoute({component: Component, ...rest}){
    const [loginStatus, setLoginStatus] = useState(null);
    document.getElementsByClassName("App")[0].style.filter = "blur(10px)";
    document.getElementById("login-loading").style.display = "block";
    isLogin().then((resp) => {
        setLoginStatus(resp);
    });

    
    if (!loginStatus) {        
        return <Login isModal={false}></Login>;
    }

    document.getElementsByClassName("App")[0].style.filter = "";
    document.getElementById("login-loading").style.display = "";
    return (<Route component={Component} {...rest}/> )
}

export default RequireLoginRoute;