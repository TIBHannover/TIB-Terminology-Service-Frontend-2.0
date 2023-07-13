

class AuthTool{

    static setHeaderForTsMicroBackend(withAccessToken=false) {
        let header = {};
        header["X-TS-Frontend-Id"] = process.env.REACT_APP_PROJECT_ID;
        header["X-TS-Auth-Provider"] = localStorage.getItem('authProvider');
         
        if (withAccessToken){
            header["Authorization"] = localStorage.getItem("token");            
        }
        return header;
    }

}

export default AuthTool;