import { isLogin } from "./Auth"
import {Route} from 'react-router-dom';
import Login from "./Login";

function RequireLoginRoute({component: Component, ...rest}){
     
    if (!isLogin()) {        
        return <Login isModal={false}></Login>
    }
    return (<Route component={Component} {...rest}/> )
}

export default RequireLoginRoute;