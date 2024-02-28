import { createContext } from "react";


const blueprint = {
    ontology: {},
    isSkos: false,
    lastVisitedIri: {"terms": "", "properties": "", "individuals": "", "termList": ""},
    storeIriForComponent: function itStoresIriInOntologyPageComponentForEachTab(){ /* sets lastVisitedIri  */ },
    tabLastStates: {"terms": null, "properties": null, "gitIssues": ""},
    storeState: function saveTabStatesToPreventReloadOnTabChange(){ /* sets tabLastStates */ }
}


export const OntologyPageContext = createContext(blueprint);