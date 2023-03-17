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
            result.push(<span className='ontology-collection-name'><a href={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies?collection=' + collections[i]}>{collections[i]}</a></span>)
            result.push(",")
        }
        else{
            result.push(<span className='ontology-collection-name'><a href={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies?collection=' + collections[i]}>{collections[i]}</a></span>)
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
                    <div class="input-group mb-3">                        
                        <input 
                            type="text" 
                            class="form-control" 
                            aria-label="By keyword" 
                            aria-describedby="By keyword" 
                            placeholder='By keyword'
                            value={enteredKeyword !== "" ? enteredKeyword : ""}
                            onChange={filterWordChange}
                            />
                    </div>                    
                </div>
            </div>
            {process.env.REACT_APP_COLLECTION_FACET_SHOWN === "true" &&
                <div className='row ontology-list-facet-section-box'>
                    <h3 className='h-headers ontology-list-facet-header'>Collection</h3>
                    <div  className="col-sm-12 facet-box" >
                        <div className='facet-switch-holder'>
                            <div class="custom-control custom-switch">                                
                                <input type="checkbox" class="custom-control-input" id="facet-switch" onChange={onSwitchChange} />
                                <label class="custom-control-label" for="facet-switch">Intersection</label>
                            </div>                           
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
        value = value.toLowerCase();
        if (ontology.ontologyId.includes(value)) {
            return true;
        }
        if (ontology.config.title.toLowerCase().includes(value)) {
            return true;
        }
        if (ontology.config.description != null &&  ontology.config.description.toLowerCase().includes(value)) {
            return true;
        }

        return false;
    }
    catch (e){        
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
    if (key === 'alphabetic'){
        return array;
    }
    return array.sort(function (a, b) {
        let x = a[key];
        const y = b[key];
        return ((x < y) ? 1 : ((x > y) ? -1 : 0))
    })
  }


/**
 * Sort an array of ontologies based on the title
 *
 * @param {*} array
 * @param {*} key
 * @returns
 */
export function sortOntologyBasedOnTitle (ontologies) {
    return ontologies.sort(function (a, b) {
      let x = a["ontologyId"]; 
      let y = b["ontologyId"];      
      return (x<y ? -1 : 1 )
    })
  }


export async function createCollectionsCheckBoxes(filterCollection, selectedCollections){
    let allCollections = await getAllCollectionsIds();    
    let result = [];
    for (let record of allCollections){
        result.push(
        <div className="row facet-item-row">
            <div className='col-sm-9'>
                <div class="form-check">
                    <input 
                        class="form-check-input collection-checkbox"
                        type="checkbox" 
                        value={record['collection']}
                        id={"col-checkbox-" + record['collection']} 
                        key={record['collection']}
                        onClick={filterCollection}
                        data-isChecked={selectedCollections.includes(record['collection'])}
                    />                    
                    <label class="form-check-label" for={"col-checkbox-" + record['collection']} >
                       {record['collection']}
                    </label>
                </div>
            </div>
            <div className='col-sm-3'>
                <span class="facet-result-count">{record['ontologiesCount']}</span>
            </div>
        </div>
        );
    }
    return result;
}