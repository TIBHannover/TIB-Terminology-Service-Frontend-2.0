import { MathFormulaWidget } from "@ts4nfdi/terminology-service-suite";
import { QueryClient, QueryClientProvider } from "react-query";
import TermLib from "../../../../Libs/TermLib";
import Toolkit from "../../../../Libs/Toolkit";
import { TableMetadata } from "../types";
import {
  TsClass,
  TsIndividual,
  TsProperty,
  TsTerm,
  TsSkosTerm,
  ProcessedMathAxiom,
  TsAnnotation,
} from "../../../../concepts";

const annotationKeyMap: Record<string, string> = {
  InChi: "InChI",
  "inchi key string": "InChIKey",
  "smiles string": "SMILES",
};

const mathWidgetApi = "https://api.terminology.tib.eu/api/";
const mathWidgetQueryClient = new QueryClient();

function hasMathMlValue(value: any): boolean {
  if (!value) {
    return false;
  }
  if (typeof value === "string") {
    return /<math[\s>]/i.test(value);
  }
  return false;
}

function createBaseMetadata(term: TsTerm): TableMetadata {
  let metadata: TableMetadata = {};
  metadata["Label"] = { value: term.label, isLink: false };
  metadata["Description"] = {
    value: term.definition ?? term?.annotation?.["definition"]?.value,
    isLink: false,
  };
  if (term.originalOntology !== term.ontologyId) {
    metadata["Imported From"] = {
      value: TermLib.createOntologyTagWithTermURL(
        term.originalOntology,
        term.iri,
        term.type,
      ),
      isLink: false,
    };
  }

  const alsoInContent = TermLib.createAlsoInTags(term);
  if (alsoInContent.length !== 0) {
    metadata["Also In"] = { value: alsoInContent, isLink: false };
  }

  metadata["Synonyms"] = {
    value: term.synonyms ? term.synonyms.join("<br/>") : "",
    isLink: false,
  };
  metadata["CURIE"] = { value: term.curie, isLink: false };
  metadata["Term ID"] = { value: term.shortForm, isLink: false };
  metadata["fullIRI"] = { value: term.iri, isLink: true };
  metadata["Ontology"] = { value: term.ontologyId, isLink: false };
  return metadata;
}

function renderMathRelatedMetadata(
  term: TsTerm,
  metadata: TableMetadata,
  key: string,
  iri?: string,
) {
  let annotation = term.annotation[key];
  metadata[key] = {
    value: (
      <QueryClientProvider client={mathWidgetQueryClient}>
        <MathFormulaWidget
          api={mathWidgetApi}
          iri={term.iri}
          mathProperty={TsTerm.getAnnotationOriginalIri(annotation, key)}
          ontologyId={term.ontologyId}
        />
      </QueryClientProvider>
    ),
    isLink: false,
    iri,
  };
  let mathFormulaAxioms = term.mathFormulaAxioms();
  if (mathFormulaAxioms.length) {
    metadata["in defining formula"] = {
      value: mathFormulaAxioms.map(
        (axiom: ProcessedMathAxiom, index: number) => {
          return (
            <div className="row border-bottom" key={index}>
              <div className="col-md-3">
                <QueryClientProvider client={mathWidgetQueryClient}>
                  <MathFormulaWidget api="" mathML={axiom.mathValue} />
                </QueryClientProvider>
              </div>
              <div className="col-md-4 pt-3">
                <span>
                  {TermLib.createTermUrl({
                    ontology_name: term.ontologyId,
                    termIri: axiom.relationIri,
                    termLabel: axiom.relationLabel,
                    type: "property",
                  })}
                </span>
              </div>
              <div className="col-md-5 pt-3">
                <span>
                  {TermLib.createTermUrl({
                    ontology_name: term.ontologyId,
                    termIri: axiom.targetIri,
                    termLabel: axiom.targetLabel,
                    type: "class",
                  })}
                </span>
              </div>
            </div>
          );
        },
      ),
      isLink: false,
    };
  }
}

function renderAnnotation(term: TsTerm, metadata: TableMetadata) {
  // add custom annotation fields. Metadata key can be anything
  for (let key in term.annotation) {
    const annotation = term.annotation[key] as TsAnnotation;
    if (!annotation) {
      continue;
    }
    if (key === "definition" || key === "has_dbxref") {
      continue;
    }
    let annotKey = key as string;
    if (!annotationKeyMap[annotKey]) {
      annotKey = annotKey.replace(/([a-z])([A-Z])/g, "$1 $2");
      annotKey = annotKey.replaceAll("_", " ");
    } else {
      annotKey = annotationKeyMap[key] ?? (key as string);
    }
    if (hasMathMlValue(annotation.value)) {
      renderMathRelatedMetadata(term, metadata, annotKey, annotation.iri);
      continue;
    }

    if (Array.isArray(annotation.value)) {
      let res: string[] = [];
      annotation.value.map((value: any) => {
        if (typeof value === "object" && value.value) {
          res.push(Toolkit.transformLinksInStringToAnchor(value.value));
        } else {
          res.push(Toolkit.transformLinksInStringToAnchor(value));
        }
      });
      metadata[annotKey] = { value: res, isLink: false, iri: annotation.iri };
    } else if (typeof annotation.value === "object" && annotation.value.value) {
      metadata[annotKey] = {
        value: Toolkit.transformLinksInStringToAnchor(annotation.value.value),
        isLink: false,
        iri: annotation.iri,
      };
    } else {
      metadata[annotKey] = {
        value: Toolkit.transformLinksInStringToAnchor(
          annotation.value as string,
        ),
        isLink: false,
        iri: annotation.iri,
      };
    }
  }
}

/**
 * Create the metadata for a class/individual detail table
 */
export function classMetaData(term: TsClass) {
  let metadata = createBaseMetadata(term);
  metadata["SubClass Of"] = {
    value: TermLib.renderClassStructure(term, term.subClassOf, {
      showAxioms: true,
    }),
    isLink: false,
  };
  metadata["Equivalent to"] = {
    value: TermLib.renderClassStructure(term, term.eqAxiom, {
      showAxioms: true,
    }),
    isLink: false,
  };
  metadata["Disjoint with"] = {
    value: TermLib.renderClassStructure(term, term.disjointWith, {
      showAxioms: true,
    }),
    isLink: false,
  };
  metadata["Used in axiom"] = { value: term.relations, isLink: false };
  metadata["Instances"] = {
    value: TermLib.createInstancesListForClass(term),
    isLink: false,
  };
  metadata["has curation status"] = {
    value: term.curationStatus,
    isLink: false,
  };
  metadata["Rules"] = { value: term.rules, isLink: false };

  if (term.annotation) {
    renderAnnotation(term, metadata);
  }
  const dbXref = term.annotation?.["has_dbxref"]?.value;
  if (dbXref && dbXref.length > 0) {
    const xrefContent = `
        <ul>
            ${dbXref.map((xref: string) => `<li>${xref}</li>`).join("")}
        </ul>
      `;
    metadata["has dbxref"] = {
      value: xrefContent,
      isLink: false,
      iri: TsTerm.DB_XREF_PURL,
    };
  }
  return metadata;
}

export function individualMetadata(term: TsIndividual) {
  let metadata = createBaseMetadata(term);
  if (term.parentClasses) {
    metadata["Instance of"] = { value: term.parentClasses, isLink: false };
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
    metadata["Domain"] = {
      value: TermLib.createListOfClasses(term["domains"]),
      isLink: false,
    };
  }

  if (term["ranges"] && term["ranges"].length !== 0) {
    metadata["Range"] = {
      value: TermLib.createListOfClasses(term["ranges"]),
      isLink: false,
    };
  }
  metadata["has curation status"] = {
    value: term.curationStatus,
    isLink: false,
  };

  if (term.annotation) {
    renderAnnotation(term, metadata);
  }
  return metadata;
}

export function skosTermMetaData(term: TsSkosTerm) {
  let metadata = createBaseMetadata(term);
  metadata["Instances"] = {
    value: TermLib.createInstancesListForClass(term),
    isLink: false,
  };
  metadata["has curation status"] = {
    value: term.curationStatus,
    isLink: false,
  };

  if (term.annotation) {
    renderAnnotation(term, metadata);
  }
  const dbXref = term.annotation["has_dbxref"]?.value;
  if (dbXref && dbXref.length > 0) {
    const xrefContent = `
        <ul>
            ${dbXref.map((xref: string) => `<li>${xref}</li>`).join("")}
        </ul>
      `;
    metadata["has dbxref"] = {
      value: xrefContent,
      isLink: false,
      iri: TsTerm.DB_XREF_PURL,
    };
  }
  return metadata;
}
