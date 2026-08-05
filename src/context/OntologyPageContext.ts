import { createContext } from "react";
import { TsOntology } from "../concepts";
import { ComponentIdentity } from "../components/Ontologies/OntologyPage/OntologyPage";
import type { TreeTermNode } from "../components/Ontologies/DataTree/types";

type Blueprint = {
  ontology: TsOntology;
  isSkos: boolean;
  lastVisitedIri: { [key: string]: string };
  storeIriForComponent: (iri: string, componentId: ComponentIdentity) => void;
  tabLastStates: { [key: string]: any };
  storeState: (
    domContent: string,
    stateObject: any,
    componentId: ComponentIdentity,
    iri: string,
  ) => void;
  ontoLang: string;
  setOntoLang: React.Dispatch<React.SetStateAction<string>>;
  fullScreenMode: boolean;
  setFullscreenMode: React.Dispatch<React.SetStateAction<boolean>>;
  handleFullScreen: () => void;
  repositories: string[];
  rootTerms: TreeTermNode[];
  rootProps: TreeTermNode[];
  skosRootIndividuals: TreeTermNode[];
  obsoleteTerms: TreeTermNode[];
  obsoleteProps: TreeTermNode[];
  withPreferredRoots: boolean;
  handlePreferredRootChange: (withPreferredRoots: boolean) => Promise<void>;
  handleObsoleteChange: (showObsolete: boolean) => void;
};

const blueprint: Blueprint = {
  ontology: new TsOntology({}),
  isSkos: false,
  lastVisitedIri: { terms: "", properties: "", individuals: "", termList: "" },
  storeIriForComponent:
    function itStoresIriInOntologyPageComponentForEachTab() {
      /* sets lastVisitedIri  */
    },
  tabLastStates: { terms: null, properties: null, gitIssues: "" },
  storeState: function saveTabStatesToPreventReloadOnTabChange() {
    /* sets tabLastStates */
  },
  ontoLang: "en",
  setOntoLang: function setOntoLang() {},
  fullScreenMode: false,
  setFullscreenMode: function setFullscreenMode() {},
  handleFullScreen: function handleFullScreen() {},
  repositories: [],
  rootTerms: [],
  rootProps: [],
  skosRootIndividuals: [],
  obsoleteTerms: [],
  obsoleteProps: [],
  withPreferredRoots: false,
  handlePreferredRootChange: async function handlePreferredRootChange() {},
  handleObsoleteChange: function handleObsoleteChange() {},
};

export const OntologyPageContext = createContext(blueprint);
