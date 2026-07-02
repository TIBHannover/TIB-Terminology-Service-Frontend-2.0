import { useEffect, useRef, useState, useContext } from "react";
import {
  TermTabMetadata,
  TermDetailComPros,
  RenderTermDetailComProps,
} from "./types";
import NodePageTabConfig from "./listOfComponentsTabs.json";
import TermDetailTable from "./TermDetailTable/TermDetailTable";
import NoteList from "../Note/NoteList";
import TermApi from "../../../api/term";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { getNoteList } from "../../../api/note";
import Graph from "../../common/Graph/Graph";
import { OntologyPageContext } from "../../../context/OntologyPageContext";
import * as SiteUrlParamNames from "../../../UrlFactory/UrlParamNames";
import CommonUrlFactory from "../../../UrlFactory/CommonUrlFactory";
import { AddToTermsetModal } from "../../TermSet/AddTermToSet";
import { TsTerm } from "../../../concepts";
import LinkedDatasets from "../LinkedDatasets/LinkedDatasets";

const DETAIL_TAB_ID = 0;
const NOTES_TAB_ID = 1;
const GRAPH_TAB_ID = 2;
const LINKED_DATASETS_TAB_ID = 3;
const TABS = {
  "": DETAIL_TAB_ID,
  notes: NOTES_TAB_ID,
  graph: GRAPH_TAB_ID,
  linked_datasets: LINKED_DATASETS_TAB_ID,
};

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
  const [actionsCollapsed, setActionsCollapsed] = useState(false);
  const tabActionRowRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLUListElement>(null);
  const actionBarRef = useRef<HTMLDivElement>(null);
  const expandedActionsWidthRef = useRef(0);

  const showDataAsJsonBtnHref =
    process.env.REACT_APP_API_URL +
    `/v2/ontologies/${targetTerm?.ontologyId ?? ""}/entities/${encodeURIComponent(encodeURIComponent(targetTerm?.iri ?? ""))}?lang=${ontologyPageContext.ontoLang}`;

  async function fetchTheTargetTerm() {
    let ontologyId = ontologyPageContext.ontology.ontologyId;
    let termApi = new TermApi(
      ontologyId,
      encodeURIComponent(props.iri),
      props.extractKey,
      ontologyPageContext.ontoLang,
    );
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
          onlyOntologyOriginalNotes: false,
        });
        countOfNotes = notes
          ? (notes.stats.total_number_of_records as number)
          : 0;
      }
      setNotesCount(countOfNotes);
    } catch {
      setNotesCount(0);
    }
  }

  function setTabOnLoad() {
    let url = new URL(window.location.href);
    let requestedTab = url.searchParams.get("subtab");
    let activeTabId = TABS[requestedTab] ?? DETAIL_TAB_ID;
    if (requestedTab !== lastRequestedTab && activeTabId !== activeTab) {
      setActiveTab(activeTabId);
      setWaiting(false);
      setLastRequestedTab(requestedTab ?? "");
    }
  }

  function tabChangeHandler(e: React.MouseEvent<HTMLAnchorElement>) {
    try {
      let selectedTabId = parseInt(
        e.currentTarget.dataset.value ?? DETAIL_TAB_ID.toString(),
      );
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
  }, [ontologyPageContext.ontoLang]);

  useEffect(() => {
    const tabActionRow = tabActionRowRef.current;
    const tabList = tabListRef.current;

    if (!tabActionRow || !tabList) {
      return;
    }

    function updateActionOverflow() {
      const currentTabActionRow = tabActionRowRef.current;
      const currentTabList = tabListRef.current;
      const currentActionBar = actionBarRef.current;

      if (!currentTabActionRow || !currentTabList) {
        return;
      }

      const visibleActionsWidth = currentActionBar?.scrollWidth ?? 0;

      if (visibleActionsWidth > 0) {
        expandedActionsWidthRef.current = visibleActionsWidth;
      }

      const actionsWidth = expandedActionsWidthRef.current;
      const rowStyles = window.getComputedStyle(currentTabActionRow);
      const rowGap =
        parseFloat(rowStyles.columnGap || rowStyles.gap || "0") || 0;
      const nextCollapsed =
        currentTabList.scrollWidth + actionsWidth + rowGap >
        currentTabActionRow.clientWidth;

      setActionsCollapsed(nextCollapsed);
    }

    updateActionOverflow();

    const resizeObserver = new ResizeObserver(updateActionOverflow);
    resizeObserver.observe(tabActionRow);
    resizeObserver.observe(tabList);
    if (actionBarRef.current) {
      resizeObserver.observe(actionBarRef.current);
    }
    window.addEventListener("resize", updateActionOverflow);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateActionOverflow);
    };
  }, [actionsCollapsed, notesCount, targetTerm]);

  const renderTermDetailActions = (isMenuContent = false) => (
    <div
      ref={isMenuContent ? undefined : actionBarRef}
      className={
        "d-flex justify-content-end mt-3 " +
        (isMenuContent ? "term-detail-action-menu" : "term-detail-action-bar")
      }
    >
      <AddToTermsetModal
        modalId={"term-in-tree"}
        term={targetTerm}
        btnClass="term-detail-action-btn"
      />
      <a
        href={showDataAsJsonBtnHref}
        target="_blank"
        rel="noreferrer"
        className="borderless-btn rounded-1 term-detail-action-btn"
        title="Show JSON"
      >
        <i className="bi bi-filetype-json"></i>
        JSON
      </a>
    </div>
  );

  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="row mb-3" ref={tabActionRowRef}>
          <div className="col-sm-9">
            <RenderTermDetailTab
              componentIdentity={props.componentIdentity}
              tabChangeHandler={tabChangeHandler}
              activeTab={activeTab}
              noteCount={notesCount}
              tabListRef={tabListRef}
            />
          </div>
          <div className="col-sm-3">
            {!actionsCollapsed && renderTermDetailActions()}
            {actionsCollapsed && (
              <Dropdown
                align="end"
                autoClose="outside"
                className="term-detail-action-dropdown"
              >
                <Dropdown.Toggle
                  className="btn btn-sm btn-dark term-detail-action-menu-toggle"
                  id="term-detail-action-menu"
                  aria-label="Term detail actions"
                >
                  <i className="bi bi-list"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>{renderTermDetailActions(true)}</Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>
        {waiting && <div className="isLoading-small"></div>}
        {!waiting && activeTab === DETAIL_TAB_ID && (
          <TermDetailTable
            iri={props.iri}
            componentIdentity={props.componentIdentity}
            extractKey={props.extractKey}
            isIndividual={false}
            node={targetTerm ?? undefined}
          />
        )}
        {!waiting && activeTab === NOTES_TAB_ID && (
          <NoteList
            key={"notesPage"}
            term={targetTerm as any}
            termType={props.typeForNote}
          />
        )}
        {!waiting && activeTab === GRAPH_TAB_ID && (
          <Graph
            ontologyId={ontologyPageContext.ontology.ontologyId}
            termIri={props.iri}
            isSkos={ontologyPageContext.isSkos}
            componentIdentity={props.componentIdentity}
          />
        )}
        {!waiting && activeTab === LINKED_DATASETS_TAB_ID && (
          <LinkedDatasets inputCurie={targetTerm?.curie} />
        )}
      </div>
    </div>
  );
};

const RenderTermDetailTab = (props: RenderTermDetailComProps) => {
  const ontologyPageContext = useContext(OntologyPageContext);
  const UrlFactory = new CommonUrlFactory();

  function skipTab(key: string): boolean {
    switch (key) {
      case "Notes":
        return process.env.REACT_APP_NOTE_FEATURE !== "true";
      case "IssueList":
        return process.env.REACT_APP_GITHUB_ISSUE_LIST_FEATURE !== "true";
      case "Publications":
        return process.env.REACT_APP_PUBLICATION_LINKS !== "true";
      case "LinkedDatasets":
        return process.env.REACT_APP_LINKED_DATASETS !== "true";
      default:
        return false;
    }
  }

  function createTabs() {
    let result = [];
    for (let configItemKey in NodePageTabConfig as TermTabMetadata) {
      let configObject = (NodePageTabConfig as TermTabMetadata)[
        configItemKey as keyof TermTabMetadata
      ];
      let linkUrl = UrlFactory.setParam({
        name: SiteUrlParamNames.SubTabInTermTable,
        value: configObject.urlEndPoint,
        updateUrl: false,
      });
      if (skipTab(configItemKey)) {
        continue;
      }

      if (
        configItemKey === "GraphView" &&
        (props.componentIdentity === "props" ||
          (props.componentIdentity === "individuals" &&
            !ontologyPageContext.isSkos))
      ) {
        continue;
      }

      result.push(
        <li
          className={
            "nav-item ontology-detail-nav-item stour-tree-table-" +
            configObject["id"]
          }
          key={configObject["keyForRenderAsTabItem"]}
        >
          <Link
            onClick={props.tabChangeHandler}
            data-value={configObject["tabId"]}
            className={
              props.activeTab === Number(configObject["tabId"])
                ? "nav-link active"
                : "nav-link"
            }
            to={linkUrl}
          >
            {configObject["tabTitle"]}
            {configItemKey === "Notes" ? ` (${props.noteCount})` : ""}
          </Link>
        </li>,
      );
    }

    return result;
  }

  return (
    <ul className="nav nav-tabs nav-tabs-node" ref={props.tabListRef}>
      {createTabs()}
    </ul>
  );
};

export default TermDetail;
