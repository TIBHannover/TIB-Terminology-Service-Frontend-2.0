import Toolkit from "../Libs/Toolkit";
import { getCallSetting } from "./constants";
import TsTerm from "../concepts/term";

class SkosApi {
  constructor({ ontologyId, iri, skosRoot, lang }) {
    this.ontologyId = ontologyId;
    this.iri = Toolkit.urlNotEncoded(iri)
      ? encodeURIComponent(encodeURIComponent(iri))
      : encodeURIComponent(iri);
    this.rootConcepts = [];
    this.childrenForSkosTerm = [];
    this.skosTerm = {};
    this.skosRoot = skosRoot;
    this.lang = lang ?? "en";
  }

  setIri(newIri) {
    this.iri = Toolkit.urlNotEncoded(newIri)
      ? encodeURIComponent(encodeURIComponent(newIri))
      : encodeURIComponent(newIri);
  }

  async fetchRootConcepts() {
    try {
      let baseUrl = process.env.REACT_APP_API_URL;
      let url = `${baseUrl}/v2/ontologies/${this.ontologyId}/skos/tree?find_roots=${this.skosRoot}&lang=${this.lang}`;
      let results = await (await fetch(url, getCallSetting)).json();
      let cleanResult = [];
      for (let item of results) {
        cleanResult.push(item["data"]);
      }
      this.rootConcepts = cleanResult;
      return true;
    } catch (e) {
      this.rootConcepts = [];
      return true;
    }
  }

  async fetchChildrenForSkosTerm() {
    try {
      let baseUrl = process.env.REACT_APP_API_URL;
      let url = `${baseUrl}/v2/ontologies/${this.ontologyId}/skos/${this.iri}/tree?lang=${this.lang}`;
      let res = await (await fetch(url, getCallSetting)).json();
      let children = res["children"] ?? [];
      for (let ch of children) {
        this.childrenForSkosTerm.push(ch["data"]);
      }
      return true;
    } catch (e) {
      this.childrenForSkosTerm = [];
      return true;
    }
  }

  async fetchSkosTerm() {
    try {
      let baseUrl = process.env.REACT_APP_API_URL;
      let url = `${baseUrl}/v2/ontologies/${this.ontologyId}/entities/${this.iri}?lang=${this.lang}`;
      let res = await (await fetch(url, getCallSetting)).json();
      this.skosTerm = res;
      return true;
    } catch (e) {
      this.skosTerm = null;
      return true;
    }
  }

  async fetchSkosTermParent() {
    try {
      let baseUrl = process.env.REACT_APP_API_URL;
      let url = `${baseUrl}/v2/ontologies/${this.ontologyId}/skos/${this.iri}/relations?lang=${this.lang}&relation_type=broader`;
      let res = await (await fetch(url, getCallSetting)).json();
      res = res["_embedded"];
      if (!res || !res["v2Entities"]) {
        return false;
      }

      let skosTerm = new TsTerm(res["v2Entities"][0]);
      return skosTerm;
    } catch (e) {
      return false;
    }
  }

  async fetchGraphData() {
    try {
      let url = `${process.env.REACT_APP_API_URL}/ontologies/${this.ontologyId}/skos/${this.iri}/graph?lang=${this.lang}`;
      let graphData = await fetch(url, getCallSetting);
      graphData = await graphData.json();
      return graphData;
    } catch (e) {
      return null;
    }
  }
}

export default SkosApi;
