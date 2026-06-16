export type CollectionData = {
  title: string | false;
  description: string;
  ontology_ids: Array<string>;
};

export type CollectionDataResponse = {
  id?: string | number;
  title?: string;
  description?: string | null;
  ontology_ids?: Array<string> | [];
  created_at?: string;
  updated_at?: string | null;
  owner_id?: string | number;
  public?: boolean;
};

export type BioregistryCollection = {
  identifier?: string;
  name?: string;
  description?: string;
  resources?: string[];
  authors?: BioregistryCollectionAuthor[];
  organizations?: BioregistryCollectionOrganization[];
  context?: string;
  references?: string[];
};

type BioregistryCollectionAuthor = {
  name?: string;
  email?: string;
  orcid?: string;
  github?: string;
};

type BioregistryCollectionOrganization = {
  name?: string;
  ror?: string;
  wikidata?: string;
  partnered?: boolean;
};
