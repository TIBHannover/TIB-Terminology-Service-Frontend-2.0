import {
  LoginResponse
  , UserSettings,
  SearchSettingPayload,
  SearchSettingApiResponse,
  ContactFormData
} from "./types/userTypes";
import { TsPluginHeader } from "./types/headerTypes";
import { getTsPluginHeaders } from "./header";




const baseUrl: string | undefined = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT;


export async function runLogin(authCode: string): Promise<LoginResponse | null> {
  try {
    let headers: TsPluginHeader = getTsPluginHeaders({ isJson: false, withAccessToken: false });
    headers["X-TS-Auth-APP-Code"] = authCode;
    let result: any = await fetch(baseUrl + "/user/login/", { method: "GET", headers: headers });
    result = await result.json();
    result = result['_result'];
    if (result && result["issue"]) {
      return null;
    }
    return result;
  }
  catch (e) {
    return null;
  }
}




export async function isLogin(): Promise<boolean> {
  try {
    let headers: TsPluginHeader = getTsPluginHeaders({ isJson: false, withAccessToken: true });
    let result: any = await fetch(baseUrl + '/user/validate_login/', { method: "GET", headers: headers });
    if (result.status !== 200) {
      return false;
    }
    result = await result.json()
    result = result["_result"]
    if (result && result["valid"] === true) {
      return true;
    }
    return false;
  }
  catch (e) {
    return false;
  }
}



export async function storeUserSettings(settings: UserSettings): Promise<boolean> {
  try {
    let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: true });
    let result: any = await fetch(baseUrl + "/user/settings/", { method: "POST", headers: headers, body: JSON.stringify(settings) });
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
  }
  catch (e) {
    return false;
  }
}



export async function storeSearchSettings(settingData: SearchSettingPayload): Promise<SearchSettingApiResponse | boolean> {
  try {
    let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: true });
    let result: any = await fetch(baseUrl + "/user/search_setting/", { method: "POST", headers: headers, body: JSON.stringify(settingData) });
    result = await result.json();
    result = result['_result']?.['saved'];
    if (result) {
      return result;
    }
    return false;
  }
  catch (e) {
    return false;
  }
}



export async function fetchSearchSettings(): Promise<Array<SearchSettingApiResponse> | []> {
  try {
    let headers: TsPluginHeader = getTsPluginHeaders({ isJson: false, withAccessToken: true });
    let result: any = await fetch(baseUrl + "/user/search_setting/", { method: "GET", headers: headers });
    result = await result.json();
    result = result['_result']['settings'];
    if (result) {
      return result;
    }
    return [];
  }
  catch (e) {
    return [];
  }
}



export async function updateSearchSettings(settingId: string | number, settingData: SearchSettingPayload): Promise<SearchSettingApiResponse | boolean> {
  try {
    let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: true });
    let result: any = await fetch(baseUrl + "/user/search_setting/" + settingId + '/', { method: "PUT", headers: headers, body: JSON.stringify(settingData) });
    result = await result.json();
    result = result['_result']['updated'];
    if (result) {
      return result;
    }
    return false;
  }
  catch (e) {
    return false;
  }
}


export async function deleteSearchSetting(settingId: string | number): Promise<boolean> {
  try {
    let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: true });
    let result: any = await fetch(baseUrl + "/user/search_setting/" + settingId + '/', { method: "DELETE", headers: headers });
    result = await result.json();
    result = result['_result']['deleted'];
    if (result) {
      return true;
    }
    return false;
  }
  catch (e) {
    return false;
  }
}


export async function sendContactFrom(data: ContactFormData): Promise<boolean> {
  try {
    let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: false });
    let result: any = await fetch(baseUrl + "/contact/create/", { method: "POST", headers: headers, body: JSON.stringify(data) });
    if (result.status === 200) {
      return true;
    }
    return false;
  }
  catch (e) {
    return false;
  }
}
