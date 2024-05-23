import { TsPluginHeader, GetHeaderFuncParams } from "./types/headerTypes";
import { UserModelType } from "./types/userTypes";



export function getTsPluginHeaders(params:GetHeaderFuncParams):TsPluginHeader{
    let isJson = params.isJson ? params.isJson : false;
    let withAccessToken = params.withAccessToken ? params.withAccessToken : false;
    let userJson = localStorage.getItem('user');
    let user:UserModelType = userJson ? JSON.parse(userJson) : null;                    
    let header:TsPluginHeader = {};
    header["X-TS-Frontend-Id"] = process.env.REACT_APP_PROJECT_ID;
    header["X-TS-Frontend-Token"] = process.env.REACT_APP_MICRO_BACKEND_TOKEN;
    header["X-TS-Auth-Provider"] = localStorage.getItem('authProvider');
    header['X-TS-Orcid-Id'] = user?.orcidId;
    header["X-TS-User-Name"] = user?.username;
        
    if (withAccessToken){
        header["Authorization"] = user?.token;
        header["X-TS-User-Token"] = user?.userToken;
    }
    if (isJson){
        header['Content-Type'] = 'application/json';
    }
    return header;
}