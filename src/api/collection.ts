import {getCallSetting} from "./constants";
import {OntologyData} from "./types/ontologyTypes";
import {CollectionWithItsOntologyListData} from "./types/collectionTypes";
import OntologyLib from "../Libs/OntologyLib";
import OntologyApi from "./ontology";


export function getCollectionStatFromOntoList(ontoList: OntologyData[]): { [key: string]: number } {
    let result: { [key: string]: number } = {};
    for (let onto of ontoList) {
        let collections = OntologyLib.getCollections(onto) as string[];
        if (collections.length === 0) {
            continue;
        }
        for (let col of collections) {
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
export async function getCollectionsAndThierOntologies(): Promise<{ [key: string]: OntologyData[] }> {
    let result: { [key: string]: OntologyData[] } = {};
    let ontoAPI = new OntologyApi({});
    await ontoAPI.fetchOntologyList();
    for (let onto of ontoAPI.list) {
        let collections = OntologyLib.getCollections(onto) as string[];
        if (collections.length === 0) {
            continue;
        }
        for (let col of collections) {
            if (col in result) {
                result[col].push(onto);
            } else {
                result[col] = [onto];
            }
        }
    }
    return result;
}
