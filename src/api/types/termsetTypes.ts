import { OntologyTermDataV2 } from "./ontologyTypes"
import { ApiKey } from "./userTypes";


export type TermSet = {
  id: string,
  name: string,
  description?: string,
  created_at: string,
  creator?: ApiKey,
  updated_at?: string,
  visibility: string,
  terms: OntologyTermDataV2[];
}

export type NewTermSetFormData = {
  name: string,
  description?: string,
  visibility: string,
  terms: OntologyTermDataV2[]
}


export type TermWrapperInSet = {
  iri?: string,
  type?: string,
  json?: OntologyTermDataV2
}
