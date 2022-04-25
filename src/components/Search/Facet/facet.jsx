import React from "react";
import './facet.css';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {getChemOntologies} from '../../../api/nfdi4chemapi';


class Facet extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            allOntologies: [],
            allOntologiesIds: [],
            ontologiesLoaded: false,
            ontologiesResultCount: [],
            resultTypes: []
        });
        this.getAllOntologies = this.getAllOntologies.bind(this);
        this.createOntologiesCheckboxList = this.createOntologiesCheckboxList.bind(this);
    }


    /**
     * process the search result array to get the existing ontologies and their result count
     */
    getAllOntologies(){
        if(!this.state.ontologiesLoaded){
            let facetData = this.props.facetData;
            facetData = facetData["facet_fields"];
            let allTypes = facetData["type"];
            let allIds = [];
            let ontologyResultCount = [];
            let allOntologies = facetData["ontology_prefix"];
            for(let i=0; i < allOntologies.length; i++){
                if(!allIds.includes(allOntologies[i]['ontology_name'])){
                    allIds.push(allOntologies[i]['ontology_name']);
                    ontologyResultCount.push(1);
                }
                else{
                    ontologyResultCount[allIds.indexOf(allOntologies[i]['ontology_name'])] += 1;
                }                                
            }
            this.setState({
                ontologiesLoaded: true,
                allOntologies: allOntologies,
                ontologiesResultCount: ontologyResultCount,
                allOntologiesIds: allIds,
                resultTypes: allTypes
            });
        }
    }


    /**
     * Create the list of ontologies checkbox view
     */
    createOntologiesCheckboxList(){       
        let Ids = this.state.allOntologiesIds;
        let result = [];
        for(let i=0; i < Ids.length; i++){
            result.push(
                <div class="row ontoloyRow"  key={Ids[i]}>
                    <div class="col-sm-8">
                        <FormGroup>
                            <FormControlLabel 
                                control={<Checkbox/>}
                                label={Ids[i]}
                                key={Ids[i]}
                            />
                        </FormGroup>
                    </div>
                    <div class="col-sm-4">
                        <div class="ontology-result-count">{this.state.ontologiesResultCount[i]}</div>
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
                            {this.createOntologiesCheckboxList()}
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