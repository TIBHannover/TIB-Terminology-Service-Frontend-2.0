import {getCallSetting, size} from "./constants";
import {getPageCount} from "./helper";
import {OntologyData, OntologyTermData, OntologyShapeTestResult, OntologySuggestionData} from "./types/ontologyTypes";
import {getTsPluginHeaders} from "./header";
import {TsPluginHeader} from "./types/headerTypes";
import OntologyLib from "../Libs/OntologyLib";


class OntologyApi {

    ontologyId: string | null = "";
    list: Array<OntologyData> = [];
    ontology: OntologyData | null = {"ontologyId": ""};
    rootClasses: Array<OntologyTermData> = [];
    rootProperties: Array<OntologyTermData> = [];
    obsoleteClasses: Array<OntologyTermData> = [];
    obsoleteProperties: Array<OntologyTermData> = [];
    lang: string = "en";

    constructor({ontologyId = null, lang = "en"}) {
        this.ontologyId = ontologyId;
        this.list = [];
        this.ontology = null;
        this.rootClasses = [];
        this.rootProperties = [];
        this.obsoleteClasses = [];
        this.obsoleteProperties = [];
        this.lang = lang;
    }


    async fetchOntologyList(): Promise<Array<any>> {
        type TempResult = {
            elements: Array<any>
        }

        try {
            let OntologiesListUrl = `${process.env.REACT_APP_API_URL}/v2/ontologies?size=1000`;
            let resp = await fetch(OntologiesListUrl, getCallSetting);
            let result: TempResult = await resp.json();
            let ontoList = [];
            if (process.env.REACT_APP_PROJECT_ID === "general") {
                ontoList = result['elements'];
            } else {
                for (let onto of result['elements']) {
                    if (OntologyLib.getCollections(onto).includes(process.env.REACT_APP_PROJECT_ID?.toUpperCase())) {
                        ontoList.push(onto);
                    }
                }
            }
            this.list = ontoList;
            return this.list;
        } catch (e) {
            this.list = [];
            return [];
        }
    }


    async fetchOntology(): Promise<boolean> {
        try {
            let ontoId = encodeURIComponent(this.ontologyId ? this.ontologyId : "");
            let url = `${process.env.REACT_APP_API_URL!}/v2/ontologies/${ontoId}?lang=${this.lang}`;
            let resp = await fetch(url, getCallSetting);
            let result: OntologyData = await resp.json();
            this.ontology = result;
            await Promise.all([
                this.fetchRootClasses(),
                this.fetchRootProperties(),
                this.fetchObsoleteClasses(),
                this.fetchObsoleteProperties()
            ]);
            return true;

        } catch (e) {
            this.ontology = null;
            return true;
        }
    }


    async fetchRootClasses(): Promise<boolean> {
        try {
            if (!this.ontology) {
                this.rootClasses = [];
                return true;
            }

            let url = `${process.env.REACT_APP_API_URL}/v2/ontologies/${this.ontologyId}/classes?hasDirectParents=false&size=1000&lang=${this.lang}&includeObsoleteEntities=false`;
            let result = await fetch(url, getCallSetting);
            let terms = await result.json();
            this.rootClasses = terms['elements'];
            return true;
        } catch (e) {
            this.rootClasses = [];
            return true;
        }

    }


    async fetchRootProperties(): Promise<boolean> {
        try {
            if (!this.ontology) {
                this.rootProperties = [];
                return true;
            }

            let url = `${process.env.REACT_APP_API_URL}/v2/ontologies/${this.ontologyId}/properties?hasDirectParents=false&size=1000&lang=${this.lang}&includeObsoleteEntities=false`;
            let result = await fetch(url, getCallSetting);
            let terms = await result.json();
            this.rootProperties = terms['elements'];
            return true;
        } catch (e) {
            this.rootProperties = [];
            return true;
        }
    }


    async fetchObsoleteClasses(): Promise<boolean> {
        try {
            let url = process.env.REACT_APP_API_BASE_URL + "/" + this.ontologyId + "/terms/roots?obsoletes=true&size=1000";
            let res = await (await fetch(url, getCallSetting)).json();
            this.obsoleteClasses = res['_embedded']["terms"];
            return true;
        } catch (e) {
            this.obsoleteClasses = [];
            return true;
        }
    }


    async fetchObsoleteProperties(): Promise<boolean> {
        type TempResult = {
            _embedded: {
                properties: Array<OntologyTermData>
            }
        }

        try {
            let url = process.env.REACT_APP_API_BASE_URL + "/" + this.ontologyId + "/properties/roots?obsoletes=true&size=1000";
            let res: TempResult = await (await fetch(url, getCallSetting)).json();
            this.obsoleteProperties = res['_embedded']["properties"];
            return true;
        } catch (e) {
            this.obsoleteProperties = [];
            return true;
        }
    }
}


export async function runShapeTest(ontologyPurl: string): Promise<OntologyShapeTestResult | boolean> {
    try {
        let headers = getTsPluginHeaders({withAccessToken: true, isJson: false});
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/ontologysuggestion/testshape?purl=' + ontologyPurl;
        let result = await fetch(url, {method: 'GET', headers: headers});
        if (result.status !== 200) {
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
        let headers: TsPluginHeader = getTsPluginHeaders({isJson: true, withAccessToken: true});
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/ontologysuggestion/create/';
        let result: any = await fetch(url, {method: 'POST', headers: headers, body: JSON.stringify(form)});
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
        let headers = getTsPluginHeaders({withAccessToken: true, isJson: false});
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/ontologysuggestion/suggestion_exist?purl=' + purl;
        let result = await fetch(url, {method: 'GET', headers: headers});
        if (result.status !== 200) {
            return false;
        }
        let data = await result.json();
        if (data['_result']['exist']) {
            return true
        }
        return false
    } catch (e) {
        return false
    }
}


export default OntologyApi;