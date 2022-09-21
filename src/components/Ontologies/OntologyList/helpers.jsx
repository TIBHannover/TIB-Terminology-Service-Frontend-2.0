import React from 'react';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import {getAllCollectionsIds} from '../../../api/fetchData';


/**
 * Create the collections list for each ontology card in the ontology list
 * @param {*} collections 
 * @returns 
 */
export function BuildCollectionForCard(collections){
    if (collections == null){
        return "";
    }
    let result = [];
    for(let i=0; i < collections.length; i++){
        if (i !== collections.length - 1){
            result.push(<span className='ontology-collection-name'><a href={'/ontologies?collection=' + collections[i]}>{collections[i]}</a></span>)
            result.push(",")
        }
        else{
            result.push(<span className='ontology-collection-name'><a href={'/ontologies?collection=' + collections[i]}>{collections[i]}</a></span>)
        }
        
    }

    return result;
}


/**
 * Create the facet widget for ontology list
 * @param {*} filterWordChange 
 * @param {*} filterCollection 
 * @returns 
 */
export function CreateFacet(filterWordChange, allCollectionsCheckboxes, enteredKeyword, onSwitchChange){
    return (
        <div className='col-sm-4' id="ontology-list-facet-grid">            
            <h3 className='ontology-list-facet-header'>Filter</h3>            
            <div className='row'>
                <div className='col-sm-12' id="ontologylist-search-grid">
                    <TextField
                    label="By keyword"
                    type="search"
                    variant="outlined"
                    onChange={filterWordChange}
                    value={enteredKeyword !== "" ? enteredKeyword : ""}
                    InputLabelProps={{ style: { fontSize: 15 } }}
                    />
                </div>
            </div>
            {process.env.REACT_APP_COLLECTION_FACET_SHOWN === "true" &&
                <div className='row ontology-list-facet-section-box'>
                    <h3 className='h-headers'>Collection</h3>
                    <div  className="col-sm-12 facet-box" >
                        <div className='facet-switch-holder'>
                            Intersection
                            <Switch                    
                                onChange={onSwitchChange}
                                id="facet-switch"
                                defaultChecked={true}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                            Union
                        </div>
                        <div>
                            {allCollectionsCheckboxes}   
                        </div>               
                    </div>
                </div>
            }            
        </div> 
    );
}


/**
 * Search in an ontology metadata to check if it contains a value
 * @param {ontology} ontology
 * @param {string} value 
 * @returns boolean
 */
export function ontology_has_searchKey(ontology, value){
    try{
        if (ontology.ontologyId.includes(value)) {
            return true;
        }
        if (ontology.config.title.includes(value)) {
            return true;
        }
        if (ontology.config.description != null &&  ontology.config.description.includes(value)) {
            return true;
        }

        return false;
    }
    catch (e){
        console.info(e);
        return false;
    }
}



 /**
 * Sort an array of objects based on a key
 *
 * @param {*} array
 * @param {*} key
 * @returns
 */
  export function sortBasedOnKey (array, key) {
    return array.sort(function (a, b) {
      let x = a[key]; const y = b[key]
      return ((x < y) ? 1 : ((x > y) ? -1 : 0))
    })
  }




export async function createCollectionsCheckBoxes(filterCollection, selectedCollections){
    let allCollections = await getAllCollectionsIds();
    let result = [];
    for (let record of allCollections){
        result.push(
        <div className="row facet-item-row">
            <div className='col-sm-9'>
            <FormGroup>
                <FormControlLabel 
                    control={<Checkbox defaultChecked={selectedCollections.includes(record['collection'])}  onClick={filterCollection} />}
                    label={record['collection']}
                    key={record['collection']}
                    value={record['collection']}
                />
            </FormGroup>
            </div>
            <div className='col-sm-3'>
                <span class="facet-result-count">{record['ontologiesCount']}</span>
            </div>
        </div>
        );
    }
    return result;
}