import { useState } from "react";
import AuthFactory from "./AuthFactory";
import {Route} from 'react-router-dom';
import UserPanel from "./UserPanel";


const RequireLoginRoute = ({component: Component, ...rest}) => {    

    const [loginStatus, setLoginStatus] = useState(null);    
    const [loginProcessFinished, setLoginProcessFinished] = useState(false);    
    AuthFactory.userIsLogin().then((resp) => {
        setLoginStatus(resp ? true : false);
        setLoginProcessFinished(true);
    });

    if(!loginProcessFinished){
        return "";
    }

    else if (!loginStatus && loginProcessFinished) {           
        return <UserPanel isModal={false}></UserPanel>;
    }
        
    return (<Route component={Component} {...rest}/> )
}

export default RequireLoginRoute;
