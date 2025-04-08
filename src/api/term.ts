// @ts-nocheck
import { buildHtmlAnchor, buildOpenParanthesis, buildCloseParanthesis } from "../Libs/htmlFactory";
import { getCallSetting } from "./constants";
import Toolkit from "../Libs/Toolkit";
import {
  OntologyTermData,
  TermListData
} from "./types/ontologyTypes";
import { Ols3ApiResponse } from "./types/common";
import TermLib from "../Libs/TermLib";



const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE_NUMBER = 1;
const TYPE_URI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
// const TYPE_CLASS_URI = "http://www.w3.org/2002/07/owl#Class";
const ON_PROPERTY_URI = "http://www.w3.org/2002/07/owl#onProperty";
const Has_Curation_Status_Purl = "http://purl.obolibrary.org/obo/IAO_0000114";



class TermApi {

  ontologyId: string = "";
  iri: string = "";
  term: OntologyTermData = {};
  termType: string = "";
  lang: string = "en";


  constructor(ontologyId?: string, iri?: string, termType?: string, language?: string) {
    this.ontologyId = ontologyId ? ontologyId : "";
    iri = iri ? iri : "";
    this.iri = Toolkit.urlNotEncoded(iri) ? encodeURIComponent(encodeURIComponent(iri)) : encodeURIComponent(iri);
    this.setTermType(termType);
    this.term = {};
    this.lang = language ? language : "en";

  }


  setTermType(termType?: string): void {
    if (termType === "term" || termType === "class" || termType === "terms") {
      this.termType = "classes";
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


  async fetchTerm(withRelations: boolean = true): Promise<boolean> {
    try {
      if (this.iri === "%20") {
        // empty iri
        this.term = {};
        return true;
      }

      let urlJson = `${process.env.REACT_APP_API_URL}/v2/ontologies/${this.ontologyId}/entities/${this.iri}?lang=${this.lang}`;
      let res = await fetch(urlJson, getCallSetting);
      this.term = await res.json();

      if (!withRelations) {
        return true;
      }

      this.term['label'] = TermLib.extractLabel(this.term);
      this.term['annotation'] = this.buildAnnotations();
      this.term['relations'] = undefined;
      this.term['eqAxiom'] = undefined;
      this.term['subClassOf'] = undefined;
      this.term['isIndividual'] = (this.termType === "individuals");
      this.fetchImportedAndAlsoInOntologies();
      let curationStatus = this.createHasCurationStatus();
      if (curationStatus) {
        this.term['curationStatus'] = curationStatus;
      }
      if (this.termType === "terms") {
        await this.fetchClassRelations();
      }

      return true;
    }
    catch (e) {
      this.term = {};
      return false;
    }

  }


  async fetchListOfTerms(page: number | string = DEFAULT_PAGE_NUMBER, size: number | string = DEFAULT_PAGE_SIZE): Promise<TermListData | []> {
    try {
      let url = `${process.env.REACT_APP_API_URL}/v2/ontologies/${this.ontologyId}/classes?lang=${this.lang}&page=${page}&size=${size}`;
      let result = await (await fetch(url, getCallSetting)).json();
      let totalTermsCount = result['totalElements'];
      result = result['elements'];
      if (!result) {
        return [];
      }
      let refinedResults = [];
      for (let term of result) {
        let termObject = new TermApi();
        termObject.term = term;
        termObject.ontologyId = term['ontologyId'];
        termObject.term['annotation'] = termObject.buildAnnotations();
        termObject.term['subClassOf'] = termObject.getSubClassOf();
        termObject.term['eqAxiom'] = termObject.getEqAxiom();
        termObject.term['label'] = termObject.extractLabel();
        refinedResults.push(termObject.term);
      }
      return { "results": refinedResults, "totalTermsCount": totalTermsCount };
    }
    catch (e) {
      // throw(e)
      return [];
    }
  }


  buildAnnotations() {
    let annotations = {};
    for (let key in this.term) {
      if (!key.includes('purl.obolibrary.org') || key === Has_Curation_Status_Purl) {
        continue;
      }
      if (this.term['linkedEntities'][key]) {
        if (typeof (this.term[key]) === "object" && !Array.isArray(this.term[key])) {
          annotations[this.term['linkedEntities'][key]['label'][0]] = this.term[key]?.value;
        } else {
          annotations[this.term['linkedEntities'][key]['label'][0]] = this.term[key];
        }
      }
    }
    return annotations;
  }



  async fetchClassRelations(): Promise<boolean> {

    let instancesList = await this.getIndividualInstancesForClass();
    this.term['relations'] = this.getRelations();
    this.term['eqAxiom'] = this.getEqAxiom();
    this.term['subClassOf'] = this.getSubClassOf();
    this.term['instancesList'] = instancesList;
    return true;
  }



  fetchImportedAndAlsoInOntologies() {
    this.term['originalOntology'] = this.getClassOriginalOntology();
    this.term['alsoIn'] = this.getClassAllOntologies();
    return true;
  }


  getRelations(): string | null {
    try {
      let relatedFromData = this.term['relatedFrom'];
      if (!relatedFromData || relatedFromData.length === 0) {
        return null;
      }
      let div = document.createElement('div');
      for (let relation of relatedFromData) {
        let propertyIri = relation['property'];
        let targetIri = relation['value'];
        let propertyLabel = this.term['linkedEntities'][propertyIri]['label'];
        let targetLabel = this.term['linkedEntities'][targetIri]['label'];
        let propUrl = `${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${this.ontologyId}/props?iri=${encodeURIComponent(propertyIri)}`;
        let targetUrl = `${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${this.ontologyId}/terms?iri=${encodeURIComponent(targetIri)}`;
        let span = document.createElement('span');
        let li = document.createElement('li');
        let ul = document.createElement('ul');
        let propAnchor = buildHtmlAnchor(propUrl, propertyLabel);
        span.appendChild(propAnchor);
        let targetAnchor = buildHtmlAnchor(targetUrl, targetLabel);
        li.appendChild(targetAnchor);
        ul.appendChild(li);
        span.appendChild(ul);
        div.appendChild(span);
      }
      return div.outerHTML;
    }
    catch (e) {
      return null;
    }
  }



  getEqAxiom(): string | null {
    try {
      let eqevalentAxiomData = this.term['http://www.w3.org/2002/07/owl#equivalentClass'];
      if (!eqevalentAxiomData) {
        return null;
      }
      let propertyIri = eqevalentAxiomData['http://www.w3.org/2002/07/owl#onProperty'];
      let targetIri = eqevalentAxiomData['http://www.w3.org/2002/07/owl#someValuesFrom'];
      let propertyLabel = this.term['linkedEntities'][propertyIri]['label'];
      let targetLabel = this.term['linkedEntities'][targetIri]['label'];
      let relationText = document.createElement('span');
      relationText.innerHTML = " some ";
      let propUrl = `${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${this.ontologyId}/props?iri=${encodeURIComponent(propertyIri)}`;
      let targetUrl = `${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${this.ontologyId}/terms?iri=${encodeURIComponent(targetIri)}`;
      let span = document.createElement('span');
      let propAnchor = buildHtmlAnchor(propUrl, propertyLabel);
      span.appendChild(propAnchor);
      span.appendChild(relationText);
      let targetAnchor = buildHtmlAnchor(targetUrl, targetLabel);
      span.appendChild(targetAnchor);
      return span.outerHTML;
    }
    catch (e) {
      return null;
    }
  }


  getSubClassOf(): string | null {
    try {
      let subClassOfData = this.term['http://www.w3.org/2000/01/rdf-schema#subClassOf'];
      if (!subClassOfData || subClassOfData.length === 0) {
        return null;
      }
      if (typeof (subClassOfData) === "string") {
        subClassOfData = [subClassOfData];
      }
      let ul = document.createElement('ul');
      for (let i = 0; i < subClassOfData.length; i++) {
        if (typeof (subClassOfData[i]) === "string") {
          let parentIri = subClassOfData[i];
          let parentLabel = this.term['linkedEntities'][parentIri]['label'];
          let parentLi = document.createElement('li');
          let parentUrl = `${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${this.ontologyId}/terms?iri=${encodeURIComponent(parentIri)}`;
          let parentAnchor = buildHtmlAnchor(parentUrl, parentLabel);
          parentLi.appendChild(parentAnchor);
          ul.appendChild(parentLi);
          continue;
        }
        let li = document.createElement('li');
        let content = this.recSubClass(subClassOfData[i]);
        li.appendChild(content);
        ul.appendChild(li);
      }

      return ul.outerHTML;

    }
    catch (e) {
      return null;
    }
  }


  recSubClass(relationObj, relation = "") {
    if (relationObj instanceof Array) {
      let targetIri = relationObj[0];
      let targetLabel = this.term['linkedEntities'][targetIri]['label'];
      let targetUrl = `${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${this.ontologyId}/terms?iri=${encodeURIComponent(targetIri)}`;
      let targetAnchor = buildHtmlAnchor(targetUrl, targetLabel);
      let liContent = document.createElement('span');
      liContent.appendChild(buildOpenParanthesis());
      liContent.appendChild(targetAnchor);
      let relationTextspan = document.createElement('span');
      relationTextspan.innerHTML = ` ${relation} `;
      liContent.appendChild(relationTextspan);
      if (typeof (relationObj[1]) === "string") {
        let targetIri = relationObj[1];
        let targetLabel = this.term['linkedEntities'][targetIri]['label'];
        let targetUrl = `${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${this.ontologyId}/terms?iri=${encodeURIComponent(targetIri)}`;
        let targetAnchor = buildHtmlAnchor(targetUrl, targetLabel);
        liContent.appendChild(targetAnchor);
        liContent.appendChild(buildCloseParanthesis());
        return liContent;
      }
      let content = this.recSubClass(relationObj[1]);
      liContent.appendChild(content);
      liContent.appendChild(buildCloseParanthesis());
      return liContent;
    }
    if (relationObj instanceof Object) {
      let propertyIri = relationObj['http://www.w3.org/2002/07/owl#onProperty'];
      if (!propertyIri) {
        let relKey = Object.keys(relationObj).find((key) => (key !== TYPE_URI));
        return this.recSubClass(relationObj[relKey], relKey?.split('#')[1]);
      }
      let propertyLabel = this.term['linkedEntities'][propertyIri]['label'];
      let propUrl = `${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${this.ontologyId}/props?iri=${encodeURIComponent(propertyIri)}`;
      let propAnchor = buildHtmlAnchor(propUrl, propertyLabel);
      let liContent = document.createElement('span');
      liContent.appendChild(buildOpenParanthesis());
      let relationTextspan = document.createElement('span');
      liContent.appendChild(propAnchor);
      let keys = Object.keys(relationObj);
      let targetKey = keys.find((key) => (key !== TYPE_URI && key !== ON_PROPERTY_URI));
      relationTextspan.innerHTML = ` ${targetKey.split('#')[1]} `;
      liContent.appendChild(relationTextspan);
      if (typeof (relationObj[targetKey]) === "string") {
        let targetIri = relationObj[targetKey];
        let targetLabel = this.term['linkedEntities'][targetIri]['label'];
        let targetUrl = `${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${this.ontologyId}/terms?iri=${encodeURIComponent(targetIri)}`;
        let targetAnchor = buildHtmlAnchor(targetUrl, targetLabel);
        liContent.appendChild(targetAnchor);
        liContent.appendChild(buildCloseParanthesis());
        return liContent;
      }
      let content = this.recSubClass(relationObj[targetKey], targetKey?.split('#')[1]);
      liContent.appendChild(content);
      liContent.appendChild(buildCloseParanthesis());
      return liContent;
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
    }
    catch (e) {
      return null;
    }
  }


  async getNodeJsTree(viewMode: string): Promise<any> {
    try {
      let OntologiesBaseServiceUrl = process.env.REACT_APP_API_URL;
      let parentPath = this.termType === "classes" ? "hierarchicalAncestors" : "ancestors";
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
    }
    catch (e) {
      return [];
    }
  }



  async getChildrenJsTree(targetNodeId: string, lang: string = "en"): Promise<any> {
    let OntologiesBaseServiceUrl = process.env.REACT_APP_API_URL;
    let path = this.termType === "classes" ? "hierarchicalChildren" : "children";
    let url = `${OntologiesBaseServiceUrl}/v2/ontologies/${this.ontologyId}/${this.termType}/${this.iri}/${path}?size=1000&lang=${lang}&includeObsoleteEntities=false`;
    let res = await (await fetch(url, getCallSetting)).json();
    let childrenList = res["elements"] ?? [];

    if (this.termType === "classes") {
      let url = `${OntologiesBaseServiceUrl}/v2/ontologies/${this.ontologyId}/classes/${this.iri}/individuals?size=1000&lang=${lang}`;
      let res = await (await fetch(url, getCallSetting)).json();
      childrenList = [...childrenList, ...(res["elements"] ?? [])];
    }
    return childrenList;
  }



  async replaceExternalIrisWithInternal(textWithExternalIris: string): Promise<string> {
    let urlRegex = /<a\s+([^>]*href=["']([^"']+)["'][^>]*)>/gi;
    let match;
    let modifiedText = textWithExternalIris;

    while ((match = urlRegex.exec(textWithExternalIris)) !== null) {
      let [, attributes, href] = match;
      let targetIriType = "terms";
      let termApi = new TermApi(this.ontologyId, encodeURIComponent(href), targetIriType);
      await termApi.fetchTerm({ withRelations: false });
      if (termApi.term.types[0] !== "class") {
        targetIriType = "props";
      }
      let internalUrl = `${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${this.ontologyId}/${targetIriType}?iri=${href}`;
      modifiedText = modifiedText.replace(match[0], `<a ${attributes.replace(href, internalUrl)}">`);
    }
    return modifiedText;
  }



  getClassOriginalOntology(): string | null {
    try {
      return this.term['definedBy'][0];
    }
    catch (e) {
      return null;
    }

  }



  getClassAllOntologies(): Array<string> | null {
    try {
      return this.term['appearsIn'];
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


  createHasCurationStatus(): Array<string> | null {
    // has_curation_status is an individual instance in the class instances list.
    try {
      let curationStatusLinks = this.term[Has_Curation_Status_Purl];
      if (!curationStatusLinks) {
        return null;
      }
      if (typeof (curationStatusLinks) === "string") {
        curationStatusLinks = [curationStatusLinks];
      }
      let result = [];
      for (let csLink of curationStatusLinks) {
        let curStatusIndiv = this.term['linkedEntities'][csLink];
        let individualUrl = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + this.term['ontologyId'] + "/individuals?iri=" + encodeURIComponent(csLink);
        result.push(`<a href="${individualUrl}" target='_blank'>${curStatusIndiv['label'][0]}</a>`);
      }
      return result;
    }
    catch (e) {
      return null;
    }
  }

}


export default TermApi;