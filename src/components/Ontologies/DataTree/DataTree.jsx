import { useState, useEffect, useContext } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import TermDetail from '../TermDetail/TermDetail';
import { MatomoWrapper } from '../../Matomo/MatomoWrapper';
import Tree from './Tree';
import JumpTo from '../../common/JumpTo/JumpTo';
import PaneResize from '../../common/PaneResize/PaneResize';
import '../../layout/tree.css';
import { OntologyPageContext } from '../../../context/OntologyPageContext';
import CommonUrlFactory from '../../../UrlFactory/CommonUrlFactory';
import { getTourProfile } from '../../../tours/controller';



const DataTree = (props) => {
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

  const [selectedNodeIri, setSelectedNodeIri] = useState('');
  const [showDetailTable, setShowDetailTable] = useState(false);
  const [isTermTree, setIsTermTree] = useState(false);
  const [isPropertyTree, setIsPropertyTree] = useState(false);
  const [paneResizeClass, setPaneResizeClass] = useState(new PaneResize());
  const [jumpToIri, setJumpToIri] = useState(null);
  const [loading, setLoading] = useState(true);

  const urlFacory = new CommonUrlFactory();


  function handleTreeNodeSelection(selectedNodeIri, showDetailTable) {
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


  function handleJumtoSelection(selectedTerm) {
    if (selectedTerm) {
      setJumpToIri(selectedTerm['iri']);
      setSelectedNodeIri(selectedTerm['iri']);
      setShowDetailTable(true);
      urlFacory.setIri({ newIri: selectedTerm['iri'] });
    }
  }


  useEffect(() => {
    paneResizeClass.setOriginalWidthForLeftPanes();
    document.body.addEventListener("mousedown", paneResizeClass.onMouseDown);
    document.body.addEventListener("mousemove", paneResizeClass.moveToResize);
    document.body.addEventListener("mouseup", paneResizeClass.releaseMouseFromResize);
    let termTree = (props.componentIdentity === "terms") ? true : false;
    let iriInUrl = urlFacory.getIri();
    if (iriInUrl) {
      setSelectedNodeIri(iriInUrl);
      setShowDetailTable(true);
    }
    else if (ontologyPageContext.lastVisitedIri[props.componentIdentity] && ontologyPageContext.lastVisitedIri[props.componentIdentity] !== "") {
      setSelectedNodeIri(ontologyPageContext.lastVisitedIri[props.componentIdentity]);
      setShowDetailTable(true);
      urlFacory.setIri({ newIri: ontologyPageContext.lastVisitedIri[props.componentIdentity] })
    }

    setIsTermTree(termTree);
    setIsPropertyTree(!termTree);
    setLoading(false);

    let tourP = getTourProfile();
    if (
      process.env.REACT_APP_SITE_TOUR === "true" &&
      ((props.componentIdentity === 'terms' && !tourP.ontoClassTreePage) || (props.componentIdentity === 'properties' && !tourP.ontoPropertyTreePage))
    ) {
      if (document.getElementById('tour-trigger-btn')) {
        document.getElementById('tour-trigger-btn').click();
      }
    }

    return () => {
      document.body.addEventListener("mousedown", paneResizeClass.onMouseDown);
      document.body.addEventListener("mousemove", paneResizeClass.moveToResize);
      document.body.addEventListener("mouseup", paneResizeClass.releaseMouseFromResize);
    };
  }, []);


  return (
    <div className="tree-view-container resizable-container">
      <div className="tree-page-left-part" id="page-left-pane">
        <div className='tree-container'>
          {!loading && (props.rootNodes.length !== 0 || (ontologyPageContext.isSkos && props.rootNodesForSkos.length !== 0 && props.componentIdentity !== "properties")) &&
            <Tree
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
          }
          {!loading && props.rootNodes.length === 0 || (ontologyPageContext.isSkos && props.rootNodesForSkos.length === 0 && props.componentIdentity !== "properties") &&
            <div className="no-node">There is no term to load in this tree</div>
          }
        </div>
      </div>
      {showDetailTable && paneResizeClass.generateVerticalResizeLine()}
      {showDetailTable &&
        <div className="node-table-container" id="page-right-pane">
          {isTermTree &&
            <MatomoWrapper>
              <TermDetail
                iri={selectedNodeIri}
                componentIdentity="terms"
                extractKey="terms"
                isIndividual={false}
                typeForNote="class"
              />
            </MatomoWrapper>
          }
          {isPropertyTree &&
            <MatomoWrapper>
              <TermDetail
                iri={selectedNodeIri}
                componentIdentity="props"
                extractKey="properties"
                isIndividual={false}
                typeForNote="property"
              />
            </MatomoWrapper>}
        </div>
      }
    </div>
  );
}



export default DataTree;





