import React from "react";
import './facet.css';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';



class Facet extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            ontologiesLoaded: false,
            resultTypes: [],
            ontologyFacetData: {}
        });
        this.getAllOntologies = this.getAllOntologies.bind(this);
        this.createOntologiesCheckboxList = this.createOntologiesCheckboxList.bind(this);
        this.createTypesCheckboxList = this.createTypesCheckboxList.bind(this);
    }


    /**
     * process the search result array to get the existing ontologies and their result count
     */
    getAllOntologies(){
        if(!this.state.ontologiesLoaded){
            let facetData = this.props.facetData;
            facetData = facetData["facet_fields"];
            let allTypes = facetData["type"];
            let allOntologies = facetData["ontology_prefix"];
            let ontologyFacetData = {};
            let types = {};
            for(let i=0; i < allOntologies.length; i++){
                if(i % 2 == 0){
                    if(allOntologies[i + 1] !== 0){
                        ontologyFacetData[allOntologies[i]] = allOntologies[i + 1];
                    }                    
                }
            }
            for(let i=0; i < allTypes.length; i++){
                if(i % 2 == 0){
                    if(allTypes[i + 1] !== 0){
                        types[allTypes[i]] = allTypes[i + 1];
                    }                    
                }
            }
            this.setState({
                ontologiesLoaded: true,
                resultTypes: types,
                ontologyFacetData: ontologyFacetData
            });
        }
    }


    /**
     * Create the list of types checkboxes
     * @returns 
     */
    createTypesCheckboxList(){
        let allTypes = this.state.resultTypes;
        let result = [];
        for(let type in allTypes){
            result.push(
                <div class="row typeRow"  key={type}>
                    <div class="col-sm-8">
                        <FormGroup>
                            <FormControlLabel 
                                control={<Checkbox/>}
                                label={type}
                                key={type}
                            />
                        </FormGroup>
                    </div>
                    <div class="col-sm-4">
                        <div class="result-count">{allTypes[type]}</div>
                    </div>                    
                </div>
            );
        }
        return result;
    }


    /**
     * Create the list of ontologies checkbox view
     */
    createOntologiesCheckboxList(){       
        let ontologyFacetData = this.state.ontologyFacetData;
        let result = [];
        for(let ontologyId in ontologyFacetData){
            result.push(
                <div key={ontologyId}>
                    <div class="row ontoloyRow">
                        <div class="col-sm-8">
                            <FormGroup>
                                <FormControlLabel 
                                    control={<Checkbox/>}
                                    label={ontologyId}
                                    key={ontologyId}
                                />
                            </FormGroup>
                        </div>
                        <div class="col-sm-4">
                            <div class="result-count">{ontologyFacetData[ontologyId]}</div>
                        </div>                    
                    </div>
                    <hr/>
                </div>
                
            );
        }
        return result;
    }


    componentDidMount(){
        this.getAllOntologies();
    }

    componentDidUpdate(){
        this.getAllOntologies();
    }


    render(){
        return(
            <div class="row" id="search-facet-container-box">
                <div class="col-sm-12">
                    <h6>{"Result types:"}</h6>
                     <div class="row" id="facet-types-list">                            
                        <div class="col-sm-12">
                            {this.createTypesCheckboxList()}
                        </div>
                    </div>
                    <h6>{"Ontologies:"}</h6>
                    <div class="row" id="facet-ontologies-list">                            
                        <div class="col-sm-12">
                            {this.createOntologiesCheckboxList()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Facet;