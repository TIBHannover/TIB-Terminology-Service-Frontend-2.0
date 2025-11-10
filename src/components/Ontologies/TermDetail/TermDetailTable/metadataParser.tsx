import TermLib from "../../../../Libs/TermLib";
import Toolkit from "../../../../Libs/Toolkit";
import { TableMetadata } from "../types";
import { TsClass, TsIndividual, TsProperty, TsTerm } from "../../../../concepts";




function createBaseMetadata(term: TsTerm): TableMetadata {
  let metadata: TableMetadata = {}
  metadata['Label'] = { "value": term.label, "isLink": false };
  metadata['Description'] = {
    "value": term.definition ?? term?.annotation?.definition,
    "isLink": false
  };
  if (term.originalOntology !== term.ontologyId) {
    metadata['Imported From'] = {
      "value": TermLib.createOntologyTagWithTermURL(term.originalOntology, term.iri, term.type),
      "isLink": false
    };
  }

  const alsoInContent = TermLib.createAlsoInTags(term);
  if (alsoInContent.length !== 0) {
    metadata['Also In'] = { "value": alsoInContent, "isLink": false };
  }

  metadata['Synonyms'] = { "value": term.synonyms ? (term.synonyms).join('<br/>') : "", "isLink": false };
  metadata['CURIE'] = { "value": term.curie, "isLink": false };
  metadata['Term ID'] = { "value": term.shortForm, "isLink": false };
  metadata['fullIRI'] = { "value": term.iri, "isLink": true };
  metadata['Ontology'] = { "value": term.ontologyId, "isLink": false };
  return metadata;
}


function renderAnnotation(term: TsTerm, metadata: TableMetadata) {
  // add custom annotation fields. Metadata key can be anything
  for (let key in term.annotation) {
    if (key === 'definition' || key === "has_dbxref") {
      continue;
    }
    if (Array.isArray(term.annotation[key])) {
      let res: string[] = [];
      term.annotation[key].map((value: any) => {
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



/**
 * Create the metadata for a class/individual detail table
 */
export function classMetaData(term: TsClass) {
  let metadata = createBaseMetadata(term);
  metadata['SubClass Of'] = { "value": term.subClassOf, "isLink": false };
  metadata['Equivalent to'] = { "value": term.eqAxiom, "isLink": false };
  metadata['Disjoint with'] = { "value": term.disjointWith, "isLink": false };
  metadata['Used in axiom'] = { "value": term.relations, "isLink": false };
  metadata['Instances'] = { "value": TermLib.createInstancesListForClass(term), "isLink": false };
  metadata['has curation status'] = { "value": term.curationStatus, "isLink": false };

  if (term.annotation) {
    renderAnnotation(term, metadata);
  }
  if (term.annotation["has_dbxref"] && term.annotation["has_dbxref"].length > 0) {
    const xrefContent = `
        <ul>
            ${term.annotation["has_dbxref"].map((xref: string) => `<li>${xref}</li>`).join('')}
        </ul>
      `;
    metadata["has_dbxref"] = { value: xrefContent, isLink: false };
  }
  return metadata;
}


export function individualMetadata(term: TsIndividual) {
  let metadata = createBaseMetadata(term);
  if (term.parentClasses) {
    metadata['Instance of'] = { "value": term.parentClasses, "isLink": false };
  }

  if (term.annotation) {
    renderAnnotation(term, metadata);
  }
  return metadata;
}


/**
 * Create the metadata for a Property detail table
 */
export function propertyMetaData(term: TsProperty) {
  let metadata = createBaseMetadata(term);
  if (term["domains"] && term["domains"].length !== 0) {
    metadata['Domain'] = { "value": TermLib.createListOfClasses(term["domains"]), "isLink": false };
  }

  if (term["ranges"] && term["ranges"].length !== 0) {
    metadata['Range'] = { "value": TermLib.createListOfClasses(term["ranges"]), "isLink": false };
  }
  metadata['has curation status'] = { "value": term.curationStatus, "isLink": false };

  if (term.annotation) {
    renderAnnotation(term, metadata);
  }

  return metadata;
}






