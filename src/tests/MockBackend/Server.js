import {setupServer} from 'msw/node';
import {ontologyListRest} from './OntologyList/OntologyListTestController';
import {collectionsListRest, collectionStatsRest, collectionOntologiesRest} from './Collections/CollectionTestController';



export const server = setupServer(
  ontologyListRest,
  collectionsListRest,
  collectionStatsRest,
  collectionOntologiesRest
)




