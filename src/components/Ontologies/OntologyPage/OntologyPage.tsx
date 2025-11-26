import { useState, useEffect } from 'react';
import DataTree from '../DataTree/DataTree';
import SkosApi from '../../../api/skos';
import OntologyApi from '../../../api/ontology';
import IndividualsList from '../IndividualList/IndividualList';
import TermList from '../TermList/TermList';
import OntologyOverview from '../OntologyOverview/OntologyOverview';
import ontologyPageTabConfig from './listOfComponentsAsTabs.json';
import { OntologyPageTabs, OntologyPageHeadSection } from './helpers';
import { getNoteList } from '../../../api/note';
import Toolkit from '../../../Libs/Toolkit';
import IssueList from '../IssueList/IssueList';
import NoteList from '../Note/NoteList';
import '../../layout/ontologyHomePage.css';
import '../../layout/note.css';
import { OntologyPageContext } from '../../../context/OntologyPageContext';
import CommonUrlFactory from '../../../UrlFactory/CommonUrlFactory';
import * as SiteUrlParamNames from '../../../UrlFactory/UrlParamNames';
import ChangesTimeline from "../../Ondet/ChangesTimeline";
import { RouteComponentProps } from 'react-router';
import { TsOntology, TsClass, TsProperty, TsSkosTerm } from '../../../concepts';


const OVERVIEW_TAB_ID = 0;
const TERM_TREE_TAB_ID = 1;
const PROPERTY_TREE_TAB_ID = 2;
const INDIVIDUAL_LIST_TAB_ID = 3;
const TERM_LIST_TAB_ID = 4;
const NOTES_TAB_ID = 5;
const GIT_ISSUE_LIST_ID = 6;
const ONDET_TAB_ID = 7;

const TAB_ID_MAP_TO_TAB_ENDPOINT: Record<string, number> = {
  "": OVERVIEW_TAB_ID,
  "terms": TERM_TREE_TAB_ID,
  "props": PROPERTY_TREE_TAB_ID,
  "individuals": INDIVIDUAL_LIST_TAB_ID,
  "termList": TERM_LIST_TAB_ID,
  "notes": NOTES_TAB_ID,
  "gitpanel": GIT_ISSUE_LIST_ID,
  "ondet": ONDET_TAB_ID
}

type CmpPropp = RouteComponentProps<{ ontologyId: string, tab?: string }>;
export type ComponentIdentity = "terms" | "properties" | "individuals";


const OntologyPage = (props: CmpPropp) => {

  /*
    This component holds the entire ontology page.

      - Fetches Ontology data including its root terms (classes), properties, individuals, and obsoletes
      - Renders Tabs (Each Tab is a child component)
      - Stores the last state and iri for each tab --> used when a user changes tabs.

    Context:
      The component provides its Context for the children. Look at src/context/OntologyPageContext.js

  */


  const UrlFactory = new CommonUrlFactory();
  let language = UrlFactory.getParam({ name: SiteUrlParamNames.Lang }) || localStorage.getItem("language") || "en";

  const [lastRequestedTab, setLastRequestedTab] = useState("");
  const [ontology, setOntology] = useState<TsOntology | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(OVERVIEW_TAB_ID);
  const [rootTerms, setRootTerms] = useState<TsClass[]>([]);
  const [skosRootIndividuals, setSkosRootIndividuals] = useState([]);
  const [rootProps, setRootProps] = useState<TsProperty[]>([]);
  const [obsoleteTerms, setObsoleteTerms] = useState<TsClass[]>([]);
  const [obsoleteProps, setObsoleteProps] = useState<TsProperty[]>([]);
  const [waiting, setWaiting] = useState(false);
  const [lastIrisHistory, setLastIrisHistory] = useState<{ [key: string]: string }>({ "terms": "", "properties": "", "individuals": "", "termList": "" });
  const [lastTabsStates, setLastTabsStates] = useState<{ [key: string]: any }>({ "terms": null, "properties": null, "gitIssues": "" });
  const [notesCount, setNotesCount] = useState(0);
  const [ontoLang, setOntoLang] = useState<string>(language);
  window.localStorage.setItem("language", ontoLang);


  async function loadOntologyData() {
    let ontologyId = props.match.params.ontologyId;
    let ontologyApi = new OntologyApi({ ontologyId: ontologyId ?? "", lang: ontoLang });
    let ontology = await ontologyApi.fetchOntology();
    if (!ontology) {
      setError("Can not load this ontology");
      return true;
    }
    let skosIndividuals: TsSkosTerm[] = [];
    if (ontology.isSkos) {
      let skosApi = new SkosApi({
        ontologyId: ontologyId,
        iri: "",
        skosRoot: ontology.ontologyJsonData?.['skosRoot'],
        lang: ontoLang
      });
      skosIndividuals = await skosApi.fetchRootConcepts();
    }

    setOntology(ontology);
    setObsoleteTerms(ontology.obsoleteClasses);
    setObsoleteProps(ontology.obsoleteProperties);
    setRootTerms(ontology.rootClasses);
    setRootProps(ontology.rootProperties);
    //@ts-ignore
    setSkosRootIndividuals(skosIndividuals);
  }


  async function setCountOfNotes() {
    let countOfNotes = 0;
    let ontologyId = props.match.params.ontologyId;
    if (process.env.REACT_APP_NOTE_FEATURE === "true") {
      let notesList = await getNoteList({
        ontologyId: ontologyId,
        pageNumber: 0,
        pageSize: 1,
        onlyOntologyOriginalNotes: false,
        withoutLabelFetch: true
      });
      countOfNotes = notesList?.stats.total_number_of_records ? Number(notesList.stats.total_number_of_records) : 0;
    }
    setNotesCount(countOfNotes);
  }


  function setTabOnLoad() {
    let requestedTab = props.match.params.tab ?? "";
    if (requestedTab === lastRequestedTab) {
      return true;
    }

    let activeTabId = TAB_ID_MAP_TO_TAB_ENDPOINT[requestedTab] ? TAB_ID_MAP_TO_TAB_ENDPOINT[requestedTab] : OVERVIEW_TAB_ID;
    let irisHistory = { ...lastIrisHistory };
    if (requestedTab in irisHistory) {
      irisHistory[requestedTab] = UrlFactory.getIri() ?? "";
    }

    setActiveTab(activeTabId);
    setWaiting(false);
    setLastRequestedTab(requestedTab);
    setLastIrisHistory(irisHistory);
  }


  function tabChange(e: React.MouseEvent<HTMLAnchorElement>) {
    try {
      let selectedTabId = e.currentTarget.dataset.value ?? OVERVIEW_TAB_ID;
      setWaiting(true);
      setActiveTab(Number(selectedTabId));
      setWaiting(false);
    } catch (e) {
      setActiveTab(OVERVIEW_TAB_ID);
      setWaiting(false);
    }
  }


  function storeIriForComponent(iri: string, componentId: ComponentIdentity) {
    /**
     * Store the last input iri for tabs
     */
    let irisHistory = { ...lastIrisHistory };
    irisHistory[componentId] = iri;
    setLastIrisHistory(irisHistory);
  }


  function tabsStateKeeper(domContent: string, stateObject: any, componentId: ComponentIdentity, iri: string) {
    /**
     * Stores the last state in for tabs components to prevent reload on tab change
     */
    let tabsStates = { ...lastTabsStates };
    tabsStates[componentId] = { "html": domContent, "states": stateObject, "lastIri": iri };
    setLastTabsStates(tabsStates);
  }


  useEffect(() => {
    loadOntologyData();
    setCountOfNotes();
    setTabOnLoad();
  }, []);

  useEffect(() => {
    if (ontoLang !== UrlFactory.getParam({ name: SiteUrlParamNames.Lang })) {
      UrlFactory.setParam({ name: SiteUrlParamNames.Lang, value: ontoLang });
      window.localStorage.setItem("language", ontoLang as string);
      setRootTerms([]);
      setRootProps([]);
      setSkosRootIndividuals([]);
      setLastTabsStates({ "terms": null, "properties": null, "gitIssues": "" });
      loadOntologyData();
    }
  }, [ontoLang]);


  if (error) {
    return <div>Something went wrong. Please try later.</div>
  } else if (!ontology) {
    return <div className="is-loading-term-list isLoading"></div>
  } else {
    const contextData = {
      ontology: ontology,
      isSkos: ontology.isSkos,
      storeIriForComponent: storeIriForComponent,
      storeState: tabsStateKeeper,
      tabLastStates: lastTabsStates,
      lastVisitedIri: lastIrisHistory,
      ontoLang: ontoLang,
      setOntoLang: setOntoLang
    };

    return (
      <div className='justify-content-center ontology-page-container' id="content-for-fullscreen">
        {Toolkit.createHelmet(ontology.ontologyId)}
        <OntologyPageContext.Provider value={contextData}>
          <div className='col-sm-12'>
            <div className='row'>
              <div className='col-sm-1'>
                <OntologyPageTabs
                  tabMetadataJson={ontologyPageTabConfig}
                  tabChangeHandler={tabChange}
                  activeTabId={activeTab}
                  noteCounts={notesCount}
                />
              </div>
              <div className='col-sm-10'>
                <OntologyPageHeadSection />
                <div className='row'>
                  <div className='col-sm-12 rounded-2 bg-white p-4'>
                    {waiting && <i className="fa fa-circle-o-notch fa-spin"></i>}
                    {!waiting && (activeTab === OVERVIEW_TAB_ID) &&
                      <OntologyOverview />
                    }
                    {!waiting && (activeTab === TERM_TREE_TAB_ID) &&
                      <DataTree
                        rootNodes={rootTerms}
                        obsoleteTerms={obsoleteTerms}
                        componentIdentity={'terms'}
                        rootNodesForSkos={skosRootIndividuals}
                        key={'termTreePage'}
                      />
                    }

                    {!waiting && (activeTab === PROPERTY_TREE_TAB_ID) &&
                      <DataTree
                        rootNodes={rootProps}
                        obsoleteTerms={obsoleteProps}
                        componentIdentity={'properties'}
                        key={'propertyTreePage'}
                        rootNodesForSkos={skosRootIndividuals}
                      />
                    }
                    {!waiting && (activeTab === INDIVIDUAL_LIST_TAB_ID) &&
                      <IndividualsList
                        rootNodes={rootTerms}
                        rootNodesForSkos={skosRootIndividuals}
                        componentIdentity={'individuals'}
                        key={'individualsTreePage'}
                      />
                    }
                    {!waiting && (activeTab === TERM_LIST_TAB_ID) &&
                      <TermList componentIdentity={'termList'} key={'termListPage'} />
                    }
                    {!waiting && (activeTab === NOTES_TAB_ID) &&
                      <NoteList key={'notesPage'} />
                    }
                    {!waiting && (activeTab === GIT_ISSUE_LIST_ID) &&
                      <IssueList componentIdentity={'gitIssues'} key={'gitIssueList'} />
                    }

                    {
                      !waiting && activeTab === ONDET_TAB_ID && (() => {
                        const errorMessage = <p><h5>Ontology is not in OnDeT, since it is not hosted on Github or Gitlab</h5></p>;

                        try {
                          const fileUrl = new URL(ontology.versionedUrl);

                          return (fileUrl.host === "raw.githubusercontent.com" || fileUrl.host === "gitlab.com")
                            ? <ChangesTimeline ontologyRawUrl={ontology.versionedUrl} />
                            : errorMessage;
                        } catch (error) {
                          return errorMessage;
                        }
                      })()
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </OntologyPageContext.Provider>
      </div>
    )
  }

}


export default OntologyPage;
