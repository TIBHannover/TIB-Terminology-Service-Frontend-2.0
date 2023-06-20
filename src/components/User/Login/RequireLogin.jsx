import { useState } from "react";
import { isLogin } from "./TS/Auth";
import {Route} from 'react-router-dom';
import Login from "./TS/Login";


function RequireLoginRoute({component: Component, ...rest}){
    const [loginStatus, setLoginStatus] = useState(null);
    document.getElementsByClassName("App")[0].style.filter = "blur(10px)";
    document.getElementById("login-loading").style.display = "block";
    isLogin().then((resp) => {
        setLoginStatus(resp);
    });

    
    if (!loginStatus) {
        document.getElementsByClassName("App")[0].style.filter = "";
        document.getElementById("login-loading").style.display = "";       
        return <Login isModal={false}></Login>;
    }

    document.getElementsByClassName("App")[0].style.filter = "";
    document.getElementById("login-loading").style.display = "";
    return (<Route component={Component} {...rest}/> )
}

export default RequireLoginRoute;