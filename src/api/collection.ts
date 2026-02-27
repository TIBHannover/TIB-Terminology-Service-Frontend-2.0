import OntologyApi from "./ontology";
import {TsOntology} from "../concepts";
import {BioregistryCollection} from "./types/collectionTypes";


export function getCollectionStatFromOntoList(ontoList: TsOntology[]): { [key: string]: number } {
    let result: { [key: string]: number } = {};
    for (let onto of ontoList) {
        if (!onto.collections.length) {
            continue;
        }
        for (let col of onto.collections) {
            if (col in result) {
                result[col] += 1;
            } else {
                result[col] = 1;
            }
        }
    }
    return Object.fromEntries(
        Object.entries(result).sort(([, v1], [, v2]) => v2 - v1)
    );
}

export function getSubjectStatFromOntoList(ontoList: TsOntology[]): { [key: string]: number } {
    let result: { [key: string]: number } = {};
    for (let onto of ontoList) {
        if (!onto.subjects.length) {
            continue;
        }
        for (let col of onto.subjects) {
            if (col in result) {
                result[col] += 1;
            } else {
                result[col] = 1;
            }
        }
    }
    return Object.fromEntries(
        Object.entries(result).sort(([, v1], [, v2]) => v2 - v1)
    );
}


/* react query key: allCollectionsWithTheirOntologies  */
export async function getCollectionsAndThierOntologies(): Promise<{ [key: string]: TsOntology[] }> {
    let result: { [key: string]: TsOntology[] } = {};
    let ontoAPI = new OntologyApi({});
    let ontologyList = await ontoAPI.fetchOntologyList();
    for (let onto of ontologyList) {
        if (!onto.collections.length) {
            continue;
        }
        for (let col of onto.collections) {
            if (col in result) {
                result[col].push(onto);
            } else {
                result[col] = [onto];
            }
        }
    }
    return result;
}

export async function getBioregistryCollection(collectionName: string): Promise<BioregistryCollection> {
    type Resp = {
        _result: {
            collections: Record<string, BioregistryCollection>;
        }
    }
    try {
        let result = await fetch(process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/collection/bioregistry_collections/");
        if (!result.ok) {
            return {};
        }
        let collections = await result.json() as Resp;
        for (let colId in collections["_result"]["collections"]) {
            let col = collections["_result"]["collections"][colId];
            if (col.name?.toLowerCase().includes(collectionName.toLowerCase())) {
                return col;
            }
        }
        return {};

    } catch {
        return {};
    }
}
