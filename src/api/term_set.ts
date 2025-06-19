import {TsPluginHeader} from "./types/headerTypes";
import {getTsPluginHeaders} from "./header";
import {TermSet, NewTermSetFormData} from "./types/termsetTypes";
import {OntologyTermDataV2} from "./types/ontologyTypes";


export async function getUserTermsetList(userId: string): Promise<TermSet[]> {
    try {
        type RespType = {
            _result: {
                term_sets: TermSet[]
            }
        }
        if (!userId) {
            return [];
        }
        let headers: TsPluginHeader = getTsPluginHeaders({isJson: true, withAccessToken: true});
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/term_set/get/";
        let result = await fetch(url, {headers: headers})
        if (!result.ok) {
            return [];
        }
        let termSetList = await result.json() as RespType;
        let userTermSets: TermSet[] = termSetList["_result"]["term_sets"].filter((tset) => tset.creator === userId);
        return userTermSets;
    } catch {
        return [];
    }
}


export async function getAllTermsetList(): Promise<TermSet[]> {
    try {
        type RespType = {
            _result: {
                term_sets: TermSet[]
            }
        }
        let headers: TsPluginHeader = getTsPluginHeaders({isJson: true, withAccessToken: true});
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/term_set/get/";
        let result = await fetch(url, {headers: headers})
        if (!result.ok) {
            return [];
        }
        let termSetList = await result.json() as RespType;
        return termSetList["_result"]["term_sets"];
    } catch {
        return [];
    }
}


export async function getTermset(termsetId: string): Promise<TermSet | null> {
    try {
        type RespType = {
            _result: {
                term_set: TermSet
            }
        }
        let headers: TsPluginHeader = getTsPluginHeaders({isJson: true, withAccessToken: true});
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/term_set/get/" + termsetId + "/";
        let result = await fetch(url, {headers: headers})
        if (!result.ok) {
            const error = new Error("Fetch failed");
            (error as any).status = result.status;
            throw error;
        }
        let termset = await result.json() as RespType;
        return termset["_result"]["term_set"];
    } catch (error) {
        throw error;
    }
}


export async function createTermset(termset: NewTermSetFormData): Promise<TermSet | null> {
    try {
        type RespType = {
            _result: {
                term_set: TermSet
            }
        }
        let headers: TsPluginHeader = getTsPluginHeaders({isJson: true, withAccessToken: true});
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/term_set/create/";
        let result = await fetch(url, {method: "POST", headers: headers, body: JSON.stringify(termset)})
        if (!result.ok) {
            return null;
        }
        let newTermset = await result.json() as RespType;
        return newTermset["_result"]["term_set"];
    } catch (e) {
        return null;
    }
}


export async function updateTermset(termset: TermSet): Promise<TermSet | null> {
    try {
        type RespType = {
            _result: {
                term_set: TermSet
            }
        }
        let headers: TsPluginHeader = getTsPluginHeaders({isJson: true, withAccessToken: true});
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/term_set/update/" + termset.id + "/";
        let result = await fetch(url, {method: "PUT", headers: headers, body: JSON.stringify(termset)})
        if (!result.ok) {
            return null;
        }
        let updatedTermset = await result.json() as RespType;
        return updatedTermset["_result"]["term_set"];
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
        let headers: TsPluginHeader = getTsPluginHeaders({isJson: true, withAccessToken: true});

        let calls = setIds.map((id) => {
            let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/term_set/" + id + "/add_term/";
            return fetch(url, {method: "PUT", headers: headers, body: JSON.stringify({"term": term})}).then((res) => {
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
        let headers: TsPluginHeader = getTsPluginHeaders({isJson: true, withAccessToken: true});
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/term_set/" + termsetId + "/remove_term?termId=" + encodeURIComponent(termId);
        let result = await fetch(url, {method: "DELETE", headers: headers})
        if (!result.ok) {
            return false;
        }
        let removedStatus = await result.json() as RespType;
        return removedStatus["_result"]["removed"];
    } catch (e) {
        return false;
    }
}
