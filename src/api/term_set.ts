import { TsPluginHeader } from "./types/headerTypes";
import { getTsPluginHeaders } from "./header";
import { TermSet, NewTermSetFormData } from "./types/termsetTypes";


export async function getTermsetList(): Promise<TermSet[] | []> {
  try {
    type RespType = {
      _result: {
        term_sets: TermSet[]
      }
    }
    let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: true });
    let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/term_set/get/";
    let result = await fetch(url, { headers: headers })
    if (!result.ok) {
      return [];
    }
    let termSetList = await result.json() as RespType;
    return termSetList["_result"]["term_sets"];
  } catch {
    return [];
  }
}


export async function createTermset(termset: NewTermSetFormData): Promise<TermSet | null> {
  try {
    type RespType = {
      _result: {
        term_set: TermSet
      }
    }
    let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: true });
    let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/term_set/create/";
    let result = await fetch(url, { method: "POST", headers: headers, body: JSON.stringify(termset) })
    if (!result.ok) {
      return null;
    }
    let newTermset = await result.json() as RespType;
    return newTermset["_result"]["term_set"];
  } catch (e) {
    return null;
  }
}
