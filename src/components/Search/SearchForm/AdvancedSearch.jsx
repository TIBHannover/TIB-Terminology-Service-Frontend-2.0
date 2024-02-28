import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import Multiselect from 'multiselect-react-dropdown';
import { getJumpToResult } from '../../../api/fetchData';
import SearchLib from '../../../Libs/searchLib';
import OntologyApi from '../../../api/ontology';



const AdvancedSearch = (props) => {

    let currentUrlParams = new URL(window.location).searchParams;

    const [searchInSelectValue, setSearchInSelectValue] = useState(currentUrlParams.get('searchin') ? currentUrlParams.getAll('searchin') : []);
    const [searchUnderselectedTerms, setSearchUnderselectedTerms] = useState(SearchLib.getSearchUnderTermsFromUrl());
    const [searchUnderAllselectedTerms, setSearchUnderAllselectedTerms] = useState(SearchLib.getSearchUnderAllTermsFromUrl());
    const [selectedOntologies, setSelectedOntologies] = useState(SearchLib.getOntologIdsFromUrl());
    const [termListForSearchUnder, setTermListForSearchUnder] = useState([]);
    const [ontologiesListForSelection, setOntologiesListForSelection] = useState([]);
    const [loadingResult, setLoadingResult] = useState(true);

    const history = useHistory();


    const searchInMetaDataOptions = ['label', 'description', 'synonym', 'short_form',  'obo_id', 'annotations', 'iri'];



    async function loadTermsForSelection(query){   
        setLoadingResult(true);         
        if(query === ""){
            setTermListForSearchUnder([]);
            return true;
        }
        let inputQuery = {"searchQuery": query, "types": "class,property"};
        let terms = await getJumpToResult(inputQuery, 20); 
        let options = [];
        for (let term of terms){
            let opt = {};
            opt['text'] = `${term['ontology_prefix']}:${term['label']} (${term['type']})`;
            opt['iri'] = term['iri'];
            options.push(opt);
        }
        setLoadingResult(false);
        setTermListForSearchUnder(options);
    }



    async function loadOntologiesForSelection(query){
        let ontologyApi = new OntologyApi({});
        await ontologyApi.fetchOntologyList();
        let ontologyList = [];
        for (let ontology of ontologyApi.list){
            let opt = {};
            opt['text'] = ontology['ontologyId'];
            opt['id'] = ontology['ontologyId'];
            ontologyList.push(opt);
        }
        setOntologiesListForSelection(ontologyList);
    }



    function handleSearchInMultiSelect(selectedList, selectedItem){        
        setSearchInSelectValue(selectedList);
        let currentUrlParams = new URLSearchParams(window.location.search);  
        currentUrlParams.delete('searchin');
        for(let val of selectedList){
            currentUrlParams.append('searchin', val);
        }        
        history.push(window.location.pathname + "?" + currentUrlParams.toString());    
    }



    function handleTermSelectionSearchUnder(selectedList, selectedItem){                
        setSearchUnderselectedTerms(selectedList);
        let currentUrlParams = new URLSearchParams(window.location.search);          
        currentUrlParams.delete('searchunder');        
        for(let term of selectedList){
            currentUrlParams.append('searchunder', encodeURIComponent(JSON.stringify(term)));            
        }  
        history.push(window.location.pathname + "?" + currentUrlParams.toString());    
    }



    function handleTermSelectionSearchUnderAll(selectedList, selectedItem){                
        setSearchUnderAllselectedTerms(selectedList);
        let currentUrlParams = new URLSearchParams(window.location.search);          
        currentUrlParams.delete('searchunderall');        
        for(let term of selectedList){
            currentUrlParams.append('searchunderall', encodeURIComponent(JSON.stringify(term)));            
        }  
        history.push(window.location.pathname + "?" + currentUrlParams.toString());    
    }



    function handleOntologySelection(selectedList, selectedItem){                        
        setSelectedOntologies(selectedList);
        let currentUrlParams = new URLSearchParams(window.location.search);          
        currentUrlParams.delete('ontology');        
        for(let ontology of selectedList){
            currentUrlParams.append('ontology', ontology['id']);            
        }  
        history.push(window.location.pathname + "?" + currentUrlParams.toString());    
    }



    useEffect(() => {
        loadOntologiesForSelection();
    }, []);



    return(
        <>
            <br></br>
            <br></br>
            <h5  className='text-center'><b>Advanced Search Options</b></h5>
            <div className="row">
                <div className="col-sm-11">
                    <label for='adv-s-search-in-select' title='Search based on specific Metadata such as label or description.'>
                        Search In (Metadata)
                        <div className='tooltip-questionmark'>?</div>
                    </label>                    
                    <Multiselect
                        isObject={false}
                        options={searchInMetaDataOptions}  
                        selectedValues={searchInSelectValue}                       
                        onSelect={handleSearchInMultiSelect}
                        onRemove={handleSearchInMultiSelect}                        
                        avoidHighlightFirstOption={true}                        
                        closeIcon={"cancel"}
                        id="adv-s-search-in-select"
                        placeholder="label, description, ..."
                    />
                </div>
            </div>
            <br></br>
            <div className="row">
                <div className="col-sm-11">
                    <label for='adv-s-search-under-term' title='In this field, you can set the classes or properties that are supposed to be the parent(s) of the one you search for (Is-a relation).'>
                        Search Under
                        <div className='tooltip-questionmark'>?</div>
                    </label>
                    <Multiselect
                        isObject={true}
                        options={termListForSearchUnder}  
                        selectedValues={searchUnderselectedTerms}                       
                        onSelect={handleTermSelectionSearchUnder}
                        onRemove={handleTermSelectionSearchUnder}    
                        onSearch={loadTermsForSelection}
                        displayValue={"text"}
                        avoidHighlightFirstOption={true}       
                        loading={loadingResult}                 
                        closeIcon={"cancel"}
                        id="adv-s-search-under-term"
                        placeholder="class, property, ..."                        
                    />
                </div>
            </div>
            <br></br>
            <div className="row">
                <div className="col-sm-11">
                    <label for='adv-s-search-under-term' title='You can restrict a search to all children of a given term, meaning to search under (subclassOf/is-a plus any hierarchical/transitive properties like ‘part of’ or ‘develops from’)'>
                        Search Under All
                        <div className='tooltip-questionmark'>?</div>
                    </label>
                    <Multiselect
                        isObject={true}
                        options={termListForSearchUnder}  
                        selectedValues={searchUnderAllselectedTerms}                       
                        onSelect={handleTermSelectionSearchUnderAll}
                        onRemove={handleTermSelectionSearchUnderAll}    
                        onSearch={loadTermsForSelection}
                        displayValue={"text"}
                        avoidHighlightFirstOption={true}       
                        loading={loadingResult}                 
                        closeIcon={"cancel"}
                        id="adv-s-search-under-all-term"
                        placeholder="class, property, ..."                        
                    />
                </div>
            </div>
            <br></br>
            <div className="row">
                <div className="col-sm-11">
                    <label for='adv-s-search-under-term' title='You can restrict the search to one or multiple ontologies.'>
                        Search In Ontology
                        <div className='tooltip-questionmark'>?</div>
                    </label>
                    {ontologiesListForSelection.length !== 0 &&
                        <Multiselect
                        isObject={true}
                        options={ontologiesListForSelection}  
                        selectedValues={selectedOntologies}                       
                        onSelect={handleOntologySelection}
                        onRemove={handleOntologySelection}                            
                        displayValue={"text"}
                        avoidHighlightFirstOption={true}                                        
                        closeIcon={"cancel"}
                        id="adv-s-search-in-ontologies"
                        placeholder="Enter Ontology name ..."                        
                    />}
                </div>
            </div>
        </>
    );


}

export default AdvancedSearch;