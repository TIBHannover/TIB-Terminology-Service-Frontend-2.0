import _ from 'lodash';
import Toolkit from "../../common/Toolkit";
import { Link } from 'react-router-dom';


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


export function formatText (label, text, isLink = false) {
  if (text === null || text === '' || typeof(text) === "undefined") {
    return 'N/A'
  }
  else if (isLink) {
    return (<a href={text} target='_blank' rel="noreferrer">{text}</a>)
  }
  else if (label === "Used in axiom"){
    return (<span  dangerouslySetInnerHTML={{ __html: text }}></span>)
  }
  else if (label === "Equivalent to"){
    return (<span  dangerouslySetInnerHTML={{ __html: text }}></span>)
  }
  else if (label === "SubClass Of"){
    return (<span  dangerouslySetInnerHTML={{ __html: text }}></span>)
  }  
  else if (label === "Instances"){    
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

export function renderOntologyPageTabs(tabMetadataJson, tabChangeHandler, ontologyId, activeTabId){
  let result = [];
  for(let configItemKey in tabMetadataJson){
      let configObject = tabMetadataJson[configItemKey];
      result.push(
          <li className="nav-item ontology-detail-nav-item" key={configObject['keyForRenderAsTabItem']}>
              <Link 
                  onClick={tabChangeHandler} 
                  data-value={configObject['tabId']} 
                  className={(activeTabId === parseInt(configObject['tabId'])) ? "nav-link active" : "nav-link"} 
                  to={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + ontologyId + configObject['urlEndPoint']}>
              
                  {configObject['tabTitle']}
              </Link>
          </li>
      );
  }

  return result;
}


/**
 * Create the relations row value to render
 * @param {*} relations 
 */
function createRelations(object){
  if(typeof(object['relations']) === "undefined"){
    return "N/A";
  }
  if(object['relations'].length === 0){
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


