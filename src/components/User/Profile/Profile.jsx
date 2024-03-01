import React from "react";
import { userIsLoginByLocalStorage } from "../Login/TS/Auth";
import {buildProfileByTsBackend} from './ProfileFields';


class UserProfile extends React.Component{

    render(){
        if(process.env.REACT_APP_AUTH_FEATURE !== "true"){
            return null;
        }
        return [
            <div className="row">
                 {userIsLoginByLocalStorage && buildProfileByTsBackend()}                       
            </div>                    
        ];
    }
}

export default UserProfile;