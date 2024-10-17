import React, {useState, useEffect, useContext} from "react";
import PropTypes from 'prop-types';
import 'font-awesome/css/font-awesome.min.css';
import TermApi from "../../../api/term";
import TreeNodeController from "./TreeNode";
import Toolkit from "../../../Libs/Toolkit";
import TreeHelper from "./TreeHelpers";
import SkosHelper from "./SkosHelpers";
import KeyboardNavigator from "./KeyboardNavigation";
import { OntologyPageContext } from "../../../context/OntologyPageContext";
import CommonUrlFactory from "../../../UrlFactory/CommonUrlFactory";
import * as SiteUrlParamNames from '../../../UrlFactory/UrlParamNames';




const Tree = (props) => {    
    /* 
        Renders the Tree view. 
        The component builds tree in this way ( function buildTheTree() )
            - If Last state exist, do not build the tree and load the last state. Used on Tab change in Ontology Page
            - If there is No input iri, build the tree first layer using root nodes.
            - If there is an iri, then loads the subtree and build the tree recursively. 
        
        Note that SKOS tree requires different approach compare to classes/properties. The reason the API response format is 
        different. (for instance Narrower/Broader instead of parent/child)

        The tree supports Keyboard Navigation. Look at: KeyboardNavigation.jsx

        Context:
            The component needs OntologyPage context. Look at src/context/OntologyPageContext.js
    */


    const ontologyPageContext = useContext(OntologyPageContext);
    const lastState = ontologyPageContext.tabLastStates[props.componentIdentity];
    const urlFacory = new CommonUrlFactory(); 

    const [treeDomContent, setTreeDomContent] = useState('');     
    const [childExtractName, setChildExtractName] = useState(props.componentIdentity);
    const [resetTreeFlag, setResetTreeFlag] = useState(false);
    const [siblingsVisible, setSiblingsVisible] = useState(false);
    const [siblingsButtonShow, setSiblingsButtonShow] = useState(urlFacory.getIri() ? true : false);
    const [subOrFullTreeBtnShow, setSubOrFullTreeBtnShow] = useState(urlFacory.getIri() ? true : false);
    const [subTreeMode, setSubTreeMode] = useState(urlFacory.getIri() ? true : false);
    const [reload, setReload] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [noNodeExist, setNoNodeExist] = useState(false);    
    const [obsoletesShown, setObsoletesShown] = useState(Toolkit.getObsoleteFlagValue());
    const [keyboardNavigationManager, setKeyboardNavigationManager] = useState(new KeyboardNavigator(null, selectNode, expandNodeHandler)); 
    const [firstTimeLoad, setFirstTimeLoad] = useState(lastState ? true : false);        


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
            noNodeExist            
        });

        const componentHTML = document.getElementById('tree-root-ul')?.innerHTML;        
        if(props.componentIdentity !== "individuals" && componentHTML){           
            ontologyPageContext.storeState({"_html_":componentHTML}, states, props.componentIdentity, props.selectedNodeIri);
        }        
        return true;
    }


    
    function setComponentData(){                      
        let extractName = props.componentIdentity;             
        if (props.rootNodes.length != 0 || resetTreeFlag || reload){                                                
            setChildExtractName(extractName);           
            setReload(false);
            setNoNodeExist(false);            
        }
        else if((props.rootNodes.length === 0 || props.rootNodesForSkos.length === 0) && !noNodeExist && props.componentIdentity !== "individuals"){
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
        
        if(firstTimeLoad && lastState && lastState.html && !props.isIndividual){            
            loadTheTreeLastState();            
            return true;
        }                
        if (!target || resetTreeFlag){            
            let result = [];
            if(ontologyPageContext.isSkos && props.componentIdentity === "individuals"){                
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
            if(ontologyPageContext.isSkos && props.componentIdentity === "individuals"){                                
                treeList = await SkosHelper.buildSkosTree(ontologyPageContext.ontology.ontologyId, target, treeFullView);                                              
            }
            else{                
                targetHasChildren = await TreeHelper.nodeHasChildren(ontologyPageContext.ontology.ontologyId, target, props.componentIdentity);
                let termApi = new TermApi(ontologyPageContext.ontology.ontologyId, target, childExtractName);                                
                listOfNodes =  await termApi.getNodeJsTree(treeFullView);
                rootNodesWithChildren = Toolkit.buildHierarchicalArrayFromFlat(listOfNodes, 'id', 'parent');                           
                if(Toolkit.getObjectInListIfExist(rootNodesWithChildren, 'iri', target)){                    
                    // the target node is a root node
                    let result = buildTheTreeFirstLayer(rootNodesWithChildren, target);
                    treeList = result.treeDomContent;
                    selectedItemId = result.selectedItemId;
                }
                else{ 
                    let i = 0;                  
                    for(i=0; i < rootNodesWithChildren.length; i++){  
                        if (rootNodesWithChildren[i].iri === "http://www.w3.org/2002/07/owl#Thing"){
                            continue;
                        }    
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
        setResetTreeFlag(false);                    
        keyboardNavigationManager.updateSelectedNodeId(selectedItemId);        
        ontologyPageContext.storeIriForComponent(target, props.componentIdentity);         
    }


   


    function loadTheTreeLastState(){          
        let lastStates =  JSON.parse(lastState.states);            
        setTreeDomContent(lastState.html);
        setChildExtractName(lastStates.childExtractName);        
        setSiblingsVisible(lastStates.siblingsVisible);
        setSiblingsButtonShow(lastStates.siblingsButtonShow);
        setSubOrFullTreeBtnShow(lastStates.subOrFullTreeBtnShow);
        setSubTreeMode(lastStates.subTreeMode);  
        setIsLoading(false);
        setNoNodeExist(lastStates.noNodeExist);        
        setFirstTimeLoad(false);
        if(lastState.lastIri){                        
            urlFacory.setIri({newIri:lastState.lastIri});            
            ontologyPageContext.storeIriForComponent(lastState.lastIri, props.componentIdentity);
            props.handleNodeSelectionInDataTree(lastState.lastIri, true);
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
            if (rootNodes[i].iri === "http://www.w3.org/2002/07/owl#Thing"){
                continue;
            }  
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
        urlFacory.resetUrl();    
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
                if(ontologyPageContext.isSkos && props.componentIdentity === "individuals"){
                    SkosHelper.showHidesiblingsForSkos(true, ontologyPageContext.ontology.ontologyId, props.selectedNodeIri);
                }
                else if(!ontologyPageContext.isSkos && await TreeHelper.nodeIsRoot(ontologyPageContext.ontology.ontologyId, targetNodes[0].parentNode.dataset.iri, props.componentIdentity)){
                    // Target node is a root node            
                    let termApi = new TermApi(ontologyPageContext.ontology.ontologyId, targetNodes[0].parentNode.dataset.iri, childExtractName);  
                    let res = await termApi.getNodeJsTree('true');
                    TreeHelper.showSiblingsForRootNode(res, targetNodes[0].parentNode.dataset.iri);    
                }
                else{
                    await TreeHelper.showSiblings(targetNodes, ontologyPageContext.ontology.ontologyId, childExtractName);
                }                                
            }
            else{
                if(ontologyPageContext.isSkos && props.componentIdentity === "individuals"){
                    SkosHelper.showHidesiblingsForSkos(false, ontologyPageContext.ontology.ontologyId, props.selectedNodeIri);
                } 
        
                if(!ontologyPageContext.isSkos && await TreeHelper.nodeIsRoot(ontologyPageContext.ontology.ontologyId, targetNodes[0].parentNode.dataset.iri, props.componentIdentity)){
                    // Target node is a root node
                    TreeHelper.hideSiblingsForRootNode(targetNodes[0].parentNode.dataset.iri);
                }
                else{
                    TreeHelper.hideSiblings(targetNodes);
                }                                
            }

            setSiblingsVisible(!siblingsVisible);               
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
        Toolkit.setObsoleteInStorageAndUrl(!obsoletesShown);
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
            props.handleNodeSelectionInDataTree(clickedNodeIri, showNodeDetailPage);            
            setSiblingsButtonShow(false);
            setSubOrFullTreeBtnShow(true);
            setSubTreeMode(false);            
            keyboardNavigationManager.updateSelectedNodeId(clickedNodeId);                                    
            urlFacory.setIri({newIri:clickedNodeIri});
            urlFacory.deleteParam({name: SiteUrlParamNames.NoteId});
            urlFacory.deleteParam({name: SiteUrlParamNames.SubTabInTermTable});
            ontologyPageContext.storeIriForComponent(clickedNodeIri, props.componentIdentity);            
        }    
    }



    async function expandNodeHandler(node){        
        await TreeHelper.expandNode(node, ontologyPageContext.ontology.ontologyId, childExtractName, ontologyPageContext.isSkos);
        saveComponentStateInParent(); 
    }



    function createTreeActionButtons(){
        return [
            <div className='row tree-action-button-area'>                
                <div className="col-sm-12 text-right">
                    <div className='row tree-action-btn-holder'>                                
                        <div className="col-sm-12">
                            {props.showListSwitchEnabled &&
                                // Used for individuals
                                <button className='btn btn-secondary btn-sm tree-action-btn' onClick={props.individualViewChanger}>
                                    Show In List
                                </button>
                            }
                        </div>                            
                    </div> 
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
                </div>                             
            </div>                      
        ];
    }

    
    const handleKeyDown = (event) => {                   
        keyboardNavigationManager.run(event);
    };


    useEffect(() => {       
        setComponentData();     
        buildTheTree();                         
        if(ontologyPageContext.isSkos && props.componentIdentity === "individuals"){
            document.getElementsByClassName('tree-container')[0].style.marginTop = '120px';            
        }    
        document.addEventListener("keydown", handleKeyDown, false);          

                
        return () => {            
            document.removeEventListener("keydown", handleKeyDown, false);                        
        };        
    }, []);


    useEffect(() => {                
        buildTheTree();  
        setIsLoading(false); 
        setTimeout(() => {             
            saveComponentStateInParent();
        }, 2000);                                
               
    }, [resetTreeFlag, reload]);


    useEffect(() => {        
        if(props.jumpToIri){                   
            setIsLoading(true);            
            setSubTreeMode(true);
            setSiblingsButtonShow(true);
            setSubOrFullTreeBtnShow(true);
            setReload(true);
        }                                                  
    }, [props.jumpToIri]);


    useEffect(() => {
        saveComponentStateInParent();                           
    }, [obsoletesShown, siblingsVisible, subTreeMode]);


    return(
        <div className="col-sm-12" onClick={(e) => processClick(e)}>
                {isLoading && <div className="isLoading"></div>}                
                {!isLoading && !noNodeExist && createTreeActionButtons()}                
                {!isLoading && !noNodeExist && 
                    <div className='row'>                    
                        {!treeDomContent._html_ 
                        ? <div className='col-sm-12 tree'>{treeDomContent}</div> 
                        : <div className='col-sm-12 tree' dangerouslySetInnerHTML={{ __html: treeDomContent._html_}}></div>
                        }                                                    
                    </div>

                }                
        </div>
    );
}


Tree.propTypes = {
    rootNodes: PropTypes.array.isRequired,
    obsoleteTerms: PropTypes.array,
    rootNodesForSkos: PropTypes.array,
    componentIdentity: PropTypes.string.isRequired,
    selectedNodeIri: PropTypes.string,
    handleNodeSelectionInDataTree: PropTypes.func.isRequired,
    individualViewChanger: PropTypes.func.isRequired,
    handleResetTreeInParent: PropTypes.func.isRequired,
    jumpToIri: PropTypes.string,
    rootNodeNotExist: PropTypes.bool,
    isIndividual: PropTypes.bool,
    showListSwitchEnabled: PropTypes.bool,
};


export default Tree;