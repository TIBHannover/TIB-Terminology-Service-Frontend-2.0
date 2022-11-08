import React from "react";

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            accessToken: ""
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
            data.append("client_id", process.env.REACT_APP_GITHUB_CLIENT_ID);
            data.append("client_secret", process.env.REACT_APP_GITHUB_SECRET);
            data.append("code", code);
            data.append("redirect_uri", process.env.REACT_APP_LOGIN_REDIRECT_URL);
            
            // first fetch the user access token
            fetch(`https://github.com/login/oauth/access_token`, {method: "POST", body: data})
                .then((resp) => resp.text())
                .then((resp) => {
                    let params = new URLSearchParams(resp);
                    this.setState({
                        accessToken: params.get("access_token")
                    }, ()=>{
                        // after this, fetch the user data
                        fetch(`https://api.github.com/user`, {headers: {Authorization: `token ${this.state.accessToken}`}})
                            .then((res) => res.json())
                            .then((res) => {
                                console.info(res);
                            })
                            .catch((error) => {
                                console.info("error")
                            });
                    });
                })
        }
    }


    
    render(){
        return [
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
        ];
    }
}

export default Login;