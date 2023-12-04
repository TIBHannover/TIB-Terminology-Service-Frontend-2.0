import React, {useState, useEffect} from "react";
import { useHistory } from "react-router";
import 'font-awesome/css/font-awesome.min.css';
import { getNodeJsTree} from '../../../api/fetchData';
import TreeNodeController from "./TreeNode";
import { performArrowDown, performArrowUp} from "./KeyboardNavigation";
import Toolkit from "../../common/Toolkit";
import TreeHelper from "./TreeHelpers";
import SkosHelper from "./SkosHelpers";




const Tree = (props) => {

    const  [treeDomContent, setTreeDomContent] = useState('');    
    const  [childExtractName, setChildExtractName] = useState('');
    const  [resetTreeFlag, setResetTreeFlag] = useState(false);
    const  [siblingsVisible, setSiblingsVisible] = useState(false);
    const  [siblingsButtonShow, setSiblingsButtonShow] = useState(false);
    const  [subOrFullTreeBtnShow, setSubOrFullTreeBtnShow] = useState(false);
    const  [reduceBtnActive, setReduceBtnActive] = useState(true);
    const  [viewMode, setViewMode] = useState(true);
    const  [reload, setReload] = useState(false);
    const  [isLoading, setIsLoading] = useState(true);
    const  [noNodeExist, setNoNodeExist] = useState(false);
    const  [lastSelectedItemId, setLastSelectedItemId] = useState(null);
    const  [obsoletesShown, setObsoletesShown] = useState(false);    


    const history = useHistory();


    function setComponentData(){
        let url = new URL(window.location);
        let targetQueryParams = url.searchParams;
        let showObsoltes = targetQueryParams.get('obsoletes') === "true" ? true : false;      
        let childExtractName = "1";     
        if (props.rootNodes.length != 0 || resetTreeFlag || reload){                
            if(props.componentIdentity === 'terms'){                         
                childExtractName = "terms";
                             
            } 
            else if(props.componentIdentity === 'props'){                
                childExtractName = "properties";              
            }
            else if(props.componentIdentity === 'individuals'){                
                childExtractName = "individuals";   
            }
            
            setChildExtractName(childExtractName);
            setResetTreeFlag(false);
            setReload(false);
            setNoNodeExist(false);
            setObsoletesShown(showObsoltes);
        }
        else if((props.rootNodes.length === 0 || props.rootNodesForSkos.length === 0) && !noNodeExist && props.rootNodeNotExist && props.componentIdentity !== "individuals"){
            setIsLoading(false);
            setNoNodeExist(true);            
        }        
    }



    async function buildTheTree(){
        let target = props.iri;
        target =  target ? target.trim() : null;        
        let siblingsButtonShow = reduceBtnActive;
        let siblingsVisible = !reduceBtnActive;
        let subOrFullTreeBtnShow = true;
        let treeList = "";
        let targetHasChildren = ""                        
        let listOfNodes =  [];
        let rootNodesWithChildren = [];
        let childrenList = [];  
        let lastSelectedItemId = "";
        let showNodeDetailPage = false;       

        if(props.lastState && props.lastState.treeDomContent !== "" && !props.isIndividual){            
            loadTheTreeLastState();            
            return true;
        }        
        else if (!target || resetTreeFlag){
            let result = [];
            if(props.isSkos && props.componentIdentity === "individuals"){
                result = buildTheTreeFirstLayer(props.rootNodesForSkos);
            }
            else{                
                result = buildTheTreeFirstLayer(props.rootNodes);
            }                                 
            treeList = result.treeDomContent;
            target = "";            
            siblingsButtonShow = false;
            siblingsVisible = false;
            subOrFullTreeBtnShow = false;           
        }                    
        else if(target != undefined || reload){            
            showNodeDetailPage = true;
            if(props.isSkos && props.componentIdentity === "individuals"){                                
                treeList = await SkosHelper.buildSkosTree(props.ontologyId, target, viewMode);                                              
            }
            else{                
                targetHasChildren = await TreeHelper.nodeHasChildren(props.ontologyId, target, props.componentIdentity);                
                listOfNodes =  await getNodeJsTree(props.ontologyId, childExtractName, target, viewMode);
                rootNodesWithChildren = Toolkit.buildHierarchicalArrayFromFlat(listOfNodes, 'id', 'parent');                           
                if(Toolkit.objectExistInList(rootNodesWithChildren, 'iri', target)){                    
                    // the target node is a root node
                    let result = buildTheTreeFirstLayer(rootNodesWithChildren, target);
                    treeList = result.treeDomContent;
                    lastSelectedItemId = result.lastSelectedItemId;
                }
                else{ 
                    let i = 0;                  
                    for(i=0; i < rootNodesWithChildren.length; i++){      
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

                    if(obsoletesShown){            
                        [childrenList, lastSelectedItemId] = TreeHelper.renderObsoletes(props.obsoleteTerms, childrenList, i, target);
                     }

                    treeList = React.createElement("ul", {className: "tree-node-ul", id: "tree-root-ul"}, childrenList);                                        
                }                
            }
                     
        }
        
        setTreeDomContent(treeList);
        setSubOrFullTreeBtnShow(subOrFullTreeBtnShow);
        setReload(false);
        setIsLoading(false);
        setSiblingsButtonShow(siblingsButtonShow);
        setSiblingsVisible(siblingsVisible);
        setLastSelectedItemId(lastSelectedItemId);
        // props.domStateKeeper(treeList, this.state, this.props.componentIdentity);
        // props.handleNodeSelectionInDataTree(target, showNodeDetailPage);
        props.iriChangerFunction(target, props.componentIdentity); 
    }


    function loadTheTreeLastState(){
        let stateObj = props.lastState;
        // stateObj.isLoadingTheComponent = false;
        // this.setState({...stateObj});        
        // if(stateObj.selectedNodeIri !== ""){
        //     let newUrl = Toolkit.setParamInUrl('iri', stateObj.selectedNodeIri)
        //     this.props.history.push(newUrl);
        //     this.props.iriChangerFunction(stateObj.selectedNodeIri, this.state.componentIdentity);
        //     this.props.handleNodeSelectionInDataTree(stateObj.selectedNodeIri, true);
        // }
        // else{
        //     this.props.handleNodeSelectionInDataTree("", false);
        // }        
    }


    function buildTheTreeFirstLayer(rootNodes, targetSelectedNodeIri=false){        
        let childrenList = [];
        let lastSelectedItemId = 0;
        let sortKey = TreeHelper.getTheNodeSortKey(rootNodes);
        if(sortKey){
            rootNodes = Toolkit.sortListOfObjectsByKey(rootNodes, sortKey, true);
        }
        let i = 0;        
        for(i=0; i < rootNodes.length; i++){
            let treeNode = new TreeNodeController();
            let nodeIsClicked = (targetSelectedNodeIri && rootNodes[i].iri === targetSelectedNodeIri)  
            if(nodeIsClicked){
                lastSelectedItemId =  i;
            }  
            let node = treeNode.buildNodeWithReact(rootNodes[i], i, nodeIsClicked);                       
            childrenList.push(node);
        }
        
        if(obsoletesShown){            
           [childrenList, lastSelectedItemId] = TreeHelper.renderObsoletes(props.obsoleteTerms, childrenList, i, targetSelectedNodeIri);
        }

        let treeList = React.createElement("ul", {className: "tree-node-ul", id: "tree-root-ul"}, childrenList);      
        return {"treeDomContent": treeList,  "lastSelectedItemId": lastSelectedItemId};
    }



    function processKeyNavigation(event){
        let jumtoItems = document.getElementsByClassName('jumpto-result-text');
        if(jumtoItems.length !== 0){
            return false;
        }
        if(event.code === "ArrowDown" || event.code === "ArrowUp" || event.code === "ArrowRight" || event.code === "ArrowLeft"){            
            event.preventDefault();
        }
        try{            
            let treeNode = new TreeNodeController();
            if(!lastSelectedItemId && ["ArrowDown", "ArrowUp"].includes(event.key)){                
                let node = treeNode.getNodeLabelTextById("0");                
                selectNode(node);
            }
            else if(lastSelectedItemId && event.key === "ArrowDown"){
                // select the next node. It is either the next siblings or the node first child
                let node = document.getElementById(lastSelectedItemId);
                performArrowDown(node, selectNode, lastSelectedItemId);                                     
                    
            }
            else if(lastSelectedItemId && event.key === "ArrowUp"){
                // select the previous node. It is either the previous siblings or last opened node.
                let node = document.getElementById(lastSelectedItemId);                
                performArrowUp(node, selectNode, lastSelectedItemId);
                                       
            }
            else if(lastSelectedItemId && event.key === "ArrowRight"){                
                // Expand the node if it has children. if it is already expanded, move the select into children
                let node = document.getElementById(lastSelectedItemId);                
                if(treeNode.isNodeClosed(node)){
                    TreeHelper.expandNode(node, props.ontologyId, childExtractName, props.isSkos).then((res) => {
                        if(props.componentIdentity !== "individuals"){
                            // this.props.domStateKeeper({__html:document.getElementById("tree-root-ul").outerHTML}, this.state, this.props.componentIdentity);
                        }
                    });  
                }
                else if(!treeNode.isNodeLeaf(node)){
                    let childNode = treeNode.getFirstChildLabelText(node.id);
                    selectNode(childNode);                    
                    treeNode.scrollToNode(lastSelectedItemId);
                }                
                 
            }
            else if(lastSelectedItemId && event.key === "ArrowLeft"){
                // Move the selection to the parent. If it is already moved, close the parent.
                let node = document.getElementById(lastSelectedItemId); 
                let parentNode = treeNode.getParentNode(node.id);
                if(treeNode.isNodeExpanded(node)){  
                    TreeHelper.expandNode(node, props.ontologyId, childExtractName).then((res) => {
                        if(props.componentIdentity !== "individuals"){
                            // this.props.domStateKeeper({__html:document.getElementById("tree-root-ul").outerHTML}, this.state, this.props.componentIdentity);
                        }
                    });
                }
                else if(parentNode.tagName === "LI"){
                    parentNode = treeNode.getNodeLabelTextById(parentNode.id);
                    selectNode(parentNode);                    
                    treeNode.scrollToNode(lastSelectedItemId);
                }                 
            }
        }
        catch(e){
            // console.info(e)
        }        
    }


    function resetTree(){        
        history.push(window.location.pathname);
        // props.domStateKeeper("", this.state, this.props.componentIdentity);
        props.handleNodeSelectionInDataTree("", false);
        // props.handleResetTreeInParent();
        setResetTreeFlag(true);
        setTreeDomContent("");
        setSiblingsVisible(false);
        setSiblingsButtonShow(false);
        setReload(true);
        setSubOrFullTreeBtnShow(false);
        setLastSelectedItemId(false);    
    }



    async function showSiblings(){
        try{    
            let targetNodes = document.getElementsByClassName("targetNodeByIri");        
            if(!siblingsVisible){
                if(props.isSkos && props.componentIdentity === "individuals"){
                    SkosHelper.showHidesiblingsForSkos(true, props.ontologyId, props.selectedNodeIri);
                }
                else if(!props.isSkos && await TreeHelper.nodeIsRoot(props.ontologyId, targetNodes[0].parentNode.dataset.iri, props.componentIdentity)){
                    // Target node is a root node            
                    let res = await getNodeJsTree(props.ontologyId, childExtractName, targetNodes[0].parentNode.dataset.iri, 'true') ;
                    TreeHelper.showSiblingsForRootNode(res, targetNodes[0].parentNode.dataset.iri);    
                }
                else{
                    await TreeHelper.showSiblings(targetNodes, props.ontologyId, childExtractName);
                }
                
                // this.setState({siblingsVisible: true}, ()=>{ 
                //     if(props.componentIdentity !== "individuals"){
                //         // this.props.domStateKeeper({__html:document.getElementById("tree-root-ul").outerHTML}, this.state, this.props.componentIdentity);
                //     }
                // });
            }
            else{
                if(props.isSkos && props.componentIdentity === "individuals"){
                    SkosHelper.showHidesiblingsForSkos(false, props.ontologyId, props.selectedNodeIri);
                } 
        
                if(!props.isSkos && await TreeHelper.nodeIsRoot(props.ontologyId, targetNodes[0].parentNode.dataset.iri, props.componentIdentity)){
                    // Target node is a root node
                    TreeHelper.hideSiblingsForRootNode(targetNodes[0].parentNode.dataset.iri);
                }
                else{
                    TreeHelper.hideSiblings(targetNodes);
                }
                
                // this.setState({siblingsVisible: false}, ()=>{
                //     if(props.componentIdentity !== "individuals"){
                //         // this.props.domStateKeeper({__html:document.getElementById("tree-root-ul").outerHTML}, this.state, this.props.componentIdentity);
                //     }
                // });
            }
        }
        catch(e){
            // console.info(e);
        }
        
    }



    function reduceTree(){        
        let showSiblings = !reduceBtnActive;
        let showObsolete = props.showNodeDetailPage ? false : obsoletesShown;
        // this.props.domStateKeeper("", this.state, this.props.componentIdentity);
        setReduceBtnActive(showSiblings);
        setSiblingsButtonShow(showSiblings);
        setReload(true);
        setTreeDomContent("");
        setIsLoading(true);
        setObsoletesShown(showObsolete);       
    }


    function showObsoletes(){        
        // this.props.domStateKeeper("", this.state, this.props.componentIdentity);            
        let newUrl = Toolkit.setParamInUrl("obsoletes", !obsoletesShown);        
        history.push(newUrl);
        setReload(true);
        setIsLoading(true);
        setTreeDomContent("");        
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
            TreeHelper.expandNode(e.target.parentNode, props.ontologyId, childExtractName, props.isSkos).then((res) => {
                if(props.componentIdentity !== "individuals"){
                    // props.domStateKeeper({__html:document.getElementById("tree-root-ul").outerHTML}, this.state, this.props.componentIdentity);
                }              
            });
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
            props.handleNodeSelectionInDataTree(clickedNodeIri, showNodeDetailPage)
            setSiblingsButtonShow(false);
            setSubOrFullTreeBtnShow(true);
            setReduceBtnActive(false);
            setLastSelectedItemId(clickedNodeId);
            // if(this.state.componentIdentity !== "individuals"){
                //         this.props.domStateKeeper({__html:document.getElementById("tree-root-ul").outerHTML}, this.state, this.props.componentIdentity);
                //     }
                                 
            let locationObject = window.location;
            const searchParams = new URLSearchParams(locationObject.search);
            searchParams.set('iri', clickedNodeIri);               
            searchParams.delete('noteId');        
            history.push(locationObject.pathname + "?" +  searchParams.toString());
            props.iriChangerFunction(clickedNodeIri, props.componentIdentity);
        }    
    }



    function createTreeActionButtons(){
        return [
            <div className='row tree-action-button-area'>                
                <div className="col-sm-12 text-right">
                    <div className='row tree-action-btn-holder'>
                        <div className="col-sm-12">
                            {!props.isIndividual && props.selectedNodeIri !== "" &&
                                <button className='btn btn-secondary btn-sm tree-action-btn' onClick={resetTree}>Reset</button> 
                            }
                        </div>                        
                    </div>
                    <div className='row tree-action-btn-holder'>
                        <div className="col-sm-12">                            
                            <button className='btn btn-secondary btn-sm tree-action-btn' onClick={showObsoletes}>
                                {!obsoletesShown ? "Show Obsoletes" : "Hide Obsoletes"}
                            </button>                             
                        </div>                        
                    </div>
                    <div className='row tree-action-btn-holder'>
                        <div className="col-sm-12">
                            {subOrFullTreeBtnShow && !props.isIndividual &&  
                                <button className='btn btn-secondary btn-sm tree-action-btn' onClick={reduceTree}>
                                {!reduceBtnActive
                                        ? "Sub Tree"
                                        : "Full Tree"
                                }
                                </button>                
                            }
                        </div>                         
                    </div>
                    <div className='row tree-action-btn-holder'>
                        <div className="col-sm-12">
                            {siblingsButtonShow && !props.isIndividual &&
                                <button className='btn btn-secondary btn-sm tree-action-btn' onClick={showSiblings}>
                                {!siblingsVisible
                                    ? "Show Siblings"
                                    : "Hide Siblings"
                                }
                                </button>                
                            }
                        </div>                                                                       
                    </div>
                    <div className='row tree-action-btn-holder'>                                
                        <div className="col-sm-12">
                        {props.showListSwitchEnabled &&
                            <button className='btn btn-secondary btn-sm tree-action-btn' onClick={props.individualViewChanger}>
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


    useEffect(() => {
        setComponentData();
        document.addEventListener("keydown", processKeyNavigation, false);    
        if(props.isSkos && props.componentIdentity === "individuals"){
            document.getElementsByClassName('tree-container')[0].style.marginTop = '120px';
        }    

        return () => {
            document.removeEventListener("keydown", processKeyNavigation, false);
        };
    }, []);


    useEffect(() => {
        setComponentData();
        buildTheTree();
    }, [props.rootNodes, resetTreeFlag, reload]);



    return(
        <div className="col-sm-12" onClick={(e) => processClick(e)}>
                {isLoading && <div className="isLoading"></div>}
                {noNodeExist && <div className="no-node">It is currently not possible to load this tree. Please try later.</div>}
                {!isLoading && !noNodeExist && createTreeActionButtons()}                
                {!isLoading && !noNodeExist && 
                    <div className='row'>
                        {!treeDomContent.__html 
                        ? <div className='col-sm-12 tree'>{treeDomContent}</div> 
                        : <div className='col-sm-12 tree' dangerouslySetInnerHTML={{ __html: treeDomContent.__html}}></div>
                        }                                                    
                    </div>
                }
        </div>
    );
}

export default Tree;