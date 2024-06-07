import { useContext } from "react";
import {Route} from 'react-router-dom';
import UserPanel from "./UserPanel";
import { AppContext } from "../../../context/AppContext";


const RequireLoginRoute = ({component: Component, ...rest}) => {    

    const appContext = useContext(AppContext);

    if (!appContext.user) {           
        return <UserPanel isModal={false}></UserPanel>;
    }
        
    return (<Route component={Component} {...rest}/> )
}

export default RequireLoginRoute;
