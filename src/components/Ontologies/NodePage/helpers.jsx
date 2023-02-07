import _ from "lodash";

/**
 * Create the metadata for a class detail table
 * The boolean in each value indicates that the metadata is a link or not.
 */
 export function classMetaData(object){
    let metadata = {
      "Label": [object.label, false],
      "CURIE":  [object.obo_id, false],
      "Description": [object.description  ? object.description[0] : "", false],
      "fullIRI": [object.iri, true],
      "Synonyms": [object.synonyms, false],
      "Equivalent to": [object.eqAxiom, false],
      "SubClass Of" : [ object.subClassOf, false],
      "Relations" : [ object, false]
    }
    
    if(object.annotation){
      for(let key in object.annotation){
        metadata[key] = [];
        let value = [];
        for(let annot of object.annotation[key]){
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
 export function propertyMetaData(object){
  let metadata = {
    "Label": [object.label, false],
    "abbreviatedIRI":  [object.short_form, false],
    "Description": [object.description, false],    
    "fullIRI": [object.iri, true],
    "Ontology": [object.ontology_name, false],
    "Synonyms": [object.synonyms, false]
  };

  if(object.annotation){
    for(let key in object.annotation){
      metadata[key] = [];
      let value = [];
      for(let annot of object.annotation[key]){
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
 export function formatText (label, text, isLink = false) {
  if (text === null || text === '' || typeof(text) === "undefined") {
    return 'N/A'
  }
  else if (isLink) {
    return (<a href={text} target='_blank' rel="noreferrer">{text}</a>)
  }
  else if (label === "Synonyms"){
    return synonymsTag(text);
  }
  else if (label === "Relations"){
    return createRelations(text);
  }
  else if (label === "Equivalent to"){
    return (<span  dangerouslySetInnerHTML={{ __html: text }}></span>)
  }
  else if (label === "SubClass Of"){
    return (<span  dangerouslySetInnerHTML={{ __html: text }}></span>)
  }

  return text
}

/**
 * Create tag for the synonyms relation
 */
function synonymsTag(objectList){
  if(objectList.length === 0){
    return "N/A";
  }
  let synTags = [];
  let counter = 0;
  for(let object of objectList){
    synTags.push(
      <div className='synonyms-tag' key={counter}>
        <div className="synonyms-button" >
          {object}
        </div>
      </div>
    );
    counter ++;
  }
  return synTags;
}


/**
 * Create tag for the subClass relation
 */
function makeTag(objectList){
  if(objectList.length === 0){
    return "N/A";
  }
  let tags = [];
  let counter = 0;
  for(let object of objectList){
    tags.push(      
      <div className='node-tag' key={counter}>
        <a className='btn term-button' href={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + object['ontology'] + "/terms?iri=" + object['iri']} target="_blank">
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
    return "N/A";
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
                href={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + object['ontology_name'] + "/props?iri=" + groupedRelations[rel][0]['relationUrl']} 
                target="_blank">
                {rel}
              </a>                  
            </div>        
            <ul>
              {groupedRelations[rel].map(function(value){
                return <li key={value['target']}>
                  <div title="term">
                    <a className='node-relation-link' href={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + object['ontology_name'] + "/terms?iri=" + value['targetUrl']} target="_blank">
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