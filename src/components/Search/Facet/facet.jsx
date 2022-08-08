import React from "react";
import '../../layout/Search.css';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


class Facet extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            resultLoaded: false,
            resultTypes: [],
            ontologyFacetData: {},
            selectedOntologies: [],
            selectedTypes: [],
            ontologyListShowAll: false,
            countOfShownOntologies: 5,
            showMoreLessOntologiesText: "+ Show More",
            selectedCollections: []
        });
        this.processFacetData = this.processFacetData.bind(this);
        this.createOntologiesCheckboxList = this.createOntologiesCheckboxList.bind(this);
        this.createTypesCheckboxList = this.createTypesCheckboxList.bind(this);
        this.handleOntologyCheckBoxClick = this.handleOntologyCheckBoxClick.bind(this);
        this.handleTypesCheckBoxClick = this.handleTypesCheckBoxClick.bind(this);
        this.handleOntologyShowMoreClick = this.handleOntologyShowMoreClick.bind(this);
        this.createCollectionsCheckBoxes = this.createCollectionsCheckBoxes.bind(this);
        this.handleCollectionsCheckboxClick = this.handleCollectionsCheckboxClick.bind(this);
    }


    /**
     * process the search result array to get the existing ontologies and their result count
     */
    processFacetData(){        
        let facetData = this.props.facetData;
        if (facetData.length == 0 || typeof facetData["facet_fields"] == "undefined"){
            this.setState({
                resultLoaded: true,
                resultTypes: {},
                ontologyFacetData: {}
            });
        }
        else{
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
                resultLoaded: true,
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
                <div class="row typeRow facet-item-row"  key={type}>
                    <div class="col-sm-9">
                        <FormGroup>
                            <FormControlLabel 
                                control={<Checkbox  onClick={this.handleTypesCheckBoxClick} />}
                                label={type}
                                key={type}                                
                                value={type}
                            />
                        </FormGroup>
                    </div>
                    <div class="col-sm-3">
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
        let counter = 1;
        for(let ontologyId in ontologyFacetData){
            if (counter > this.state.countOfShownOntologies && !this.state.ontologyListShowAll){
                break;
            }
            result.push(
                <div key={ontologyId}>
                    <div class="row ontoloyRow facet-item-row">
                        <div class="col-sm-9">
                            <FormGroup>
                                <FormControlLabel 
                                    control={<Checkbox onClick={this.handleOntologyCheckBoxClick} />}
                                    label={ontologyId}
                                    key={ontologyId}
                                    value={ontologyId}
                                />
                            </FormGroup>
                        </div>
                        <div class="col-sm-3">
                            <div class="result-count">{ontologyFacetData[ontologyId]}</div>
                        </div>                    
                    </div>                    
                </div>                
            );
            counter += 1;
        }
        return result;
    }


    /**
     * Create the collection facet box     
     * @returns 
     */
    createCollectionsCheckBoxes(){
        let allCollections = this.props.collections;
        let result = [];
        for (let record of allCollections){
            result.push(
            <div className="row facet-item-row">
                <div className='col-sm-9'>
                <FormGroup>
                    {<FormControlLabel 
                            control={<Checkbox  onClick={this.handleCollectionsCheckboxClick} />}
                            label={record['collection']}
                            key={record['collection']}                      
                            value={record['collection']}                    
                        />
                    }
                </FormGroup>
                </div>                
            </div>
            );
        }
        return result;
    }

    
    /**
     * Handle click on the ontologies checkboxes
     */
    handleOntologyCheckBoxClick(e){
        let selectedOntologies = this.state.selectedOntologies;
        if(e.target.checked){
            selectedOntologies.push(e.target.value.toUpperCase());
            this.setState({
                selectedOntologies: selectedOntologies
            });
        }
        else{
            let index = selectedOntologies.indexOf(e.target.value.toUpperCase());
            selectedOntologies.splice(index, 1);
            this.setState({
                selectedOntologies: selectedOntologies
            });
        }
        this.props.handleChange(this.state.selectedOntologies, this.state.selectedTypes, this.state.selectedCollections);                
    }


    /**
     * Handle click on the type checkboxes
     */
     handleTypesCheckBoxClick(e){
        let selectedTypes = this.state.selectedTypes;
        if(e.target.checked){
            selectedTypes.push(e.target.value);
            this.setState({
                selectedTypes: selectedTypes
            });
        }
        else{
            let index = selectedTypes.indexOf(e.target.value);
            selectedTypes.splice(index, 1);
            this.setState({
                selectedTypes: selectedTypes
            });
        }
        this.props.handleChange(this.state.selectedOntologies, this.state.selectedTypes, this.state.selectedCollections);      
    }


    /**
     * Handle the click on the collection checkbox in the facet
     */
    handleCollectionsCheckboxClick(e){       
        let selectedCollections = this.state.selectedCollections;        
        if(e.target.checked){
            selectedCollections.push(e.target.value.trim());
            this.setState({
                selectedCollections: selectedCollections
            });
        }
        else{
            let index = selectedCollections.indexOf(e.target.value.trim());
            selectedCollections.splice(index, 1);
            this.setState({
                selectedCollections: selectedCollections
            });
        }
        this.props.handleChange(this.state.selectedOntologies, this.state.selectedTypes, this.state.selectedCollections);
    }


    /**
     * Handle the show more button in the ontology facet list
     * @param {*} e 
     */
    handleOntologyShowMoreClick(e){
        if(this.state.ontologyListShowAll){
            this.setState({
                showMoreLessOntologiesText: "+ Show More",
                ontologyListShowAll: false
            });
        }
        else{
            this.setState({
                showMoreLessOntologiesText: "- Show Less",
                ontologyListShowAll: true
            });
        }       
    }


    componentDidMount(){
        if(!this.state.resultLoaded){
            this.processFacetData();
        }        
    }

    componentDidUpdate(){
        if(!this.state.resultLoaded){
            this.processFacetData();
        }
    }


    render(){
        return(
            <div class="row" id="search-facet-container-box">
                <h2>Filter Results</h2>
                <div class="col-sm-12">
                    <h4>{"Type"}</h4>
                     <div class="row facet-list-box" id="facet-types-list">                            
                        <div class="col-sm-12">
                            {this.createTypesCheckboxList()}
                        </div>
                    </div>
                    <h4>{"Ontologies"}</h4>
                    <div class="row facet-list-box" id="facet-ontologies-list">                            
                        <div class="col-sm-12">
                            {this.createOntologiesCheckboxList()}
                            <div className="text-center">
                                <a className="btn show-more-btn"  onClick={this.handleOntologyShowMoreClick}>{this.state.showMoreLessOntologiesText}</a>
                            </div>
                        </div>
                    </div>
                    <h4>{"Collections"}</h4>
                    <div class="row facet-list-box" id="facet-ontologies-list">                            
                        <div class="col-sm-12">
                            {this.createCollectionsCheckBoxes()}                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Facet;