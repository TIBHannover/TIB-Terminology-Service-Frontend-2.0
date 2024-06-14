export type OntologyData = {
    ontologyId: string,
    loaded? : string,
    updated? : string,
    status? : string,
    message? : string,
    version? : string,
    fileHash? : string,
    loadAttempts? : number,
    numberOfTerms?: number,
    numberOfProperties?: number,
    numberOfIndividuals?: number,
    config?: object,
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
    iri: string,
    label: string,
    description?: Array<string>,
    annotations?: any,
    synonyms?: string,
    ontology_name: string,
    ontology_prefix: string,
    ontology_iri: string,
    is_obsolete: boolean,
    term_replaced_by?: string,
    is_defining_ontology: boolean,
    has_children: boolean,
    is_root: boolean,
    short_form: string,
    obo_id?: string,
    in_subset?: boolean,
    obo_definition_citation?: string,
    obo_xref?: string,
    obo_synonym?: string,
    is_preferred_root?: boolean,
    _links: {
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