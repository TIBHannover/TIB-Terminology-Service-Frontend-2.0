import _ from "lodash";

/**
 * Create the metadata for a class detail table
 * The boolean in each value indicates that the metadata is a link or not.
 */
 export function classMetaData(object){
    let metadata = {
      "Label": [object.label, false],
      "Short Form":  [object.short_form, false],
      "Description": [object.description  ? object.description[0] : "", false],
      // "Definition": [object.annotation ? object.annotation.definition : "", false],
      "Iri": [object.iri, true],
      "Ontology": [object.ontology_name, false],
      "SubClass of" : [ object.parents, false],
      "Relations" : [ object, false],
      "Example Usage": [object.annotation ? object.annotation.example_usage : "", false],
      "Editor Note": [object.annotation ? object.annotation.editor_note : "", false],
      "Is Defined By": [object.annotation ? object.annotation.isDefinedBy : "", false]
    };
    return metadata;
  }


/**
 * Create the metadata for a Property detail table
 * The boolean in each value indicates that the metadata is a link or not.
 */
 export function propertyMetaData(object){
  let metadata = {
    "Label": [object.label, false],
    "Short Form":  [object.short_form, false],
    "Description": [object.description, false],
    "Definition": [object['annotation'] ? object['annotation']['definition source'] : "", false],
    "Iri": [object.iri, true],
    "Ontology": [object.ontology_name, false],
    "Curation Status" : [object['annotation'] ? object['annotation']['has curation status'] : "", false],
    "Editor": [object['annotation'] ? object['annotation']['term editor'] : "", false],
    "Is Defined By": [object['annotation'] ? object['annotation']['isDefinedBy'] : "", false]
  };

  return metadata;
}



/**
   * Format the text. check if a text input is a link to a simple text. 
   * @param {*} text 
   * @param {*} label 
   * @param {*} isLink 
   * @returns 
   */
 export function formatText (label, text, isLink = false) {
  if (text === null || text === '' || typeof(text) === "undefined") {
    return 'null'
  }
  else if (isLink) {
    return (<a href={text} target='_blank' rel="noreferrer">{text}</a>)
  }
  else if (label === "SubClass of"){
    return makeTag(text);
  }
  else if (label === "Relations"){
    return createRelations(text);
  }
  return text
}


/**
 * Create tag for term relations
 */
function makeTag(objectList){
  if(objectList.length === 0){
    return "";
  }
  let tags = [];
  let counter = 0;
  for(let object of objectList){
    tags.push(      
      <div className='node-tag' key={counter}>
        <a className='node-tag-link' href={"/ontologies/" + object['ontology'] + "/terms?iri=" + object['iri']} target="_blank">
          {object['label']}
        </a>
      </div>
    );
    counter ++;
  }
  return tags;
}


/**
 * Create the relations row value to render
 * @param {*} relations 
 */
function createRelations(object){
  if(typeof(object['relations']) !== "undefined" && object['relations'].length === 0){
    return "";
  }
  let groupedRelations = _.groupBy(object['relations'], res => res.relation);  
  let relsToRender = [];
  for(let rel of Object.keys(groupedRelations)){
    if(typeof(rel) !== "undefined" && rel !== "undefined"){
      relsToRender.push(
        <ul>
          <li key={groupedRelations[rel][0]['relation']}>
            <div title="property">
              <a className='node-relation-link' 
                href={"/ontologies/" + object['ontology_name'] + "/props?iri=" + groupedRelations[rel][0]['relationUrl']} 
                target="_blank">
                {rel}
              </a>                  
            </div>        
            <ul>
              {groupedRelations[rel].map(function(value){
                return <li key={value['target']}>
                  <div title="term">
                    <a className='node-relation-link' href={"/ontologies/" + object['ontology_name'] + "/terms?iri=" + value['targetUrl']} target="_blank">
                          {value["target"]}                      
                      </a>
                  </div>                   
                </li>
              })}
            </ul>
          </li>
        </ul>
      );
    }
  }
  return relsToRender;
}