import { A } from "msw/lib/glossary-de6278a9";
import { TermMultiSelectOption } from "./common";



export type SearchApiInput = {
    searchQuery: string,
    page: number,
    size: number,
    selectedOntologies: string[],
    selectedTypes: string[],
    selectedCollections: string[],
    obsoletes: boolean,
    exact: boolean,
    isLeaf: boolean,
    searchInValues: string[],
    searchUnderIris: string[],
    searchUnderAllIris: string[]
};
  
  
export type SuggestAndSelectApiInput = {
    searchQuery: string,
    ontologyIds: string[],
    types: string[],
    obsoletes: boolean,
    collectionIds: string[]
};
  
  
  
export type SearchApiResponse ={
    responseHeader: any,
    response: {
        numFound: number,
        start: number,
        docs: SearchSingleResult[] 
    },
    highlighting: any,
    facet_counts: {
      facet_fields: any,
      facet_ranges: any,
      facet_queries: any,
      facet_dates: any,
      facet_intervals: any,
      facet_heatmaps: any
    },
    expanded: any
};
  

export interface BaseSearchSingleResult{
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


interface SearchSingleResult extends BaseSearchSingleResult{
    obo_id: string,
    description: string[],
    is_defining_ontology: boolean
}


export type SearchSetting = {
    selectedMetaData: Array<string>|[],
    selectedSearchUnderTerms: Array<TermMultiSelectOption>|[],
    selectedSearchUnderAllTerms: Array<TermMultiSelectOption>|[],
}