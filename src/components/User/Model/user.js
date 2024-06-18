class UserModel{
    constructor(){
        this.token = "";
        this.fullName = "";
        this.username = "";
        this.userToken = "";
        this.authProvider = "";
        this.company = "";
        this.gitHomeUrl = "";
        this.orcidId = "";
        this.systemAdmin = false;
        this.settings = {
            userCollectionEnabled: false,
            activeCollection: {"title": "", "ontology_ids": []},
            advancedSearchEnabled: false,
            activeSearchSetting: {},
            activeSearchSettingIsModified: false
        };
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

    setGitInfo({company, homeUrl}){
        this.company = company;
        this.gitHomeUrl = homeUrl;
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