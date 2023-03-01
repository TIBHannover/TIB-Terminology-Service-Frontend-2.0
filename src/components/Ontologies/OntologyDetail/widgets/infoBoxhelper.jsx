import _ from "lodash";

/**
 * recursion for multiple creators
 */
function formatCreators(creators){
    let answer = []
  let value = []
  for (let i = 0; i < creators.length; i++) {
    value.push(creators[i])
  }
  answer = value.join(',\n')
  return answer
}

/**
 * Create the metadata for ontology overview table
 * The boolean in each value indicates that the metadata is a link or not.
 */
export function ontologyMetadata(object){
   let metadata = {
      "IRI": [object.config.id, true],
      "Homepage":  [object.config.homepage, true],
      "Issue Tracker":  [object.config.tracker, true],
      "License": [object.config.license.label, false],
      "Creator": [formatCreators(object.config.creators), false],
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

/**
   * Format the text. check if a text input is a link to a simple text. 
   * @param {*} text 
   * @param {*} label 
   * @param {*} isLink 
   * @returns 
   */
export function formatText (object, label, text, isLink = false) {
    if (text === null || text === '' || typeof(text) === "undefined") {
      return 'N/A'
    }
    else if (isLink) {
      return (<a href={text} target='_blank' rel="noreferrer">{text}</a>)
    }
    else if (label === "License"){
      return (<a href={object.config.license.url} target='_blank' rel="noreferrer">{object.config.license.label}</a> );
    }
  
    return text
  }