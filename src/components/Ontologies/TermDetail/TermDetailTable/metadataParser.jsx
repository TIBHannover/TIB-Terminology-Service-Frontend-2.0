import TermLib from "../../../../Libs/TermLib";
import Toolkit from "../../../../Libs/Toolkit";


/**
 * Create the metadata for a class/individual detail table 
 */
export function classMetaData(term, termType) {
  let metadata = {}
  metadata['Label'] = { "value": term.label, "isLink": false };
  metadata['Description'] = { "value": TermLib.createTermDiscription(term) ?? term?.annotation?.definition, "isLink": false };
  metadata['Imported From'] = { "value": TermLib.createOntologyTagWithTermURL(term.originalOntology, term.iri, termType), "isLink": false };
  metadata['Also In'] = { "value": TermLib.createAlsoInTags(term, termType), "isLink": false };
  metadata['Synonyms'] = { "value": term.synonym ? (term.synonym).join('<br/>') : "", "isLink": false }
  metadata['CURIE'] = { "value": term.curie, "isLink": false };
  metadata['Term ID'] = { "value": term.shortForm, "isLink": false };
  metadata['fullIRI'] = { "value": term.iri, "isLink": true };
  metadata['SubClass Of'] = { "value": term.subClassOf, "isLink": false };
  metadata['Equivalent to'] = { "value": term.eqAxiom, "isLink": false };
  metadata['Used in axiom'] = { "value": term.relations, "isLink": false };
  metadata['Instances'] = { "value": TermLib.createInstancesListForClass(term), "isLink": false };
  metadata['has curation status'] = { "value": term.curationStatus, "isLink": false };

  if (term.annotation) {
    // add custom annotation fields. Metadata key can be anything
    for (let key in term.annotation) {
      if (key === 'definition') {
        continue;
      }
      if (Array.isArray(term.annotation[key])) {
        let res = [];
        term.annotation[key].map((value) => {
          if (typeof (value) === "object" && value.value) {
            res.push(Toolkit.transformLinksInStringToAnchor(value.value));
          } else {
            res.push(Toolkit.transformLinksInStringToAnchor(value));
          }
        });
        metadata[key] = { "value": res, "isLink": false };
      } else if (typeof (term.annotation[key]) === "object" && term.annotation[key].value) {
        metadata[key] = { "value": Toolkit.transformLinksInStringToAnchor(term.annotation[key].value), "isLink": false };
      } else {
        metadata[key] = { "value": Toolkit.transformLinksInStringToAnchor(term.annotation[key]), "isLink": false };
      }
    }
  }
  return metadata;
}



/**
 * Create the metadata for a Property detail table 
 */
export function propertyMetaData(term) {
  let metadata = {};

  metadata['Label'] = { "value": term.label, "isLink": false };
  metadata['Description'] = { "value": term?.annotation?.definition ?? null, "isLink": false };
  metadata['Imported From'] = { "value": TermLib.createOntologyTagWithTermURL(term.originalOntology, term.iri, "property"), "isLink": false };
  metadata['Also In'] = { "value": TermLib.createAlsoInTags(term, "property"), "isLink": false };
  metadata['Synonyms'] = { "value": term.synonyms, "isLink": false };
  metadata['CURIE'] = { "value": term.obo_id, "isLink": false };
  metadata['Term ID'] = { "value": term.shortForm, "isLink": false };
  metadata['fullIRI'] = { "value": term.iri, "isLink": true };
  metadata['Ontology'] = { "value": term.ontologyId, "isLink": false };
  metadata['has curation status'] = { "value": term.curationStatus, "isLink": false };

  if (term.annotation) {
    // add custom annotation fields. Metadata key can be anything
    for (let key in term.annotation) {
      if (key === 'definition') {
        continue;
      }
      if (Array.isArray(term.annotation[key])) {
        let res = [];
        term.annotation[key].map((value) => {
          if (typeof (value) === "object" && value.value) {
            res.push(Toolkit.transformLinksInStringToAnchor(value.value));
          } else {
            res.push(Toolkit.transformLinksInStringToAnchor(value));
          }
        });
        metadata[key] = { "value": res, "isLink": false };
      } else if (typeof (term.annotation[key]) === "object" && term.annotation[key].value) {
        metadata[key] = { "value": Toolkit.transformLinksInStringToAnchor(term.annotation[key].value), "isLink": false };
      }
      else {
        metadata[key] = { "value": Toolkit.transformLinksInStringToAnchor(term.annotation[key]), "isLink": false };
      }
    }
  }

  return metadata;
}






