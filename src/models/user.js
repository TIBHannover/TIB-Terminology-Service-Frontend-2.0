class UserModel{
    constructor(){
        this.token = "";
        this.fullName = "";
        this.username = "";
        this.userToken = "";
        this.authProvider = "";
        this.company = "";
        this.githubHomeUrl = "";
        this.orcidId = "";
        this.systemAdmin = false;
        this.settings = {};
    }

    
    setToken(token){
        this.token = token;
    }


    setUsername(username){
        this.username = username;
    }

    setUserToken(token){
        this.userToken = token;
    }

    setAuthProvider(providerName){
        this.authProvider = providerName;
    }

    setFullName(fullName){
        this.fullName = fullName;
    }

    setGithubInfo({company, homeUrl}){
        this.company = company;
        this.githubHomeUrl = homeUrl;
    }

    setOrcidInfo({orcidId}){
        this.orcidId = orcidId;
    }

    setSystemAdmin(isAdmin){
        this.systemAdmin = isAdmin;
    }

    setSettings(settings){
        this.settings = settings;
    }
}

export default UserModel;