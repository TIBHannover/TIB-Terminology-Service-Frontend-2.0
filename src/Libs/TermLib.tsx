import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import {
  ClassStructureAxiom,
  ClassStructureNode,
  TsClass,
  TsSkosTerm,
  TsTerm,
} from "../concepts";
import Toolkit from "./Toolkit";

const Has_Curation_Status_Purl = "http://purl.obolibrary.org/obo/IAO_0000114";
type RenderClassStructureOptions = {
  showAxioms?: boolean;
};

class TermLib {
  static renderClassStructure(
    term: TsClass,
    nodes?: ClassStructureNode[],
    options: RenderClassStructureOptions = {},
  ) {
    if (!nodes?.length) {
      return;
    }

    return (
      <ul>
        {nodes.map((node, index) => (
          <li key={index}>
            {TermLib.renderClassStructureNode(term, node, options)}
          </li>
        ))}
      </ul>
    );
  }

  static classStructureToText(nodes?: ClassStructureNode[]): string {
    if (!nodes?.length) {
      return "";
    }
    return nodes
      .map((node) => TermLib.classStructureNodeToText(node))
      .join("; ");
  }

  private static renderClassStructureNode(
    term: TsClass,
    node: ClassStructureNode,
    options: RenderClassStructureOptions,
  ): JSX.Element | string {
    const axiomButton =
      options.showAxioms && node.axioms?.length ? (
        <AxiomInfoButton axioms={node.axioms} />
      ) : null;

    if (node.type === "literal") {
      return (
        <>
          {node.value}
          {axiomButton}
        </>
      );
    }
    if (node.type === "link") {
      return (
        <>
          <a
            href={TermLib.createClassStructureUrl(term, node)}
            target="_blank"
            rel="noreferrer"
          >
            {node.label}
          </a>
          {axiomButton}
        </>
      );
    }

    return (
      <span>
        ({node.left &&
          TermLib.renderClassStructureNode(term, node.left, options)}
        <span> {node.relation} </span>
        {node.right &&
          TermLib.renderClassStructureNode(term, node.right, options)}
        )
        {axiomButton}
      </span>
    );
  }

  private static classStructureNodeToText(node: ClassStructureNode): string {
    if (node.type === "literal") {
      return node.value;
    }
    if (node.type === "link") {
      return node.label || node.iri;
    }
    return `(${node.left ? TermLib.classStructureNodeToText(node.left) : ""} ${node.relation} ${node.right ? TermLib.classStructureNodeToText(node.right) : ""})`;
  }

  private static createClassStructureUrl(
    term: TsClass,
    node: Extract<ClassStructureNode, { type: "link" }>,
  ) {
    return `${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${term.ontologyId}/${node.target}?iri=${encodeURIComponent(node.iri)}`;
  }

  static createOntologyTagWithTermURL(
    ontology_name: string,
    termIri: string,
    type: string,
  ) {
    /* 
        We need the ontology_name as the input since the function is also used for
        making tag from "imported from" or "Also In". The ontology_name is not necessary equivalent with
        the term ontology_name metadata.
    */
    if (!ontology_name) {
      return null;
    }

    let targetHref =
      process.env.REACT_APP_PROJECT_SUB_PATH +
      "/ontologies/" +
      encodeURIComponent(ontology_name);
    if (type === "class" || type === "terms") {
      targetHref += "/terms?iri=" + encodeURIComponent(termIri);
    } else if (type === "property" || type === "properties") {
      targetHref += "/props?iri=" + encodeURIComponent(termIri);
    } else if (type === "individual" || type === "individuals") {
      targetHref += "/individuals?iri=" + encodeURIComponent(termIri);
    }

    return [
      <a
        href={targetHref}
        className="btn btn-default ontology-button "
        target="_blank"
      >
        {ontology_name.toUpperCase()}
      </a>,
    ];
  }

  static createTermUrlWithOntologyPrefix({
    ontology_name,
    termIri,
    termLabel,
    type,
  }: {
    ontology_name: string;
    termIri: string;
    termLabel: string;
    type: string;
  }) {
    if (!ontology_name) {
      return null;
    }

    let targetHref =
      process.env.REACT_APP_PROJECT_SUB_PATH +
      "/ontologies/" +
      encodeURIComponent(ontology_name);
    if (type === "class" || type === "terms") {
      targetHref += "/terms?iri=" + encodeURIComponent(termIri);
    } else if (type === "property" || type === "properties") {
      targetHref += "/props?iri=" + encodeURIComponent(termIri);
    } else if (type === "individual" || type === "individuals") {
      targetHref += "/individuals?iri=" + encodeURIComponent(termIri);
    }
    return [
      <a href={targetHref} target="_blank">
        {ontology_name.toUpperCase() + ":" + termLabel}
      </a>,
    ];
  }

  static createTermUrl({
    ontology_name,
    termIri,
    termLabel,
    type,
  }: {
    ontology_name: string;
    termIri: string;
    termLabel: string;
    type: string;
  }) {
    if (!ontology_name) {
      return null;
    }

    let targetHref =
      process.env.REACT_APP_PROJECT_SUB_PATH +
      "/ontologies/" +
      encodeURIComponent(ontology_name);
    if (type === "class" || type === "terms") {
      targetHref += "/terms?iri=" + encodeURIComponent(termIri);
    } else if (type === "property" || type === "properties") {
      targetHref += "/props?iri=" + encodeURIComponent(termIri);
    } else if (type === "individual" || type === "individuals") {
      targetHref += "/individuals?iri=" + encodeURIComponent(termIri);
    }
    return [
      <a href={targetHref} target="_blank">
        {termLabel}
      </a>,
    ];
  }

  static createAlsoInTags(term: TsTerm) {
    if (term.alsoIn && term.alsoIn.length !== 0) {
      let alsoInList = [];
      for (let ontologyId of term.alsoIn) {
        if (term.originalOntology !== ontologyId) {
          alsoInList.push(
            TermLib.createOntologyTagWithTermURL(
              ontologyId,
              term.iri,
              term.type,
            ),
          );
        }
      }
      return alsoInList;
    }
    return [];
  }

  static createInstancesListForClass(term: TsClass | TsSkosTerm) {
    // instances are the individuals which are a type of this class.
    if (!term.instancesList) {
      return null;
    }
    let result = [];
    for (let instance of term.instancesList) {
      let individualUrl =
        process.env.REACT_APP_PROJECT_SUB_PATH +
        "/ontologies/" +
        instance["ontology_name"] +
        "/individuals?iri=" +
        encodeURIComponent(instance["iri"]);
      result.push(
        <li>
          <a href={individualUrl} target="_blank">
            {instance["label"]}
          </a>
        </li>,
      );
    }
    return result;
  }

  static createListOfClasses(classList) {
    // render a list of classes as a list
    // classList is list of object with props: {ontologyId:"", iri:"", label:""}
    let result = [];
    for (let cl of classList) {
      let classUrl =
        process.env.REACT_APP_PROJECT_SUB_PATH +
        "/ontologies/" +
        cl["ontologyId"] +
        "/terms?iri=" +
        encodeURIComponent(cl["iri"]);
      result.push(
        <>
          <a href={classUrl} target="_blank">
            {cl["label"]}
          </a>
          <br />
        </>,
      );
    }
    return result;
  }

  static extractLabel(term) {
    try {
      if (term.label instanceof String || typeof term.label === "string") {
        return term.label;
      }
      let label = term.label[term.label?.length - 1];
      if (!label) {
        return "N/A";
      }
      if (label.hasOwnProperty("value")) {
        return label.value;
      }
      return label;
    } catch {
      return "N/A";
    }
  }

  static termHasChildren(term) {
    return term.hasHierarchicalChildren || term.hasDirectChildren;
  }

  static makeTermIdForTree(term) {
    let id = term.iri + "___" + Math.random().toString(36).substring(2, 20);
    return id;
  }

  static getTermType(term) {
    if (!term.type) {
      return "";
    }
    if (Toolkit.isString(term.type)) {
      return term.type;
    }
    return term.type[0];
  }

  static gerTermSynonyms(term) {
    if (!term.synonym) {
      return;
    }
    let result = [];
    for (let syn of term.synonym) {
      try {
        if (Toolkit.isString(syn)) {
          result.push(syn);
          continue;
        }
        result.push(syn.value);
      } catch {
        continue;
      }
    }
    return result;
  }

  static getAnnotations(term) {
    let annotations = {};
    for (let key in term) {
      if (
        !key.includes("purl.obolibrary.org") ||
        key === Has_Curation_Status_Purl
      ) {
        continue;
      }
      if (term["linkedEntities"][key]) {
        if (typeof term[key] === "object" && !Array.isArray(term[key])) {
          annotations[term["linkedEntities"][key]["label"][0]] =
            TsTerm.createAnnotation(key, term[key]?.value);
        } else {
          annotations[term["linkedEntities"][key]["label"][0]] =
            TsTerm.createAnnotation(key, term[key]);
        }
      }
    }
    return annotations;
  }

  static getAnnotationDefinition(definitionList) {
    if (!definitionList) {
      return [];
    }
    let results = [];
    for (let def of definitionList) {
      if (typeof def === "string") {
        results.push(def);
      } else if ("value" in def) {
        results.push(def.value);
      }
    }
    return results;
  }
}

function AxiomInfoButton({ axioms }: { axioms: ClassStructureAxiom[] }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        type="button"
        className="metadata-info-button ms-1"
        aria-label="see axioms"
        title="see axioms"
        onClick={() => setShowModal(true)}
      >
        <i className="bi bi-info-circle" aria-hidden="true"></i>
      </button>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        className="metadata-info-modal"
      >
        <Modal.Header>
          <Modal.Title>Axioms</Modal.Title>
          <button
            type="button"
            className="metadata-info-close"
            aria-label="Close"
            onClick={() => setShowModal(false)}
          >
            <i className="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {axioms.map((axiom, index) => (
              <li key={`${axiom.key}-${axiom.value}-${index}`}>
                <span title={axiom.key}>{axiom.keyLabel}</span>:{" "}
                <span title={axiom.value}>{axiom.valueLabel}</span>
              </li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default TermLib;
