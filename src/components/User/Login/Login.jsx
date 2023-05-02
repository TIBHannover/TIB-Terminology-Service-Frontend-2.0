import { useAuth } from "react-oidc-context";


export default function LoginForm(onlyLoginButton){
    const auth = useAuth();
    console.info(auth.user)
    return [
        <span>                
            {!auth.isAuthenticated && onlyLoginButton &&                    
                <span>
                    <a type="button" onClick={() => void auth.signinRedirect()}>Login</a>                    
                </span>                    
            }
            {!auth.isAuthenticated && !onlyLoginButton &&                
                <div className="row">
                    <div className="col-sm-12 text-center">
                        <h5>You need to login for accessing this section.</h5>
                        <br></br>
                        <a type="button" onClick={() => void auth.signinRedirect()}>Login</a>
                    </div>
                </div>                   
            }
            {auth.isAuthenticated &&                     
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle user-profile-dropdown" type="button" id="userProfileDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {auth.user?.profile?.name}
                    </button>
                    <div class="dropdown-menu" aria-labelledby="userProfileDropdown">
                        <a class="dropdown-item" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/myprofile"}>My Profile</a>
                        <a class="dropdown-item" href="#" onClick={() => void auth.removeUser()}>Logout</a>                            
                    </div>                        
                </div>
            }
        </span>            
    ];
    
}
