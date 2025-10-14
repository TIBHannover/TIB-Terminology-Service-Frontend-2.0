import TsClass from "../../concepts/class"

export type OntologyData = {
  ontologyId: string,
  ontologyPurl?: string,
  loaded?: string,
  version?: string,
  fileHash?: string,
  loadAttempts?: number,
  numberOfTerms?: number,
  numberOfProperties?: number,
  numberOfIndividuals?: number,
  config?: {
    id?: string
  },
  _links?: {
    self: {
      href: string
    },
    terms: {
      href: string
    },
    properties: {
      href: string
    },
    individuals: {
      href: string
    }
  }
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
  relations?: string | null, // not part of ols api
  eqAxiom?: string | null, // not part of ols api
  subClassOf?: string | null, // not part of ols api
  isIndividual?: boolean, // not part of ols api
  curationStatus?: Array<string> | null, // not part of ols api
  parents?: Array<ParentNode>, // used anywhere?
  instancesList?: any, // not part of ols api
  originalOntology?: string | null, // not part of ols api
  alsoIn?: Array<string> | null, // not part of ols api
  [key: string]: any
}


export type ParentNode = {
  label?: string,
  iri?: string,
  ontology?: string
}

export type TermListData = {
  results?: Array<TsClass>,
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
