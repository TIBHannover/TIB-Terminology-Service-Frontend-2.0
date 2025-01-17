import { useContext } from "react";
import { AppContext } from "../../../context/AppContext";


const UserProfile = () =>{

    const appContext = useContext(AppContext);

    function buildGitProfile(){
        return [
            <tbody>
                <tr>                            
                    <td>Name</td>
                    <td>{appContext.user.fullName}</td>                            
                </tr>
                <tr>                            
                    <td>Homepage</td>
                    <td><a href={appContext.user.githubHomeUrl} target={"_blank"}>{appContext.user.githubHomeUrl}</a></td>                            
                </tr>
                <tr>                            
                    <td>Organization</td>
                    <td> {appContext.user.company}</td>                            
                </tr>
            </tbody>
        ];
    }
    
    
    function buildOrcidProfile(){
        return [
            <tbody>
                <tr>                            
                    <td>Name</td>
                    <td>{appContext.user.fullName}</td>                            
                </tr>            
                <tr>                            
                    <td>ORCID ID</td>
                    <td> {appContext.user.orcidId}</td>                            
                </tr>
            </tbody>
        ];
    }

    
    if(process.env.REACT_APP_AUTH_FEATURE !== "true"){
        return null;
    }
    return (
        <div className="row">                
                <div className="col-sm-6 user-info-panel user-profile-container">
                    <table class="table table-striped">                    
                        {localStorage.getItem("authProvider") === "orcid" ? buildOrcidProfile() : buildGitProfile()}
                    </table>         
                </div>                      
        </div>                    
    );
    
}

export default UserProfile;