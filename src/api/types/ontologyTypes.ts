export type OntologyData = {
    ontologyId: string,
    loaded? : string,
    updated? : string,
    status? : string,
    message? : string,
    version? : string,
    fileHash? : string,
    loadAttempts? : number,
    numberOfTerms: number,
    numberOfProperties: number,
    numberOfIndividuals: number,
    config: object
}