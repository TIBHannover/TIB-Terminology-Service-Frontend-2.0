import OntologyApi from "./ontology";
import { TsOntology } from "../concepts";


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
