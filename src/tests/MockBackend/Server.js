import {setupServer} from 'msw/node';
import {ontologyListRest} from './OntologyList/OntologyListTestController';



export const server = setupServer(
  ontologyListRest,
)




