import { useState } from "react";
import { isLogin } from "./TS/Auth";
import {Route} from 'react-router-dom';
import LoginPanel from "./TS/LoginPanel";


const RequireLoginRoute = ({component: Component, ...rest}) => {    

    const [loginStatus, setLoginStatus] = useState(null);    
    const [loginProcessFinished, setLoginProcessFinished] = useState(false);    
    isLogin().then((resp) => {
        setLoginStatus(resp ? true : false);
        setLoginProcessFinished(true);
    });

    if(!loginProcessFinished){
        return "";
    }

    else if (!loginStatus && loginProcessFinished) {           
        return <LoginPanel isModal={false}></LoginPanel>;
    }
        
    return (<Route component={Component} {...rest}/> )
}

export default RequireLoginRoute;
