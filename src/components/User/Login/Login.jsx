import React from "react";

class Login extends React.Component{
    
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
                                <a className="btn btn-primary github-login-btn">
                                    Sign in with GitHub
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