import { TsPluginHeader, GetHeaderFuncParams } from "./types/headerTypes";
import { UserModelType } from "./types/userTypes";


export function getTsPluginHeaders(params: GetHeaderFuncParams): TsPluginHeader {
    let isJson = params.isJson ? params.isJson : false;
    let withAccessToken = params.withAccessToken ? params.withAccessToken : false;
    let userJson = localStorage.getItem('user');
    let user: UserModelType = userJson ? JSON.parse(userJson) : null;
    let header: TsPluginHeader = {};
    header["X-TS-Frontend-Id"] = process.env.REACT_APP_PROJECT_ID;
    header["X-TS-Frontend-Token"] = process.env.REACT_APP_MICRO_BACKEND_TOKEN;
    header["X-TS-Auth-Provider"] = localStorage.getItem('authProvider');

    if (withAccessToken) {
        header["X-CSRF-Token"] = user?.csrf ?? "";
        header["X-Auth-Token"] = user?.jwt ?? "";
    }
    if (isJson) {
        header['Content-Type'] = 'application/json';
    }
    return header;
}