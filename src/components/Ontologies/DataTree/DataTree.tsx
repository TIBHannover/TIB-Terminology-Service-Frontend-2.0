import { useState, useEffect, useContext } from "react";
import "font-awesome/css/font-awesome.min.css";
import TermDetail from "../TermDetail/TermDetail";
import { MatomoWrapper } from "../../Matomo/MatomoWrapper";
import Tree from "./Tree";
import PaneResize from "../../common/PaneResize/PaneResize";
import "../../layout/tree.css";
import { OntologyPageContext } from "../../../context/OntologyPageContext";
import CommonUrlFactory from "../../../UrlFactory/CommonUrlFactory";
import { getTourProfile } from "../../../tours/controller";
import TermApi from "../../../api/term";
import type { DataTreeProps, SelectedJumpTerm } from "./types";

const TermDetailComponent = TermDetail as any;
const TreeComponent = Tree as any;

const DataTree = (props: DataTreeProps) => {
  /* 
    The tree view holder components. It is a warpper for:
      - Tree 
      - Term Detail view
      - Jump To
      - Pane resize
    
    Context:
      The component needs OntologyPage context. Look at src/context/OntologyPageContext.js
  */

  const ontologyPageContext = useContext(OntologyPageContext);

  const [selectedNodeIri, setSelectedNodeIri] = useState("");
  const [showDetailTable, setShowDetailTable] = useState(false);
  const [isTermTree, setIsTermTree] = useState(false);
  const [isPropertyTree, setIsPropertyTree] = useState(false);
  const [paneResizeClass, setPaneResizeClass] = useState(new PaneResize());
  const [jumpToIri, setJumpToIri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const urlFacory = new CommonUrlFactory();

  function handleTreeNodeSelection(
    selectedNodeIri: string,
    showDetailTable: boolean,
  ) {
    setSelectedNodeIri(selectedNodeIri);
    setShowDetailTable(showDetailTable);
    setJumpToIri(null);
  }

  function handleResetTreeEvent() {
    paneResizeClass.resetTheWidthToOrignial();
    setSelectedNodeIri("");
    setShowDetailTable(false);
    setJumpToIri(null);
  }

  function handleJumtoSelection(selectedTerm: SelectedJumpTerm | null) {
    if (selectedTerm?.iri) {
      setJumpToIri(selectedTerm["iri"]);
      setSelectedNodeIri(selectedTerm["iri"]);
      setShowDetailTable(true);
      urlFacory.setIri({ newIri: selectedTerm["iri"] });
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
    let termTree = props.componentIdentity === "terms" ? true : false;
    let iriInUrl = urlFacory.getIri();
    let curieInUrl = urlFacory.getCurie();
    if (iriInUrl) {
      setSelectedNodeIri(iriInUrl);
      setShowDetailTable(true);
      setLoading(false);
    } else if (curieInUrl) {
      let termApi = new TermApi(
        ontologyPageContext.ontology.ontologyId,
        curieInUrl,
        props.componentIdentity,
        ontologyPageContext.ontoLang,
      );
      setLoading(true);
      termApi.getTermIriByCurie(curieInUrl).then((iri) => {
        setSelectedNodeIri(iri);
        setShowDetailTable(true);
        urlFacory.deleteParam({ name: "curie" });
        urlFacory.setIri({ newIri: iri });
        setLoading(false);
      });
    } else if (
      ontologyPageContext.lastVisitedIri[props.componentIdentity] &&
      ontologyPageContext.lastVisitedIri[props.componentIdentity] !== ""
    ) {
      setSelectedNodeIri(
        ontologyPageContext.lastVisitedIri[props.componentIdentity],
      );
      setShowDetailTable(true);
      urlFacory.setIri({
        newIri: ontologyPageContext.lastVisitedIri[props.componentIdentity],
      });
      setLoading(false);
    } else {
      setLoading(false);
    }

    setIsTermTree(termTree);
    setIsPropertyTree(!termTree);

    let tourP = getTourProfile();
    if (
      process.env.REACT_APP_SITE_TOUR === "true" &&
      ((props.componentIdentity === "terms" && !tourP.ontoClassTreePage) ||
        (props.componentIdentity === "properties" &&
          !tourP.ontoPropertyTreePage))
    ) {
      if (document.getElementById("tour-trigger-btn")) {
        document.getElementById("tour-trigger-btn")?.click();
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

  return (
    <div className="tree-view-container resizable-container">
      <div className="tree-page-left-part" id="page-left-pane">
        <div className="tree-container">
          {!loading &&
            (props.rootNodes.length !== 0 ||
              (ontologyPageContext.isSkos &&
                props.rootNodesForSkos.length !== 0 &&
                props.componentIdentity !== "properties")) && (
              <TreeComponent
                rootNodes={props.rootNodes}
                obsoleteTerms={props.obsoleteTerms}
                rootNodesForSkos={props.rootNodesForSkos}
                componentIdentity={props.componentIdentity}
                selectedNodeIri={selectedNodeIri}
                key={props.key}
                handleNodeSelectionInDataTree={handleTreeNodeSelection}
                individualViewChanger={""}
                handleResetTreeInParent={handleResetTreeEvent}
                jumpToIri={jumpToIri}
                handleJumtoSelection={handleJumtoSelection}
              />
            )}
          {(!loading && props.rootNodes.length === 0) ||
            (ontologyPageContext.isSkos &&
              props.rootNodesForSkos.length === 0 &&
              props.componentIdentity !== "properties" && (
                <div className="no-node">
                  There is no term to load in this tree
                </div>
              ))}
        </div>
      </div>
      {showDetailTable && paneResizeClass.generateVerticalResizeLine()}
      {showDetailTable && (
        <div className="node-table-container" id="page-right-pane">
          {isTermTree && (
            <MatomoWrapper>
              <TermDetailComponent
                iri={selectedNodeIri}
                componentIdentity="terms"
                extractKey="terms"
                isIndividual={false}
                typeForNote="class"
              />
            </MatomoWrapper>
          )}
          {isPropertyTree && (
            <MatomoWrapper>
              <TermDetailComponent
                iri={selectedNodeIri}
                componentIdentity="props"
                extractKey="properties"
                isIndividual={false}
                typeForNote="property"
              />
            </MatomoWrapper>
          )}
        </div>
      )}
    </div>
  );
};

export default DataTree;
