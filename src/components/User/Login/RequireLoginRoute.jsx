import { useState } from "react";
import { isLogin } from "./TS/Auth";
import {Route} from 'react-router-dom';
import Login from "./TS/Login";


function RequireLoginRoute({component: Component, ...rest}){
    const [loginStatus, setLoginStatus] = useState(null);    
    isLogin().then((resp) => {
        setLoginStatus(resp);
    });

    
    if (!loginStatus) {           
        return <Login isModal={false}></Login>;
    }
    
    return (<Route component={Component} {...rest}/> )
}

export default RequireLoginRoute;
