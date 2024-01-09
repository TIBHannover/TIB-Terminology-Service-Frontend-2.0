import React from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import {getAllCollectionsIds} from '../../../api/fetchData';



const Facet = (props) => {

    const [resultLoaded, setResultLoaded] = useState(false);
    const [resultTypes, setResultTypes] = useState([]);
    const [ontologyFacetData, setOntologyFacetData] = useState([]);
    const [collections, setCollections] = useState([]);
    const [ontologyListShowAll, setOntologyListShowAll] = useState(false);
    const [countOfShownOntologies, setCountOfShownOntologies] = useState(5);
    const [showMoreLessOntologiesText, setShowMoreLessOntologiesText] = useState("+ Show More");
    const [currentUrl, setCurrentUrl] = useState("");
    const [isLoading, setIsLoading] = useState("");

    const history = useHistory();



    async function setComponentData(){        
        let currentUrl = window.location.href;            
        if (props.facetData.length === 0 || typeof props.facetData["facet_fields"] === "undefined"){
            setResultLoaded(true);
            setResultTypes({});
            setOntologyFacetData({});
            setCurrentUrl(currentUrl);
            setIsLoading(false);            
        }
        else{            
            let facetData = props.facetData["facet_fields"];
            let allTypes = facetData["type"];
            let allOntologies = facetData["ontology_name"];
            let ontologyFacetData = {};
            let types = {};                        
            for(let i=0; i < allOntologies.length; i++){
                if(i % 2 == 0){
                    ontologyFacetData[allOntologies[i].toUpperCase()] = allOntologies[i + 1];
                }
            }
            for(let i=0; i < allTypes.length; i++){
                if(i % 2 == 0){                    
                    types[allTypes[i]] = allTypes[i + 1];                    
                }
            }
            let allCollections = [];
            if(process.env.REACT_APP_PROJECT_ID === "general"){
                allCollections = await getAllCollectionsIds();
            } 
            setResultLoaded(true);
            setResultTypes(types);
            setOntologyFacetData(ontologyFacetData);
            setCollections(allCollections);
            setCurrentUrl(currentUrl);
            setIsLoading(false);           
        }                    
    }


    function  handleOntologyCheckBoxClick(e){
        let searchUrl = new URL(window.location); 
        
        let selectedOntologies = this.props.selectedOntologies;
        
        if(e.target.checked){
            searchUrl.searchParams.set('ontology', e.target.value.toUpperCase());
        }
        else{
            // let index = selectedOntologies.indexOf(e.target.value.toUpperCase());
            // selectedOntologies.splice(index, 1);            
            searchUrl.searchParams.delete('ontology', e.target.value.toUpperCase());
        }
        
        history.replace({...history.location, search: searchUrl.searchParams.toString()});
        this.props.handleChange(selectedOntologies, this.props.selectedTypes, this.props.selectedCollections, "ontology"); 
        this.setState({isLoading: true});               
    }



    function createTypesCheckboxList(){        
        let result = [];
        for(let type in resultTypes){
            if(resultTypes[type] !== 0){
                result.push(
                    <div class="row typeRow facet-item-row"  key={type}>
                        <div class="col-sm-9">
                            <div class="form-check">
                                <input 
                                    class="form-check-input search-facet-checkbox"
                                    type="checkbox" 
                                    value={type}
                                    id={"search-checkbox-" + type} 
                                    key={type}
                                    onClick={this.handleTypesCheckBoxClick}
                                    data-isChecked={props.selectedTypes.includes(type)}
                                />                    
                                <label class="form-check-label" for={"search-checkbox-" + type} >
                                {type}
                                </label>
                            </div>         
                        </div>
                        <div class="col-sm-3">
                            <div class="facet-result-count">{resultTypes[type]}</div>
                        </div>                    
                    </div>
                );
            }            
        }
        return result;
    }



    function createOntologiesCheckboxList(){        
        let lastSelectedOntologyIndex = 0;
        let counter = 1;
        for(let ontoId in ontologyFacetData){
            if(props.selectedOntologies.includes(ontoId.toUpperCase())){
                lastSelectedOntologyIndex = counter;
            }
            counter += 1;
        }
        if(lastSelectedOntologyIndex < countOfShownOntologies){
            lastSelectedOntologyIndex = countOfShownOntologies;
        }

        let result = [];
        counter = 1;
        for(let ontologyId in ontologyFacetData){             
            if (counter > lastIndex && !ontologyListShowAll){
                break;
            }
            if(ontologyFacetData[ontologyId] !== 0){
                result.push(
                    <div key={ontologyId}>
                        <div class="row ontoloyRow facet-item-row">
                            <div class="col-sm-9">
                                <div class="form-check">
                                    <input 
                                        class="form-check-input search-facet-checkbox ontology-facet-checkbox"
                                        type="checkbox" 
                                        value={ontologyId}
                                        id={"search-checkbox-" + ontologyId} 
                                        key={ontologyId}
                                        onClick={this.handleOntologyCheckBoxClick}
                                        data-isChecked={props.selectedOntologies.includes(ontologyId.toUpperCase())}
                                    />                    
                                    <label class="form-check-label" for={"search-checkbox-" + ontologyId} >
                                    {ontologyId}
                                    </label>
                                </div>                                
                            </div>
                            <div class="col-sm-3">
                                <div class="facet-result-count">{ontologyFacetData[ontologyId]}</div>
                            </div>                    
                        </div>                    
                    </div>                
                );
            }            
            counter += 1;
        }        
        return result;
    }



    function createCollectionsCheckBoxes(){        
        let result = [];
        for (let record of collections){
            for(let ontoId of record['ontolgies']){
                if(props.selectedOntologies.includes(ontoId) || props.selectedOntologies.length === 0){
                    result.push(
                        <div className="row facet-item-row">
                            <div className='col-sm-9'>
                                <div class="form-check">
                                    <input 
                                        class="form-check-input search-facet-checkbox"
                                        type="checkbox" 
                                        value={record['collection']}
                                        id={"search-checkbox-" + record['collection']} 
                                        key={record['collection']}
                                        onClick={this.handleCollectionsCheckboxClick}
                                        data-isChecked={props.selectedCollections.includes(record['collection'])}
                                    />                    
                                    <label class="form-check-label" for={"search-checkbox-" + record['collection']} >
                                    {record['collection']}
                                    </label>
                                </div>                      
                            </div>                
                        </div>
                    );
                    break;
                }
            }                        
        }
        return result;
    }
















    return(
        <div class="row" id="search-facet-container-box">                                   
            {isLoading && 
            <div class="d-flex justify-content-center">
                <div class="spinner-grow text-info facet-loading-effect" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>}                
            {!isLoading &&
            <div class="col-sm-12">
                <h2>Filter Results</h2>    
                <div className="row">
                    <div className="col-sm-12 clear-filter-link-box">
                        <a onClick={this.clearFacet}>Clear All Filters</a>
                        <br></br>
                    </div>
                </div> 
                <h4>{"Type"}</h4>
                 <div class="facet-box" id="facet-types-list">                                              
                    {this.createTypesCheckboxList()}
                </div>
                <h4>{"Ontologies"}</h4>
                <div class="facet-box">                            
                    {this.createOntologiesCheckboxList()}                                                
                    <div className="text-center" id="search-facet-show-more-ontology-btn">
                        <a className="show-more-btn"  onClick={this.handleOntologyShowMoreClick}>{this.state.showMoreLessOntologiesText}</a>
                    </div>                        
                </div>
                {process.env.REACT_APP_COLLECTION_FACET_SHOWN === "true" &&
                <><h4>{"Collections"}</h4><div class="facet-box" id="facet-collections-list">
                        {this.createCollectionsCheckBoxes()}
                    </div></>}
            </div>}
        </div>
    );


}




class Facet1 extends React.Component{

    
   



    
    /**
     * Handle click on the ontologies checkboxes
     */
   


    /**
     * Handle click on the type checkboxes
     */
     handleTypesCheckBoxClick(e){
        let selectedTypes = this.props.selectedTypes;
        if(e.target.checked){
            selectedTypes.push(e.target.value);            
        }
        else{
            let index = selectedTypes.indexOf(e.target.value);
            selectedTypes.splice(index, 1);            
        }        
        this.props.handleChange(this.props.selectedOntologies, selectedTypes, this.props.selectedCollections, "type");
        this.setState({isLoading: true});
    }


    /**
     * Handle the click on the collection checkbox in the facet
     */
    handleCollectionsCheckboxClick(e){       
        let selectedCollections = this.props.selectedCollections;        
        if(e.target.checked){
            selectedCollections.push(e.target.value.trim());           
        }
        else{
            let index = selectedCollections.indexOf(e.target.value.trim());
            selectedCollections.splice(index, 1);            
        }
        this.props.handleChange(this.props.selectedOntologies, this.props.selectedTypes, selectedCollections, "collection");
        this.setState({isLoading: true});
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


    /**
     * Reset facet
     */
    clearFacet(){        
        this.props.handleChange([], [], []);
        let allFacetCheckBoxes = document.getElementsByClassName('search-facet-checkbox');                
        for(let checkbox of allFacetCheckBoxes){            
            if(checkbox.dataset.ischecked !== "true"){
                document.getElementById(checkbox.id).checked = false;
            }
            delete checkbox.dataset.ischecked;
        }            
    }


    componentDidMount(){
        // this.setState({isLoading: false});
    }

    
    componentDidUpdate(){
        // pre-select the facet fields if entered via url
        
        let allFacetCheckBoxes = document.getElementsByClassName('search-facet-checkbox');                
        for(let checkbox of allFacetCheckBoxes){                  
            if(checkbox.dataset.ischecked === "true"){                
                document.getElementById(checkbox.id).checked = true;
            }
            delete checkbox.dataset.ischecked;
        }
        // check show more button for ontologies is needed or not
        let counter = 0;
        let facetOntologies = this.state.ontologyFacetData;
        for(let key in facetOntologies){
            if(facetOntologies[key] !== 0){
                counter ++;
            }            
        }
        let showMoreIsNeeded = "";
        let showMoreDiv = document.getElementById('search-facet-show-more-ontology-btn');
        if(counter <= this.state.countOfShownOntologies && showMoreDiv){
            showMoreDiv.style.display = 'none';
            showMoreIsNeeded = false;
        }
        else if(showMoreDiv){
            showMoreDiv.style.display = '';
            showMoreIsNeeded = true;
        }
                
        let currentUrl = this.state.currentUrl;
        if(currentUrl !== window.location.href){
            this.setComponentData();          
        }    
    }



    render(){
       
    }
}


export default Facet;