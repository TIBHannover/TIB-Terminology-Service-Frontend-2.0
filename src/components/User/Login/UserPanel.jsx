import { useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import AuthFactory from "./AuthFactory";
import Login from "./TS/Login";



const UserPanel = (props) => {

    const appContext = useContext(AppContext);


    if(process.env.REACT_APP_AUTH_FEATURE !== "true"){            
        return null;
    }

    return (
        <span>                
            {!appContext.user && 
                <Login isModal={props.isModal} />
            }
            {appContext.user &&                     
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle user-profile-dropdown" type="button" id="userProfileDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                       {appContext.user.fullName}
                    </button>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userProfileDropdown">
                        <a class="dropdown-item" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/myprofile"}>My Profile</a>
                        {localStorage.getItem('authProvider') === 'github' && process.env.REACT_APP_GITHUB_ISSUE_REQUEST_FEATURE === "true" &&
                            <a class="dropdown-item" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/submitedIssueRequests"}>Submited Issue Requests</a>
                        }
                        {appContext.isUserSystemAdmin &&
                            <a class="dropdown-item" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/reports"}>{`Reports (${appContext.reportsListForAdmin.length})`}</a> 
                        }                        
                        <a class="dropdown-item" href="#" onClick={() => {AuthFactory.runLogout();}}>Logout</a>
                    </div>                        
                </div>
            }
        </span>            
    );
}



export default UserPanel;