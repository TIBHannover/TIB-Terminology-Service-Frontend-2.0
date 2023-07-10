import Login from "../Login/TS/Login";
import { userIsLoginByLocalStorage } from "../Login/TS/Auth";
import { useAuth } from "react-oidc-context";


function SubmitedIssueRequests(){
    const auth = useAuth();

    return [
        <div className="row">
                {(!auth.isAuthenticated && !userIsLoginByLocalStorage()) &&                     
                    <Login isModal={false} />
                }
                {(auth.isAuthenticated  || userIsLoginByLocalStorage()) &&
                    <div className="row">                        
                        
                    </div>                   
                }              
        </div> 
    ];

}

export default SubmitedIssueRequests;

