import {
    UserSettings,
    SearchSettingPayload,
    SearchSettingApiResponse,
    ContactFormData,
    ApiKey
} from "./types/userTypes";
import { TsPluginHeader } from "./types/headerTypes";
import { getTsPluginHeaders } from "./header";
import { LoginResponse } from "./types/userTypes";


const baseUrl: string | undefined = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT;


export async function runLogin(authCode: string): Promise<LoginResponse | null> {
    try {
        let headers: TsPluginHeader = getTsPluginHeaders({ isJson: false, withAccessToken: false });
        headers["X-TS-Auth-APP-Code"] = authCode;
        let result: any = await fetch(baseUrl + "/user/login/", { method: "GET", headers: headers, credentials: "include" });
        result = await result.json();
        result = result['_result'];
        if (result && result["issue"]) {
            return null;
        }
        return result;
    } catch (e) {
        return null;
    }
}


export async function logout(): Promise<boolean> {
    try {
        let headers: TsPluginHeader = getTsPluginHeaders({ isJson: false, withAccessToken: true });
        let result: any = await fetch(baseUrl + "/user/logout/", { method: "GET", headers: headers, credentials: "include" });
        result = await result.json();
        result = result['_result'];
        if (result) {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}


export async function isLogin(): Promise<boolean> {
    try {
        let headers: TsPluginHeader = getTsPluginHeaders({ isJson: false, withAccessToken: true });
        let result: any = await fetch(baseUrl + '/user/validate_login/', { method: "GET", headers: headers, credentials: "include" });
        if (result.status !== 200) {
            return false;
        }
        result = await result.json()
        result = result["_result"]
        if (result && result["valid"] === true) {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}


export async function storeUserSettings(settings: UserSettings): Promise<boolean> {
    try {
        let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: true });
        let result: any = await fetch(baseUrl + "/user/settings/", {
            method: "POST",
            credentials: "include",
            headers: headers,
            body: JSON.stringify(settings)
        });
        result = await result.json();
        result = result['_result']['saved'];
        if (result || result === "true") {
            // update local settings
            let userJson = localStorage.getItem('user');
            let user: any = userJson ? JSON.parse(userJson) : null;
            if (user) {
                user.settings = settings
                localStorage.setItem('user', JSON.stringify(user));
            }
        }
        return result;
    } catch (e) {
        return false;
    }
}


export async function storeSearchSettings(settingData: SearchSettingPayload): Promise<SearchSettingApiResponse | boolean> {
    try {
        let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: true });
        let result: any = await fetch(baseUrl + "/user/search_setting/", {
            method: "POST",
            credentials: "include",
            headers: headers,
            body: JSON.stringify(settingData)
        });
        result = await result.json();
        result = result['_result']?.['saved'];
        if (result) {
            return result;
        }
        return false;
    } catch (e) {
        return false;
    }
}


export async function fetchSearchSettings(): Promise<Array<SearchSettingApiResponse> | []> {
    try {
        let headers: TsPluginHeader = getTsPluginHeaders({ isJson: false, withAccessToken: true });
        let result: any = await fetch(baseUrl + "/user/search_setting/", { method: "GET", headers: headers, credentials: "include" });
        result = await result.json();
        result = result['_result']['settings'];
        if (result) {
            return result;
        }
        return [];
    } catch (e) {
        return [];
    }
}


export async function updateSearchSettings(settingId: string | number, settingData: SearchSettingPayload): Promise<SearchSettingApiResponse | boolean> {
    try {
        let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: true });
        let result: any = await fetch(baseUrl + "/user/search_setting/" + settingId + '/', {
            method: "PUT",
            credentials: "include",
            headers: headers,
            body: JSON.stringify(settingData)
        });
        result = await result.json();
        result = result['_result']['updated'];
        if (result) {
            return result;
        }
        return false;
    } catch (e) {
        return false;
    }
}


export async function deleteSearchSetting(settingId: string | number): Promise<boolean> {
    try {
        let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: true });
        let result: any = await fetch(baseUrl + "/user/search_setting/" + settingId + '/', {
            method: "DELETE",
            credentials: "include",
            headers: headers
        });
        result = await result.json();
        result = result['_result']['deleted'];
        if (result) {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}


export async function sendContactFrom(data: ContactFormData): Promise<boolean> {
    try {
        let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: false });
        let result: any = await fetch(baseUrl + "/contact/create/", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });
        if (result.status === 200) {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}


export async function fetchUserApiKeys(): Promise<ApiKey[]> {
    type _resp = {
        _result: {
            api_keys: ApiKey[]
        }
    }
    try {
        let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: true });
        let result: any = await fetch(baseUrl + "/user/apikey/get/", { method: "GET", headers: headers, credentials: "include" });
        result = await result.json() as _resp;
        result = result['_result']['api_keys'];
        if (result) {
            return result;
        }
        return [];
    } catch (e) {
        return [];
    }
}

export async function createApiKey(data: { name: string, description: string, title: string, expires_at: string }): Promise<string> {
    type _resp = {
        _result: {
            api_key: ApiKey,
            token: string
        }
    }
    try {
        let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: true });
        let result: any = await fetch(baseUrl + "/user/apikey/create/", {
            method: "POST",
            credentials: "include",
            headers: headers,
            body: JSON.stringify(data)
        });
        result = await result.json() as _resp;
        result = result['_result'];
        if (result) {
            return result.token;
        }
        return "";
    } catch (e) {
        return "";
    }
}

export async function updateApiKey(data: { id: string, name: string, description: string, title: string, expires_at: string }): Promise<ApiKey | null> {
    type _resp = {
        _result: {
            updated: ApiKey
        }
    }
    try {
        let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: true });
        let result: any = await fetch(baseUrl + "/user/apikey/update/", {
            method: "PUT",
            credentials: "include",
            headers: headers,
            body: JSON.stringify(data)
        });
        result = await result.json() as _resp;
        result = result['_result']['updated'];
        return result;
    } catch (e) {
        return null;
    }
}

export async function deleteApiKey(id: string): Promise<boolean> {
    type _resp = {
        _result: {
            deleted: boolean
        }
    }
    try {
        let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: true });
        let result: any = await fetch(baseUrl + "/user/apikey/delete/", {
            method: "DELETE",
            credentials: "include",
            headers: headers,
            body: JSON.stringify({ id: id })
        });
        result = await result.json() as _resp;
        result = result['_result']['deleted'];
        if (result) {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}
