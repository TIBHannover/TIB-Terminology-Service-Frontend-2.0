
/**
 * Create the metadata for a class detail table
 * The boolean in each value indicates that the metadata is a link or not.
 */
 export function classMetaData(object){
    let metadata = {
      "Label": [object.label, false],
      "Short Form":  [object.short_form, false],
      "Description": [object.description, false],
      "Definition": [object.annotation ? object.annotation.definition : "", false],
      "Iri": [object.iri, true],
      "Ontology": [object.ontology_name, false],
      "SubClass of" : "",
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