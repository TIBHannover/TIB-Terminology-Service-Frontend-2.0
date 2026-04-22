export type GetDatasetLinksProps = {
    curie?: string,
    ontologyId?: string
    repository?: string,
    page?: number,
    size?: number,
    groupBy?: "dataset" | "term";
}

export type DatasetLinksApiResp = {
    _result: {
        links: Record<string, DatasetLink[]>,
        total: number,
        page: number,
        size: number
    }
}

export type DatasetLink = {
    curie?: string,
    ontology_id?: string
    dataset_title?: string,
    repo_name?: string,
    created_at?: string
}

export type GetDatasetLinkServiceResp = {
    linksMap: Map<string, DatasetLink[]>,
    total: number
}
