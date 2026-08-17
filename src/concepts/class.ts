import {
  OntologyTermDataV2,
  OntologyTermData,
} from "../api/types/ontologyTypes";
import { buildHtmlAnchor } from "../Libs/htmlFactory";
import { TsTerm } from "./term";

export type ClassStructureNode =
  | {
      type: "link";
      iri: string;
      label: string;
      target: "terms" | "props";
    }
  | {
      type: "literal";
      value: string;
    }
  | {
      type: "expression";
      left?: ClassStructureNode; // left is subject in subject-predicate-object triple
      relation: string; // predicate
      right?: ClassStructureNode; // right is object in subject-predicate-object triple
    };

export class TsClass extends TsTerm {
  instancesList: OntologyTermData[];

  constructor(
    termData: OntologyTermDataV2,
    individualInstances: OntologyTermData[],
  ) {
    super(termData);
    this.instancesList = individualInstances;
  }

  override get type(): string {
    return "class";
  }

  override get isIndividual(): boolean {
    return false;
  }

  get eqAxiom(): ClassStructureNode[] | undefined {
    return this.recursivelyBuildStructure(TsTerm.EQUIVALENT_CLASS_PURL);
  }

  get subClassOf(): ClassStructureNode[] | undefined {
    return this.recursivelyBuildStructure(TsTerm.SUBCLASS_PURL);
  }

  get disjointWith(): ClassStructureNode[] | undefined {
    return this.recursivelyBuildStructure(TsTerm.DISJOINTWITH_PURL);
  }

  get rules(): string {
    return this.getRules();
  }

  override get annotation(): { [key: string]: any } {
    return this.buildAnnotations();
  }

  override buildAnnotations(): { [key: string]: any } {
    try {
      let annotations = {} as { [key: string]: any };
      let dbXref = this.createDbXrefAnnotation();
      if (dbXref && dbXref.length) {
        annotations["has_dbxref"] = TsTerm.createAnnotation(
          TsTerm.DB_XREF_PURL,
          "has_dbxref",
          dbXref,
        );
      }
      if (this.term[TsClass.IDENTIFIER_PURL_HTTP]) {
        annotations["Identifier"] = TsTerm.createAnnotation(
          TsClass.IDENTIFIER_PURL_HTTP,
          this.term[TsClass.IDENTIFIER_PURL_HTTP],
        );
      } else if (this.term[TsClass.IDENTIFIER_PURL_HTTPS]) {
        annotations["Identifier"] = TsTerm.createAnnotation(
          TsClass.IDENTIFIER_PURL_HTTPS,
          this.term[TsClass.IDENTIFIER_PURL_HTTPS],
        );
      }
      for (let key in this.term) {
        if (TsTerm.ANNOTATION_EXPECTION.includes(key)) {
          continue;
        }
        if (this.getLabelForLinkedEntity(key).length) {
          if (
            typeof this.term[key] === "object" &&
            !Array.isArray(this.term[key])
          ) {
            annotations[this.getLabelForLinkedEntity(key)] =
              TsTerm.createAnnotation(
                key,
                this.getLabelForLinkedEntity(key),
                this.term[key]?.value,
              );
          } else {
            annotations[this.getLabelForLinkedEntity(key)] =
              TsTerm.createAnnotation(
                key,
                this.getLabelForLinkedEntity(key),
                this.term[key],
              );
          }
        }
      }
      return annotations;
    } catch (e) {
      return {};
    }
  }

  createDbXrefAnnotation(): string[] | undefined {
    try {
      let dbXrefLinks = [] as string[];
      let dbxrefValue = this.term[TsClass.DB_XREF_PURL];
      if (!dbxrefValue) {
        return dbXrefLinks;
      }
      let termDbXrefList: {
        value: string;
        axioms: { [key: string]: string }[];
      }[] = [];
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
          sources.length
            ? dbXrefLinks.push(
                `${xref.value} <small>(source: ${sources.join(", ")})</small>`,
              )
            : dbXrefLinks.push(`${xref.value}`);
        } else {
          let anchor = this.term["linkedEntities"][xref.value];
          let sources = [];
          for (let ax of xref.axioms) {
            sources.push(Object.values(ax)[0]);
          }
          if (anchor.url) {
            sources.length
              ? dbXrefLinks.push(
                  `<a href="${anchor.url}" target="_blank" rel="noopener noreferrer">${xref.value}</a> <small>(source: ${sources})</small>`,
                )
              : dbXrefLinks.push(
                  `<a href="${anchor.url}" target="_blank" rel="noopener noreferrer">${xref.value}</a>`,
                );
          } else {
            sources.length
              ? dbXrefLinks.push(
                  `${xref.value} <small>(source: ${sources.join(", ")})</small>`,
                )
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

  recursivelyBuildStructure(
    metadataPurl: string,
  ): ClassStructureNode[] | undefined {
    try {
      let data = this.term[metadataPurl];
      if (typeof data === "string") {
        data = [data];
      } else if (Array.isArray(data)) {
        if (
          metadataPurl === TsTerm.EQUIVALENT_CLASS_PURL &&
          this.isExpressionArray(data)
        ) {
          data = [data];
        }
      } else if (typeof data === "object") {
        data = [data];
      }
      if (!data || data.length === 0) {
        return;
      }
      let result: ClassStructureNode[] = [];
      for (let i = 0; i < data.length; i++) {
        let subClassData = data[i];
        let [subClassIri, subClassIsIri] =
          this.getStringValueIfPossible(subClassData);
        if (subClassIsIri) {
          if (!this.term["linkedEntities"][subClassIri]) {
            continue;
          }
          let parentLabel = this.getLabelForLinkedEntity(subClassIri);
          let [parentLableString, _] =
            this.getStringValueIfPossible(parentLabel);
          result.push(this.createLinkNode(subClassIri, parentLableString));
        } else {
          result.push(this.recSubClass(subClassData)!);
        }
      }

      return result.length ? result : undefined;
    } catch (e) {
      // console.log(e)
      return;
    }
  }

  recSubClass(relationObj: any, relation = ""): ClassStructureNode | undefined {
    if (relationObj instanceof Array) {
      let left: ClassStructureNode | undefined;
      if (typeof relationObj[0] === "string") {
        left = this.createTermLinkNode(relationObj[0]);
      } else {
        left = this.recSubClass(relationObj[0]);
      }
      let right: ClassStructureNode | undefined;
      if (typeof relationObj[1] === "string") {
        right = this.createTermLinkNode(relationObj[1]);
      } else {
        right = this.recSubClass(relationObj[1]);
      }
      return { type: "expression", left, relation, right };
    }
    if (relationObj instanceof Object) {
      let propertyIri = relationObj["http://www.w3.org/2002/07/owl#onProperty"];
      if (!propertyIri) {
        let relKey = Object.keys(relationObj).find(
          (key) => key !== TsTerm.TYPE_URI,
        )!;
        return this.recSubClass(relationObj[relKey], relKey?.split("#")[1]);
      }
      let keys = Object.keys(relationObj);
      let targetKey = keys.find(
        (key) => key !== TsTerm.TYPE_URI && key !== TsTerm.ON_PROPERTY_URI,
      )!;
      let right: ClassStructureNode | undefined;
      if (typeof relationObj[targetKey] === "string") {
        if (targetKey.includes("Cardinality")) {
          right = { type: "literal", value: relationObj[targetKey] };
        } else {
          right = this.createTermLinkNode(relationObj[targetKey]);
        }
      } else {
        right = this.recSubClass(
          relationObj[targetKey],
          targetKey?.split("#")[1],
        );
      }
      return {
        type: "expression",
        left: this.createLinkNode(
          propertyIri,
          this.getLabelForLinkedEntity(propertyIri),
          "props",
        ),
        relation: targetKey.split("#")[1],
        right,
      };
    }
    return { type: "literal", value: "" };
  }

  getRules(): string {
    try {
      const objectPurl = "http://www.w3.org/ns/shacl#object";
      const predicatePurl = "http://www.w3.org/ns/shacl#predicate";
      const subjectPurl = "http://www.w3.org/ns/shacl#subject";
      if (!this.term[TsTerm.RULE_PURL]) {
        return "";
      }
      let rules = this.term[TsTerm.RULE_PURL];
      let result = document.createElement("div") as HTMLDivElement;
      for (let triple of rules) {
        let object = triple[objectPurl];
        let predicate = triple[predicatePurl];
        let subject = triple[subjectPurl];
        let predicateLabel = this.getLabelForLinkedEntity(predicate);
        let ruleContainer = document.createElement("div") as HTMLDivElement;
        let objectAnchor = buildHtmlAnchor(object, object);
        let subjectAnchor = buildHtmlAnchor(subject, subject);
        ruleContainer.appendChild(objectAnchor);
        ruleContainer.appendChild(
          document.createTextNode("  " + predicateLabel + " "),
        );
        ruleContainer.appendChild(subjectAnchor);
        result.appendChild(ruleContainer);
      }
      return result.outerHTML;
    } catch (e) {
      // console.log(e);
      return "";
    }
  }

  private getStringValueIfPossible(value: any): [string, boolean] {
    if (typeof value === "string") {
      return [value, true];
    }
    if (
      typeof value === "object" &&
      value.value &&
      typeof value.value === "string"
    ) {
      return [value.value, true];
    }
    return [value, false];
  }

  private createTermLinkNode(iri: string): ClassStructureNode {
    return this.createLinkNode(iri, this.getLabelForLinkedEntity(iri));
  }

  private createLinkNode(
    iri: string,
    label: string,
    target: "terms" | "props" = "terms",
  ): ClassStructureNode {
    return { type: "link", iri, label, target };
  }

  private isExpressionArray(data: any[]): boolean {
    return data.length === 2;
  }
}
