import { useKeycloak } from "@react-keycloak/web";

export default function LoginForm(onlyLoginButton){
    const { keycloak, initialized } = useKeycloak();        
        
    return [
        <span>                
            {!keycloak.authenticated && onlyLoginButton &&                    
                <span>
                    <a type="button"  onClick={() => keycloak.login()}>Login</a>                    
                </span>                    
            }
            {!keycloak.authenticated && !onlyLoginButton &&                
                <div className="row">
                    <div className="col-sm-12 text-center">
                        <h5>You need to login for accessing this section.</h5>
                        <br></br>
                        <a type="button"  onClick={() => keycloak.login()}>Login</a>
                    </div>
                </div>                   
            }
            {keycloak.authenticated &&                     
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle user-profile-dropdown" type="button" id="userProfileDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {localStorage.getItem("name")}
                    </button>
                    <div class="dropdown-menu" aria-labelledby="userProfileDropdown">
                        <a class="dropdown-item" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/myprofile"}>My Profile</a>
                        <a class="dropdown-item" href="#" onClick={() => {keycloak.logout();}}>Logout</a>                            
                    </div>                        
                </div>
            }
        </span>            
    ];
    
}
