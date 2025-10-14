import TsTerm from "./term";
import { OntologyTermDataV2, OntologyTermData } from "../api/types/ontologyTypes";
import { buildHtmlAnchor, buildCloseParanthesis, buildOpenParanthesis } from "../Libs/htmlFactory";


class TsClass extends TsTerm {

  instancesList: OntologyTermData[];

  constructor(termData: OntologyTermDataV2, individualInstances: OntologyTermData[]) {
    super(termData);
    this.instancesList = individualInstances;

  }

  override get type(): string {
    return "class";
  }

  override get isIndividual(): boolean {
    return false;
  }

  get eqAxiom(): string | undefined {
    return this.recursivelyBuildStructure(TsTerm.EQUIVALENT_CLASS_PURL);
  }

  get subClassOf(): string | undefined {
    return this.recursivelyBuildStructure(TsTerm.SUBCLASS_PURL);
  }

  get disjointWith(): string | undefined {
    return this.recursivelyBuildStructure(TsTerm.DISJOINTWITH_PURL);
  }

  override get annotation(): { [key: string]: any } {
    return this.buildAnnotations();
  }


  override buildAnnotations(): { [key: string]: any } {
    let annotations = {} as { [key: string]: any };
    let dbXref = this.createDbXrefAnnotation();
    if (dbXref && dbXref.length) {
      annotations["has_dbxref"] = dbXref;
    }
    if (this.term[TsClass.IDENTIFIER_PURL_HTTP]) {
      annotations["Identifier"] = this.term[TsClass.IDENTIFIER_PURL_HTTP];
    } else if (this.term[TsClass.IDENTIFIER_PURL_HTTPS]) {
      annotations["Identifier"] = this.term[TsClass.IDENTIFIER_PURL_HTTPS];
    }
    for (let key in this.term) {
      if (!key.includes('purl.obolibrary.org') || key === TsClass.CURATION_STATUS_PURL) {
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

  createDbXrefAnnotation(): string[] | undefined {
    try {
      let dbXrefLinks = [] as string[];
      let dbxrefValue = this.term[TsClass.DB_XREF_PURL];
      if (!dbxrefValue) {
        return dbXrefLinks;
      }
      let termDbXrefList: { value: string, axioms: { [key: string]: string }[] }[] = [];
      if (typeof dbxrefValue === "string") {
        termDbXrefList = [{ value: dbxrefValue, axioms: [] }];
      } else {
        termDbXrefList = dbxrefValue;
      }
      for (let xref of termDbXrefList) {
        if (typeof xref === "string") {
          xref = { value: xref, axioms: [] };
        }
        if (!this.term["linkedEntities"][xref.value]) {
          // the xref value is not part of linked entities --> display as plain string
          let sources = [];
          for (let ax of xref.axioms) {
            sources.push(Object.values(ax)[0]);
          }
          sources.length ?
            dbXrefLinks.push(`${xref.value} <small>(source: ${sources.join(', ')})</small>`)
            : dbXrefLinks.push(`${xref.value}`);
        } else {
          let anchor = this.term["linkedEntities"][xref.value];
          let sources = [];
          for (let ax of xref.axioms) {
            sources.push(Object.values(ax)[0]);
          }
          if (anchor.url) {
            sources.length ?
              dbXrefLinks.push(`<a href="${anchor.url}" target="_blank" rel="noopener noreferrer">${xref.value}</a> <small>(source: ${sources})</small>`)
              : dbXrefLinks.push(`<a href="${anchor.url}" target="_blank" rel="noopener noreferrer">${xref.value}</a>`);
          } else {
            sources.length ?
              dbXrefLinks.push(`${xref.value} <small>(source: ${sources.join(', ')})</small>`)
              : dbXrefLinks.push(`${xref.value}`);
          }
        }
      }

      return dbXrefLinks;
    } catch (e) {
      // console.log(e)
      return;
    }
  }

  recursivelyBuildStructure(metadataPurl: string): string | undefined {
    try {
      let data = this.term[metadataPurl];
      if (!data || data.length === 0) {
        return;
      }
      if (typeof (data) === "string") {
        data = [data];
      }
      if (metadataPurl === TsTerm.EQUIVALENT_CLASS_PURL) {
        data = [data];
      }
      let ul = document.createElement('ul');
      for (let i = 0; i < data.length; i++) {
        if (typeof (data[i]) === "string") {
          let parentIri = data[i];
          let parentLabel = this.term['linkedEntities'][parentIri]['label'][0];
          let parentLi = document.createElement('li');
          let parentUrl = `${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${this.ontologyId}/terms?iri=${encodeURIComponent(parentIri)}`;
          let parentAnchor = buildHtmlAnchor(parentUrl, parentLabel);
          parentLi.appendChild(parentAnchor);
          ul.appendChild(parentLi);
          continue;
        }
        let li = document.createElement('li');
        let content = this.recSubClass(data[i])!;
        li.appendChild(content);
        ul.appendChild(li);
      }

      return ul.outerHTML;

    } catch (e) {
      // console.log(e)
      return;
    }
  }


  recSubClass(relationObj: any, relation = ""): HTMLSpanElement | undefined {
    if (relationObj instanceof Array) {
      let targetIri = relationObj[0];
      let targetLabel = this.term['linkedEntities'][targetIri]['label'][0];
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
        let targetLabel = this.term['linkedEntities'][targetIri]['label'][0];
        let targetUrl = `${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${this.ontologyId}/terms?iri=${encodeURIComponent(targetIri)}`;
        let targetAnchor = buildHtmlAnchor(targetUrl, targetLabel);
        liContent.appendChild(targetAnchor);
        liContent.appendChild(buildCloseParanthesis());
        return liContent;
      }
      let content = this.recSubClass(relationObj[1])!;
      liContent.appendChild(content);
      liContent.appendChild(buildCloseParanthesis());
      return liContent;
    }
    if (relationObj instanceof Object) {
      let propertyIri = relationObj['http://www.w3.org/2002/07/owl#onProperty'];
      if (!propertyIri) {
        let relKey = Object.keys(relationObj).find((key) => (key !== TsTerm.TYPE_URI))!;
        return this.recSubClass(relationObj[relKey], relKey?.split('#')[1]);
      }
      let propertyLabel = this.term['linkedEntities'][propertyIri]['label'][0];
      let propUrl = `${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${this.ontologyId}/props?iri=${encodeURIComponent(propertyIri)}`;
      let propAnchor = buildHtmlAnchor(propUrl, propertyLabel);
      let liContent = document.createElement('span');
      liContent.appendChild(buildOpenParanthesis());
      let relationTextspan = document.createElement('span');
      liContent.appendChild(propAnchor);
      let keys = Object.keys(relationObj);
      let targetKey = keys.find((key) => (key !== TsTerm.TYPE_URI && key !== TsTerm.ON_PROPERTY_URI))!;
      relationTextspan.innerHTML = ` ${targetKey.split('#')[1]} `;
      liContent.appendChild(relationTextspan);
      if (typeof (relationObj[targetKey]) === "string") {
        let targetIri = relationObj[targetKey];
        let targetLabel = this.term['linkedEntities'][targetIri]['label'][0];
        let targetUrl = `${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${this.ontologyId}/terms?iri=${encodeURIComponent(targetIri)}`;
        let targetAnchor = buildHtmlAnchor(targetUrl, targetLabel);
        liContent.appendChild(targetAnchor);
        liContent.appendChild(buildCloseParanthesis());
        return liContent;
      }
      let content = this.recSubClass(relationObj[targetKey], targetKey?.split('#')[1])!;
      liContent.appendChild(content);
      liContent.appendChild(buildCloseParanthesis());
      return liContent;
    }
    return;
  }


}

export default TsClass;
