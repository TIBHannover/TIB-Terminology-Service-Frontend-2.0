import { TsPluginHeader } from "./types/headerTypes";
import { getTsPluginHeaders } from "./header";
import { TermSet, NewTermSetFormData } from "./types/termsetTypes";
import { OntologyTermDataV2 } from "./types/ontologyTypes";
import { TsTermset } from "../concepts";
import { resolve } from "path";


export async function getUserTermsetList(userId: string): Promise<TsTermset[]> {
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
    if (!userId) {
      // guest users
      let userTermSets: TermSet[] = termSetList["_result"]["term_sets"];
      userTermSets.sort((s1, s2) => s1.name.localeCompare(s2.name));
      let tsTermsets: TsTermset[] = [];
      for (let ts of userTermSets) {
        let tsTset = new TsTermset(ts);
        tsTermsets.push(tsTset);
      }
      return tsTermsets;
    }
    let userTermSets: TermSet[] = termSetList["_result"]["term_sets"].filter((tset) => tset.creator === userId);
    userTermSets.sort((s1, s2) => s1.name.localeCompare(s2.name));
    let tsTermsets: TsTermset[] = [];
    for (let ts of userTermSets) {
      let tsTset = new TsTermset(ts);
      tsTermsets.push(tsTset);
    }
    return tsTermsets;
  } catch (e) {
    return [];
  }
}


export async function getAllTermsetList(): Promise<TsTermset[]> {
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
    let tsTermsets: TsTermset[] = [];
    for (let ts of termSetList["_result"]["term_sets"]) {
      let tsTset = new TsTermset(ts);
      tsTermsets.push(tsTset);
    }
    return tsTermsets;
  } catch {
    return [];
  }
}


export async function getTermset(termsetId: string): Promise<TsTermset | null> {
  let p = new Promise<TsTermset | null>(async (resolve, reject) => {
    try {
      type RespType = {
        _result: {
          term_set: TermSet
        }
      }
      let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: true });
      let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/term_set/get/" + termsetId + "/";
      let result = await fetch(url, { headers: headers })
      if (!result.ok) {
        const error = new Error("Fetch failed");
        (error as any).status = result.status;
        reject(error);
      }
      let termset = await result.json() as RespType;
      let tsTermset = new TsTermset(termset["_result"]["term_set"]);
      resolve(tsTermset);
    } catch (error) {
      reject(error);
    }
  });
  return p;
}


export async function createTermset(termset: NewTermSetFormData): Promise<TsTermset | null> {
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
    let tsTermset = new TsTermset(newTermset["_result"]["term_set"]);
    return tsTermset;
  } catch (e) {
    return null;
  }
}


export async function updateTermset(termset: TsTermset): Promise<TsTermset | null> {
  try {
    type RespType = {
      _result: {
        term_set: TermSet
      }
    }
    let termsetJson: TermSet = {
      id: termset.id,
      name: termset.name,
      description: termset.description,
      created_at: termset.created_at,
      updated_at: termset.updated_at,
      visibility: termset.visibility,
      terms: termset.terms,
      creator: termset.creator
    };
    let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: true });
    let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/term_set/update/" + termset.id + "/";
    let result = await fetch(url, { method: "PUT", headers: headers, body: JSON.stringify(termsetJson) })
    if (!result.ok) {
      return null;
    }
    let updatedTermset = await result.json() as RespType;
    return new TsTermset(updatedTermset["_result"]["term_set"]);
  } catch (e) {
    return null;
  }
}


export async function addTermToMultipleSets(setIds: string[], term: OntologyTermDataV2): Promise<boolean> {
  try {
    type RespType = {
      _result: {
        added: boolean
      }
    }
    let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: true });

    let calls = setIds.map((id) => {
      let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/term_set/" + id + "/add_term/";
      return fetch(url, { method: "PUT", headers: headers, body: JSON.stringify({ "term": term }) }).then((res) => {
        if (!res.ok) {
          return false;
        }
        return res.json();
      })

    })

    let results = await Promise.all(calls) as RespType[];
    return results.reduce(
      (lastCalculation, current) => lastCalculation && current["_result"]["added"],
      true
    );
  } catch (e) {
    return false;
  }
}


export async function removeTermFromSet(termsetId: string, termId: string): Promise<boolean> {
  try {
    type RespType = {
      _result: {
        removed: boolean
      }
    }
    let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: true });
    let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/term_set/" + termsetId + "/remove_term?termId=" + encodeURIComponent(termId);
    let result = await fetch(url, { method: "DELETE", headers: headers })
    if (!result.ok) {
      return false;
    }
    let removedStatus = await result.json() as RespType;
    return removedStatus["_result"]["removed"];
  } catch (e) {
    return false;
  }
}
