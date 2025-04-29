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
    let ontologyIdInUrl = null;
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
}

export default OntologyLib;
