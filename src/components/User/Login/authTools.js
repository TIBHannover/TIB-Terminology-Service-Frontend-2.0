

class AuthTool{

    static setHeaderForTsMicroBackend(withAccessToken=false) {
        let header = {};
        header["TS_Frontend_Id"] = process.env.REACT_APP_PROJECT_ID;
        header["TS_Auth_Provider"] = "github";        
        if (withAccessToken){
            header["Authorization"] = localStorage.getItem("token");            
        }
        return header;
    }

}

export default AuthTool;