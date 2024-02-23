import { createContext } from "react";


const blueprint = {
    ontology: {},
    isSkos: false,
    storeIriForComponent: function itStoresIriInOntologyPageComponentForEachTab(){},
    storeState: function saveTabStatesToPreventReloadOnTabChange(){}
}


export const OntologyPageContext = createContext(blueprint);