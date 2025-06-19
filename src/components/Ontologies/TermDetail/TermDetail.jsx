import {useEffect, useState, useContext} from 'react';
import NodePageTabConfig from './listOfComponentsTabs.json';
import TermDetailTable from './TermDetailTable/TermDetailTable';
import NoteList from '../Note/NoteList';
import SkosApi from '../../../api/skos';
import TermApi from '../../../api/term';
import {Link} from 'react-router-dom';
import {getNoteList} from '../../../api/note';
import Graph from '../../common/Graph/Graph';
import {OntologyPageContext} from "../../../context/OntologyPageContext";
import * as SiteUrlParamNames from '../../../UrlFactory/UrlParamNames';
import CommonUrlFactory from '../../../UrlFactory/CommonUrlFactory';
import PropTypes from 'prop-types';
import {AddToTermsetModal, AddToTermsetModalBtn} from '../../TermSet/TermSet';
import TermLib from '../../../Libs/TermLib';


const DETAIL_TAB_ID = 0;
const NOTES_TAB_ID = 1;
const GRAPH_TAB_ID = 2;


const TermDetail = (props) => {
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
  const [targetTerm, setTargetTerm] = useState({"iri": null});
  const [notesCount, setNotesCount] = useState(0);
  
  const showDataAsJsonBtnHref = process.env.REACT_APP_API_URL +
    `/v2/ontologies/${targetTerm.ontologyId}/entities/${encodeURIComponent(encodeURIComponent(targetTerm.iri))}?lang=${ontologyPageContext.ontoLang}`;
  
  async function fetchTheTargetTerm() {
    let term = null;
    let ontologyId = ontologyPageContext.ontology.ontologyId;
    if (ontologyPageContext.isSkos && props.componentIdentity === "individual") {
      let skosApi = new SkosApi({ontologyId: ontologyId, iri: props.iri})
      await skosApi.fetchSkosTerm();
      term = skosApi.skosTerm;
    } else {
      let termApi = new TermApi(ontologyId, encodeURIComponent(props.iri), props.extractKey, ontologyPageContext.ontoLang);
      await termApi.fetchTerm();
      term = termApi.term;
    }
    setTargetTerm(term);
  }
  
  
  async function fetchNoteCount() {
    try {
      let ontologyId = ontologyPageContext.ontology.ontologyId;
      let term = {"iri": props.iri};
      let countOfNotes = 0;
      if (process.env.REACT_APP_NOTE_FEATURE === "true") {
        countOfNotes = await getNoteList({
          ontologyId: ontologyId,
          type: null,
          pageNumber: 0,
          pageSize: 1,
          targetTerm: term,
          onlyOntologyOriginalNotes: false
        });
        countOfNotes = countOfNotes ? countOfNotes['stats']['total_number_of_records'] : 0;
      }
      setNotesCount(countOfNotes);
    } catch {
      setNotesCount(0);
    }
  }
  
  
  function setTabOnLoad() {
    let url = new URL(window.location);
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
      setLastRequestedTab(requestedTab);
    }
  }
  
  function tabChangeHandler(e, v) {
    try {
      let selectedTabId = e.target.dataset.value;
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
          <AddToTermsetModalBtn modalId={"term-in-tree"}/>
          <a
            href={showDataAsJsonBtnHref}
            target='_blank'
            rel="noreferrer"
            className='btn btn-secondary btn-dark download-ontology-btn'
          >
            <i className="bi bi-filetype-json"></i>
            JSON
          </a>
        </div>
        <AddToTermsetModal modalId={"term-in-tree"} term={targetTerm}/>
        <RenderTermDetailTab
          componentIdentity={props.componentIdentity}
          tabChangeHandler={tabChangeHandler}
          activeTab={activeTab}
          noteCounts={notesCount}
        />
        {waiting && <div className="isLoading-small"></div>}
        {!waiting && (activeTab === DETAIL_TAB_ID) &&
          <TermDetailTable
            iri={props.iri}
            componentIdentity={props.componentIdentity}
            extractKey={props.extractKey}
            isIndividual={false}
            node={targetTerm}
          />
        }
        {!waiting && (activeTab === NOTES_TAB_ID) &&
          <NoteList
            key={'notesPage'}
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


const RenderTermDetailTab = (props) => {
  
  const ontologyPageContext = useContext(OntologyPageContext);
  const UrlFactory = new CommonUrlFactory();
  
  function createTabs() {
    let result = [];
    for (let configItemKey in NodePageTabConfig) {
      let configObject = NodePageTabConfig[configItemKey];
      let linkUrl = UrlFactory.setParam({
        name: SiteUrlParamNames.SubTabInTermTable,
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
            {configItemKey === "Notes" ? ` (${props.noteCounts})` : ""}
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


TermDetail.propTypes = {
  iri: PropTypes.string.isRequired,
  componentIdentity: PropTypes.string.isRequired,
  extractKey: PropTypes.string.isRequired,
  typeForNote: PropTypes.string.isRequired
}

export default TermDetail;
