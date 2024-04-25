import { useContext } from "react";
import { AppContext } from "../../../../context/AppContext";
import AuthFactory from "../AuthFactory";



const LoginPanel = (props) => {

    const appContext = useContext(AppContext);


    function authProviderUrl(e){
        let authProvider = e.target.getAttribute("authProvider");
        let loginUrl = "";
        if(authProvider === "github"){
            loginUrl = process.env.REACT_APP_GITHUB_AUTH_BASE_URL;
            loginUrl += "&client_id=" + process.env.REACT_APP_GITHUB_CLIENT_ID;                   
        }
        else{
            loginUrl = process.env.REACT_APP_ORCID_AUTH_BASE_URL;
            loginUrl += "&client_id=" + process.env.REACT_APP_ORCID_CLIENT_ID;            
        }
        
        loginUrl += "&redirect_uri=" + process.env.REACT_APP_LOGIN_REDIRECT_URL;
        localStorage.setItem("authProvider", authProvider);
        localStorage.setItem("redirectUrl", window.location.href);
        window.location.replace(loginUrl);
    }



    function buildAuthButtons(){        
        return [
            <span>
                <div className="row justify-content-center">
                    <a onClick={authProviderUrl}  authProvider="github" className="btn btn-secondary github-login-btn">
                        <i className="fa fa-github"></i> Sign in with GitHub
                    </a>
                </div>
                <br></br>
                <div className="row justify-content-center">
                    <a onClick={authProviderUrl} authProvider="orcid" className="btn btn-secondary orcid-login-btn">
                    <i class="fa-brands fa-orcid"></i> Sign in with ORCID
                    </a>
                </div>   
            </span>
        ];
    }



    if(process.env.REACT_APP_AUTH_FEATURE !== "true"){            
        return null;
    }

    return (
        <span>                
            {!appContext.user && props.isModal &&
                // render the modal. Used in the site header 
                <span>
                    <a  className="login-btn-header" type="button" data-toggle="modal" data-target="#loginModal">Login</a>
                    <div class="modal fade loginModal" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="loginModalLabel">Login</h5>                                        
                                    <a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a>
                                </div>
                                <div class="modal-body">
                                    <div className="login-modal-hint-text">  
                                        <strong>Attention:</strong> Some of the features, such as term request, are only available if you 
                                                    authenticate with Github. 
                                    </div>
                                    <br></br> 
                                    {buildAuthButtons()}
                                </div>                            
                            </div>
                        </div>
                    </div>
                </span>                    
            }
            {!appContext.user && !props.isModal &&
                // render the normal login form. Used when a user need to login before accessing a section
                <div className="row">
                    <div className="col-sm-12 text-center">
                        <h5>You need to login for accessing this section.</h5>
                        <div>  
                            <strong>Attention:</strong> Some of the features, such as term request, are only available if you 
                                        authenticate with Github. 
                        </div> 
                        <br></br>
                        {buildAuthButtons()}
                    </div>
                </div>                   
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



export default LoginPanel;