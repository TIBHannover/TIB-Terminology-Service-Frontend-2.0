import React from "react";
import {auth, userIsLoginByLocalStorage, Logout} from "./Auth";

class Login extends React.Component{
    constructor(props){
        super(props);       
        this.gitHubLoginUrl = this.gitHubLoginUrl.bind(this);        
    }

    gitHubLoginUrl(){
        let loginUrl = "https://github.com/login/oauth/authorize?scope=user";
        loginUrl += "&client_id=" + process.env.REACT_APP_GITHUB_CLIENT_ID;
        loginUrl += "&redirect_uri=" + process.env.REACT_APP_LOGIN_REDIRECT_URL;
        return loginUrl;       
    }

    componentDidMount(){
        auth();        
    }

    render(){
        return [
            <span>                
                {!userIsLoginByLocalStorage() && this.props.isModal &&
                    // render the modal. Used in the site header 
                    <span>
                    <a type="button" data-toggle="modal" data-target="#loginModal">Login</a>
                    <div class="modal fade loginModal" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="loginModalLabel">Login</h5>
                                    <a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a>
                                </div>
                                <div class="modal-body text-center">
                                    <a href={this.gitHubLoginUrl()} className="btn btn-primary github-login-btn">
                                        <i className="fa fa-github"></i> Sign in with GitHub
                                    </a>
                                </div>                            
                            </div>
                        </div>
                    </div>
                    </span>                    
                }
                {!userIsLoginByLocalStorage() && !this.props.isModal &&
                    // render the normal login form. Used when a user need to login before accessing a section
                    <div className="row">
                        <div className="col-sm-12 text-center">
                            <h5>You need to login for accessing this section.</h5>
                            <br></br>
                            <a href={this.gitHubLoginUrl()} className="btn btn-primary github-login-btn">
                                <i className="fa fa-github"></i> Sign in with GitHub
                            </a>
                        </div>
                    </div>                   
                }
                {userIsLoginByLocalStorage() &&                     
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle user-profile-dropdown" type="button" id="userProfileDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                           {localStorage.getItem("name")}
                        </button>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userProfileDropdown">
                            <a class="dropdown-item" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/myprofile"}>My Profile</a>
                            <a class="dropdown-item" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/submitedIssueRequests"}>Submited Issue Requests</a>
                            <a class="dropdown-item" href="#" onClick={() => {Logout();}}>Logout</a>                            
                        </div>                        
                    </div>
                }
            </span>            
        ];
    }
}

export default Login;