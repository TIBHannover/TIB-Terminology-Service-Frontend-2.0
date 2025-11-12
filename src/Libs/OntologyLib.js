
class OntologyLib {

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

}


export default OntologyLib;
