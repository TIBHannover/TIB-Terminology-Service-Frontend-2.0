import { OntologyData } from "../api/types/ontologyTypes";
import { TsClass, TsProperty } from "./";

export class TsOntology {
  private _id: string;
  private _iri: string;
  private _title: string;
  private _description: string;
  private _preferredPrefix: string;
  private _purl: string;
  private _loaded: string;
  private _version: string;
  private _versionedUrl: string;
  private _numberOfClasses: number;
  private _numberOfProperties: number;
  private _numberOfIndividuals: number;
  private _allowDownload: boolean;
  private _collections: Array<string>;
  private _subjects: Array<string>;
  private _homepage: string;
  private _license: string;
  private _licenseUrl: string;
  private _creator: string;
  private _issueTrackerUrl: string;
  private _importedFrom: Array<string>;
  private _isSkos: boolean;
  private _rootClasses: TsClass[] = [];
  private _rootProperties: TsProperty[] = [];
  private _obsoleteClasses: TsClass[] = [];
  private _obsoleteProperties: TsProperty[] = [];
  private _annotations: Record<string, any> = {};
  private _importsFrom: Array<string> = [];
  private _language: Array<string> = [];
  private _repo_url: string;
  private _tracker: string;
  ontologyJsonData: OntologyData = {};

  constructor(ontologyData: OntologyData = {}) {
    this.ontologyJsonData = ontologyData;
    this._id = ontologyData.ontologyId ?? "";
    this._iri = ontologyData.iri ?? "";
    this._title = this.processTitle(ontologyData);
    this._description = ontologyData.description ?? "";
    this._preferredPrefix = ontologyData.preferredPrefix ?? "";
    this._purl = ontologyData.ontologyPurl ?? "";
    this._loaded = ontologyData.loaded ?? "";
    this._version = ontologyData["http://www.w3.org/2002/07/owl#versionInfo"] ?? "";
    this._versionedUrl = ontologyData["versioned_url"] || ontologyData["http://www.w3.org/2002/07/owl#versionIRI"] || "";
    this._numberOfClasses = parseInt(ontologyData.numberOfClasses ?? "0");
    this._numberOfProperties = parseInt(ontologyData.numberOfProperties ?? "0");
    this._numberOfIndividuals = parseInt(ontologyData.numberOfIndividuals ?? "0");
    this._allowDownload = ontologyData.allow_download ?? false;
    this._collections = ontologyData.classifications?.[0].collection ?? [];
    this._subjects = ontologyData.classifications?.[1].subject ?? [];
    this._homepage = ontologyData.homepage ?? "";
    this._license = ontologyData.license?.label ?? "";
    this._licenseUrl = ontologyData.license?.url ?? "";
    this._creator = this.processCreators(ontologyData);
    this._issueTrackerUrl = ontologyData.tracker ?? "";
    this._importedFrom = ontologyData.importsFrom ?? [];
    this._isSkos = ontologyData.isSkos ?? false;
    this._annotations = this.processAnnotations(ontologyData);
    this._importsFrom = ontologyData["importsFrom"] ?? [];
    this._repo_url = ontologyData.repo_url ?? "";
    this._language = ontologyData.language ?? [];
    this._tracker = ontologyData.tracker ?? "";
  }

  get ontologyId(): string {
    return this._id;
  }

  get iri(): string {
    return this._iri;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get preferredPrefix(): string {
    return this._preferredPrefix;
  }

  get purl(): string {
    return this._purl;
  }

  get loaded(): string {
    return this._loaded;
  }

  get version(): string {
    return this._version;
  }

  get versionedUrl(): string {
    return this._versionedUrl;
  }

  get numberOfClasses(): number {
    return this._numberOfClasses;
  }

  get numberOfProperties(): number {
    return this._numberOfProperties;
  }

  get numberOfIndividuals(): number {
    return this._numberOfIndividuals;
  }

  get allowDownload(): boolean {
    return this._allowDownload;
  }

  get collections(): Array<string> {
    return this._collections;
  }

  get subjects(): Array<string> {
    return this._subjects;
  }

  get homepage(): string {
    return this._homepage;
  }

  get license(): string {
    return this._license;
  }

  get licenseUrl(): string {
    return this._licenseUrl;
  }

  get creator(): string {
    return this._creator;
  }

  get issueTrackerUrl(): string {
    return this._issueTrackerUrl;
  }

  get importedFrom(): Array<string> {
    return this._importedFrom;
  }

  get isSkos(): boolean {
    return this._isSkos;
  }

  get rootClasses(): TsClass[] {
    return this._rootClasses;
  }

  get rootProperties(): TsProperty[] {
    return this._rootProperties;
  }

  get obsoleteClasses(): TsClass[] {
    return this._obsoleteClasses;
  }

  get obsoleteProperties(): TsProperty[] {
    return this._obsoleteProperties;
  }

  get importsFrom(): Array<string> {
    return this._importsFrom;
  }

  get annotations(): Record<string, any> {
    return this._annotations;
  }

  get repo_url(): string {
    return this._repo_url;
  }

  get language(): Array<string> {
    return this._language;
  }

  get tracker(): string {
    return this._tracker;
  }

  set rootClasses(input: TsClass[]) {
    this._rootClasses = input;
  }

  set rootProperties(input: TsProperty[]) {
    this._rootProperties = input;
  }

  set obsoleteClasses(input: TsClass[]) {
    this._obsoleteClasses = input;
  }

  set obsoleteProperties(input: TsProperty[]) {
    this._obsoleteProperties = input;
  }


  private processCreators(ontology: OntologyData): string {
    let creators = ontology["http://purl.org/dc/terms/creator"] || ontology["http://purl.org/dc/elements/1.1/creator"] || ontology['creator'];
    if (!creators || creators.length === 0) {
      return "N/A";
    }
    if (typeof creators === "string") {
      return creators;
    }
    let value = [];
    for (let i = 0; i < creators.length; i++) {
      value.push(creators[i]);
    }
    return value.join(",\n");
  }


  private processTitle(ontology: OntologyData): string {
    if (ontology.title) {
      return ontology.title.trim();
    }
    return ontology.label?.[0].trim() ?? "";
  }


  private processAnnotations(ontology: OntologyData): Record<string, any> {
    try {
      let annotations: Record<string, any> = {};
      for (let prop in ontology) {
        if (!prop.includes("://")) {
          // properties that are not IRIs are discarded.
          continue;
        }
        if (prop === "http://purl.obolibrary.org/obo/IAO_0000700") {
          // has preferred root term prop
          continue;
        }
        if (
          prop.startsWith("http://www.w3.org/2000/01/rdf-schema#") ||
          prop.startsWith("http://www.w3.org/1999/02/22-rdf-syntax-ns#") ||
          prop.startsWith("http://www.w3.org/2002/07/owl#")
        ) {
          // skip all props in owl, rdf, rdfs namespace
          continue;
        }
        annotations[prop] = ontology[prop];
      }
      return annotations;
    } catch {
      return {};
    }
  }


}

