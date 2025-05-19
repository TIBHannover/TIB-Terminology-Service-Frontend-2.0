import Toolkit from "../Libs/Toolkit";
import { getCallSetting } from "./constants";
import SkosLib from "../Libs/Skos";

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
      let OntologiesBaseServiceUrl = process.env.REACT_APP_API_BASE_URL;
      let url =
        OntologiesBaseServiceUrl +
        "/" +
        this.ontologyId +
        "/skos/" +
        this.iri +
        "/relations?relation_type=narrower&page=0&size=1000";
      let res = await (await fetch(url, getCallSetting)).json();
      res = res["_embedded"];
      if (typeof res["individuals"] !== "undefined") {
        this.childrenForSkosTerm = res["individuals"];
        return true;
      }

      this.childrenForSkosTerm = [];
      return true;
    } catch (e) {
      this.childrenForSkosTerm = [];
      return true;
    }
  }

  async fetchSkosTerm() {
    try {
      let OntologiesBaseServiceUrl = process.env.REACT_APP_API_BASE_URL;
      let url =
        OntologiesBaseServiceUrl +
        "/" +
        this.ontologyId +
        "/individuals/" +
        this.iri;
      let res = await (await fetch(url, getCallSetting)).json();
      if (!res) {
        this.skosTerm = null;
        return true;
      } else if (typeof res["iri"] === "undefined") {
        this.skosTerm = null;
        return true;
      } else {
        res["has_children"] = SkosLib.skosTermHasChildren(res);
        this.skosTerm = res;
        return true;
      }
    } catch (e) {
      this.skosTerm = null;
      return true;
    }
  }

  async fetchSkosTermParent() {
    try {
      let baseUrl = process.env.REACT_APP_API_BASE_URL;
      let url =
        baseUrl +
        "/" +
        this.ontologyId +
        "/skos/" +
        this.iri +
        "/relations?relation_type=broader";
      let res = await (await fetch(url, getCallSetting)).json();
      res = res["_embedded"];
      if (!res || !res["individuals"]) {
        return false;
      }

      return res["individuals"][0];
    } catch (e) {
      return false;
    }
  }

  async fetchGraphData() {
    try {
      let url = `${process.env.REACT_APP_API_URL}/ontologies/${this.ontologyId}/skos/${this.iri}/graph`;
      let graphData = await fetch(url, getCallSetting);
      graphData = await graphData.json();
      return graphData;
    } catch (e) {
      return null;
    }
  }
}

export default SkosApi;
