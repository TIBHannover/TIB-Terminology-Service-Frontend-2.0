import { useState } from "react";
import { isLogin } from "./TS/Auth";


function RenderIfLogin({component: Component}){
    const [loginStatus, setLoginStatus] = useState(null);    
    isLogin().then((resp) => {
        setLoginStatus(resp);
    });
    
    if (loginStatus) {
        return Component;
    }
    return "";
   
    
}

export default RenderIfLogin;