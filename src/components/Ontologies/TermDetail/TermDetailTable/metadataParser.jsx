import TermLib from "../../../../Libs/TermLib";


/**
 * Create the metadata for a class/individual detail table 
 */
 export function classMetaData(term, termType){
    let metadata = {}
    metadata['Label'] = {"value": term.label, "isLink": false};
    metadata['Imported From'] = {"value": TermLib.createOntologyTagWithTermURL(term.originalOntology, term.iri, termType), "isLink": false};
    metadata['Also In'] = {"value": TermLib.createAlsoInTags(term, termType), "isLink": false};
    metadata['Synonyms'] = {"value": term.synonyms ? (term.synonyms).join(',\n') : "", "isLink": false}
    metadata['CURIE'] = {"value": term.obo_id, "isLink": false};
    metadata['Term ID'] = {"value": term.short_form, "isLink": false};    
    metadata['Description'] = {"value": TermLib.createTermDiscription(term), "isLink": false};
    metadata['fullIRI'] = {"value": term.iri, "isLink": true};
    metadata['SubClass Of'] = {"value": term.subClassOf, "isLink": false};    
    metadata['Equivalent to'] = {"value": term.eqAxiom, "isLink": false};
    metadata['Used in axiom'] = {"value": term.relations, "isLink": false};
    metadata['Instances'] = {"value": TermLib.createInstancesListForClass(term), "isLink": false};
    
    if(term.annotation){
      // add custom annotation fields. Metadata key can be anything
      for(let key in term.annotation){
        metadata[key] = [];
        let value = [];
        for(let annot of term.annotation[key]){
          value.push(annot);
        }
        metadata[key] = {"value": value.join(',\n'), "isLink": false};
      }    
    }
    
  return metadata;
}



/**
 * Create the metadata for a Property detail table 
 */
export function propertyMetaData(term){    
  let metadata = {};

  metadata['Label'] = {"value": term.label, "isLink": false};
  metadata['Imported From'] =  {"value": TermLib.createOntologyTagWithTermURL(term.originalOntology, term.iri, "property"), "isLink": false};
  metadata['Also In'] = {"value": TermLib.createAlsoInTags(term, "property"), "isLink": false};
  metadata['Synonyms'] = {"value": term.synonyms, "isLink": false};
  metadata['CURIE'] = {"value": term.obo_id, "isLink": false};
  metadata['Term ID'] = {"value": term.short_form, "isLink": false};
  metadata['Description'] = {"value": term.description, "isLink": false};
  metadata['fullIRI'] = {"value": term.iri, "isLink": true};
  metadata['Ontology'] = {"value": term.ontology_name, "isLink": false};

  if(term.annotation){
    for(let key in term.annotation){
      metadata[key] = [];
      let value = [];
      for(let annot of term.annotation[key]){
        value.push(annot);
      }
      metadata[key] = {"value": value.join(',\n'), "isLink": false};
    }
  }

  return metadata;
}






