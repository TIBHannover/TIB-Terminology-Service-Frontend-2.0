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
            }
        });
    }

    render(){
        return(
            <div class="row">
                <div class="col-sm-3">
                    <Facet 
                        facetData={this.state.searchResult}
                    />
                </div>
                <div class="col-sm-9">
                    search result
                </div>
            </div>
        );
    }
}

export default FacetTester