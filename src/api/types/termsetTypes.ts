import { OntologyTermDataV2 } from "./ontologyTypes"


export type TermSet = {
    id: string,
    name: string,
    description?: string,
    creator: string,
    created_at: string,
    updated_at?: string,
    visibility: "me" | "internal" | "public",
    terms: OntologyTermDataV2[]
}
