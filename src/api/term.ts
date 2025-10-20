import { getCallSetting } from "./constants";
import Toolkit from "../Libs/Toolkit";
import {
  OntologyTermDataV2,
  TermListData
} from "./types/ontologyTypes";
import { Ols3ApiResponse } from "./types/common";
import TsClass from "../concepts/class";
import TsProperty from "../concepts/property";
import TsTerm from "../concepts/term";
import TsIndividual from "../concepts/individual";


const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE_NUMBER = 1;
const CLASS_TYPE_ID = "classes";
const PROPERTY_TYPE_ID = "properties";
const INDIVIDUAL_TYPE_ID = "individuals";


class TermApi {

  ontologyId: string = "";
  iri: string = "";
  term: OntologyTermDataV2 = {};
  termType: string = "";
  lang: string = "en";


  constructor(ontologyId?: string, iri?: string, termType?: string, language?: string) {
    this.ontologyId = ontologyId ? ontologyId : "";
    iri = iri ? iri : "";
    this.iri = Toolkit.urlNotEncoded(iri) ? encodeURIComponent(encodeURIComponent(iri)) : encodeURIComponent(iri);
    this.setTermType(termType);
    this.term = {}; // this holds the term data from ols api.
    this.lang = language ? language : "en";

  }


  setTermType(termType?: string): void {
    if (termType === "term" || termType === "class" || termType === "terms") {
      this.termType = CLASS_TYPE_ID;
    } else if (termType === "property") {
      this.termType = PROPERTY_TYPE_ID;
    } else if (termType === "individual") {
      this.termType = INDIVIDUAL_TYPE_ID;
    } else {
      this.termType = termType ? termType : "";
    }
  }


  async fetchTerm(): Promise<TsTerm | null> {
    try {
      if (this.iri === "%20") {
        // empty iri
        this.term = {};
        return null;
      }

      let urlJson = `${process.env.REACT_APP_API_URL}/v2/ontologies/${this.ontologyId}/entities/${this.iri}?lang=${this.lang}`;
      let res = await fetch(urlJson, getCallSetting);
      this.term = await res.json();
      if (this.termType === CLASS_TYPE_ID) {
        let instancesList = await this.getIndividualInstancesForClass();
        let tsClass = new TsClass(this.term, instancesList);
        return tsClass;
      } else if (this.termType === PROPERTY_TYPE_ID) {
        let tsProp = new TsProperty(this.term);
        return tsProp;
      }
      let indiv = new TsIndividual(this.term);
      return indiv;
    } catch (e) {
      this.term = {};
      return null;
    }

  }


  async fetchListOfTerms(page: number | string = DEFAULT_PAGE_NUMBER, size: number | string = DEFAULT_PAGE_SIZE, obsoletes: boolean = false): Promise<TermListData | []> {
    try {
      let url = `${process.env.REACT_APP_API_URL}/v2/ontologies/${this.ontologyId}/${this.termType}?lang=${this.lang}&page=${page}&size=${size}&includeObsoleteEntities=${obsoletes}`;
      let result = await (await fetch(url, getCallSetting)).json();
      let totalTermsCount = result['totalElements'];
      result = result['elements'];
      if (!result) {
        return [];
      }
      let refinedResults = [];
      for (let term of result) {
        let termObject = new TsClass(term, []);
        refinedResults.push(termObject);
      }
      return { "results": refinedResults, "totalTermsCount": totalTermsCount };
    } catch (e) {
      //throw (e)
      return [];
    }
  }



  async getIndividualInstancesForClass(): Promise<any> {
    try {
      let baseUrl = process.env.REACT_APP_API_BASE_URL;
      let callUrl = baseUrl + "/" + this.ontologyId + "/terms/" + this.iri + "/instances";
      let result = await fetch(callUrl, getCallSetting);
      let apiResult: Ols3ApiResponse = await result.json();
      let indvResult = apiResult['_embedded'];
      if (!indvResult || typeof (indvResult['individuals']) === "undefined") {
        return null;
      }
      return indvResult['individuals'];
    } catch (e) {
      return null;
    }
  }


  async getNodeJsTree(): Promise<any> {
    try {
      let OntologiesBaseServiceUrl = process.env.REACT_APP_API_URL;
      let parentPath = this.termType === CLASS_TYPE_ID ? "hierarchicalAncestors" : "ancestors";
      let url = `${OntologiesBaseServiceUrl}/v2/ontologies/${this.ontologyId}/${this.termType}/${this.iri}/${parentPath}?size=1000&lang=${this.lang}&includeObsoleteEntities=false`;
      let listOfNodes = await (await fetch(url, getCallSetting)).json();
      let nodesList = listOfNodes["elements"] ?? [];
      if (nodesList.length === 0) {
        // fallback: the target is individual on a class tree
        let url = `${OntologiesBaseServiceUrl}/v2/ontologies/${this.ontologyId}/individuals/${this.iri}/ancestors?size=1000&lang=${this.lang}&includeObsoleteEntities=false`;
        let listOfNodes = await (await fetch(url, getCallSetting)).json();
        return listOfNodes["elements"] ?? [];
      }
      return nodesList;
    } catch (e) {
      return [];
    }
  }


  async getChildrenJsTree(lang: string = "en"): Promise<any> {
    const getChildren = async (lang: string) => {
      let OntologiesBaseServiceUrl = process.env.REACT_APP_API_URL;
      let path = this.termType === CLASS_TYPE_ID ? "hierarchicalChildren" : "children";
      let url = `${OntologiesBaseServiceUrl}/v2/ontologies/${this.ontologyId}/${this.termType}/${this.iri}/${path}?size=1000&lang=${lang}&includeObsoleteEntities=false`;
      let res = await (await fetch(url, getCallSetting)).json();
      return res["elements"] ?? [];
    }

    const getHierarchicalChilren = async (lang: string) => {
      if (this.termType === CLASS_TYPE_ID) {
        let OntologiesBaseServiceUrl = process.env.REACT_APP_API_URL;
        let url = `${OntologiesBaseServiceUrl}/v2/ontologies/${this.ontologyId}/classes/${this.iri}/individuals?size=1000&lang=${lang}`;
        let res = await (await fetch(url, getCallSetting)).json();
        return res["elements"] ?? [];
      }
      return [];
    }

    let [children, hierarchialChildren] = await Promise.all([getChildren(lang), getHierarchicalChilren(lang)]);

    return [...children, ...hierarchialChildren];
  }



  async fetchGraphData(): Promise<any> {
    try {
      let url = `${process.env.REACT_APP_API_URL}/ontologies/${this.ontologyId}/terms/${this.iri}/graph?lang=${this.lang}`;
      let graphData = await fetch(url, getCallSetting);
      graphData = await graphData.json();
      return graphData;
    } catch (e) {
      return null;
    }
  }
}


export default TermApi;