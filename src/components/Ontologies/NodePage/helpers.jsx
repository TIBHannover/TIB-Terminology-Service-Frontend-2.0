import _ from 'lodash';
import Toolkit from "../../common/Toolkit";


/**
 * Create the metadata for a class detail table
 * The boolean in each value indicates that the metadata is a link or not.
 */
 export function classMetaData(object){
    let metadata = {
      "Label": [object.label, false],
      "Synonyms": [object.synonyms ? (object.synonyms).join(',\n') : "", false],
      "CURIE":  [object.obo_id, false],
      "Term ID":  [object.short_form, false],
      "Description": [object.description  ? object.description[0] : "", false],
      "fullIRI": [object.iri, true], 
      "SubClass Of": [object.subClassOf, false]    
    }
    
    if(object.eqAxiom !== "N/A"){
      metadata['Equivalent to'] = [object.eqAxiom, false];
    }
    
    if(formatText("Used in axiom", object.relations, false) !== "N/A" && formatText("Used in axiom", object.relations, false).length !== 0){
      metadata['Used in axiom'] = [object.relations, false];
    }

    if(object.instancesList &&  object.instancesList.length !== 0){
      metadata['Instances'] = [object.instancesList, false];
    }

    if(object.obo_definition_citation){
      let result = [];
      for(let cite of object.obo_definition_citation){
        result.push(
          <div>
            {cite['definition']}
            <br/>
             [<span className="node-metadata-label">Reference</span>:  <a href={cite['oboXrefs'][0]['url']} target="_blank">{cite['oboXrefs'][0]['url']}</a>]
          </div>
        )
      }
      metadata['Description'] = [result, false];
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
    
    if(object.type && object.isIndividual){
      metadata['Type'] = [];
      let typeMtadataValue = [];
      for(let type of object.type){
        typeMtadataValue.push(
          <span>
            <a href={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + type['ontology_name'] + '/terms?iri=' + type['iri']} target={"_blank"}>
              {type['label']}
            </a>
            <br></br>
          </span>        
        );
      }
      metadata['Type'] = [typeMtadataValue, false];
    }

    if(object.isIndividual && object.description){
      // individual description structure is different
      metadata['Description'][0] = [];      
      for(let desc of object.description){
        metadata['Description'][0].push(<p>{desc}</p>);
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
    "Synonyms": [object.synonyms, false],
    "CURIE":  [object.obo_id, false],
    "Term ID":  [object.short_form, false],
    "Description": [object.description, false],    
    "fullIRI": [object.iri, true],
    "Ontology": [object.ontology_name, false] 
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
  else if (tableLabel === "Instances"){    
    return <ul>{createInstancesList(text)}</ul>;
  }

  return Toolkit.transformStringOfLinksToAnchors(text);
}



function createInstancesList(instancesList){
  let result = [];  
  for(let instance of instancesList){
    let individualUrl = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + instance['ontology_name'] + "/individuals?iri=" + encodeURIComponent(instance['iri']);
    result.push(
      <li>        
        <a href={individualUrl} target='_blank'>
          {instance['label']}
        </a>
      </li>
    );
  }  
  return result;
}





