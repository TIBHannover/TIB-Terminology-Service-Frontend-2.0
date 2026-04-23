import {GetDatasetLinksProps, DatasetLink, DatasetLinksApiResp, GetDatasetLinkServiceResp} from "./types/datasetLinks";
import {getTsPluginHeaders} from "./header";
import {ErrorObject} from "./types/common";

export async function getDatasetLinks(props: GetDatasetLinksProps): Promise<GetDatasetLinkServiceResp | ErrorObject> {
    try {
        let baseUrl = `${process.env.REACT_APP_MICRO_BACKEND_ENDPOINT}/ts/get?`;
        baseUrl += props.curie ? `curie=${props.curie}` : '';
        baseUrl += props.ontologyId ? `&ontology_id=${props.ontologyId}` : '';
        baseUrl += props.repository ? `&repo_name=${props.repository}` : '';
        baseUrl += props.page ? `&page=${props.page}` : '';
        baseUrl += props.size ? `&size=${props.size}` : '';
        baseUrl += props.groupBy ? `&groupBy=${props.groupBy}` : '';
        let headers = getTsPluginHeaders({isJson: true, withAccessToken: false});
        let resp = await fetch(baseUrl, {headers: headers});
        if (!resp.ok) {
            throw new Error(resp.statusText);
        }
        let data = await resp.json() as DatasetLinksApiResp;
        let dls = data['_result']['links'];
        let res = new Map<string, DatasetLink[]>();
        for (let key in dls) {
            res.set(key, dls[key]);
        }
        return {
            "linksMap": res,
            total: data['_result']['total'] as number
        };
    } catch (e) {
        return {value: true, message: String(e)};
    }
}


export async function getDatasetRepositories(ontologyId: string): Promise<string[] | ErrorObject> {
    try {
        if (ontologyId === "nmrcv") {
            ontologyId = "nmr";
        }
        let baseUrl = `${process.env.REACT_APP_MICRO_BACKEND_ENDPOINT}/ts/repos_list?ontology_id=${ontologyId}`;
        let headers = getTsPluginHeaders({isJson: true, withAccessToken: false});
        let resp = await fetch(baseUrl, {headers: headers});
        if (!resp.ok) {
            throw new Error(resp.statusText);
        }
        let data = await resp.json() as { _result: { repositories: string[] } };
        return data['_result']['repositories'];
    } catch (e) {
        return {value: true, message: String(e)};
    }
}