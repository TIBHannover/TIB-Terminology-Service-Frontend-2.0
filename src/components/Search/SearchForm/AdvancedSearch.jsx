import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import Multiselect from 'multiselect-react-dropdown';
import { getJumpToResult } from '../../../api/fetchData';



const AdvancedSearch = (props) => {

    const [searchInSelectValue, setSearchInSelectValue] = useState([]);
    const [searchUnderselectedTerms, setSearchUnderselectedTerms] = useState([]);
    const [termListForSearchUnder, setTermListForSearchUnder] = useState([]);
    const [searchUnderLoading, setSearchUnderLoading] = useState(true);

    const history = useHistory();


    const searchInMetaDataOptions = ['label', 'description', 'synonym', 'short_form',  'obo_id', 'annotations', 'iri'];



    function handleSearchInMultiSelect(selectedList, selectedItem){        
        setSearchInSelectValue(selectedList)
    }


    async function loadTermsForSelection(query){   
        setSearchUnderLoading(true);         
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
        setSearchUnderLoading(false);
        setTermListForSearchUnder(options);
    }


    function handleTermSelection(selectedList, selectedItem){
        setSearchUnderselectedTerms(selectedList);
    }


    useEffect(() => {
        let currentUrlParams = new URLSearchParams(window.location.search);  
        currentUrlParams.delete('searchin');
        currentUrlParams.delete('searchunder');
        for(let val of searchInSelectValue){
            currentUrlParams.append('searchin', val);
        }
        for(let term of searchUnderselectedTerms){
            currentUrlParams.append('searchunder', encodeURIComponent(term['iri']));
        }  
        history.push(window.location.pathname + "?" + currentUrlParams.toString());    
    }, [searchInSelectValue, searchUnderselectedTerms]);



    return(
        <>
            <br></br>
            <br></br>
            <h5  className='text-center'><b>Advanced Search Options</b></h5>
            <div className="row">
                <div className="col-sm-11">
                    <label for='adv-s-search-in-select'>Search In (Metadata)</label>
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
            <div className="row">
                <div className="col-sm-11">
                    <label for='adv-s-search-under-term'>Search Under</label>
                    <Multiselect
                        isObject={true}
                        options={termListForSearchUnder}  
                        selectedValues={searchUnderselectedTerms}                       
                        onSelect={handleTermSelection}
                        onRemove={handleTermSelection}    
                        onSearch={loadTermsForSelection}
                        displayValue={"text"}
                        avoidHighlightFirstOption={true}       
                        loading={searchUnderLoading}                 
                        closeIcon={"cancel"}
                        id="adv-s-search-under-term"
                        placeholder="class, property, ..."                        
                    />
                </div>
            </div>
        </>
    );


}

export default AdvancedSearch;