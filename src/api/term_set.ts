import { TsPluginHeader } from "./types/headerTypes";
import { getTsPluginHeaders } from "./header";
import { TermSet } from "./types/termsetTypes";


export async function getTermsetList(): Promise<TermSet[] | []> {
  try {
    type RespType = {
      _results: {
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
    return termSetList["_results"]["term_sets"];
  } catch {
    return [];
  }
}
