import {rest} from 'msw';
import listOfCollections from './listOfCollections.json';
import listOfChemOntologies from './nfdi4chemOntologies.json';
import listOfIngOntologies from './nfdi4ingOntologies.json';


const collectionIdsEndPoint = "https://service.tib.eu/ts4tib/api/ontologies/schemavalues";
const collectionStatsEndPoint = "https://service.tib.eu/ts4tib/api/ontologies/getstatisticsbyclassification";
const collectionOntologiesEndPoint = "https://service.tib.eu/ts4tib/api/ontologies/filterby";


export const collectionsListRest = rest.get(collectionIdsEndPoint, (req, res, ctx) => {  
    const schema = req.url.searchParams.get('schema');  
    return res(        
        ctx.status(200, 'Mocked status'),
        ctx.json(listOfCollections),
    );
});


export const collectionStatsRest = rest.get(collectionStatsEndPoint, (req, res, ctx) => {
    const schema = req.url.searchParams.get('schema');
    const collectionName = req.url.searchParams.get('classification');
    let resultJson = {
        "lastUpdated": 0,
        "numberOfOntologies": 0,
        "numberOfTerms": 0,
        "numberOfProperties": 0,
        "numberOfIndividuals": 0,
        "softwareVersion": ""
    };
    if (collectionName === "NFDI4CHEM"){
        resultJson["numberOfOntologies"] = 20;
    }
    else{
        resultJson["numberOfOntologies"] = 30;
    }

    return res(        
        ctx.status(200, 'Mocked status'),
        ctx.json(resultJson),
    );
});


export const collectionOntologiesRest = rest.get(collectionOntologiesEndPoint, (req, res, ctx) => {
    const schema = req.url.searchParams.get('schema');
    const collectionName = req.url.searchParams.get('classification');
    const page = req.url.searchParams.get('page');
    const size = req.url.searchParams.get('size');
    const exclusive = req.url.searchParams.get('exclusive');
    if (collectionName === "NFDI4CHEM"){
        return res(        
            ctx.status(200, 'Mocked status'),
            ctx.json(listOfChemOntologies),
        );
    }
    else{
        return res(        
            ctx.status(200, 'Mocked status'),
            ctx.json(listOfIngOntologies),
        );
    }    
});