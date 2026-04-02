export type GetDatasetLinksProps = {
    curie?: string,
    ontologyId?: string
    repository?: string
}

export type DatasetLink = {
    curie?: string,
    ontology_id?: string
    dataset_title?: string,
    repo_name?: string,
    created_at?: string
}