import React from "react";
import {getIndividualsList} from '../../../api/fetchData';
import { withRouter } from 'react-router-dom';
import NodePage from '../NodePage/NodePage';
import {sortIndividuals} from './helpers';


class IndividualsList extends React.Component {
    constructor(props){
        super(props);
        this.state = ({
            individuals: [],
            isLoaded: false,
            ontology: "",
            showNodeDetailPage: false,
            selectedNodeIri: ""
        });
        this.loadList = this.loadList.bind(this);
        this.createIndividualList = this.createIndividualList.bind(this);
        this.selectNode = this.selectNode.bind(this);
        this.processClick = this.processClick.bind(this);
    }


    /**
     * Loads the list of individuals
     */
    async loadList(){
        let ontology = this.props.ontology;
        try{            
            let indvList = await getIndividualsList(ontology)
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
     * Process a click on the list container div. 
     * @param {*} e 
     */
    processClick(e){
        if (e.target.tagName === "SPAN"){ 
            this.selectNode(e.target);
        }       
    }


    createIndividualList(){
        let result = [];
        let individuals = this.state.individuals;
        for (let indv of individuals){
            result.push(
                <li className="list-node-li">
                    <span className="tree-text-container" data-iri={indv["iri"]}>
                        {indv["label"]}
                    </span>
                </li>
            );
        }
        return result;
    }



    componentDidMount(){
        this.loadList();
    }



    render(){
        return(
            <div className="row tree-view-container" onClick={(e) => this.processClick(e)}> 
                <div className="col-sm-6 tree-container">
                    <ul>
                        {this.createIndividualList()}
                    </ul>
                </div>
                {this.state.showNodeDetailPage && 
                    <div className="col-sm-6 node-table-container">
                        <NodePage
                        iri={this.state.selectedNodeIri}
                        ontology={this.state.ontology}
                        componentIdentity="individuals"
                        extractKey="individuals"
                        isSkos={this.state.isSkos}
                        />
                    </div>
                }
            </div>
        );        
    }
}

export default withRouter(IndividualsList);