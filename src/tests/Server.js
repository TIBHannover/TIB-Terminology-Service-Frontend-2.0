import {rest} from 'msw';
import {setupServer} from 'msw/node';
import { func } from 'prop-types';


const ontologyListEndPoint = "https://service.tib.eu/ts4tib/api/ontologies";


export const server = setupServer(
  rest.get(ontologyListEndPoint, (req, res, ctx) => {
    const pageNumber = req.url.searchParams.get('page');
    const pageSize = req.url.searchParams.get('size');
    return res(
        // ctx.delay(1000),
        ctx.status(200, 'Mocked status'),
        ctx.json(createOntologyListRestApiJsonResponse()),
    );
  }),
)




function createOntologyListRestApiJsonResponse(){
    return {
        "page": {
            "size": 20,
            "totalElements": 115,
            "totalPages": 6,
            "number": 0
        },
        "_embedded": {
            "ontologies": [
                {
                    "ontologyId": "abcd",
                    "loaded": "2023-02-02T18:17:17.660+0000",
                    "updated": "2023-02-13T20:26:28.176+0000",
                    "status": "LOADED",
                    "version": null,                    
                    "numberOfTerms": 64,
                    "numberOfProperties": 404,
                    "numberOfIndividuals": 79,
                    "config": {
                        "id": "http://rs.tdwg.org/abcd/terms/",
                        "title": "b title",
                        "namespace": "abcd",
                        "preferredPrefix": "ABCD",
                        "description": "The base ontology of the ABCD Standard.",
                        "classifications": [
                            {
                                "collection": [
                                    "FAIR Data Spaces"
                                ]
                            }
                        ]
                    }
                },
                {
                    "ontologyId": "chebi",
                    "loaded": "2023-01-02T18:17:17.660+0000",
                    "updated": "2023-01-13T20:26:28.176+0000",
                    "status": "LOADED",
                    "version": null,                    
                    "numberOfTerms": 100,
                    "numberOfProperties": 300,
                    "numberOfIndividuals": 70,
                    "config": {
                        "id": "http://rs.tdwg.org/abcd/terms/",
                        "title": "a title",
                        "namespace": "chebi",
                        "preferredPrefix": "CHEBI",
                        "description": "The base ontology of the test Standard.",
                        "classifications": [
                            {
                                "collection": [
                                    "NFDDI4ChEM"
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    };
}