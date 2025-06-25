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
  
  static createTermUrlWithOntologyPrefix(
    {
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
    } else if (term.definition) {
      let result = [];
      for (let desc of term.definition) {
        if (typeof desc === "object" && desc.value) {
          let defText = Toolkit.transformLinksInStringToAnchor(desc.value);
          let defArr = [];
          defArr.push(defText);
          for (let ax of (desc.axioms ?? [])) {
            for (let key in ax) {
              defArr.push(
                <>
                  <br/>
                  <span className="node-metadata-label">{term["linkedEntities"]?.[key]?.label[0] + ": "}</span>
                </>
              );
              defArr.push(<>{ax[key]}<br/></>);
            }
          }
          result.push(<p>{defArr}</p>);
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
}

export default TermLib;
