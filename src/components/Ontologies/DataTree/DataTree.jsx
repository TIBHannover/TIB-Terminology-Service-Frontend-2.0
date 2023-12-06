import {useState, useEffect} from 'react';
import 'font-awesome/css/font-awesome.min.css';
import NodePage from '../NodePage/NodePage';
import { MatomoWrapper } from '../../Matomo/MatomoWrapper';
import Tree from './Tree';
import JumpTo from '../../common/JumpTo/JumpTo';
import PaneResize from '../../common/PaneResize/PaneResize';



const DataTree = (props) => {

  const [selectedNodeIri, setSelectedNodeIri] = useState('');
  const [showDetailTable, setShowDetailTable] = useState(false);
  const [isTermTree, setIsTermTree] = useState(false);
  const [isPropertyTree, setIsPropertyTree] = useState(false);
  const [paneResizeClass, setPaneResizeClass] = useState(new PaneResize());


  function handleTreeNodeSelection(selectedNodeIri, showDetailTable){
      setSelectedNodeIri(selectedNodeIri);
      setShowDetailTable(showDetailTable);
  }


  function handleResetTreeEvent(){    
    paneResizeClass.resetTheWidthToOrignial();
    setSelectedNodeIri("");
    setShowDetailTable(false);
  }


  function handleJumtoSelection(selectedTerm){
    if(selectedTerm){            
      setSelectedNodeIri(selectedTerm['iri']);
    }   
  }


  useEffect(() => {
    let url = new URL(window.location);
    let targetQueryParams = url.searchParams;    
    paneResizeClass.setOriginalWidthForLeftPanes();        
    document.body.addEventListener("mousedown", paneResizeClass.onMouseDown);
    document.body.addEventListener("mousemove", paneResizeClass.moveToResize);
    document.body.addEventListener("mouseup", paneResizeClass.releaseMouseFromResize);
    let termTree = (props.componentIdentity === "terms") ? true : false;         
    setSelectedNodeIri(props.iri);
    setIsTermTree(termTree);
    setIsPropertyTree(!termTree);
    setShowDetailTable(targetQueryParams.get('iri') ? true : false);

    return () => {
      document.body.addEventListener("mousedown", paneResizeClass.onMouseDown);
      document.body.addEventListener("mousemove", paneResizeClass.moveToResize);
      document.body.addEventListener("mouseup", paneResizeClass.releaseMouseFromResize);
    };
  }, []);


  return(
    <div className="tree-view-container resizable-container"> 
      <div className="tree-page-left-part" id="page-left-pane">       
        <div className='row autosuggest-sticky'>
          <div className='col-sm-10'>
              <JumpTo
                targetType={"term"}
                ontologyId={props.ontology.ontologyId}
                isSkos={props.isSkos} 
                label={"Jump to"}
                handleJumtoSelection={handleJumtoSelection}
                obsoletes={false}
              />
          </div>
        </div>          
        <div className='tree-container'>
              <Tree
                rootNodes={props.rootNodes}
                obsoleteTerms={props.obsoleteTerms}                               
                rootNodesForSkos={props.rootNodesForSkos}
                componentIdentity={props.componentIdentity}
                selectedNodeIri={selectedNodeIri}
                key={props.key}                    
                ontologyId={props.ontology.ontologyId}
                rootNodeNotExist={props.rootNodeNotExist}
                iriChangerFunction={props.iriChangerFunction}
                lastState={props.lastState}
                domStateKeeper={props.domStateKeeper}
                isSkos={props.isSkos}
                handleNodeSelectionInDataTree={handleTreeNodeSelection}
                individualViewChanger={""}
                handleResetTreeInParent={handleResetTreeEvent}
              />
        </div>
      </div>
      {showDetailTable && paneResizeClass.generateVerticalResizeLine()}
      {showDetailTable &&
        <div className="node-table-container" id="page-right-pane">
          {isTermTree &&
              <MatomoWrapper>
              <NodePage
                iri={selectedNodeIri}
                ontology={props.ontology}
                componentIdentity="terms"
                extractKey="terms"
                isSkos={props.isSkos}
                isIndividual={false}
                typeForNote="class"
              />
              </MatomoWrapper>        
          }
          {isPropertyTree &&           
            <MatomoWrapper>
            <NodePage
                iri={selectedNodeIri}
                ontology={props.ontology}
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





