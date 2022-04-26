import { on } from "events";
import React from "react";
import Facet from './facet'


class FacetTester extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            searchResult: {
                "facet_fields": {
                    "ontology_prefix": ["CHEBI", 213, "MS", 94, "HP", 0],
                    "type": ["class", 523, "individual", 0, "property", 6, "ontology", 1]
                } 
            },
            result: []
        });
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(ontologies, types){
        let result = [];
        for(let i=0; i<types.length; i++){
            result.push(
                <div key={types[i]}>
                    {types[i]}
                </div>
            );
        }
        this.setState({
            result: result
        });
    }

    render(){
        return(
            <div class="row">
                <div class="col-sm-3">
                    <Facet 
                        facetData={this.state.searchResult}
                        handleChange={this.handleChange}
                    />
                </div>
                <div class="col-sm-9">
                   {this.state.result}
                </div>
            </div>
        );
    }
}

export default FacetTester