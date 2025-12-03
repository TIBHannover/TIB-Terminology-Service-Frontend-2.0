import { TsTerm } from "../../concepts";

export type OntologyData = {
  ontologyId?: string,
  iri?: string,
  title?: string,
  label?: string,
  description?: string,
  "http://purl.org/dc/terms/description"?: string,
  preferredPrefix?: string,
  ontologyPurl?: string,
  loaded?: string,
  "http://www.w3.org/2002/07/owl#versionInfo"?: string,
  "http://www.w3.org/2002/07/owl#versionIRI"?: string,
  numberOfClasses?: string,
  numberOfProperties?: string,
  numberOfIndividuals?: string,
  allow_download?: boolean,
  classifications?: [
    { collection: string[] },
    { subject: string[] }
  ],
  homepage?: string,
  tracker?: string,
  License?: {
    label: string,
    url: string
  },
  creator?: string[],
  "http://purl.org/dc/terms/creator"?: string[],
  "http://purl.org/dc/elements/1.1/creator"?: string[],
  importsFrom?: string[],
  isSkos?: boolean,
  [key: string]: any // to support unkown properties returned by api for an ontology.
}


export type OntologyTermData = {
  iri?: string,
  label?: string,
  description?: Array<string>,
  annotation?: any,
  synonyms?: string,
  ontology_name?: string,
  ontology_prefix?: string,
  ontology_iri?: string,
  is_obsolete?: boolean,
  term_replaced_by?: string,
  is_defining_ontology?: boolean,
  has_children?: boolean,
  is_root?: boolean,
  short_form?: string,
  obo_id?: string,
  in_subset?: boolean,
  obo_definition_citation?: string,
  obo_xref?: string,
  obo_synonym?: string,
  is_preferred_root?: boolean,
  relations?: string | null,
  eqAxiom?: string | null,
  subClassOf?: string | null,
  isIndividual?: boolean,
  curationStatus?: Array<string> | null,
  parents?: Array<ParentNode>,
  instancesList?: any,
  originalOntology?: string | null,
  alsoIn?: Array<string> | null,
  _links?: {
    self: {
      href: string
    },
    children?: {
      href: string
    },
    descendants?: {
      href: string
    },
    ancestors?: {
      href: string
    },
    graph?: {
      href: string
    },
    hierarchicalChildren?: {
      href: string
    },
    hierarchicalDescendants?: {
      href: string
    }
  }
}


export type OntologyTermDataV2 = {
  iri?: string,
  curie?: string,
  label?: string[],
  type?: string[],
  definition?: Array<any>,
  synonym?: string[] | { value: string }[],
  ontologyId?: string,
  ontologyPreferredPrefix?: string,
  ontologyIri?: string,
  isObsolete?: boolean,
  appearsIn?: string[],
  definedBy?: string[],
  hasHierarchicalChildren?: boolean,
  hasDirectParents?: boolean,
  shortForm?: string,
  isPreferredRoot?: boolean,
  [key: string]: any
}


export type ParentNode = {
  label?: string,
  iri?: string,
  ontology?: string
}

export type TermListData = {
  results?: Array<TsTerm>,
  totalTermsCount?: number | string
}


export type OntologySuggestionData = {
  username: string,
  email: string,
  reason: string,
  name: string,
  purl: string,
  ontologyFile?: string,
  collection_ids?: string,
  collection_suggestion?: boolean,
  [key: string]: string | boolean | undefined
}


export type OntologyShapeTestResult = {
  error: Array<{
    text: string,
    about: string
  }>,
  info: Array<string>,
  shape_test_failed: boolean,
}

export type OntologyPurlValidationRes = {
  valid: boolean,
  reason: string,
}
