import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';



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
            result.push(<span className='ontology-collection-name'><a href="#">{collections[i]}</a></span>)
            result.push(",")
        }
        else{
            result.push(<span className='ontology-collection-name'><a href="#">{collections[i]}</a></span>)
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
export function CreateFacet(filterWordChange, filterCollection){
    return (
        <Grid item xs={4} id="ontology-list-facet-grid">
            <h3 className='h-headers'>Filter</h3>            
            <Grid container>
                <Grid item xs={12} id="ontologylist-search-grid">
                    <TextField
                    label="By keyword"
                    type="search"
                    variant="outlined"
                    onChange={filterWordChange}
                    InputLabelProps={{ style: { fontSize: 15 } }}
                    />
                </Grid>
            </Grid>
            <Grid container className='ontology-list-facet-section-box'>
            <h5 className='h-headers'>Collection</h5>
                <Grid item xs={12} >
                    {createCollectionsCheckBoxes(filterCollection)}                    
                </Grid>
            </Grid>
            <Grid container className='ontology-list-facet-section-box'>
            <h5 className='h-headers'>Last Updated</h5>
                <Grid item xs={12} >
                <input type="range"  min="1" max="10" />
                <span id="lastUpdateRange"> 1 year(s) ago</span>
                </Grid>
            </Grid>
        </Grid> 
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
        if (ontology.config.description.includes(value)) {
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




function createCollectionsCheckBoxes(filterCollection){
    let collections = ["NFDI4Chem", "NFDI4Ing", "FAIR Data Spaces"];
    let result = [];
    for (let index in collections){
        result.push(
        <div className="row">
            <div className='col-sm-9'>
            <FormGroup>
                <FormControlLabel 
                    control={<Checkbox  onClick={filterCollection} />}
                    label={collections[index]}
                    key={collections[index]}                      
                    value={collections[index]}
                />
            </FormGroup>
            </div>
            <div className='col-sm-3'>
                <span class="facet-result-count">125</span>
            </div>
        </div>
        );
    }
    return result;
}