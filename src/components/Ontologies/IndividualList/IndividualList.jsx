import React from "react";
import {getIndividualsList} from '../../../api/fetchData';
import { withRouter } from 'react-router-dom';
import NodePage from '../NodePage/NodePage';
import {sortIndividuals} from './helpers';
import Tree from "../DataTree/Tree";
import JumpTo from "../JumpTo/Jumpto";
import PaneResize from "../../common/PaneResize/PaneResize";



class IndividualsList extends React.Component {
    constructor(props){
        super(props);
        this.state = ({
            individuals: [],
            isLoaded: false,
            ontology: "",
            showNodeDetailPage: false,
            selectedNodeIri: " ",
            listView: true,
            isRendered: false            
        });
        this.paneResize = new PaneResize();
        this.setComponentData = this.setComponentData.bind(this);
        this.createIndividualList = this.createIndividualList.bind(this);
        this.selectNode = this.selectNode.bind(this);
        this.processClick = this.processClick.bind(this);
        this.createIndividualTree = this.createIndividualTree.bind(this);
        this.switchView = this.switchView.bind(this);
        this.selectNodeOnLoad = this.selectNodeOnLoad.bind(this);
        this.renderIndividualListSection = this.renderIndividualListSection.bind(this);
        this.createActionButtonSection = this.createActionButtonSection.bind(this);
        this.handleNodeSelectionInTreeView = this.handleNodeSelectionInTreeView.bind(this);
    }


    async setComponentData(){
        let ontology = this.props.ontology;        
        try{            
            let indvList = await getIndividualsList(ontology);            
            this.setState({
                isLoaded: true,
                individuals: sortIndividuals(indvList),
                ontology: ontology,
                listView: !this.props.isSkos
            });
            if(this.props.iri !== " " && typeof(this.props.iri) !== "undefined"){
                let currentUrlParams = new URLSearchParams();
                currentUrlParams.append('iri', this.props.iri);
                this.props.history.push(window.location.pathname + "?" + currentUrlParams.toString());
                this.props.iriChangerFunction(this.props.iri, this.props.componentIdentity);              
            }
        }
        catch(error){
            this.setState({
                isLoaded: true,
                individuals: [],
                ontology: ontology                
            });
        }
    }

   
    selectNode(target){ 
        if(this.props.isSkos && !this.state.listView){
            return true;
        }        
        let selectedElement = document.querySelectorAll(".clicked");
        for(let i=0; i < selectedElement.length; i++){
            selectedElement[i].classList.remove("clicked");
        }
        if(!target.classList.contains("clicked")  && target.tagName === "SPAN"){            
            target.classList.add("clicked");
            this.setState({
                showNodeDetailPage: true,
                selectedNodeIri: target.dataset.iri,
            });
            let currentUrlParams = new URLSearchParams();
            currentUrlParams.append('iri', target.dataset.iri);
            this.props.history.push(window.location.pathname + "?" + currentUrlParams.toString());
            this.props.iriChangerFunction(target.dataset.iri, this.props.componentIdentity);    
        }
        else{
            target.classList.remove("clicked");            
        }    
    }

    
    selectNodeOnLoad(){
        if(this.props.isSkos && !this.state.listView){
            return true;
        }      
        let node = document.getElementById(this.props.iri);
        if(node){            
            node.classList.add('clicked');            
            let position = document.getElementById(this.props.iri).offsetTop;
            document.getElementsByClassName('tree-page-left-part')[0].scrollTop = position;            
            this.setState({
                isRendered: true
            });
        }             
    }


    
    processClick(e){        
        if(this.props.isSkos && !this.state.listView){            
            return true;
        } 
        if(!this.state.listView){
            // select a class on the individual tree. Load the tree view for the class
            if(e.target.parentNode.parentNode.classList.contains("opened")){
                let path = window.location.pathname;
                let targetIri = encodeURIComponent(e.target.parentNode.parentNode.dataset.iri);
                path = path.split("individuals")[0];
                window.location.replace(path + "terms?iri=" + targetIri);
            }
        }        
        else if (e.target.tagName === "SPAN"){ 
            this.selectNode(e.target);
        }       
    }


    createIndividualList(){
        let result = [];
        let individuals = this.state.individuals;
        for (let indv of individuals){
            result.push(
                <li className="list-node-li">
                    <span className="tree-text-container" data-iri={indv["iri"]} id={indv["iri"]}>
                        {indv["label"] !== "" ? indv["label"] : "N/A"}
                    </span>
                </li>
            );
        }
        if (result.length === 0 && this.state.isLoaded){
            result.push(
                <div className="alert alert-success">
                    This ontology has no individual.
                </div>
            );
        }
        return result;
    }


    handleNodeSelectionInTreeView(selectedNodeIri, ShowDetailTable, componentIdentity="individual"){
        if(this.props.isSkos){
            this.setState({
                selectedNodeIri: selectedNodeIri,
                showNodeDetailPage: ShowDetailTable
              });
        }
    }

    
    switchView(){
        let listview = this.state.listView;        
        this.setState({
            listView: !listview,
            isRendered: false
        });
    }



    createIndividualTree(){
        let result = [
            <div className='tree-container'>
                <Tree 
                    rootNodes={this.props.rootNodes}
                    componentIdentity={this.props.componentIdentity}
                    iri={this.state.selectedNodeIri}
                    key={this.props.key}
                    ontology={this.props.ontology}
                    rootNodeNotExist={this.props.isSkos ? false : true}
                    iriChangerFunction={this.props.iriChangerFunction}
                    lastState={this.props.lastState}
                    domStateKeeper={this.props.domStateKeeper}
                    isSkos={this.props.isSkos}
                    nodeSelectionHandler={this.handleNodeSelectionInTreeView}
                    isIndividual={this.props.isSkos ? false : true}
                    showListSwitchEnabled={true}
                    individualViewChanger={this.switchView}                
                />
            </div>          
        ];
        return result;
    }


    createActionButtonSection(){
        return [
            typeof(this.props.iri) !== "undefined" && this.props.iri !== " "  && this.state.individuals.length !== 0 &&
                <div className="row tree-action-button-holder">                    
                    <div className="col-sm-12">
                        <button className='btn btn-secondary btn-sm tree-action-btn' onClick={this.switchView}>
                            {this.state.listView ? "Show In Tree" : ""}
                        </button>                                
                    </div>                    
                </div>                    
                   
        ];
    }


    renderIndividualListSection(){
        return [
            <div className="col-sm-12">
                {!this.state.isLoaded && <div className="col-sm-12 isLoading"></div>}                    
                <div className="row">
                    <div className="col-sm-12">
                        <ul>
                            {this.createIndividualList()}
                        </ul>
                    </div>                    
                </div>
            </div>
        ];
    }



    componentDidMount(){
        this.setComponentData();
        document.body.addEventListener("mousedown", this.paneResize.onMouseDown);
        document.body.addEventListener("mousemove", this.paneResize.moveToResize);
        document.body.addEventListener("mouseup", this.paneResize.releaseMouseFromResize);                              
    }

    componentDidUpdate(){
        let showDetailTable = typeof(this.props.iri) !== "undefined" ? true : false;   
        if(this.props.iri !== this.state.selectedNodeIri){
            this.setState({
                showNodeDetailPage: showDetailTable,
                selectedNodeIri: this.props.iri
            });
        }
        if(!this.state.isRendered){
            this.selectNodeOnLoad();
        }        
    }

    componentWillUnmount(){  
        document.body.addEventListener("mousedown", this.paneResize.onMouseDown);
        document.body.addEventListener("mousemove", this.paneResize.moveToResize);
        document.body.addEventListener("mouseup", this.paneResize.releaseMouseFromResize);
      }



    render(){
        return(
            <div className="tree-view-container resizable-container" onClick={(e) =>  this.processClick(e)}>                                 
                <div className="tree-page-left-part" id="page-left-pane">
                  <JumpTo
                    ontologyId={this.props.ontology}
                    isSkos={this.props.isSkos}
                    componentIdentity={this.props.componentIdentity}          
                   />
                   <div className='row tree-action-button-area'>
                        <div className="col-sm-6"></div> 
                        <div className="col-sm-5 text-center">
                            {this.createActionButtonSection()}
                        </div>
                        <div className="col-sm-1"></div>   
                   </div>                   
                    <div>                        
                        {this.state.listView && this.renderIndividualListSection()} 
                        {!this.state.listView && this.createIndividualTree()}
                    </div>                    
                </div>
                {this.paneResize.generateVerticalResizeLine()}                                
                <div className="node-table-container" id="page-right-pane">
                    {this.state.showNodeDetailPage &&                     
                            <NodePage
                            iri={this.state.selectedNodeIri}
                            ontology={this.props.ontology}
                            componentIdentity="individual"
                            extractKey="individuals"
                            isSkos={this.state.isSkos}
                            isIndividual={true}
                            />                    
                    }
                </div>
            </div>
        );        
    }
}

export default withRouter(IndividualsList);