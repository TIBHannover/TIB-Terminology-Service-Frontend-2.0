import React from "react";
import {getIndividualsList} from '../../../api/fetchData';


class IndividualsList extends React.Component {
    constructor(props){
        super(props);
        this.state = ({
            individuals: [],
            isLoaded: false,
            ontology: ""
        });
        this.loadList = this.loadList.bind(this);
        this.createIndividualList = this.createIndividualList.bind(this);
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
                individuals: indvList,
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


    createIndividualList(){
        let result = [];
        let individuals = this.state.individuals;
        for (let indv of individuals){
            result.push(
                <li>{indv["label"]}</li>
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
            </div>
        );        
    }
}

export default IndividualsList;