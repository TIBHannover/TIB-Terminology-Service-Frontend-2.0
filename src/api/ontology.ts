import { getCallSetting, size } from "./constants";
import { getPageCount } from "./helper";
import { OntologyData, OntologyTermData, OntologyShapeTestResult, OntologySuggestionData } from "./types/ontologyTypes";
import { getTsPluginHeaders } from "./header";
import { TsPluginHeader } from "./types/headerTypes";




class OntologyApi {

  ontologyId: string | null = "";
  list: Array<OntologyData> = [];
  ontology: OntologyData | null = { "ontologyId": "" };
  rootClasses: Array<OntologyTermData> = [];
  rootProperties: Array<OntologyTermData> = [];
  obsoleteClasses: Array<OntologyTermData> = [];
  obsoleteProperties: Array<OntologyTermData> = [];
  lang: string = "en";

  constructor({ ontologyId = null, lang = "en" }) {
    this.ontologyId = ontologyId;
    this.list = [];
    this.ontology = null;
    this.rootClasses = [];
    this.rootProperties = [];
    this.obsoleteClasses = [];
    this.obsoleteProperties = [];
    this.lang = lang;
  }


  async fetchOntologyList(): Promise<Array<OntologyData>> {
    type TempResult = {
      _embedded: {
        ontologies: Array<OntologyData>
      }
    }

    try {
      let OntologiesListUrl = `${process.env.REACT_APP_API_ONTOLOGY_LIST}`;
      let resp = await fetch(OntologiesListUrl, getCallSetting);
      let result: TempResult = await resp.json();
      this.list = result['_embedded']['ontologies'];
      return this.list;
    }
    catch (e) {
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
        this.fetchRootCalsses(),
        this.fetchRootProperties(),
        this.fetchObsoleteClasses(),
        this.fetchObsoleteProperties()
      ]);
      return true;

    }
    catch (e) {
      this.ontology = null;
      return true;
    }
  }



  async fetchRootCalsses(): Promise<boolean> {
    try {
      if (!this.ontology) {
        this.rootClasses = [];
        return true;
      }
      let termsLink = this.ontology?.['_links']?.['terms']?.['href'];
      if (!termsLink?.includes('https')) {
        termsLink = termsLink?.replace('http', 'https');
      }
      let pageCount = await getPageCount(termsLink + '/roots');
      let terms: Array<OntologyTermData> = [];
      for (let page = 0; page < pageCount; page++) {
        let url = `${termsLink}/roots?page=${page}&size=${size}&lang=${this.lang}`;
        let res = await (await fetch(url, getCallSetting)).json();
        if (page == 0) {
          terms = res['_embedded']['terms'];
        }
        else {
          terms = terms.concat(res['_embedded']['terms']);
        }
      }

      this.rootClasses = terms;
      return true;

    }
    catch (e) {
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
      let propertiesLink = this.ontology?.['_links']?.['properties']?.['href'];
      if (!propertiesLink?.includes('https')) {
        propertiesLink = propertiesLink?.replace('http', 'https');
      }
      let pageCount = await getPageCount(propertiesLink + '/roots');
      let props: Array<OntologyTermData> = [];
      for (let page = 0; page < pageCount; page++) {
        let url = propertiesLink + "/roots?page=" + page + "&size=" + size;
        let res = await (await fetch(url, getCallSetting)).json();
        if (page == 0) {
          props = res['_embedded']['properties'];
        }
        else {
          props = props.concat(res['_embedded']['properties']);
        }
      }

      this.rootProperties = props;
      return true;

    }
    catch (e) {
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
    }
    catch (e) {
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
    }
    catch (e) {
      this.obsoleteProperties = [];
      return true;
    }
  }
}



export async function runShapeTest(ontologyPurl: string): Promise<OntologyShapeTestResult | boolean> {
  try {
    let headers = getTsPluginHeaders({ withAccessToken: true, isJson: false });
    let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/ontologysuggestion/testshape?purl=' + ontologyPurl;
    let result = await fetch(url, { method: 'GET', headers: headers });
    if (result.status !== 200) {
      return false;
    }
    let data = await result.json();
    return data['_result']['response'];
  }
  catch (e) {
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
  }
  catch (e) {
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
    if (data['_result']['exist']) {
      return true
    }
    return false
  }
  catch (e) {
    return false
  }
}



export default OntologyApi;