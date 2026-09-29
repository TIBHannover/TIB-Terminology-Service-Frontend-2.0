import { useState, useEffect, useContext, useRef } from "react";
import TermApi from "../../../api/term";
import TermDetail from "../TermDetail/TermDetail";
import Tree from "../DataTree/Tree";
import PaneResize from "../../common/PaneResize/PaneResize";
import { RenderIndividualList } from "./RenderIndividualList";
import { OntologyPageContext } from "../../../context/OntologyPageContext";
import CommonUrlFactory from "../../../UrlFactory/CommonUrlFactory";
import PropTypes from "prop-types";
import { getTourProfile } from "../../../tours/controller";

const PAGE_SIZE = 50;

const IndividualsList = (props) => {
  /* 
      This component is responsible for rendering the list of individuals for the ontology.
      It uses the TermApi to get the list of individuals for the ontology.
      It requires the ontologyPageContext to get the ontology information.
  */

  const ontologyPageContext = useContext(OntologyPageContext);
  const rootNodes = ontologyPageContext.rootTerms;
  const rootNodesForSkos = ontologyPageContext.skosRootIndividuals;
  const lastVisitedIri =
    ontologyPageContext.lastVisitedIri[props.componentIdentity];

  const [individuals, setIndividuals] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalNumberOfIndividuals, setTotalNumberOfIndividuals] = useState(0);
  const [targetIri, setTargetIri] = useState(
    lastVisitedIri && lastVisitedIri !== " " ? lastVisitedIri : "",
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [showNodeDetailPage, setShowNodeDetailPage] = useState(false);
  const [selectedNodeIri, setSelectedNodeIri] = useState("");
  const [jumpToIri, setJumpToIri] = useState(null);
  const [listView, setListView] = useState(!ontologyPageContext.isSkos);
  const [JumpToOnLoad, setJumpToOnload] = useState(false);
  const [paneResizeClass, setPaneResizeClass] = useState(new PaneResize());
  const requestId = useRef(0);

  const urlFactory = new CommonUrlFactory();

  async function setComponentData() {
    const currentRequestId = ++requestId.current;
    setIsLoaded(false);
    setIndividuals([]);
    try {
      const termApi = new TermApi(
        ontologyPageContext.ontology.ontologyId,
        targetIri,
        props.componentIdentity,
        ontologyPageContext.ontoLang,
      );
      const curieInUrl = urlFactory.getCurie();
      if (!targetIri && curieInUrl) {
        const iri = await termApi.getTermIriByCurie(curieInUrl);
        if (currentRequestId !== requestId.current) {
          return;
        }
        urlFactory.deleteParam({ name: "curie" });
        if (iri) {
          setTargetIri(iri);
          return;
        }
      }
      if (targetIri) {
        const individual = await termApi.fetchTerm();
        if (currentRequestId !== requestId.current) {
          return;
        }
        setIndividuals(individual ? [individual] : []);
        setIsLoaded(true);
        setSelectedNodeIri(targetIri);
        setJumpToOnload(true);
        setJumpToIri(targetIri);
        if (urlFactory.getIri() !== targetIri) {
          urlFactory.setIri({ newIri: targetIri });
        }
        ontologyPageContext.storeIriForComponent(
          targetIri,
          props.componentIdentity,
        );
        return;
      }
      let indvList = await termApi.fetchListOfIndividuals(pageNumber);
      if (currentRequestId !== requestId.current) {
        return;
      }
      const totalNumber = Number(indvList["totalTermsCount"] ?? 0);
      const lastPage = Math.max(Math.ceil(totalNumber / PAGE_SIZE) - 1, 0);
      setTotalNumberOfIndividuals(totalNumber);
      if (pageNumber > lastPage) {
        setPageNumber(lastPage);
        return;
      }
      indvList = indvList["results"] ?? [];
      setIsLoaded(true);
      setIndividuals(sortIndividuals(indvList));
    } catch (error) {
      if (currentRequestId !== requestId.current) {
        return;
      }
      setIsLoaded(true);
      setTotalNumberOfIndividuals(0);
      setIndividuals(sortIndividuals([]));
    }
  }

  function pageCount() {
    return Math.ceil(totalNumberOfIndividuals / PAGE_SIZE);
  }

  function handlePagination(value) {
    const nextPage = parseInt(value) - 1;
    if (nextPage === pageNumber) {
      return;
    }
    requestId.current += 1;
    setIsLoaded(false);
    setIndividuals([]);
    setPageNumber(nextPage);
  }

  function resetList() {
    requestId.current += 1;
    setIsLoaded(false);
    setIndividuals([]);
    setSelectedNodeIri("");
    setJumpToIri(null);
    setShowNodeDetailPage(false);
    urlFactory.deleteParam({ name: "iri" });
    urlFactory.deleteParam({ name: "curie" });
    ontologyPageContext.storeIriForComponent("", props.componentIdentity);
    setPageNumber(0);
    setTargetIri("");
  }

  function selectNode(target) {
    if (ontologyPageContext.isSkos && !listView) {
      return true;
    }
    let selectedElement = document.querySelectorAll(".clicked");
    for (let i = 0; i < selectedElement.length; i++) {
      selectedElement[i].classList.remove("clicked");
    }
    if (!target.classList.contains("clicked") && target.tagName === "SPAN") {
      target.classList.add("clicked");
      setShowNodeDetailPage(true);
      setSelectedNodeIri(target.dataset.iri);
      urlFactory.setIri({ newIri: target.dataset.iri });
      ontologyPageContext.storeIriForComponent(
        target.dataset.iri,
        props.componentIdentity,
      );
    } else {
      target.classList.remove("clicked");
    }
  }

  function processClick(e) {
    if (
      (ontologyPageContext.isSkos && !listView) ||
      !e.target.closest(".individual-list-container")
    ) {
      return true;
    }

    if (!listView) {
      // select a class on the individual tree. Load the tree view for the class
      if (e.target.parentNode.parentNode.classList.contains("opened")) {
        let path = window.location.pathname;
        let targetIri = encodeURIComponent(
          e.target.parentNode.parentNode.dataset.iri,
        );
        path = path.split("individuals")[0];
        window.location.replace(path + "terms?iri=" + targetIri);
      }
    } else if (e.target.tagName === "SPAN") {
      selectNode(e.target);
    }
  }

  function handleNodeSelectionInTreeView(selectedNodeIri, showDetailTable) {
    if (ontologyPageContext.isSkos) {
      setSelectedNodeIri(selectedNodeIri);
      setShowNodeDetailPage(showDetailTable);
    }
  }

  function switchView() {
    setJumpToOnload(!listView);
    setListView(!listView);
  }

  function handleResetTreeEvent() {
    paneResizeClass.resetTheWidthToOrignial();
    setListView(false);
    setSelectedNodeIri("");
    setShowNodeDetailPage(false);
  }

  function sortIndividuals(individuals) {
    return individuals.sort(function (a, b) {
      let x = a["label"];
      let y = b["label"];
      return x < y ? -1 : 1;
    });
  }

  function createIndividualTree() {
    let result = [
      <div className="tree-container">
        <Tree
          componentIdentity={"terms"}
          selectedNodeIri={selectedNodeIri}
          key={props.key}
          rootNodeNotExist={
            ontologyPageContext.isSkos
              ? rootNodesForSkos.length === 0
              : rootNodes.length === 0
          }
          handleNodeSelectionInDataTree={handleNodeSelectionInTreeView}
          isIndividual={!ontologyPageContext.isSkos}
          showListSwitchEnabled={!ontologyPageContext.isSkos}
          individualViewChanger={switchView}
          handleResetTreeInParent={handleResetTreeEvent}
          jumpToIri={jumpToIri}
          handleJumtoSelection={handleJumtoSelection}
        />
      </div>,
    ];
    return result;
  }

  function handleJumtoSelection(selectedTerm) {
    if (selectedTerm) {
      requestId.current += 1;
      setIsLoaded(false);
      setIndividuals([]);
      setSelectedNodeIri(selectedTerm["iri"]);
      setJumpToIri(selectedTerm["iri"]);
      setJumpToOnload(true);
      urlFactory.setIri({ newIri: selectedTerm["iri"] });
      setTargetIri(selectedTerm["iri"]);
      let selectedElement = document.querySelectorAll(".clicked");
      for (let i = 0; i < selectedElement.length; i++) {
        selectedElement[i].classList.remove("clicked");
      }
    }
  }

  useEffect(() => {
    paneResizeClass.setOriginalWidthForLeftPanes();
    document.body.addEventListener("mousedown", paneResizeClass.onMouseDown);
    document.body.addEventListener("mousemove", paneResizeClass.moveToResize);
    document.body.addEventListener(
      "mouseup",
      paneResizeClass.releaseMouseFromResize,
    );
    let tourP = getTourProfile();
    if (
      !tourP.ontoIndividualPage &&
      process.env.REACT_APP_SITE_TOUR === "true"
    ) {
      if (document.getElementById("tour-trigger-btn")) {
        document.getElementById("tour-trigger-btn").click();
      }
    }

    if (selectedNodeIri !== "") {
      setShowNodeDetailPage(true);
      let node = document.getElementById(selectedNodeIri);
      if (node) {
        node.classList.add("clicked");
      }
    }

    return () => {
      document.body.addEventListener("mousedown", paneResizeClass.onMouseDown);
      document.body.addEventListener("mousemove", paneResizeClass.moveToResize);
      document.body.addEventListener(
        "mouseup",
        paneResizeClass.releaseMouseFromResize,
      );
    };
  }, []);

  useEffect(() => {
    setComponentData();
    return () => {
      requestId.current += 1;
    };
  }, [pageNumber, targetIri]);

  useEffect(() => {
    if (selectedNodeIri !== "") {
      setShowNodeDetailPage(true);
    }
  }, [selectedNodeIri, JumpToOnLoad, listView]);

  useEffect(() => {
    setListView(!ontologyPageContext.isSkos);
  }, [ontologyPageContext.isSkos]);

  return (
    <div
      className="tree-view-container resizable-container"
      onClick={(e) => processClick(e)}
    >
      <div className="tree-page-left-part" id="page-left-pane">
        {listView && (
          <RenderIndividualList
            individuals={individuals}
            isLoaded={isLoaded}
            iri={selectedNodeIri}
            listView={listView}
            switchViewFunction={switchView}
            handleJumtoSelection={handleJumtoSelection}
            componentIdentity={props.componentIdentity}
            pageCount={pageCount()}
            pageNumber={pageNumber}
            pageSize={PAGE_SIZE}
            totalNumberOfIndividuals={totalNumberOfIndividuals}
            handlePagination={handlePagination}
            targetMode={Boolean(targetIri)}
            resetList={resetList}
          />
        )}
        {!listView &&
          (rootNodes.length !== 0 ||
            (ontologyPageContext.isSkos &&
              rootNodesForSkos.length !== 0)) &&
          createIndividualTree()}
      </div>
      {showNodeDetailPage && paneResizeClass.generateVerticalResizeLine()}
      {showNodeDetailPage && (
        <div className="node-table-container" id="page-right-pane">
          <TermDetail
            iri={selectedNodeIri}
            componentIdentity="individuals"
            extractKey="individuals"
            isIndividual={true}
            typeForNote="individual"
          />
        </div>
      )}
    </div>
  );
};

IndividualsList.propTypes = {
  componentIdentity: PropTypes.string,
  key: PropTypes.string,
};

export default IndividualsList;
