import React from "react";
import Facet from './facet'


class FacetTester extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            searchResult: [{"ontology_name": "ms", "type": "class"}, {"ontology_name": "chebi", "type": "class"}, {"ontology_name": "ms", "type": "property"}]
        });
    }

    render(){
        return(
            <div class="row">
                <div class="col-sm-3">
                    <Facet 
                        searchResults={this.state.searchResult}
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