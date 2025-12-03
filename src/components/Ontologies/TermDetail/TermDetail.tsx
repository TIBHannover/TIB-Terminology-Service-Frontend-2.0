import { useEffect, useState, useContext } from 'react';
import { TermTabMetadata, TermDetailComPros, RenderTermDetailComProps } from './types';
import NodePageTabConfig from './listOfComponentsTabs.json';
import TermDetailTable from './TermDetailTable/TermDetailTable';
import NoteList from '../Note/NoteList';
import TermApi from '../../../api/term';
import { Link } from 'react-router-dom';
import { getNoteList } from '../../../api/note';
import Graph from '../../common/Graph/Graph';
import { OntologyPageContext } from "../../../context/OntologyPageContext";
import * as SiteUrlParamNames from '../../../UrlFactory/UrlParamNames';
import CommonUrlFactory from '../../../UrlFactory/CommonUrlFactory';
import { AddToTermsetModal } from '../../TermSet/AddTermToSet';
import { TsTerm } from '../../../concepts';



const DETAIL_TAB_ID = 0;
const NOTES_TAB_ID = 1;
const GRAPH_TAB_ID = 2;


const TermDetail = (props: TermDetailComPros) => {
  /*
    This component is responsible for rendering the detail page of a term.
    It contains the term detail table, notes, and graph view.
    It also contains the tab navigation for switching between these components.
    It requires the ontologyPageContext to be available.
  */

  const ontologyPageContext = useContext(OntologyPageContext);

  const [activeTab, setActiveTab] = useState(DETAIL_TAB_ID);
  const [lastRequestedTab, setLastRequestedTab] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [targetTerm, setTargetTerm] = useState<TsTerm>();
  const [notesCount, setNotesCount] = useState(0);

  const showDataAsJsonBtnHref = process.env.REACT_APP_API_URL +
    `/v2/ontologies/${targetTerm?.ontologyId ?? ""}/entities/${encodeURIComponent(encodeURIComponent(targetTerm?.iri ?? ""))}?lang=${ontologyPageContext.ontoLang}`;

  async function fetchTheTargetTerm() {
    let ontologyId = ontologyPageContext.ontology.ontologyId;
    let termApi = new TermApi(ontologyId, encodeURIComponent(props.iri), props.extractKey, ontologyPageContext.ontoLang);
    let term = await termApi.fetchTerm();
    setTargetTerm(term ?? undefined);
  }


  async function fetchNoteCount() {
    try {
      let ontologyId = ontologyPageContext.ontology.ontologyId;
      let countOfNotes = 0;
      if (process.env.REACT_APP_NOTE_FEATURE === "true") {
        let notes = await getNoteList({
          ontologyId: ontologyId,
          type: "",
          pageNumber: 0,
          pageSize: 1,
          targetTerm: targetTerm,
          onlyOntologyOriginalNotes: false
        });
        countOfNotes = notes ? notes['stats']['total_number_of_records'] as number : 0;
      }
      setNotesCount(countOfNotes);
    } catch {
      setNotesCount(0);
    }
  }


  function setTabOnLoad() {
    let url = new URL(window.location.href);
    let requestedTab = url.searchParams.get("subtab");
    let activeTabId = activeTab;
    if (requestedTab !== lastRequestedTab && requestedTab === 'notes') {
      activeTabId = NOTES_TAB_ID;
    } else if (requestedTab !== lastRequestedTab && requestedTab === 'graph') {
      activeTabId = GRAPH_TAB_ID;
    } else if (requestedTab !== lastRequestedTab) {
      activeTabId = DETAIL_TAB_ID;
    }

    if (activeTabId !== activeTab) {
      setActiveTab(activeTabId);
      setWaiting(false);
      setLastRequestedTab(requestedTab ?? "");
    }
  }

  function tabChangeHandler(e: React.MouseEvent<HTMLAnchorElement>) {
    try {
      let selectedTabId = (e.currentTarget.dataset.value ?? DETAIL_TAB_ID) as number;
      setWaiting(true);
      setActiveTab(selectedTabId);
      setWaiting(false);
    } catch (e) {
      setActiveTab(DETAIL_TAB_ID);
      setWaiting(false);
    }
  }


  useEffect(() => {
    setTabOnLoad();
    fetchTheTargetTerm();
    fetchNoteCount();
  }, [props.iri, activeTab]);

  useEffect(() => {
    setWaiting(true);
    fetchTheTargetTerm();
    setWaiting(false);
  }, [ontologyPageContext.ontoLang])


  return (
    <div className='row'>
      <div className='col-sm-12'>
        <div className='term-detail-action-bar'>
          <AddToTermsetModal modalId={"term-in-tree"} term={targetTerm} />
          <a
            href={showDataAsJsonBtnHref}
            target='_blank'
            rel="noreferrer"
            className='btn btn-sm btn-dark download-ontology-btn'
          >
            <i className="bi bi-filetype-json"></i>
            JSON
          </a>
        </div>
        <RenderTermDetailTab
          componentIdentity={props.componentIdentity}
          tabChangeHandler={tabChangeHandler}
          activeTab={activeTab}
          noteCount={notesCount}
        />
        {waiting && <div className="isLoading-small"></div>}
        {!waiting && (activeTab === DETAIL_TAB_ID) &&
          <TermDetailTable
            iri={props.iri}
            componentIdentity={props.componentIdentity}
            extractKey={props.extractKey}
            isIndividual={false}
            node={targetTerm ?? undefined}
          />
        }
        {!waiting && (activeTab === NOTES_TAB_ID) &&
          <NoteList
            key={'notesPage'}
            //@ts-ignore
            term={targetTerm}
            termType={props.typeForNote}
          />
        }
        {!waiting && (activeTab === GRAPH_TAB_ID) &&
          <Graph
            ontologyId={ontologyPageContext.ontology.ontologyId}
            termIri={props.iri}
            isSkos={ontologyPageContext.isSkos}
            componentIdentity={props.componentIdentity}
          />
        }
      </div>
    </div>
  );
}


const RenderTermDetailTab = (props: RenderTermDetailComProps) => {

  const ontologyPageContext = useContext(OntologyPageContext);
  const UrlFactory = new CommonUrlFactory();

  function createTabs() {
    let result = [];
    for (let configItemKey in NodePageTabConfig as TermTabMetadata) {
      //@ts-ignore
      let configObject = NodePageTabConfig[configItemKey];
      let linkUrl = UrlFactory.setParam({
        name: SiteUrlParamNames.SubTabInTermTable,
        //@ts-ignore
        value: NodePageTabConfig[configItemKey]['urlEndPoint'],
        updateUrl: false
      });
      if (configItemKey === "Notes" && process.env.REACT_APP_NOTE_FEATURE !== "true") {
        continue;
      }
      if (configItemKey === "GraphView" && (props.componentIdentity === "props" || (props.componentIdentity === "individuals" && !ontologyPageContext.isSkos))) {
        continue;
      }

      result.push(
        <li className={"nav-item ontology-detail-nav-item stour-tree-table-" + configObject['id']}
          key={configObject['keyForRenderAsTabItem']}>
          <Link
            onClick={props.tabChangeHandler}
            data-value={configObject['tabId']}
            className={(props.activeTab === parseInt(configObject['tabId'])) ? "nav-link active" : "nav-link"}
            to={linkUrl}
          >
            {configObject['tabTitle']}
            {configItemKey === "Notes" ? ` (${props.noteCount})` : ""}
          </Link>
        </li>
      );
    }

    return result;
  }

  return (
    <ul className="nav nav-tabs nav-tabs-node">
      {createTabs()}
    </ul>
  );
}

export default TermDetail;
