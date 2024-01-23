import _ from 'lodash';
import Toolkit from '../../../Libs/Toolkit';
import TermLib from '../../../Libs/TermLib';


/**
 * Create the metadata for a class/individual detail table
 * The boolean in each value indicates that the metadata is a link or not.
 */
 export function classMetaData(term, termType){
    let metadata = {}
    metadata['Label'] = [term.label, false];
    metadata['Imported From'] = [TermLib.createOntologyTagWithTermURL(term.originalOntology, term.iri, termType), false];
    metadata['Also In'] = [TermLib.createAlsoInTags(term, termType), false];
    metadata['Synonyms'] = [term.synonyms ? (term.synonyms).join(',\n') : "", false];
    metadata['CURIE'] = [term.obo_id, false];
    metadata['Term ID'] = [term.short_form, false];    
    metadata['Description'] = [TermLib.createTermDiscription(term), false];
    metadata['fullIRI'] = [term.iri, true];
    metadata['SubClass Of'] = [term.subClassOf, false];    
    metadata['Equivalent to'] = [term.eqAxiom, false];
    metadata['Used in axiom'] = [term.relations, false];
    metadata['Instances'] = [TermLib.createInstancesListForClass(term), false];
    
    if(term.annotation){
      // add custom annotation fields. Metadata key can be anything
      for(let key in term.annotation){
        metadata[key] = [];
        let value = [];
        for(let annot of term.annotation[key]){
          value.push(annot);
        }
        metadata[key] = [value.join(',\n'), false];
      }    
    }
    
  return metadata;
}



/**
 * Create the metadata for a Property detail table
 * The boolean in each value indicates that the metadata is a link or not.
 */
export function propertyMetaData(term){    
  let metadata = {};

  metadata['Label'] = [term.label, false];
  metadata['Imported From'] = [TermLib.createOntologyTagWithTermURL(term.originalOntology, term.iri, "property"), false];
  metadata['Also In'] = [TermLib.createOntologyTagWithTermURL(term, term.iri, "property"), false];
  metadata['Synonyms'] = [term.synonyms, false];
  metadata['CURIE'] = [term.obo_id, false];
  metadata['Term ID'] = [term.short_form, false];
  metadata['Description'] = [term.description, false];
  metadata['fullIRI'] = [term.iri, true];
  metadata['Ontology'] = [term.ontology_name, false];

  if(term.annotation){
    for(let key in term.annotation){
      metadata[key] = [];
      let value = [];
      for(let annot of term.annotation[key]){
        value.push(annot);
      }
      metadata[key] = [value.join(',\n'), false];
    }
  }

  return metadata;
}


export function formatText (tableLabel, text, isLink = false) {    
  if (text === null || text === '' || typeof(text) === "undefined") {
    return 'N/A'
  }  
  else if (isLink) {
    return (<a href={text} target='_blank' rel="noreferrer">{text}</a>)
  }
  else if (["Used in axiom", "Equivalent to", "SubClass Of"].includes(tableLabel)){        
    return (<span  dangerouslySetInnerHTML={{ __html: text }}></span>)
  }    
  else if (["Type", "Description", "Imported From", "Also In", "Instances"].includes(tableLabel)){
    return text;
  }
  
  let formatedText = Toolkit.transformLinksInStringToAnchor(text);    
  return (<span  dangerouslySetInnerHTML={{ __html: formatedText }}></span>)
}






