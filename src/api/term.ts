import { getCallSetting } from "./constants";
import Toolkit from "../Libs/Toolkit";
import {
  OntologyTermData,
  ParentNode,
  TermListData
} from "./types/ontologyTypes";
import { Ols3ApiResponse } from "./types/common";



const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE_NUMBER = 1;


class TermApi {

  ontologyId: string = "";
  iri: string = "";
  term: OntologyTermData = {};
  termType: string = "";


  constructor(ontologyId?: string, iri?: string, termType?: string) {
    this.ontologyId = ontologyId ? ontologyId : "";
    iri = iri ? iri : "";
    this.iri = Toolkit.urlNotEncoded(iri) ? encodeURIComponent(encodeURIComponent(iri)) : encodeURIComponent(iri);
    this.setTermType(termType);
    this.term = {};
  }


  setTermType(termType?: string): void {
    if (termType === "class") {
      this.termType = "terms";
    }
    else if (termType === "property") {
      this.termType = "properties";
    }
    else if (termType === "individual") {
      this.termType = "individuals";
    }
    else {
      this.termType = termType ? termType : "";
    }
  }


  async fetchTerm(): Promise<boolean> {
    try {
      if (this.iri === "%20") {
        // empty iri
        this.term = {};
        return true;
      }
      let OntologiesBaseServiceUrl = process.env.REACT_APP_API_BASE_URL + "/";
      let baseUrl = OntologiesBaseServiceUrl + this.ontologyId + "/" + this.termType;
      let callResult = await fetch(baseUrl + "/" + this.iri, getCallSetting);

      if (callResult.status === 404) {
        this.term = {};
        return true;
      }
      this.term = await callResult.json();
      this.term['relations'] = undefined;
      this.term['eqAxiom'] = undefined;
      this.term['subClassOf'] = undefined;
      this.term['isIndividual'] = (this.termType === "individuals");
      await this.fetchImportedAndAlsoInOntologies();
      let curationStatus = await this.createHasCurationStatus();
      if (curationStatus) {
        this.term['curationStatus'] = curationStatus;
      }
      if (this.termType === "terms") {
        let parents = await this.getParents();
        this.term['parents'] = parents;
        await this.fetchClassRelations();
      }

      return true;
    }
    catch (e) {
      this.term = {};
      return false;
    }

  }


  async fetchTermWithoutRelations(): Promise<boolean> {
    try {
      if (this.iri === "%20") {
        // empty iri
        this.term = {};
        return true;
      }
      // console.clear();
      let OntologiesBaseServiceUrl = process.env.REACT_APP_API_BASE_URL + "/";
      let baseUrl = OntologiesBaseServiceUrl + this.ontologyId + "/" + this.termType;
      let callResult = await fetch(baseUrl + "/" + this.iri, getCallSetting);

      if (callResult.status === 404) {
        this.term = {};
        return true;
      }
      this.term = await callResult.json();
      return true;
    }
    catch (e) {
      this.term = {};
      return false;
    }

  }


  async getParents(): Promise<Array<ParentNode> | []> {

    try {
      if (this.termType === "individuals") {
        return [];
      }

      let url = `${process.env.REACT_APP_API_BASE_URL}/${this.ontologyId}/${this.termType}/${this.iri}/hierarchicalParents`;
      let res = await fetch(url, getCallSetting);
      let apiRes = await res.json();
      let parents: Array<OntologyTermData> = apiRes["_embedded"][this.termType];
      let result = [];
      for (let p of parents) {
        let temp: ParentNode = { "label": p.label, "iri": p.iri, "ontology": p.ontology_name };
        result.push(temp);
      }
      return result;
    }
    catch (e) {
      return [];
    }
  }


  async fetchClassRelations(): Promise<boolean> {
    let [relations, eqAxiom, subClassOf, instancesList] = await Promise.all([
      this.getRelations(),
      this.getEqAxiom(),
      this.getSubClassOf(),
      this.getIndividualInstancesForClass(),
      this.createHasCurationStatus()

    ]);
    this.term['relations'] = relations;
    this.term['eqAxiom'] = eqAxiom;
    this.term['subClassOf'] = subClassOf;
    this.term['instancesList'] = instancesList;
    return true;
  }



  async fetchImportedAndAlsoInOntologies() {
    let [originalOntology, alsoIn] = await Promise.all([
      this.getClassOriginalOntology(),
      this.getClassAllOntologies()

    ]);
    this.term['originalOntology'] = originalOntology;
    this.term['alsoIn'] = alsoIn;
    return true;
  }




  async getRelations(): Promise<string | null> {
    try {
      let url = process.env.REACT_APP_API_BASE_URL + '/' + this.ontologyId + '/terms/' + this.iri + '/relatedfroms';
      let res = await fetch(url, getCallSetting);
      res = await res.json();
      if (typeof (res) !== "undefined") {
        let entries = Object.entries(res)
        let result = "";

        for (let [k, v] of entries) {
          result += k
          result += "<ul>"
          for (let item of v) {
            result += '<li>' + '<a href=' + process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + this.ontologyId + '/terms?iri=' + encodeURIComponent(item["iri"]) + '>' + item["label"] + '</a>' + '</li>';
          }
          result += "</ul>"
        }
        return result
      }

      return null;
    }
    catch (e) {
      return null;
    }
  }



  async getEqAxiom(): Promise<string | null> {
    try {
      let url = process.env.REACT_APP_API_BASE_URL + '/' + this.ontologyId + '/terms/' + this.iri + '/equivalentclassdescription';
      let res = await fetch(url, getCallSetting);
      let apiRes: Ols3ApiResponse = await res.json();
      let eqAxioms = apiRes["_embedded"];
      if (typeof (eqAxioms) !== "undefined") {
        let resultHtml = "";
        resultHtml += "<ul>";
        for (let item of eqAxioms["strings"]) {
          let eqTextWithInternalUrls = await this.replaceExternalIrisWithInternal(item["content"]);
          resultHtml += `<li>${eqTextWithInternalUrls}</li>`;
        }
        resultHtml += "</ul>";
        return resultHtml;
      }
      return null;
    }
    catch (e) {
      return null;
    }
  }


  async getSubClassOf(): Promise<string | null> {
    try {
      let url = process.env.REACT_APP_API_BASE_URL + '/' + this.ontologyId + '/terms/' + this.iri + '/superclassdescription';
      let parents = await this.getParents();
      let res = await fetch(url, getCallSetting);
      if (res.status === 404) {
        return null;
      }
      let apiRes: Ols3ApiResponse = await res.json();
      let subClassRelations = apiRes["_embedded"];
      if (parents.length === 0 && typeof (subClassRelations) === "undefined") {
        return null;
      }
      let result = "<ul>";
      for (let parent of parents) {
        let parentUrl = `${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${this.ontologyId}/terms?iri=${encodeURIComponent(parent["iri"] ? parent["iri"] : "")}`;
        result += `<li><a href=${parentUrl}>${parent["label"]}</a></li>`;
      }
      if (typeof (subClassRelations) !== "undefined") {
        for (let subClassString of subClassRelations["strings"]) {
          let subClassStringWithInternalIris = await this.replaceExternalIrisWithInternal(subClassString["content"]);
          result += `<li>${subClassStringWithInternalIris}</li>`;
        }
      }
      result += "</ul>";
      return result;
    }
    catch (e) {
      // throw(e)        
      return null;
    }
  }


  async getIndividualInstancesForClass(): Promise<any> {
    try {
      let baseUrl = process.env.REACT_APP_API_BASE_URL;
      let callUrl = baseUrl + "/" + this.ontologyId + "/" + this.iri + "/terminstances";
      let result = await fetch(callUrl, getCallSetting);
      let apiResult: Ols3ApiResponse = await result.json();
      let indvResult = apiResult['_embedded'];
      if (!indvResult || typeof (indvResult['individuals']) === "undefined") {
        return null;
      }
      return indvResult['individuals'];
    }
    catch (e) {
      return null;
    }
  }


  async getNodeJsTree(viewMode: string): Promise<any> {
    try {
      let url = process.env.REACT_APP_API_BASE_URL + "/";
      url += this.ontologyId + "/" + this.termType + "/" + this.iri + "/jstree?viewMode=All&siblings=" + viewMode;
      let listOfNodes = await (await fetch(url, getCallSetting)).json();
      return listOfNodes;
    }
    catch (e) {
      return [];
    }
  }



  async getChildrenJsTree(targetNodeId: string): Promise<any> {
    let OntologiesBaseServiceUrl = process.env.REACT_APP_API_BASE_URL;
    let url = OntologiesBaseServiceUrl + "/";
    url += this.ontologyId + "/" + this.termType + "/" + this.iri + "/jstree/children/" + targetNodeId;
    let res = await (await fetch(url, getCallSetting)).json();
    return res;
  }



  async fetchListOfTerms(page: number | string = DEFAULT_PAGE_NUMBER, size: number | string = DEFAULT_PAGE_SIZE): Promise<TermListData | []> {
    try {
      let url = `${process.env.REACT_APP_API_BASE_URL}/${this.ontologyId}/${this.termType}?page=${page}&size=${size}`;
      let result = await (await fetch(url, getCallSetting)).json();
      let totalTermsCount = result['page']['totalElements'];
      result = result['_embedded'];
      if (!result) {
        return [];
      }
      if (typeof (result[this.termType]) === "undefined") {
        return [];
      }
      return { "results": result[this.termType], "totalTermsCount": totalTermsCount };
    }
    catch (e) {
      // throw(e)
      return [];
    }
  }


  async replaceExternalIrisWithInternal(textWithExternalIris: string): Promise<string> {
    let urlRegex = /<a\s+([^>]*href=["']([^"']+)["'][^>]*)>/gi;
    let match;
    let modifiedText = textWithExternalIris;

    while ((match = urlRegex.exec(textWithExternalIris)) !== null) {
      let [, attributes, href] = match;
      let targetIriType = "terms";
      let termApi = new TermApi(this.ontologyId, encodeURIComponent(href), targetIriType);
      await termApi.fetchTermWithoutRelations();
      if (Object.keys(termApi.term).length === 0) {
        targetIriType = "props";
      }
      let internalUrl = `${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${this.ontologyId}/${targetIriType}?iri=${href}`;
      modifiedText = modifiedText.replace(match[0], `<a ${attributes.replace(href, internalUrl)}">`);
    }
    return modifiedText;
  }



  async getClassOriginalOntology(): Promise<string | null> {
    /**
     * This API endpoint expect a raw Iri (Not encoded)
     */
    try {
      let iri = decodeURIComponent(this.iri);
      let url = `${process.env.REACT_APP_API_URL}/${this.termType}/findByIdAndIsDefiningOntology?iri=${iri}`;
      let result = await (await fetch(url, getCallSetting)).json();
      result = result['_embedded'][this.termType];
      let originalOntology = null;
      for (let res of result) {
        if (res['ontology_name'].toLowerCase() !== "vibso" && this.ontologyId !== res['ontology_name']) {
          originalOntology = res['ontology_name'];
        }
      }
      return originalOntology;
    }
    catch (e) {
      return null;
    }

  }



  async getClassAllOntologies(): Promise<Array<string> | null> {
    try {
      /**
      * This API endpoint expect a raw Iri (Not encoded)
      */
      let iri = decodeURIComponent(this.iri);
      let url = `${process.env.REACT_APP_API_URL}/${this.termType}?iri=${iri}`;
      let result = await (await fetch(url, getCallSetting)).json();
      result = result['_embedded'][this.termType];
      let ontologies = [];
      for (let term of result) {
        if (this.ontologyId !== term['ontology_name']) {
          ontologies.push(term['ontology_name']);
        }
      }
      return ontologies;
    }
    catch (e) {
      return null;
    }

  }


  async fetchGraphData(): Promise<any> {
    try {
      let url = `${process.env.REACT_APP_API_URL}/ontologies/${this.ontologyId}/terms/${this.iri}/graph`;
      let graphData = await fetch(url, getCallSetting);
      graphData = await graphData.json();
      return graphData;
    }
    catch (e) {
      return null;
    }
  }


  async createHasCurationStatus(): Promise<Array<string> | null> {
    // has_curation_status is an individual instance in the class instances list.
    try {
      let curationStatusLinks = this.term.annotation['has curation status'];
      if (!curationStatusLinks) {
        return null;
      }
      let result = [];
      for (let csLink of curationStatusLinks) {
        let termApi = new TermApi(this.ontologyId, csLink, 'individuals');
        await termApi.fetchTermWithoutRelations();
        let individualUrl = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + termApi.term['ontology_name'] + "/individuals?iri=" + encodeURIComponent(termApi.term['iri'] ? termApi.term['iri'] : "");
        result.push(`<a href="${individualUrl}" target='_blank'>${termApi.term['label']}</a>`);
      }
      return result;
    }
    catch (e) {
      return null;
    }
  }

}


export default TermApi;