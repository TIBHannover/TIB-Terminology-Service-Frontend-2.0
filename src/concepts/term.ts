import { OntologyTermDataV2 } from "../api/types/ontologyTypes";
import Toolkit from "../Libs/Toolkit";
import { buildHtmlAnchor } from "../Libs/htmlFactory";


class TsTerm {

  static TYPE_URI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
  static ON_PROPERTY_URI = "http://www.w3.org/2002/07/owl#onProperty";
  static CURATION_STATUS_PURL = "http://purl.obolibrary.org/obo/IAO_0000114";
  static DB_XREF_PURL = "http://www.geneontology.org/formats/oboInOwl#hasDbXref";
  static IDENTIFIER_PURL_HTTPS = "https://schema.org/identifier";
  static IDENTIFIER_PURL_HTTP = "http://schema.org/identifier";
  static PROPERTY_DOMAIN_PURL = "http://www.w3.org/2000/01/rdf-schema#domain";
  static PROPERTY_RANGE_PURL = "http://www.w3.org/2000/01/rdf-schema#range";
  static SUBCLASS_PURL = "http://www.w3.org/2000/01/rdf-schema#subClassOf";
  static EQUIVALENT_CLASS_PURL = "http://www.w3.org/2002/07/owl#equivalentClass";
  static DISJOINTWITH_PURL = "http://www.w3.org/2002/07/owl#disjointWith";
  term: OntologyTermDataV2;


  constructor(termData: OntologyTermDataV2) {
    this.term = termData;
  }


  get type(): string {
    if (this.term.type && this.term.type.length > 1) {
      return this.term.type[0];
    }
    return "";
  }

  get label(): string {
    try {
      if (!this.term.label || !this.term.label.length) {
        return "N/A";
      }
      if (typeof this.term.label === "string") {
        return this.term.label as string;
      }
      let label = this.term.label[this.term.label.length - 1] as string | { value: string };

      if (typeof label === 'string') {
        return label;
      } else if ("value" in label) {
        return label.value;
      }
      return label;
    } catch {
      return "N/A";
    }
  }

  get definition() {
    if (this.term.definition) {
      let result = [];
      for (let desc of this.term.definition) {
        if (typeof desc === "object" && desc.value) {
          let defText = Toolkit.transformLinksInStringToAnchor(desc.value);
          let defArr = [];
          defArr.push(defText);
          for (let ax of (desc.axioms ?? [])) {
            for (let key in ax) {
              let conatiner = document.createElement("span") as HTMLSpanElement;
              let axiomLabelSpan = document.createElement("span") as HTMLSpanElement;
              let emptyLine = document.createElement("br") as HTMLBRElement;
              let targetLabel = this.term["linkedEntities"]?.[key]?.label[0] as string;
              axiomLabelSpan.appendChild(document.createTextNode(targetLabel + ": "));
              axiomLabelSpan.classList.add("node-metadata-label");
              conatiner.appendChild(emptyLine);
              conatiner.appendChild(axiomLabelSpan);
              defArr.push(conatiner);
              if (Array.isArray(ax[key]) && ax[key].length > 1) {
                let span = document.createElement("span") as HTMLSpanElement;
                let emptyLine = document.createElement("br") as HTMLBRElement;
                span.appendChild(document.createTextNode(ax[key].join(", ")));
                span.appendChild(emptyLine);
                defArr.push(span);
              } else {
                let span = document.createElement("span") as HTMLSpanElement;
                let emptyLine = document.createElement("br") as HTMLBRElement;
                span.appendChild(document.createTextNode(ax[key]));
                span.appendChild(emptyLine);
                defArr.push(span);
              }
            }
          }
          result.push(defArr);
        } else {
          result.push(desc);
        }
      }
      return result;
    }

    return null;
  }


  get synonyms() {
    if (!this.term.synonym || !this.term.synonym.length) {
      return;
    }
    let result = [];
    for (let syn of this.term.synonym) {
      syn = syn as string | { value: string }
      try {
        if (typeof syn === "string") {
          result.push(syn);
        } else if ("value" in syn) {
          result.push(syn.value);
        }
      } catch {
        continue;
      }
    }
    return result;
  }

  get relations(): string | undefined {
    try {
      let relatedFromData = this.term['relatedFrom'];
      if (!relatedFromData || relatedFromData.length === 0) {
        return;
      }
      let div = document.createElement('div');
      for (let relation of relatedFromData) {
        let propertyIri = relation['property'];
        let targetIri = relation['value'];
        let propertyLabel = this.term['linkedEntities'][propertyIri]['label'][0];
        let targetLabel = this.term['linkedEntities'][targetIri]['label'][0];
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
    } catch (e) {
      return;
    }
  }



  get curationStatus(): string[] | undefined {
    return this.createHasCurationStatus();
  }

  get annotation(): { [key: string]: any } {
    return this.buildAnnotations();
  }

  get contributors() {
    if (this.annotation?.["contributor"]) {
      return this.annotation["contributor"];
    } else if (this.annotation?.["term editor"]) {
      return this.annotation["term editor"];
    } else if (this.annotation?.["creator"]) {
      return this.annotation["creator"];
    } else {
      return "N/A";
    }
  }

  get isIndividual(): boolean {
    return this.type.includes("individual")
  }

  get iri(): string {
    return this.term.iri ?? "";
  }

  get curie(): string {
    return this.term.curie ?? "";
  }

  get ontologyId(): string {
    return this.term.ontologyId ?? "";
  }

  get ontologyPreferredPrefix(): string {
    return this.term.ontologyPreferredPrefix ?? "";
  }

  get ontologyIri(): string {
    return this.term.ontologyIri ?? "";
  }

  get isObsolete(): boolean {
    return this.term.isObsolete ?? false;
  }

  get originalOntology(): string {
    if (this.term.definedBy && this.term.definedBy.length) {
      return this.term.definedBy[0];
    }
    return "";
  }

  get alsoIn(): string[] | undefined {
    if (this.term.appearsIn && this.term.appearsIn.length) {
      return this.term['appearsIn'];
    }
    return;
  }

  get hasHierarchicalChildren(): boolean {
    return this.term.hasHierarchicalChildren ?? false;
  }

  get hasDirectParents(): boolean {
    return this.term.hasDirectParents ?? false;
  }

  get directParent(): string[] {
    return this.term["directParent"] ?? [];
  }

  get shortForm(): string {
    return this.term.shortForm ?? "";
  }

  get isPreferredRoot(): boolean {
    return this.term.isPreferredRoot ?? false;
  }


  createHasCurationStatus(): string[] | undefined {
    // has_curation_status is an individual instance in the class instances list.
    try {
      let curationStatusLinks = this.term[TsTerm.CURATION_STATUS_PURL];
      if (!curationStatusLinks) {
        return;
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
    } catch (e) {
      return;
    }
  }

  buildAnnotations(): { [key: string]: any } {
    let annotations: { [key: string]: any } = {};
    if (this.term[TsTerm.IDENTIFIER_PURL_HTTP]) {
      annotations["Identifier"] = this.term[TsTerm.IDENTIFIER_PURL_HTTP];
    } else if (this.term[TsTerm.IDENTIFIER_PURL_HTTPS]) {
      annotations["Identifier"] = this.term[TsTerm.IDENTIFIER_PURL_HTTPS];
    }
    for (let key in this.term) {
      if (!key.includes('purl.obolibrary.org') || key === TsTerm.CURATION_STATUS_PURL) {
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



}

export default TsTerm;
