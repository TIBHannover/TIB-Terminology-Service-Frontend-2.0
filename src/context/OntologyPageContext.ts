import { createContext } from "react";
import { TsOntology } from "../concepts";
import { ComponentIdentity } from "../components/Ontologies/OntologyPage/OntologyPage";


type Blueprint = {
  ontology: TsOntology,
  isSkos: boolean,
  lastVisitedIri: { [key: string]: string },
  storeIriForComponent: (iri: string, componentId: ComponentIdentity) => void,
  tabLastStates: { [key: string]: any },
  storeState: (domContent: string, stateObject: any, componentId: ComponentIdentity, iri: string) => void,
  ontoLang: string,
  setOntoLang: React.Dispatch<React.SetStateAction<string>>
  fullScreenMode: boolean,
  handleFullScreen: () => void
}

const blueprint: Blueprint = {
  ontology: new TsOntology({}),
  isSkos: false,
  lastVisitedIri: { "terms": "", "properties": "", "individuals": "", "termList": "" },
  storeIriForComponent: function itStoresIriInOntologyPageComponentForEachTab() { /* sets lastVisitedIri  */ },
  tabLastStates: { "terms": null, "properties": null, "gitIssues": "" },
  storeState: function saveTabStatesToPreventReloadOnTabChange() { /* sets tabLastStates */ },
  ontoLang: "en",
  setOntoLang: function setOntoLang() { },
  fullScreenMode: false,
  handleFullScreen: function handleFullScreen() { }
}



export const OntologyPageContext = createContext(blueprint);