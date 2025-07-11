import {type} from "os"

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
    label?: string[],
    definition?: Array<any>,
    synonyms?: string,
    ontologyId?: string,
    ontologyPreferredPrefix?: string,
    ontologyIri?: string,
    isObsolete?: boolean,
    definedBy?: string[],
    hasHierarchicalChildren?: boolean,
    hasDirectParents?: boolean,
    shortForm?: string,
    isPreferredRoot?: boolean,
    relations?: string | null,
    eqAxiom?: string | null,
    subClassOf?: string | null,
    isIndividual?: boolean,
    curationStatus?: Array<string> | null,
    parents?: Array<ParentNode>,
    instancesList?: any,
    originalOntology?: string | null,
    alsoIn?: Array<string> | null,
    [key: string]: any
}


export type ParentNode = {
    label?: string,
    iri?: string,
    ontology?: string
}

export type TermListData = {
    results?: Array<OntologyTermDataV2>,
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
    info: Array<string>
}

export  type OntologyPurlValidationRes = {
    valid: boolean,
    reason: string,
}
