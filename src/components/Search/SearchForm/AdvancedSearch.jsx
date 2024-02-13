import { useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';



const AdvancedSearch = (props) => {

    const [searchInSelectValue, setSearchInSelectValue] = useState(null);


    const searchInMetaDataOptions = ['label', 'description', 'synonym', 'short_form',  'obo_id', 'annotations', 'iri'];



    function handleSearchInMultiSelect(selectedList, selectedItem){        
        setSearchInSelectValue(selectedList)
    }



    return(
        <>
            <br></br>
            <br></br>
            <div className="row">
                <div className="col-sm-9">
                    <label for='adv-s-search-in-select'>Search In (Metadata)</label>
                    <Multiselect
                        isObject={false}
                        options={searchInMetaDataOptions}  
                        selectedValues={searchInSelectValue}                       
                        onSelect={handleSearchInMultiSelect}
                        onRemove={handleSearchInMultiSelect}                        
                        avoidHighlightFirstOption={true}
                        id="adv-s-search-in-select"
                        placeholder="label, description, ..."
                    />
                </div>
            </div>
        </>
    );


}

export default AdvancedSearch;