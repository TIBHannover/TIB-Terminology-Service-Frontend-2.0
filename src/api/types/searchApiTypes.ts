import { TermMultiSelectOption } from "./common";
import { TsTerm } from "../../concepts";


export type SearchApiInput = {
    searchQuery: string,
    page?: number,
    size?: number,
    selectedOntologies?: string[],
    selectedTypes?: string[],
    selectedCollections?: string[],
    obsoletes?: boolean,
    exact?: boolean,
    includeImported?: boolean,
    isLeaf?: boolean,
    searchInValues?: string[],
    searchUnderIris?: string[],
    searchUnderAllIris?: string[],
    fromOntologyPage?: boolean
};


export type SuggestAndSelectApiInput = {
    searchQuery: string,
    ontologyIds: string[],
    types: string[],
    obsoletes: boolean,
    collectionIds: string[]
    searchUnderIris: string[],
    searchUnderAllIris: string[]
};


export type SearchApiResponse = {
    numElements: number,
    page: number,
    totalPages: number,
    totalElements: number,
    elements: TsTerm[],
    facetFieldsToCounts: SearchResultFacet
}


export type SearchResultFacet = {
    type?: Record<string, number>,
    ontologyId?: Record<string, number>
}


export interface BaseSearchSingleResult {
    id: string,
    iri: string,
    label: string,
    short_form: string,
    ontology_name: string,
    ontology_prefix: string,
    type: string,
};


export type AutoSuggestSingleResult = {
    autosuggest: string,
}


interface SearchSingleResult extends BaseSearchSingleResult {
    obo_id: string,
    description: string[],
    is_defining_ontology: boolean
}


export type SearchSetting = {
    selectedMetaData: Array<string> | [],
    selectedSearchUnderTerms: Array<TermMultiSelectOption> | [],
    selectedSearchUnderAllTerms: Array<TermMultiSelectOption> | [],
}