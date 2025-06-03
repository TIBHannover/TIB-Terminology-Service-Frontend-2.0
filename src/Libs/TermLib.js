import Toolkit from "./Toolkit";
import TermApi from "../api/term";

class TermLib {
  static createOntologyTagWithTermURL(ontology_name, termIri, type) {
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

  static createAlsoInTags(term, termType) {
    if (term.alsoIn && term.alsoIn.length !== 0) {
      let alsoInList = [];
      for (let ontologyId of term.alsoIn) {
        if (term.originalOntology !== ontologyId) {
          alsoInList.push(
            TermLib.createOntologyTagWithTermURL(
              ontologyId,
              term.iri,
              termType,
            ),
          );
        }
      }
      return alsoInList;
    }
    return null;
  }

  static createTermDiscription(term) {
    if (term.isIndividual && term.description) {
      // individual description structure is different
      let result = [];
      for (let desc of term.description) {
        result.push(<p>{desc}</p>);
      }
      return result;
    } else if (term.obo_definition_citation) {
      let result = [];
      for (let cite of term.obo_definition_citation) {
        result.push(
          <div>
            {Toolkit.transformLinksInStringToAnchor(cite["definition"])}
            <br />[<span className="node-metadata-label">Reference</span>:{" "}
            <a href={cite["oboXrefs"][0]["url"]} target="_blank">
              {cite["oboXrefs"][0]["url"] ? cite["oboXrefs"][0]["url"] : "N/A"}
            </a>
            ]
          </div>,
        );
      }
      return result;
    } else if (term.definition) {
      let result = [];
      for (let desc of term.definition) {
        if (typeof desc === "object" && desc.value) {
          result.push(<p>{desc.value}</p>);
        } else {
          result.push(<p>{desc}</p>);
        }
      }
      return result;
    }

    return null;
  }

  static createInstancesListForClass(term) {
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

  static getContributors(term) {
    if (term["annotation"]["contributor"]) {
      return term["annotation"]["contributor"];
    } else if (term["annotation"]["term editor"]) {
      return term["annotation"]["term editor"];
    } else if (term["annotation"]["creator"]) {
      return term["annotation"]["creator"];
    } else {
      return "N/A";
    }
  }
}

export default TermLib;
