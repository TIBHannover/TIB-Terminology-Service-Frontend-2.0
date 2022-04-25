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
            ontologiesLoaded: false
        });
        this.getAllOntologies = this.getAllOntologies.bind(this);
        this.createOntologiesCheckboxList = this.createOntologiesCheckboxList.bind(this);
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


    /**
     * Create the list of ontologies checkbox view
     */
    createOntologiesCheckboxList(){
        let Ids = this.state.allOntologiesIds;
        let result = [];
        for(let i=0; i < Ids.length; i++){
            result.push(
                <div class="row ontoloyRow"  key={Ids[i]}>
                    <div class="col-sm-10">
                        <FormGroup>
                            <FormControlLabel 
                                control={<Checkbox/>}
                                label={Ids[i]}
                                key={Ids[i]}
                            />
                        </FormGroup>
                    </div>
                    <div class="col-sm-2">
                        <div class="ontology-result-count">0</div>
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


    render(){
        return(
            <div class="row" id="search-facet-container-box">
                <div class="col-sm-12">
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