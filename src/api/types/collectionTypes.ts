export type CollectionData ={
    title:string,
    description:string,
    ontology_ids:Array<string>
}


export type CollectionDataResponse ={
    id:string|number,
    title:string,
    description:string|null,
    ontology_ids:Array<string>|[],
    created_at:string,
    updated_at:string|null,
    owner_id:string|number,
    public:boolean
}


export type CollectionWithItsOntologyListData = {
    collection?: string,
    ontologies?: Array<{
      ontologyId?: string,
      purl?: string
    }>
  }
