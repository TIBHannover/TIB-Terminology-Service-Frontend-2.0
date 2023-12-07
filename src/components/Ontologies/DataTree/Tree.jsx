import React, {useState, useEffect, useRef} from "react";
import { useHistory } from "react-router";
import 'font-awesome/css/font-awesome.min.css';
import { getNodeJsTree} from '../../../api/fetchData';
import TreeNodeController from "./TreeNode";
import Toolkit from "../../common/Toolkit";
import TreeHelper from "./TreeHelpers";
import SkosHelper from "./SkosHelpers";
import KeyboardNavigator from "./KeyboardNavigation";




const Tree = (props) => {    
    let url = new URL(window.location);
    let targetQueryParams = url.searchParams;

    const [treeDomContent, setTreeDomContent] = useState(''); 
    const [componentLastHtmlContent, setComponentLastHtmlContent] = useState(null); 
    const [childExtractName, setChildExtractName] = useState(props.componentIdentity);
    const [resetTreeFlag, setResetTreeFlag] = useState(false);
    const [siblingsVisible, setSiblingsVisible] = useState(false);
    const [siblingsButtonShow, setSiblingsButtonShow] = useState(targetQueryParams.get('iri') ? true : false);
    const [subOrFullTreeBtnShow, setSubOrFullTreeBtnShow] = useState(targetQueryParams.get('iri') ? true : false);
    const [subTreeMode, setSubTreeMode] = useState(targetQueryParams.get('iri') ? true : false);
    const [reload, setReload] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [noNodeExist, setNoNodeExist] = useState(false);    
    const [obsoletesShown, setObsoletesShown] = useState(targetQueryParams.get('obsoletes') === "true" ? true : false);
    const [keyboardNavigationManager, setKeyboardNavigationManager] = useState(new KeyboardNavigator(null, selectNode, expandNodeHandler)); 
    const [firstTimeLoad, setFirstTimeLoad] = useState(props.lastState ? false : false);

    const history = useHistory();    
    const componentRef = useRef(null);


    function saveComponentStateInParent(){
        // Used when user changes the tabs to avoid component running on each tab change and load the last state.        
        const states = JSON.stringify({            
            childExtractName,
            resetTreeFlag,
            siblingsVisible,
            siblingsButtonShow,
            subOrFullTreeBtnShow,
            subTreeMode,
            reload,
            isLoading,
            noNodeExist,
            obsoletesShown
        });

        // const componentHTML = document.getElementById('tree-ul-container').innerHTML;      
        // console.info(componentRef.current.outerHTML)
        const componentHTML = componentRef.current.innerHTML;      
        if(props.componentIdentity !== "individuals"){
            props.domStateKeeper({"_html_":componentHTML}, states, props.componentIdentity, props.selectedNodeIri);
        }        
        return true;
    }


    
    function setComponentData(){                      
        let extractName = props.componentIdentity;             
        if (props.rootNodes.length != 0 || resetTreeFlag || reload){                                                
            setChildExtractName(extractName);
            setResetTreeFlag(false);
            setReload(false);
            setNoNodeExist(false);            
        }
        else if((props.rootNodes.length === 0 || props.rootNodesForSkos.length === 0) && !noNodeExist && props.rootNodeNotExist && props.componentIdentity !== "individuals"){
            setIsLoading(false);
            setNoNodeExist(true);            
        }        
    }


    async function buildTheTree(){        
        let target = props.selectedNodeIri;
        target =  target ? target.trim() : null;        
        let siblingsVisible = false;
        let treeFullView = !subTreeMode;        
        let treeList = "";
        let targetHasChildren = ""                        
        let listOfNodes =  [];
        let rootNodesWithChildren = [];
        let childrenList = [];  
        let selectedItemId = "";
        let showNodeDetailPage = false;       
        
        if(firstTimeLoad && props.lastState && props.lastState.html && !props.isIndividual){            
            loadTheTreeLastState();            
            return true;
        }                
        if (!target || resetTreeFlag){
            let result = [];
            if(props.isSkos && props.componentIdentity === "individuals"){
                result = buildTheTreeFirstLayer(props.rootNodesForSkos);
            }
            else{                
                result = buildTheTreeFirstLayer(props.rootNodes);
            }                                 
            treeList = result.treeDomContent;
            target = "";                        
            siblingsVisible = false;                       
        }                    
        else if(target != undefined || reload){            
            showNodeDetailPage = true;                             
            if(props.isSkos && props.componentIdentity === "individuals"){                                
                treeList = await SkosHelper.buildSkosTree(props.ontologyId, target, treeFullView);                                              
            }
            else{                
                targetHasChildren = await TreeHelper.nodeHasChildren(props.ontologyId, target, props.componentIdentity);                
                listOfNodes =  await getNodeJsTree(props.ontologyId, childExtractName, target, treeFullView);
                rootNodesWithChildren = Toolkit.buildHierarchicalArrayFromFlat(listOfNodes, 'id', 'parent');                           
                if(Toolkit.objectExistInList(rootNodesWithChildren, 'iri', target)){                    
                    // the target node is a root node
                    let result = buildTheTreeFirstLayer(rootNodesWithChildren, target);
                    treeList = result.treeDomContent;
                    selectedItemId = result.selectedItemId;
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
                        [childrenList, selectedItemId] = TreeHelper.renderObsoletes(props.obsoleteTerms, childrenList, i, target);
                     }

                    treeList = React.createElement("ul", {className: "tree-node-ul", id: "tree-root-ul"}, childrenList);                                        
                }                
            }
                     
        }
        
        setTreeDomContent(treeList);        
        setReload(false);              
        setSiblingsVisible(siblingsVisible);                      
        keyboardNavigationManager.updateSelectedNodeId(selectedItemId);        
        props.iriChangerFunction(target, props.componentIdentity);         
    }


   


    function loadTheTreeLastState(){
        setComponentLastHtmlContent(props.lastState.html);
        setChildExtractName(props.lastState.states.childExtractName);        
        setSiblingsVisible(props.lastState.states.siblingsVisible);
        setSiblingsButtonShow(props.lastState.states.siblingsButtonShow);
        setSubOrFullTreeBtnShow(props.lastState.states.subOrFullTreeBtnShow);
        setSubTreeMode(props.lastState.states.subTreeMode);  
        setIsLoading(false);
        setNoNodeExist(props.lastState.states.noNodeExist);
        setObsoletesShown(props.lastState.states.obsoletesShown);
        setFirstTimeLoad(false);
        if(props.lastState.lastIri){
            let newUrl = Toolkit.setParamInUrl('iri', props.lastState.lastIri);
            history.push(newUrl);
            props.iriChangerFunction(props.lastState.lastIri, props.componentIdentity);
            props.handleNodeSelectionInDataTree(props.lastState.lastIri, true);
            return true;
        }
        props.handleNodeSelectionInDataTree("", false);        
        return true;       
    }


    function buildTheTreeFirstLayer(rootNodes, targetSelectedNodeIri=false){        
        let childrenList = [];
        let selectedItemId = 0;
        let sortKey = TreeHelper.getTheNodeSortKey(rootNodes);
        if(sortKey){
            rootNodes = Toolkit.sortListOfObjectsByKey(rootNodes, sortKey, true);
        }
        let i = 0;        
        for(i=0; i < rootNodes.length; i++){
            let treeNode = new TreeNodeController();
            let nodeIsClicked = (targetSelectedNodeIri && rootNodes[i].iri === targetSelectedNodeIri)  
            if(nodeIsClicked){
                selectedItemId =  i;
            }  
            let node = treeNode.buildNodeWithReact(rootNodes[i], i, nodeIsClicked);                       
            childrenList.push(node);
        }
        
        if(obsoletesShown){            
           [childrenList, selectedItemId] = TreeHelper.renderObsoletes(props.obsoleteTerms, childrenList, i, targetSelectedNodeIri);
        }

        let treeList = React.createElement("ul", {className: "tree-node-ul", id: "tree-root-ul"}, childrenList);      
        return {"treeDomContent": treeList,  "selectedItemId": selectedItemId};
    }



    


    function resetTree(){        
        history.push(window.location.pathname);
        // saveComponentStateInParent();       
        props.handleResetTreeInParent();
        setResetTreeFlag(true);
        setTreeDomContent("");
        setSiblingsVisible(false);
        setSiblingsButtonShow(false);
        setReload(true);
        setSubOrFullTreeBtnShow(false);
        setSubTreeMode(false);        
        keyboardNavigationManager.updateSelectedNodeId(null);
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
                    let res = await getNodeJsTree(props.ontologyId, childExtractName, targetNodes[0].parentNode.dataset.iri, 'true');
                    TreeHelper.showSiblingsForRootNode(res, targetNodes[0].parentNode.dataset.iri);    
                }
                else{
                    await TreeHelper.showSiblings(targetNodes, props.ontologyId, childExtractName);
                }                                
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
            }

            setSiblingsVisible(!siblingsVisible);   
            saveComponentStateInParent();         
        }
        catch(e){
            // console.info(e);
        }
        
    }



    function reduceTree(){                        
        let showSubtreeFlag = subTreeMode;        
        setSubTreeMode(!showSubtreeFlag);
        setSiblingsButtonShow(!showSubtreeFlag);
        setTreeDomContent("");
        setIsLoading(true);
        setReload(true);        
    }


    function showObsoletes(){                      
        let newUrl = Toolkit.setParamInUrl("obsoletes", !obsoletesShown);        
        history.push(newUrl);
        setReload(true);
        setIsLoading(true);
        setTreeDomContent("");
        setObsoletesShown(!obsoletesShown);        
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
            expandNodeHandler(e.target.parentNode);         
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
            // setSubTreeMode(false);            
            keyboardNavigationManager.updateSelectedNodeId(clickedNodeId);                                           
            let locationObject = window.location;
            const searchParams = new URLSearchParams(locationObject.search);
            searchParams.set('iri', clickedNodeIri);               
            searchParams.delete('noteId');        
            history.push(locationObject.pathname + "?" +  searchParams.toString());
            props.iriChangerFunction(clickedNodeIri, props.componentIdentity);
            saveComponentStateInParent();
        }    
    }



    async function expandNodeHandler(node){        
        await TreeHelper.expandNode(node, props.ontologyId, childExtractName, props.isSkos);
        saveComponentStateInParent(); 
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
                    {props.componentIdentity !== "individuals" && 
                        <div className='row tree-action-btn-holder'>
                            <div className="col-sm-12">                            
                                <button className='btn btn-secondary btn-sm tree-action-btn' onClick={showObsoletes}>
                                    {!obsoletesShown ? "Show Obsoletes" : "Hide Obsoletes"}
                                </button>                             
                            </div>                        
                        </div>
                    }
                    <div className='row tree-action-btn-holder'>
                        <div className="col-sm-12">
                            {subOrFullTreeBtnShow && !props.isIndividual &&  
                                <button className='btn btn-secondary btn-sm tree-action-btn' onClick={reduceTree}>
                                {!subTreeMode
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
            </div>                      
        ];
    }

    
    const handleKeyDown = (event) => {            
        keyboardNavigationManager.run(event);
    };


    useEffect(() => {       
        setComponentData();     
        // saveComponentStateInParent();              
        if(props.isSkos && props.componentIdentity === "individuals"){
            document.getElementsByClassName('tree-container')[0].style.marginTop = '120px';            
        }    
        document.addEventListener("keydown", handleKeyDown, false);          

        setTimeout(() => {
            setIsLoading(false);              
        }, 2000);
        
        return () => {            
            document.removeEventListener("keydown", handleKeyDown, false);                        
        };        
    }, []);


    useEffect(() => {
        setComponentData();
        buildTheTree();        
        setTimeout(() => {
            setIsLoading(false);  
            saveComponentStateInParent();
        }, 2000);         
               
    }, [props.rootNodes,  resetTreeFlag, reload]);


    // if(componentLastHtmlContent){
    //     // console.log(componentLastHtmlContent)
    //     return(            
    //         <div 
    //             className="col-sm-12" 
    //             onClick={(e) => processClick(e)}                     
    //             id="tree-ul-container" 
    //             dangerouslySetInnerHTML={{ __html: componentLastHtmlContent._html_}}
    //         >
    //         </div>
    //     );
    // }

    return(
        <div className="col-sm-12" onClick={(e) => processClick(e)} id="tree-ul-container" ref={componentRef}>
                {isLoading && <div className="isLoading"></div>}
                {noNodeExist && <div className="no-node">It is currently not possible to load this tree. Please try later.</div>}
                {!isLoading && !noNodeExist && createTreeActionButtons()}                
                {!isLoading && !noNodeExist && 
                    <div className='row'>
                        <div className='col-sm-12 tree'>{treeDomContent}</div> 
                    </div>
                }
        </div>
    );
}

export default Tree;