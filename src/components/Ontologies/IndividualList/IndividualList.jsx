import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import TermApi from "../../../api/term";
import TermDetail from "../TermDetail/TermDetail";
import Tree from "../DataTree/Tree";
import PaneResize from "../../common/PaneResize/PaneResize";
import Toolkit from "../../../Libs/Toolkit";
import JumpTo from "../../common/JumpTo/JumpTo";
import { RenderIndividualList } from "./RenderIndividualList";
import { OntologyPageContext } from "../../../context/OntologyPageContext";




const IndividualsList = (props) => {

    const ontologyPageContext = useContext(OntologyPageContext);
    const lastVisitedIri = ontologyPageContext.lastVisitedIri[props.componentIdentity];

    const [individuals, setIndividuals] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);    
    const [showNodeDetailPage, setShowNodeDetailPage] = useState(false);
    const [selectedNodeIri, setSelectedNodeIri] = useState("");
    const [jumpToIri, setJumpToIri] = useState(null);
    const [listView, setListView] = useState(true);
    const [JumpToOnLoad, setJumpToOnload] = useState(false);
    const [paneResizeClass, setPaneResizeClass] = useState(new PaneResize());

    const history = useHistory();

    
    async function setComponentData(){           
        try{                           
            let termApi = new TermApi(ontologyPageContext.ontology.ontologyId, null, props.componentIdentity);
            let indvList = await termApi.fetchListOfTerms(0, 10000);   
            indvList = indvList["results"];                
            setIsLoaded(true);
            setIndividuals(sortIndividuals(indvList));                                          
            if(lastVisitedIri && lastVisitedIri !== " " && typeof(lastVisitedIri) !== "undefined"){
                let newUrl = Toolkit.setParamInUrl('iri', lastVisitedIri)                
                history.push(newUrl);
                setSelectedNodeIri(lastVisitedIri);
                setJumpToOnload(true);    
                setJumpToIri(lastVisitedIri);           
                ontologyPageContext.storeIriForComponent(lastVisitedIri, props.componentIdentity);              
            }            
        }
        catch(error){
            setIsLoaded(true);
            setIndividuals(sortIndividuals([]));                   
        }
    }



    function selectNodeOnLoad(){
        if(ontologyPageContext.isSkos && !listView){
            return true;
        }                
        let node = document.getElementById(selectedNodeIri);
        if(node){            
            node.classList.add('clicked');            
            let position = document.getElementById(selectedNodeIri).offsetTop;
            document.getElementsByClassName('tree-page-left-part')[0].scrollTop = position;   
            setJumpToOnload(false);                     
        }             
    }



    function selectNode(target){ 
        if(ontologyPageContext.isSkos && !listView){
            return true;
        }        
        let selectedElement = document.querySelectorAll(".clicked");
        for(let i=0; i < selectedElement.length; i++){
            selectedElement[i].classList.remove("clicked");
        }
        if(!target.classList.contains("clicked")  && target.tagName === "SPAN"){            
            target.classList.add("clicked");
            setShowNodeDetailPage(true);
            setSelectedNodeIri(target.dataset.iri);            
            let newUrl = Toolkit.setParamInUrl('iri', target.dataset.iri)            
            history.push(newUrl);
            ontologyPageContext.storeIriForComponent(target.dataset.iri, props.componentIdentity);    
        }
        else{
            target.classList.remove("clicked");            
        }    
    }



    function processClick(e){        
        if(ontologyPageContext.isSkos && !listView){            
            return true;
        } 
        if(!listView){
            // select a class on the individual tree. Load the tree view for the class
            if(e.target.parentNode.parentNode.classList.contains("opened")){
                let path = window.location.pathname;
                let targetIri = encodeURIComponent(e.target.parentNode.parentNode.dataset.iri);
                path = path.split("individuals")[0];
                window.location.replace(path + "terms?iri=" + targetIri);
            }
        }        
        else if (e.target.tagName === "SPAN"){ 
            selectNode(e.target);
        }       
    }


    function handleNodeSelectionInTreeView(selectedNodeIri, showDetailTable){
        if(ontologyPageContext.isSkos){
            setSelectedNodeIri(selectedNodeIri);
            setShowNodeDetailPage(showDetailTable);            
        }
    }



    function switchView(){
        setJumpToOnload(!listView);
        setListView(!listView);                
    }



    function handleResetTreeEvent(){    
        paneResizeClass.resetTheWidthToOrignial();
        setListView(false);
        setSelectedNodeIri("");
        setShowNodeDetailPage(false);        
    }


    function sortIndividuals (individuals) {
        return individuals.sort(function (a, b) {
          let x = a["label"]; 
          let y = b["label"];      
          return (x<y ? -1 : 1 )
        })
    }



    function createIndividualTree(){
        let result = [
            <div className='tree-container'>
                <Tree 
                    rootNodes={props.rootNodes}
                    obsoleteTerms={[]}   
                    rootNodesForSkos={props.rootNodesForSkos}
                    componentIdentity={props.componentIdentity}
                    selectedNodeIri={selectedNodeIri}
                    key={props.key}                    
                    rootNodeNotExist={ontologyPageContext.isSkos ? props.rootNodesForSkos.length === 0 : props.rootNodes.length === 0}                    
                    lastState={props.lastState}                                
                    handleNodeSelectionInDataTree={handleNodeSelectionInTreeView}
                    isIndividual={ontologyPageContext.isSkos ? false : true}
                    showListSwitchEnabled={true}
                    individualViewChanger={switchView}     
                    handleResetTreeInParent={handleResetTreeEvent}
                    jumpToIri={jumpToIri}           
                />
            </div>          
        ];
        return result;
    }


    function handleJumtoSelection(selectedTerm){    
        if(selectedTerm){                 
            setSelectedNodeIri(selectedTerm['iri']);
            setJumpToIri(selectedTerm['iri']);
            setJumpToOnload(true);      
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set('iri', selectedTerm['iri']);  
            history.push(window.location.pathname + "?" +  searchParams.toString());
            let selectedElement = document.querySelectorAll(".clicked");
            for(let i=0; i < selectedElement.length; i++){
                    selectedElement[i].classList.remove("clicked");
            }
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
    

    useEffect(() => {                             
        if(selectedNodeIri !== ""){
            setShowNodeDetailPage(true);            
        }
        if(JumpToOnLoad){
            selectNodeOnLoad();
        }    
    }, [selectedNodeIri, JumpToOnLoad, listView]);



    useEffect(() => {                                     
        setListView(ontologyPageContext.isSkos ? false : true);
    }, [ontologyPageContext.isSkos]);



    return (
        <div className="tree-view-container resizable-container" onClick={(e) =>  processClick(e)}>                                 
            <div className="tree-page-left-part" id="page-left-pane">                  
                <div className='row autosuggest-sticky'>
                    <div className='col-sm-10'>
                        <JumpTo
                            targetType={props.componentIdentity}                            
                            label={"Jump to"}
                            handleJumtoSelection={handleJumtoSelection}
                            obsoletes={false}
                        />    
                    </div>
                </div>                
                {listView && 
                    <RenderIndividualList 
                        individuals={individuals}
                        isLoaded={isLoaded}
                        iri={selectedNodeIri}
                        listView={listView}
                        switchViewFunction={switchView}                            
                    />
                }                                            
                {!listView && createIndividualTree()}                       
            </div>
            {showNodeDetailPage && paneResizeClass.generateVerticalResizeLine()}                                
            {showNodeDetailPage &&
                <div className="node-table-container" id="page-right-pane">                     
                    <TermDetail
                        iri={selectedNodeIri}                        
                        componentIdentity="individuals"
                        extractKey="individuals"                        
                        isIndividual={true}
                        typeForNote="individual"
                    />                    
                </div>
            }
        </div>
    );

}


export default IndividualsList;