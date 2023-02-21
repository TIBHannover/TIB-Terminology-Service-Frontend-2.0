import React from "react";
import {getIndividualsList} from '../../../api/fetchData';
import { withRouter } from 'react-router-dom';
import NodePage from '../NodePage/NodePage';
import {sortIndividuals} from './helpers';
import Tree from "../DataTree/Tree";


class IndividualsList extends React.Component {
    constructor(props){
        super(props);
        this.state = ({
            individuals: [],
            isLoaded: false,
            ontology: "",
            showNodeDetailPage: false,
            selectedNodeIri: "",
            listView: true,
            isRendered: false
        });
        this.loadList = this.loadList.bind(this);
        this.createIndividualList = this.createIndividualList.bind(this);
        this.selectNode = this.selectNode.bind(this);
        this.processClick = this.processClick.bind(this);
        this.createIndividualTree = this.createIndividualTree.bind(this);
        this.switchView = this.switchView.bind(this);
        this.selectNodeOnLoad = this.selectNodeOnLoad.bind(this);
    }


    /**
     * Loads the list of individuals
     */
    async loadList(){
        let ontology = this.props.ontology;        
        try{            
            let indvList = await getIndividualsList(ontology);            
            this.setState({
                isLoaded: true,
                individuals: sortIndividuals(indvList),
                ontology: ontology                
            });
        }
        catch(error){
            this.setState({
                isLoaded: true,
                individuals: [],
                ontology: ontology                
            });
        }
    }


    /**
     * Select a node in list
     * @param {*} e 
     */
    selectNode(target){    
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
            this.props.iriChangerFunction(target.dataset.iri, this.state.componentIdentity);    
        }
        else{
            target.classList.remove("clicked");            
        }    
    }


    /**
     * Select the node that is given by iri in url
     */
    selectNodeOnLoad(){        
        let node = document.getElementById(this.props.iri);
        if(node){
            node.classList.add('clicked');
            document.getElementById(this.props.iri).scrollIntoView();
            this.setState({
                isRendered: true
            });
        }             
    }



    /**
     * Process a click on the list container div. 
     * @param {*} e 
     */
    processClick(e){
        if (e.target.tagName === "SPAN"){ 
            this.selectNode(e.target);
        }       
    }


    /**
     * Create the List view
     * @returns 
     */
    createIndividualList(){
        let result = [];
        let individuals = this.state.individuals;
        for (let indv of individuals){
            result.push(
                <li className="list-node-li">
                    <span className="tree-text-container" data-iri={indv["iri"]} id={indv["iri"]}>
                        {indv["label"]}
                    </span>
                </li>
            );
        }
        return result;
    }


    handleNodeSelection(x, y){

    }


    /**
     * Switch the view from tree to list and vice versa
     */
    switchView(){
        let listview = this.state.listView;        
        this.setState({
            listView: !listview,
            isRendered: false
        });
    }



    /**
     * Show an individuals in the tree view
     */
    createIndividualTree(){
        let result = [
            <Tree 
                rootNodes={this.props.rootNodes}
                componentIdentity={this.props.componentIdentity}
                iri={this.state.selectedNodeIri}
                key={this.props.key}
                ontology={this.props.ontology}
                rootNodeNotExist={false}
                iriChangerFunction={this.props.iriChangerFunction}
                lastState={this.props.lastState}
                domStateKeeper={this.props.domStateKeeper}
                isSkos={this.props.isSkos}
                nodeSelectionHandler={this.handleNodeSelection}
                isIndividual={true}
                individualViewChanger={this.switchView}
            />
        ];
        return result;
    }



    componentDidMount(){
        this.loadList();        
    }

    componentDidUpdate(){
        let showDetailTable = typeof(this.props.iri) !== "undefined"  ? true : false;
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



    render(){
        return(
            <div className="row tree-view-container" onClick={(e) => this.processClick(e)}> 
                <div className="col-sm-6">
                    <div className="row">
                        {this.state.listView && 
                            <div className="col-sm-12 tree-container">
                                {!this.state.isLoaded && <div className="col-sm-12 isLoading"></div>}
                                <div className="row">
                                    <div className="col-sm-10">
                                        <ul>
                                            {this.createIndividualList()}
                                        </ul>
                                    </div>
                                    {typeof(this.props.iri) !== "undefined" &&
                                    <div className="col-sm-2">
                                        <button className='btn btn-secondary btn-sm tree-action-btn sticky-top' onClick={this.switchView}>
                                            {this.state.listView ? "Show In Tree" : ""}
                                        </button>                                
                                    </div>
                                    }

                                </div>
                            </div>
                        }                        
                        {!this.state.listView &&
                            this.createIndividualTree()
                        }                        
                    </div>                    
                </div>                                    
                {this.state.showNodeDetailPage && 
                    <div className="col-sm-6 node-table-container">
                        <NodePage
                        iri={this.state.selectedNodeIri}
                        ontology={this.props.ontology}
                        componentIdentity="individual"
                        extractKey="individuals"
                        isSkos={this.state.isSkos}
                        isIndividual={true}
                        />
                    </div>
                }
            </div>
        );        
    }
}

export default withRouter(IndividualsList);