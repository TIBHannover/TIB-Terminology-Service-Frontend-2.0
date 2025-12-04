import Toolkit from "../Libs/Toolkit";
import { getCallSetting } from "./constants";
import { TsSkosTerm } from "../concepts";

class SkosApi {
  ontologyId: string;
  iri: string;
  skosRoot: any;
  lang: string;
  constructor(props: { ontologyId: string, iri: string, skosRoot: any, lang: string }) {
    let { ontologyId, iri, skosRoot, lang } = props;
    this.ontologyId = ontologyId;
    this.iri = "";
    this.setIri(iri);
    this.skosRoot = skosRoot;
    this.lang = lang ?? "en";
  }

  setIri(newIri: string) {
    this.iri = Toolkit.urlNotEncoded(newIri)
      ? encodeURIComponent(encodeURIComponent(newIri))
      : encodeURIComponent(newIri);
  }

  async fetchRootConcepts(): Promise<TsSkosTerm[]> {
    try {
      let baseUrl = process.env.REACT_APP_API_URL;
      let url = `${baseUrl}/v2/ontologies/${this.ontologyId}/skos/tree?find_roots=${this.skosRoot}&lang=${this.lang}`;
      let results = await (await fetch(url, getCallSetting)).json();
      let rootSkosTerms: TsSkosTerm[] = [];
      for (let item of results) {
        // console.log(item);
        rootSkosTerms.push(new TsSkosTerm(item["data"]));
      }
      return rootSkosTerms;
    } catch (e) {
      return [];
    }
  }

  async fetchChildrenForSkosTerm(): Promise<TsSkosTerm[]> {
    try {
      let baseUrl = process.env.REACT_APP_API_URL;
      let url = `${baseUrl}/v2/ontologies/${this.ontologyId}/skos/${this.iri}/tree?lang=${this.lang}`;
      let res = await (await fetch(url, getCallSetting)).json();
      let children = res["children"] ?? [];
      let childSkosTerms: TsSkosTerm[] = [];
      for (let ch of children) {
        childSkosTerms.push(new TsSkosTerm(ch["data"]));
      }
      return childSkosTerms;
    } catch (e) {
      return [];
    }
  }

  async fetchSkosTerm(): Promise<TsSkosTerm | null> {
    try {
      let baseUrl = process.env.REACT_APP_API_URL;
      let url = `${baseUrl}/v2/ontologies/${this.ontologyId}/entities/${this.iri}?lang=${this.lang}`;
      let res = await (await fetch(url, getCallSetting)).json();
      return new TsSkosTerm(res);
    } catch (e) {
      return null;
    }
  }

  async fetchSkosTermParent(): Promise<TsSkosTerm | null> {
    try {
      let baseUrl = process.env.REACT_APP_API_URL;
      let url = `${baseUrl}/v2/ontologies/${this.ontologyId}/skos/${this.iri}/relations?lang=${this.lang}&relation_type=broader`;
      let res = await (await fetch(url, getCallSetting)).json();
      res = res["_embedded"];
      if (!res || !res["v2Entities"]) {
        return null;
      }

      return new TsSkosTerm(res["v2Entities"][0]);
    } catch (e) {
      return null;
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
