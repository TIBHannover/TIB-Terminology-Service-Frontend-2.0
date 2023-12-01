import {useState, useEffect} from 'react';
import { useHistory } from 'react-router';
import 'font-awesome/css/font-awesome.min.css';
import NodePage from '../NodePage/NodePage';
import { MatomoWrapper } from '../../Matomo/MatomoWrapper';
import Tree from './Tree';
import JumpTo from '../../common/JumpTo/JumpTo';
import PaneResize from '../../common/PaneResize/PaneResize';
import TreeNodeController from './TreeNode';
import TreeHelper from './TreeHelpers';



const DataTree = (props) => {

  const [selectedNodeIri, setSelectedNodeIri] = useState('');
  const [showDetailTable, setShowDetailTable] = useState(false);
  const [isTermTree, setIsTermTree] = useState(false);
  const [isPropertyTree, setIsPropertyTree] = useState(false);
  const [ontologyId, setOntologyId] = useState('');
  const [childExtractName, setChildExtractName] = useState('');

  const paneResizeClass = new PaneResize();
  const history = useHistory();


  function setComponentData(){
    let termTree = (props.componentIdentity === "terms") ? true : false;     
    setOntologyId(props.ontology.ontologyId);
    setSelectedNodeIri(props.iri);
    setIsTermTree(termTree);
    setIsPropertyTree(!termTree);
  }



  function handleTreeNodeSelection(selectedNodeIri, showDetailTable){
      setSelectedNodeIri(selectedNodeIri);
      setShowDetailTable(showDetailTable);
  }


  function handleResetTreeEevent(){
    paneResizeClass.resetTheWidthToOrignial();
  }


  function handleJumtoSelection(selectedTerm){
    if(selectedTerm){            
      setSelectedNodeIri(selectedTerm['iri']);
    }   
  }


  function selectNode(target){    
      if(props.isIndividual){
          return true;
      }
      let treeNode = new TreeNodeController();
      treeNode.unClickAllNodes();        
      let targetNodeDiv = treeNode.getClickedNodeDiv(target);
      let clickedNodeIri = "";
      let clickedNodeId = "";
      let showNodeDetailPage = false;         
      if(targetNodeDiv){            
          targetNodeDiv.classList.add("clicked");            
          clickedNodeIri = treeNode.getClickedNodeIri(target);
          clickedNodeId = treeNode.getClickedNodeId(target);            
          showNodeDetailPage = true;

          setSelectedNodeIri(clickedNodeIri);
          setShowDetailTable(showNodeDetailPage);

          
          // this.setState({
          //     // showNodeDetailPage: showNodeDetailPage,
          //     // selectedNodeIri: clickedNodeIri,
          //     siblingsButtonShow: false,
          //     subOrFullTreeBtnShow: true,
          //     reduceBtnActive: false,
          //     lastSelectedItemId: clickedNodeId
          // }, () =>{
          //     if(this.state.componentIdentity !== "individuals"){
          //         this.props.domStateKeeper({__html:document.getElementById("tree-root-ul").outerHTML}, this.state, this.props.componentIdentity);
          //     }                
          // });            
          
          let locationObject = window.location;
          const searchParams = new URLSearchParams(locationObject.search);
          searchParams.set('iri', clickedNodeIri);               
          searchParams.delete('noteId');        
          history.push(locationObject.pathname + "?" +  searchParams.toString());
          props.iriChangerFunction(clickedNodeIri, this.state.componentIdentity);
      }    
  }


  function processClick(e){
      if(props.isIndividual){
          return true;
      }        
      if (e.target.tagName === "DIV" && e.target.classList.contains("tree-text-container")){             
          selectNode(e.target);
      }
      else if (e.target.tagName === "DIV" && e.target.classList.contains("li-label-text")){ 
          selectNode(e.target.parentNode);
      }
      else if (e.target.tagName === "S"){ 
          selectNode(e.target.parentNode.parentNode);
      }
      else if (e.target.tagName === "I"){
          // expand a node by clicking on the expand icon
          TreeHelper.expandNode(e.target.parentNode, ontologyId, childExtractName, props.isSkos).then((res) => {
              if(props.componentIdentity !== "individuals"){
                  // props.domStateKeeper({__html:document.getElementById("tree-root-ul").outerHTML}, this.state, this.props.componentIdentity);
              }              
          });
      }
  }





  useEffect(() => {
    setComponentData();
    paneResizeClass.setOriginalWidthForLeftPanes();        
    document.body.addEventListener("mousedown", paneResizeClass.onMouseDown);
    document.body.addEventListener("mousemove", paneResizeClass.moveToResize);
    document.body.addEventListener("mouseup", paneResizeClass.releaseMouseFromResize);

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
              iri={selectedNodeIri}
              key={props.key}                    
              ontology={props.ontology.ontologyId}
              rootNodeNotExist={props.rootNodeNotExist}
              iriChangerFunction={props.iriChangerFunction}
              lastState={props.lastState}
              domStateKeeper={props.domStateKeeper}
              isSkos={props.isSkos}
              // nodeSelectionHandler={handleTreeNodeSelection}
              individualViewChanger={""}
              handleResetTreeInParent={handleResetTreeEevent}
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





