import Toolkit from "./Toolkit";

class OntologyLib {
  static formatCreators(creators) {
    if (!creators || creators.length === 0) {
      return "N/A";
    }
    if (Toolkit.isString(creators)) {
      return creators;
    }
    let value = [];
    for (let i = 0; i < creators.length; i++) {
      value.push(creators[i]);
    }
    return value.join(",\n");
  }

  static formatSubject(classifications) {
    if (!classifications) {
      return "";
    }
    if (classifications[1] !== undefined) {
      let value = [];
      let subjectList = classifications[1].subject ?? [];
      for (let i = 0; i < subjectList.length; i++) {
        value.push(subjectList[i]);
      }
      return value.join(",\n");
    }
    return "";
  }

  static getCurrentOntologyIdFromUrlPath() {
    let currentUrlPath = window.location.pathname;
    currentUrlPath = currentUrlPath.split("ontologies/");
    let ontologyIdInUrl = "";
    if (currentUrlPath.length === 2 && currentUrlPath[1] !== "") {
      ontologyIdInUrl = currentUrlPath[1].includes("/")
        ? currentUrlPath[1].split("/")[0].trim()
        : currentUrlPath[1].trim();
    }
    return ontologyIdInUrl;
  }

  static getLabel(ontology) {
    if (ontology.title) {
      return ontology.title;
    }
    return ontology.label?.[0] ?? "";
  }

  static gerDescription(ontology) {
    return ontology.description ? ontology.description : "";
  }

  static getCollections(ontology) {
    if (!ontology.classifications) {
      return [];
    }
    return ontology.classifications?.[0]?.collection ?? [];
  }

  static getAnnotationProperties(ontology) {
    try {
      let annotations = {};
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

export default OntologyLib;
