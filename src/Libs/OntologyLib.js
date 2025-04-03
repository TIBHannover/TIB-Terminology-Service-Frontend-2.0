class OntologyLib {
  static formatCreators(creators) {
    if (creators.length === 0) {
      return "N/A";
    }
    let value = [];
    for (let i = 0; i < creators.length; i++) {
      value.push(creators[i]);
    }
    return value.join(",\n");
  }

  static formatSubject(classifications) {
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
}

export default OntologyLib;
