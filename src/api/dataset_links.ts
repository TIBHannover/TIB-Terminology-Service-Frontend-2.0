import {GetDatasetLinksProps, DatasetLink} from "./types/datasetLinks";
import {getTsPluginHeaders} from "./header";
import {ErrorObject} from "./types/common";

export async function getDatasetLinks(props: GetDatasetLinksProps): Promise<Map<string, DatasetLink[]> | ErrorObject> {
    try {
        let baseUrl = `${process.env.REACT_APP_MICRO_BACKEND_ENDPOINT}/ts/get?`;
        baseUrl += props.curie ? `curie=${props.curie}` : '';
        baseUrl += props.ontologyId ? `&ontology_id=${props.ontologyId}` : '';
        baseUrl += props.repository ? `&repo_name=${props.repository}` : '';
        let headers = getTsPluginHeaders({isJson: true, withAccessToken: false});
        let resp = await fetch(baseUrl, {headers: headers});
        if (!resp.ok) {
            throw new Error(resp.statusText);
        }
        let data = await resp.json();
        let dls = data['_result']['links'] as DatasetLink[];
        let res = new Map<string, DatasetLink[]>();
        for (let dl of dls) {
            if (!res.has(dl.dataset_title!)) {
                res.set(dl.dataset_title!, [dl]);
            } else {
                res.get(dl.dataset_title!)!.push(dl);
            }
        }
        return res;
    } catch (e) {
        return {value: true, message: String(e)};
    }
}