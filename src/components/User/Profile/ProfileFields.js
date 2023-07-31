export function buildProfileByTsBackend(){
    return [        
        <div className="col-sm-6 user-profile-container">
            <table class="table table-striped">                    
                {localStorage.getItem("authProvider") === "github" ? buildGithubProfile() : buildOrcidProfile()}
            </table>         
        </div>    
    ];
}


export function buildProfileByKecloak(){
    return [
        <div className="col-sm-6 user-profile-container">
            <table class="table table-striped">                    
                <tbody>
                    <tr>                            
                        <td>Name</td>
                        <td> {this.props.auth.user?.profile.name}</td>                            
                    </tr>                    
                </tbody>
            </table>         
        </div>
    ];
}


function buildGithubProfile(){
    return [
        <tbody>
            <tr>                            
                <td>Name</td>
                <td>{localStorage.getItem('name')}</td>                            
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
    ];
}


function buildOrcidProfile(){
    return [
        <tbody>
            <tr>                            
                <td>Name</td>
                <td>{localStorage.getItem('name')}</td>                            
            </tr>            
            <tr>                            
                <td>ORCID ID</td>
                <td> {localStorage.getItem('orcid_id')}</td>                            
            </tr>
        </tbody>
    ];
}