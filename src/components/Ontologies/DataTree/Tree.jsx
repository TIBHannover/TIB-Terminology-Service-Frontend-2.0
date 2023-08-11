import React from "react";
import 'font-awesome/css/font-awesome.min.css';
import { withRouter } from 'react-router-dom';
import { getNodeJsTree} from '../../../api/fetchData';
import TreeNodeController from "./TreeNode";
import { performArrowDown, performArrowUp} from "./KeyboardNavigation";
import Toolkit from "../../common/Toolkit";
import TreeHelper from "./TreeHelpers";
import SkosHelper from "./SkosHelpers";



class Tree extends React.Component {
    constructor (props) {
        super(props)
        this.state = ({
          rootNodes: [],
          rootNodesForSkos: [],
          selectedNodeIri: '',
          showNodeDetailPage: false,
          componentIdentity: "",
          termTree: false,
          propertyTree: false,
          ontologyId: '',      
          childExtractName: "",
          targetNodeIri: "",
          treeDomContent: "",
          resetTreeFlag: false,
          siblingsVisible: false,
          siblingsButtonShow: false,
          subOrFullTreeBtnShow: false,
          reduceBtnActive: true,
          viewMode: true,
          reload: false,
          isLoadingTheComponent: true,
          noNodeExist: false,
          isSkos: false,
          lastSelectedItemId: null 
        })
    
        this.setComponentData = this.setComponentData.bind(this);
        this.buildTheTreeFirstLayer = this.buildTheTreeFirstLayer.bind(this);
        this.processClick = this.processClick.bind(this);
        this.selectNode = this.selectNode.bind(this);
        this.buildTheTree = this.buildTheTree.bind(this);
        this.resetTree = this.resetTree.bind(this);
        this.showSiblings = this.showSiblings.bind(this);
        this.reduceTree = this.reduceTree.bind(this);   
        this.processKeyNavigation = this.processKeyNavigation.bind(this);
        this.loadTheTreeLastState = this.loadTheTreeLastState.bind(this);    
        this.createTreeActionButtons = this.createTreeActionButtons.bind(this);
    }


   
   async setComponentData(){
    let rootNodes = this.props.rootNodes;
    let rootNodesForSkos = this.props.rootNodesForSkos;
    let ontologyId = this.props.ontology;
    let componentIdentity = this.props.componentIdentity;
    let resetFlag = this.state.resetTreeFlag;
    let viewMode = !this.state.reduceBtnActive;
    let reload = this.state.reload;
    let isSkos = this.props.isSkos;
    let termTree = false;
    let propertyTree = false;    
    let childExtractName = "";
    if ((rootNodes.length != 0 && this.state.rootNodes.length == 0) || resetFlag || reload){
        if(componentIdentity === 'term'){         
            termTree = true
            propertyTree = false;
            childExtractName = "terms";
                         
        } 
        else if(componentIdentity === 'property'){
            termTree = false;
            propertyTree = true;
            childExtractName = "properties";              
        }
        else if(componentIdentity === 'individual'){
            termTree = false;
            propertyTree = false;
            childExtractName = "individuals";   
        }

        this.setState({                                              
            rootNodes: rootNodes,
            rootNodesForSkos: rootNodesForSkos,
            componentIdentity: componentIdentity, 
            termTree: termTree,
            propertyTree: propertyTree,
            ontologyId: ontologyId,
            childExtractName: childExtractName,
            resetTreeFlag: false,
            reload: false,
            noNodeExist: false,
            isSkos: isSkos
          }, async () => {
            await this.buildTheTree(resetFlag, viewMode, reload);
          }); 

    }
    else if((rootNodes.length === 0 || rootNodesForSkos.length === 0) && !this.state.noNodeExist && this.props.rootNodeNotExist && componentIdentity !== "individuals"){
      this.setState({
        isLoadingTheComponent: false,
        noNodeExist: true
      });
    }
    
  }


   async buildTheTree(resetFlag, viewMode, reload){
        let target = this.props.iri;
        target =  target ? target.trim() : null;        
        let siblingsButtonShow = this.state.reduceBtnActive;
        let siblingsVisible = !this.state.reduceBtnActive;
        let subOrFullTreeBtnShow = true;
        let treeList = "";
        let targetHasChildren = ""                        
        let listOfNodes =  [];
        let rootNodesWithChildren = [];
        let childrenList = [];  
        let lastSelectedItemId = "";
        let showNodeDetailPage = false;

        if(this.props.lastState && this.props.lastState.treeDomContent !== "" && !this.props.isIndividual){            
            this.loadTheTreeLastState();
            return true;
        }        
        else if (!target || resetFlag){
            let result = [];
            if(this.state.isSkos && this.state.componentIdentity === "individual"){
                result = this.buildTheTreeFirstLayer(this.state.rootNodesForSkos);
            }
            else{
                result = this.buildTheTreeFirstLayer(this.state.rootNodes);
            }                                 
            treeList = result.treeDomContent;
            target = "";            
            siblingsButtonShow = false;
            siblingsVisible = false;
            subOrFullTreeBtnShow = false;           
        }                    
        else if((target != undefined && this.state.targetNodeIri != target) || reload ){
            showNodeDetailPage = true;
            if(this.state.isSkos && this.state.componentIdentity === "individual"){                                
                treeList = await SkosHelper.buildSkosTree(this.state.ontologyId, target, viewMode);                                              
            }
            else{                
                targetHasChildren = await TreeHelper.nodeHasChildren(this.state.ontologyId, target, this.state.componentIdentity);                
                listOfNodes =  await getNodeJsTree(this.state.ontologyId, this.state.childExtractName, target, viewMode);
                rootNodesWithChildren = Toolkit.buildHierarchicalArrayFromFlat(listOfNodes, 'id', 'parent');                           
                if(Toolkit.objectExistInList(rootNodesWithChildren, 'iri', target)){                    
                    // the target node is a root node
                    let result = this.buildTheTreeFirstLayer(rootNodesWithChildren, target);
                    treeList = result.treeDomContent;
                    lastSelectedItemId = result.lastSelectedItemId;
                }
                else{                    
                    for(let i=0; i < rootNodesWithChildren.length; i++){      
                        let treeNode = new TreeNodeController();
                        let result = TreeHelper.setIsExpandedAndHasChildren(rootNodesWithChildren[i]);
                        let isExpanded = result.isExpanded;
                        rootNodesWithChildren[i]['has_children'] = result.hasChildren;      
                        if(rootNodesWithChildren[i].childrenList.length !== 0){
                            treeNode.children = TreeHelper.autoExpandTargetNode(rootNodesWithChildren[i].childrenList, i, target, targetHasChildren);            
                        }
                        let isClicked = false;        
                        let node = treeNode.buildNodeWithReact(rootNodesWithChildren[i], i, isClicked, isExpanded);
                        childrenList.push(node);
                    }
                    treeList = React.createElement("ul", {className: "tree-node-ul", id: "tree-root-ul"}, childrenList);                                        
                }                
            }
                     
        }
        
        this.setState({
            targetNodeIri: target,       
            treeDomContent: treeList,
            selectedNodeIri: target,
            showNodeDetailPage: showNodeDetailPage,
            subOrFullTreeBtnShow: subOrFullTreeBtnShow,            
            reload: false,
            isLoadingTheComponent: false,
            siblingsButtonShow: siblingsButtonShow,
            siblingsVisible: siblingsVisible,
            lastSelectedItemId: lastSelectedItemId
        }, () => {
            this.props.domStateKeeper(treeList, this.state, this.props.componentIdentity);
            this.props.nodeSelectionHandler(target, showNodeDetailPage);
            this.props.iriChangerFunction(target, this.props.componentIdentity);
        });  
    }


    loadTheTreeLastState(){
        let stateObj = this.props.lastState;
        stateObj.isLoadingTheComponent = false;
        this.setState({...stateObj});        
        if(stateObj.selectedNodeIri !== ""){
            let newUrl = Toolkit.setParamInUrl('iri', stateObj.selectedNodeIri)
            this.props.history.push(newUrl);
            this.props.iriChangerFunction(stateObj.selectedNodeIri, this.state.componentIdentity);
            this.props.nodeSelectionHandler(stateObj.selectedNodeIri, true);
        }
        else{
            this.props.nodeSelectionHandler("", false);
        }        
    }


    buildTheTreeFirstLayer(rootNodes, targetSelectedNodeIri=false){        
        let childrenList = [];
        let lastSelectedItemId = 0;
        let sortKey = TreeHelper.getTheNodeSortKey(rootNodes);
        if(sortKey){
            rootNodes = Toolkit.sortListOfObjectsByKey(rootNodes, sortKey, true);
        }        
        for(let i=0; i < rootNodes.length; i++){
            let treeNode = new TreeNodeController();
            let nodeIsClicked = (targetSelectedNodeIri && rootNodes[i].iri === targetSelectedNodeIri)  
            if(nodeIsClicked){
                lastSelectedItemId =  i;
            }  
            let node = treeNode.buildNodeWithReact(rootNodes[i], i, nodeIsClicked);                       
            childrenList.push(node);
        }        
        let treeList = React.createElement("ul", {className: "tree-node-ul", id: "tree-root-ul"}, childrenList);      
        return {"treeDomContent": treeList,  "lastSelectedItemId": lastSelectedItemId};
    }

    
    selectNode(target){    
        if(this.props.isIndividual){
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
            this.props.nodeSelectionHandler(clickedNodeIri, showNodeDetailPage);
            this.setState({
                showNodeDetailPage: showNodeDetailPage,
                selectedNodeIri: clickedNodeIri,
                siblingsButtonShow: false,
                subOrFullTreeBtnShow: true,
                reduceBtnActive: false,
                lastSelectedItemId: clickedNodeId
            }, () =>{
                if(this.state.componentIdentity !== "individual"){
                    this.props.domStateKeeper({__html:document.getElementById("tree-root-ul").outerHTML}, this.state, this.props.componentIdentity);
                }                
            });            
            let newUrl = Toolkit.setParamInUrl('iri', clickedNodeIri);            
            this.props.history.push(newUrl);
            this.props.iriChangerFunction(clickedNodeIri, this.state.componentIdentity);
        }    
    }


    /**
     * Process a click on the tree container div. 
     * @param {*} e 
     */
    processClick(e){        
        if(this.props.isIndividual){
            return true;
        }        
        if (e.target.tagName === "DIV" && e.target.classList.contains("tree-text-container")){             
            this.selectNode(e.target);
        }
        else if (e.target.tagName === "DIV" && e.target.classList.contains("li-label-text")){ 
            this.selectNode(e.target.parentNode);
        }
        else if (e.target.tagName === "I"){
            // expand a node by clicking on the expand icon
            TreeHelper.expandNode(e.target.parentNode, this.state.ontologyId, this.state.childExtractName, this.state.isSkos).then((res) => {
                if(this.state.componentIdentity !== "individual"){
                    this.props.domStateKeeper({__html:document.getElementById("tree-root-ul").outerHTML}, this.state, this.props.componentIdentity);
                }              
            });
        }
    }

    

    processKeyNavigation(event){
        let jumtoItems = document.getElementsByClassName('jumpto-result-text');
        if(jumtoItems.length !== 0){
            return false;
        }
        if(event.code === "ArrowDown" || event.code === "ArrowUp" || event.code === "ArrowRight" || event.code === "ArrowLeft"){            
            event.preventDefault();
        }
        try{
            let lastSelectedItemId = this.state.lastSelectedItemId;
            let treeNode = new TreeNodeController();
            if(!lastSelectedItemId && ["ArrowDown", "ArrowUp"].includes(event.key)){                
                let node = treeNode.getNodeLabelTextById("0");                
                this.selectNode(node);
            }
            else if(lastSelectedItemId && event.key === "ArrowDown"){
                // select the next node. It is either the next siblings or the node first child
                let node = document.getElementById(lastSelectedItemId);
                performArrowDown(node, this.selectNode, this.state.lastSelectedItemId);                                     
                    
            }
            else if(lastSelectedItemId && event.key === "ArrowUp"){
                // select the previous node. It is either the previous siblings or last opened node.
                let node = document.getElementById(lastSelectedItemId);                
                performArrowUp(node, this.selectNode, lastSelectedItemId);
                                       
            }
            else if(lastSelectedItemId && event.key === "ArrowRight"){                
                // Expand the node if it has children. if it is already expanded, move the select into children
                let node = document.getElementById(lastSelectedItemId);                
                if(treeNode.isNodeClosed(node)){
                    TreeHelper.expandNode(node, this.state.ontologyId, this.state.childExtractName, this.state.isSkos).then((res) => {
                        if(this.state.componentIdentity !== "individual"){
                            this.props.domStateKeeper({__html:document.getElementById("tree-root-ul").outerHTML}, this.state, this.props.componentIdentity);
                        }
                    });  
                }
                else if(!treeNode.isNodeLeaf(node)){
                    let childNode = treeNode.getFirstChildLabelText(node.id);
                    this.selectNode(childNode);                    
                    treeNode.scrollToNode(this.state.lastSelectedItemId);
                }                
                 
            }
            else if(lastSelectedItemId && event.key === "ArrowLeft"){
                // Move the selection to the parent. If it is already moved, close the parent.
                let node = document.getElementById(lastSelectedItemId); 
                let parentNode = treeNode.getParentNode(node.id);
                if(treeNode.isNodeExpanded(node)){  
                    TreeHelper.expandNode(node, this.state.ontologyId, this.state.childExtractName).then((res) => {
                        if(this.state.componentIdentity !== "individual"){
                            this.props.domStateKeeper({__html:document.getElementById("tree-root-ul").outerHTML}, this.state, this.props.componentIdentity);
                        }
                    });
                }
                else if(parentNode.tagName === "LI"){
                    parentNode = treeNode.getNodeLabelTextById(parentNode.id);
                    this.selectNode(parentNode);                    
                    treeNode.scrollToNode(this.state.lastSelectedItemId);
                }                 
            }
        }
        catch(e){
            // console.info(e)
        }        
    }
  
  
  resetTree(){
    this.props.history.push(window.location.pathname);
    this.props.domStateKeeper("", this.state, this.props.componentIdentity);
    this.props.nodeSelectionHandler("", false);
    this.props.handleResetTreeInParent();
    this.setState({
      resetTreeFlag: true,
      treeDomContent: "",
      siblingsVisible: false,
      siblingsButtonShow: false,
      reload: false,
      showNodeDetailPage: false,
      subOrFullTreeBtnShow: false,
      lastSelectedItemId: false
    });
  }


async showSiblings(){
        try{    
            let targetNodes = document.getElementsByClassName("targetNodeByIri");        
            if(!this.state.siblingsVisible){
                if(this.state.isSkos && this.props.componentIdentity === "individual"){
                    SkosHelper.showHidesiblingsForSkos(true, this.state.ontologyId, this.state.selectedNodeIri);
                }
                else if(!this.state.isSkos && await TreeHelper.nodeIsRoot(this.state.ontologyId, targetNodes[0].parentNode.dataset.iri, this.state.componentIdentity)){
                    // Target node is a root node            
                    let res = await getNodeJsTree(this.state.ontologyId, this.state.childExtractName, targetNodes[0].parentNode.dataset.iri, 'true') ;
                    TreeHelper.showSiblingsForRootNode(res, targetNodes[0].parentNode.dataset.iri);    
                }
                else{
                    await TreeHelper.showSiblings(targetNodes, this.state.ontologyId, this.state.childExtractName);
                }
                
                this.setState({siblingsVisible: true}, ()=>{ 
                    if(this.state.componentIdentity !== "individual"){
                        this.props.domStateKeeper({__html:document.getElementById("tree-root-ul").outerHTML}, this.state, this.props.componentIdentity);
                    }
                });
            }
            else{
                if(this.state.isSkos && this.props.componentIdentity === "individual"){
                    SkosHelper.showHidesiblingsForSkos(false, this.state.ontologyId, this.state.selectedNodeIri);
                } 
        
                if(!this.state.isSkos && await TreeHelper.nodeIsRoot(this.state.ontologyId, targetNodes[0].parentNode.dataset.iri, this.state.componentIdentity)){
                    // Target node is a root node
                    TreeHelper.hideSiblingsForRootNode(targetNodes[0].parentNode.dataset.iri);
                }
                else{
                    TreeHelper.hideSiblings(targetNodes);
                }
                
                this.setState({siblingsVisible: false}, ()=>{
                    if(this.state.componentIdentity !== "individual"){
                        this.props.domStateKeeper({__html:document.getElementById("tree-root-ul").outerHTML}, this.state, this.props.componentIdentity);
                    }
                });
            }
        }
        catch(e){
            // console.info(e);
        }
        
    }


    /**
     * Reduce tree. show/hide the sub-tree when a node is opened by iri.
     */
    reduceTree(){
        let reduceBtnActive = this.state.reduceBtnActive;  
        let showSiblings = !reduceBtnActive;
        this.props.domStateKeeper("", this.state, this.props.componentIdentity);
        this.setState({
            reduceBtnActive: !reduceBtnActive,
            siblingsButtonShow: showSiblings,
            reload: true, 
            treeDomContent: "",
            isLoadingTheComponent: true
        });
    }


    componentDidMount(){
        this.setComponentData();
        document.addEventListener("keydown", this.processKeyNavigation, false);    
        if(this.props.isSkos && this.props.componentIdentity === "individual"){
            document.getElementsByClassName('tree-container')[0].style.marginTop = '120px';
        }        
    }
    
    componentDidUpdate(){
        this.setComponentData();
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.processKeyNavigation, false);
    }


    createTreeActionButtons(){
        return [
            <div className='row tree-action-button-area'>
                <div className="col-sm-6"></div>                
                <div className="col-sm-5 text-center">
                    <div className='row tree-action-btn-holder'>
                        <div className="col-sm-12">
                            {!this.props.isIndividual && this.state.selectedNodeIri !== "" &&
                                <button className='btn btn-secondary btn-sm tree-action-btn' onClick={this.resetTree}>Reset</button> 
                            }
                        </div>                        
                    </div>
                    <div className='row tree-action-btn-holder'>
                        <div className="col-sm-12">
                            {this.state.subOrFullTreeBtnShow && !this.props.isIndividual &&  
                                <button className='btn btn-secondary btn-sm tree-action-btn' onClick={this.reduceTree}>
                                {!this.state.reduceBtnActive
                                        ? "Sub Tree"
                                        : "Full Tree"
                                }
                                </button>                
                            }
                        </div>                         
                    </div>
                    <div className='row tree-action-btn-holder'>
                        <div className="col-sm-12">
                            {this.state.siblingsButtonShow && !this.props.isIndividual &&
                                <button className='btn btn-secondary btn-sm tree-action-btn' onClick={this.showSiblings}>
                                {!this.state.siblingsVisible
                                    ? "Show Siblings"
                                    : "Hide Siblings"
                                }
                                </button>                
                            }
                        </div>                                                                       
                    </div>
                    <div className='row tree-action-btn-holder'>                                
                        <div className="col-sm-12">
                        {this.props.showListSwitchEnabled &&
                            <button className='btn btn-secondary btn-sm tree-action-btn' onClick={this.props.individualViewChanger}>
                                Show In List
                            </button>
                        }
                        </div>                            
                    </div> 
                </div> 
                <div className="col-sm-1"></div>               
            </div>                      
        ];
    }


    render(){
        return (
            <div className="col-sm-12" onClick={(e) => this.processClick(e)}>
                {this.state.isLoadingTheComponent && <div className="isLoading"></div>}
                {this.state.noNodeExist && <div className="no-node">It is currently not possible to load this tree. Please try later.</div>}
                {!this.state.isLoadingTheComponent && !this.state.noNodeExist && this.createTreeActionButtons()}                
                {!this.state.isLoadingTheComponent && !this.state.noNodeExist && 
                    <div className='row'>
                        {!this.state.treeDomContent.__html 
                        ? <div className='col-sm-12 tree'>{this.state.treeDomContent}</div> 
                        : <div className='col-sm-12 tree' dangerouslySetInnerHTML={{ __html: this.state.treeDomContent.__html}}></div>
                        }                                                    
                    </div>
                }
            </div>
        );
    }
}

export default withRouter(Tree);