import React from "react";
import isLogin from "./Auth";

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            isLogin: false
        });

        this.gitHubLoginUrl = this.gitHubLoginUrl.bind(this);
    }

    gitHubLoginUrl(){
        let loginUrl = "https://github.com/login/oauth/authorize?scope=user";
        loginUrl += "&client_id=" + process.env.REACT_APP_GITHUB_CLIENT_ID;
        loginUrl += "&redirect_uri=" + process.env.REACT_APP_LOGIN_REDIRECT_URL;
        return loginUrl;       
    }

    componentDidMount(){
        let cUrl = window.location.href;
        if(cUrl.includes("code=")){
            let code = cUrl.split("code=")[1];
            let data = new FormData();
            data.append("code", code);            
            
            // first fetch the user access token
            fetch(`http://localhost:5000/login`, {method: "POST", body: data})
                .then((resp) => resp.json())
                .then((resp) => {
                    if(resp["data"]){
                        localStorage.setItem("name", resp["data"]["name"]);
                        localStorage.setItem("company", resp["data"]["company"]);
                        localStorage.setItem("github_home", resp["data"]["github_home"]);
                        localStorage.setItem("token", resp["data"]["token"]);
                        this.setState({
                            isLogin: true
                        });                        
                    }
                    
                })
                .catch((e) => {
                    console.info(e);
                })
                
        }
    }


    
    render(){
        return [
            <span>
                {!isLogin() && 
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
                {isLogin() && 
                    <a href="#" className="btn btn-primary">{localStorage.getItem('name')}</a>
                }
            </span>            
        ];
    }
}

export default Login;