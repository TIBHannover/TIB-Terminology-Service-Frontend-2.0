import _ from "lodash";

/**
 * Create the metadata for ontology overview table
 * The boolean in each value indicates that the metadata is a link or not.
 */
export function ontologyMetadata(object){
   let metadata = {
      "IRI": [object.config.id, true],
      "Homepage":  [object.config.homepage, true],
      "Issue Tracker":  [object.config.tracker, true],
      "License": [object.config.license.label, true],
      "Creator": [object.config.creators, false],
   }

   if(object.config.annotation){
    for(let key in object.config.annotation){
      metadata[key] = [];
      let value = [];
      for(let annot of object.config.annotation[key]){
        value.push(annot);
      }
      metadata[key] = [value.join(',\n'), false];
    }
  }
  return metadata;
}