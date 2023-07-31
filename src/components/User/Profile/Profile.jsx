import React from "react";
// import LoginForm from "../Login/Keycloak/Login";
import Login from "../Login/TS/Login";
import { withAuth } from "react-oidc-context";
import { userIsLoginByLocalStorage } from "../Login/TS/Auth";
import {buildProfileByTsBackend, buildProfileByKecloak} from './ProfileFields';


class UserProfile extends React.Component{

    render(){
        return [
            <div className="row">
                 {!this.props.auth.isAuthenticated && userIsLoginByLocalStorage && buildProfileByTsBackend()}
                {this.props.auth.isAuthenticated && buildProfileByKecloak()}        
            </div>                    
        ];
    }
}

export default withAuth(UserProfile);