import { getTsPluginHeaders } from "./header";
import { ContentReport } from "./types/userTypes";


export async function sendResolveRequest(props: { objectType: string, objectId: string, action: string, creatorUsername: string }) {
  try {
    type ResultType = {
      _result: {
        resolved: boolean;
      };
    };
    let { objectType, objectId, action, creatorUsername } = props;
    let headers = getTsPluginHeaders({ withAccessToken: true });
    let formData = {
      objectType: objectType,
      objectId: objectId,
      action: action,
      creatorUsername: creatorUsername
    };
    let resolveUrl = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/report/resolve/';
    let resp = await fetch(resolveUrl, { method: 'POST', headers: headers, body: JSON.stringify(formData) });
    if (!resp.ok) {
      return false;
    }
    let result = await resp.json() as ResultType;
    return result['_result']['resolved'];
  }
  catch (e) {
    return false;
  }
}



export async function getReportList(): Promise<ContentReport[]> {
  try {
    type ResultType = {
      _result: {
        reports: ContentReport[];
      };
    };
    let headers = getTsPluginHeaders({ withAccessToken: true });
    let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/report/list/';
    let resp = await fetch(url, { method: 'GET', headers: headers });
    if (!resp.ok) {
      return [];
    }
    let result = await resp.json() as ResultType;
    return result['_result']['reports'];
  }
  catch (e) {
    return [];
  }
}





