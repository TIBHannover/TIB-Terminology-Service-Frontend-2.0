import { isLogin } from "./Auth"
import {Route} from 'react-router-dom';

function RequireLoginRoute({component: Component, ...rest}){
     
    if (!isLogin()) {
        window.location.replace("/ts");
    }
    return (<Route component={Component} {...rest}/> )
}

export default RequireLoginRoute;