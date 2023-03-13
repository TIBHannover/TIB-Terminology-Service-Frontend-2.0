import React from "react";


class UserProfile extends React.Component{

    render(){
        return [
            <div className="row">
                <div className="col-sm-4">
                    <img className="img-fluid" src={localStorage.getItem('avatar')} width={400} height={500}></img>
                </div>
                <div className="col-sm-6 user-profile-container">
                    <table class="table table-striped">                    
                        <tbody>
                            <tr>                            
                                <td>Name</td>
                                <td> {localStorage.getItem('name')}</td>                            
                            </tr>
                            <tr>                            
                                <td>GitHub Homepage</td>
                                <td><a href={localStorage.getItem('github_home')} target={"_blank"}>{localStorage.getItem('github_home')}</a></td>                            
                            </tr>
                            <tr>                            
                                <td>Organization</td>
                                <td> {localStorage.getItem('company')}</td>                            
                            </tr>
                        </tbody>
                    </table>         
                </div>
            </div>                    
        ];
    }
}

export default UserProfile;