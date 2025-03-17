
export type OndetData = {
    markdown: MongoDBDocument;
    difference: Difference;
    gitDiff: string;
}

type MongoDBDocument = {
    file?: string;
    error?: string;
}

type Difference = {
    changes: Array<string>;
    error?: string;
}