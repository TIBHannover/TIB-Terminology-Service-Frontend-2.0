import React from "react";
import './facet.css';
import {getChemOntologies} from '../../../api/nfdi4chemapi';


class Facet extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            allOntologies: [],
            allOntologiesIds: [],
            ontologiesLoaded: false
        });
        this.getAllOntologies = this.getAllOntologies.bind(this);
    }


    /**
     * Get a list of all ontologies
     */
    async getAllOntologies(){
        if(!this.state.ontologiesLoaded){
            let allOntologies = await getChemOntologies();
            let allIds = [];
            for(let i=0; i < allOntologies.length; i++){
                allIds.push(allOntologies[i]['ontologyId']);
            }
            this.setState({
                ontologiesLoaded: true,
                allOntologies: allOntologies,
                allOntologiesIds: allIds
            });
        }
    }


    componentDidMount(){
        this.getAllOntologies();
    }


    render(){
        return(
            <div class="row" id="search-facet-container-box">
                <div class="col-sm-12">
                    <div class="row">
                        <div class="col-sm-12">
                            hh
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Facet;