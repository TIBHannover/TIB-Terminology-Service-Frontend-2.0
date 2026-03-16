import {Publication} from "./types/publicationsLinks";
import {TsPluginHeader} from "./types/headerTypes";
import {getTsPluginHeaders} from "./header";

export async function createPublicationLink(ontology_id: string, doi: string): Promise<Publication> {
    try {
        type apiResp = {
            _result: { created: Publication }
        }
        let headers: TsPluginHeader = getTsPluginHeaders({isJson: true, withAccessToken: true});
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT;
        let resp = await fetch(url + "/pub_link/create/", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ontology_id: ontology_id, doi: doi})
        });
        if (!resp.ok) {
            return {};
        }
        let data = (await resp.json()) as apiResp;
        if (data["_result"]["created"]) {
            return data["_result"]["created"];
        }
        return {};
    } catch (e) {
        return {};
    }
}


export async function getPublicationsLinks(ontology_id: string): Promise<Publication[]> {
    try {
        type apiResp = {
            _result: { publications: Publication[] }
        }
        let headers: TsPluginHeader = getTsPluginHeaders({isJson: true, withAccessToken: false});
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT;
        let resp = await fetch(url + "/pub_link/get/" + ontology_id + "/", {
            method: "GET",
            headers: headers
        });
        if (!resp.ok) {
            return [];
        }
        let data = (await resp.json()) as apiResp;
        if (data["_result"]["publications"]) {
            return data["_result"]["publications"];
        }
        return [];
    } catch {
        return [];
    }
}

export async function deletePublicationLink(id: number): Promise<boolean> {
    try {
        type apiResp = {
            _result: { deleted: boolean }
        }
        let headers: TsPluginHeader = getTsPluginHeaders({isJson: true, withAccessToken: true});
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT;
        let resp = await fetch(url + "/pub_link/delete/" + id + "/", {
            method: "DELETE",
            headers: headers
        });
        if (!resp.ok) {
            return false;
        }
        let data = (await resp.json()) as apiResp;
        if (data["_result"]["deleted"]) {
            return true;
        }
        return false;
    } catch {
        return false;
    }
}
