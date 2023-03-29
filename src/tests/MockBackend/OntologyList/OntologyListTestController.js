import {rest} from 'msw';
import OntologyListRestApiJsonResponse from './ListOfOntologies.json';


const ontologyListEndPoint = "https://service.tib.eu/ts4tib/api/ontologies";


export const ontologyListRest = rest.get(ontologyListEndPoint, (req, res, ctx) => {
    const pageNumber = req.url.searchParams.get('page');
    const pageSize = req.url.searchParams.get('size');
    return res(        
        ctx.status(200, 'Mocked status'),
        ctx.json(OntologyListRestApiJsonResponse),
    );
});









