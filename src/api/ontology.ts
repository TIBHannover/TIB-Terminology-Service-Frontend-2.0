import { getCallSetting } from "./constants";
import {
    OntologyData,
    OntologyShapeTestResult,
    OntologySuggestionData,
    OntologyPurlValidationRes
} from "./types/ontologyTypes";
import { getTsPluginHeaders } from "./header";
import { TsPluginHeader } from "./types/headerTypes";
import { TsOntology, TsClass, TsProperty } from "../concepts";
import { OntologyTermDataV2 } from "./types/ontologyTypes";


type constructorProps = { ontologyId?: string, lang?: string };

class OntologyApi {

    ontologyId: string = "";
    lang: string = "en";

    constructor({ ontologyId, lang }: constructorProps) {
        this.ontologyId = ontologyId ?? "";
        this.lang = lang ?? "en";
    }


    async fetchOntologyList(): Promise<TsOntology[]> {
        type TempResult = {
            elements: Array<any>
        }

        try {
            let OntologiesListUrl = `${process.env.REACT_APP_API_URL}/v2/ontologies?size=1000`;
            let resp = await fetch(OntologiesListUrl, getCallSetting);
            let result: TempResult = await resp.json();
            let ontoList: TsOntology[] = [];
            let projectId = process.env.REACT_APP_PROJECT_ID!;
            for (let onto of result['elements']) {
                let ontology = new TsOntology(onto);
                if (projectId === "general") {
                    ontoList.push(ontology);
                } else if (ontology.collections.includes(projectId.toUpperCase())) {
                    ontoList.push(ontology);
                }
            }
            return ontoList;
        } catch (e) {
            return [];
        }
    }


    async fetchOntology(): Promise<TsOntology | null> {
        try {
            let ontoId = encodeURIComponent(this.ontologyId ? this.ontologyId : "");
            let url = `${process.env.REACT_APP_API_URL!}/v2/ontologies/${ontoId}?lang=${this.lang}`;
            let resp = await fetch(url, getCallSetting);
            let result: OntologyData = await resp.json();
            let ontology = new TsOntology(result);
            const [rootClasses, rootProperties] = await Promise.all(
                [
                    this.fetchRootClasses(),
                    this.fetchRootProperties(),
                ]);
            ontology.rootClasses = rootClasses.roots;
            ontology.obsoleteClasses = rootClasses.obsoletes;
            ontology.rootProperties = rootProperties.roots;
            ontology.obsoleteProperties = rootProperties.obsoletes;
            return ontology;

        } catch (e) {
            return null;
        }
    }


    async fetchRootClasses(): Promise<{ roots: TsClass[], obsoletes: TsClass[] }> {
        try {
            let url = `${process.env.REACT_APP_API_URL}/v2/ontologies/${this.ontologyId}/classes?hasDirectParents=false&size=1000&lang=${this.lang}&includeObsoleteEntities=false`;
            let result = await fetch(url, getCallSetting);
            let respData = await result.json();
            let terms = respData['elements'] as OntologyTermDataV2[];
            let rootClasses: TsClass[] = [];
            let obsoleteClasses: TsClass[] = [];
            for (let term of terms) {
                if (!term.isObsolete) {
                    let classObj = new TsClass(term, []);
                    rootClasses.push(classObj);
                } else {
                    let classObj = new TsClass(term, []);
                    obsoleteClasses.push(classObj);
                }
            }
            return { roots: rootClasses, obsoletes: obsoleteClasses };
        } catch (e) {
            return { roots: [], obsoletes: [] };
        }
    }


    async fetchRootProperties(): Promise<{ roots: TsProperty[], obsoletes: TsProperty[] }> {
        try {
            let url = `${process.env.REACT_APP_API_URL}/v2/ontologies/${this.ontologyId}/properties?hasDirectParents=false&size=1000&lang=${this.lang}&includeObsoleteEntities=false`;
            let result = await fetch(url, getCallSetting);
            let respData = await result.json();
            let terms = respData['elements'] as OntologyTermDataV2[];
            let rootProperties: TsProperty[] = [];
            let obsoleteProperties: TsProperty[] = [];
            for (let term of terms) {
                if (!term.isObsolete) {
                    let propObj = new TsProperty(term);
                    rootProperties.push(propObj);
                } else {
                    let propObj = new TsProperty(term);
                    obsoleteProperties.push(propObj);
                }
            }
            return { roots: rootProperties, obsoletes: obsoleteProperties };
        } catch (e) {
            return { roots: [], obsoletes: [] };
        }
    }

}


export async function runShapeTest(ontologyPurl: string): Promise<OntologyShapeTestResult | boolean> {
    try {
        let headers = getTsPluginHeaders({ withAccessToken: true, isJson: false });
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/ontologysuggestion/testshape?purl=' + ontologyPurl;
        let result = await fetch(url, { method: 'GET', headers: headers });
        if (!result.ok) {
            return false;
        }
        let data = await result.json();
        return data['_result']['response'];
    } catch (e) {
        return false;
    }
}


export async function submitOntologySuggestion(formData: OntologySuggestionData): Promise<boolean> {
    try {
        let form = {};
        let formDataAny = formData as any;
        for (let key in formDataAny) {
            // @ts-ignore
            form[key] = formDataAny[key];
        }
        let headers: TsPluginHeader = getTsPluginHeaders({ isJson: true, withAccessToken: true });
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/ontologysuggestion/create/';
        let result: any = await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(form) });
        if (result.status === 200) {
            result = await result.json();
            result = result['_result']['response'];
            return result;
        }
        return false;
    } catch (e) {
        return false;
    }
}


export async function checkSuggestionExist(purl: string): Promise<boolean> {
    try {
        let headers = getTsPluginHeaders({ withAccessToken: true, isJson: false });
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/ontologysuggestion/suggestion_exist?purl=' + purl;
        let result = await fetch(url, { method: 'GET', headers: headers });
        if (result.status !== 200) {
            return false;
        }
        let data = await result.json();
        return !!data['_result']['exist'];

    } catch (e) {
        return false
    }
}


export async function checkOntologyPurlIsValidUrl(purl: string): Promise<OntologyPurlValidationRes> {
    try {
        let headers = getTsPluginHeaders({ withAccessToken: false, isJson: false });
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/ontologysuggestion/purl_is_valid?purl=' + purl;
        let result = await fetch(url, { method: 'GET', headers: headers });
        if (result.status !== 200) {
            return { "valid": false, "reason": "unknown" };
        }
        let data = await result.json();
        return data['_result'];

    } catch (e) {
        return { "valid": false, "reason": "unknown" };
    }
}


export default OntologyApi;