import {getAllCollectionsIds} from '../../../api/fetchData';
import Toolkit from '../../common/Toolkit';


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
                    <div className="input-group mb-3">                        
                        <input 
                            type="text" 
                            className="form-control" 
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
                            <div className="custom-control custom-switch">                                
                                <input type="checkbox" className="custom-control-input" id="facet-switch" onChange={onSwitchChange} />
                                <label className="custom-control-label" for="facet-switch">Intersection</label>
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


export function sortArrayOfOntologiesBasedOnKey(ontologiesArray, key) {
    if(key === "title"){
        return Toolkit.sortListOfObjectsByKey(ontologiesArray, key, true, 'config');        
    }
    else if(key === 'ontologyId'){
        return Toolkit.sortListOfObjectsByKey(ontologiesArray, key, true);         
    }
    return Toolkit.sortListOfObjectsByKey(ontologiesArray, key);    
}


export async function createCollectionsCheckBoxes(filterCollection, selectedCollections){
    let allCollections = await getAllCollectionsIds();    
    let result = [];
    for (let record of allCollections){
        result.push(
        <div className="row facet-item-row">
            <div className='col-sm-9'>
                <div className="form-check">
                    <input 
                        className="form-check-input collection-checkbox"
                        type="checkbox" 
                        value={record['collection']}
                        id={"col-checkbox-" + record['collection']} 
                        key={record['collection']}
                        onClick={filterCollection}
                        data-isChecked={selectedCollections.includes(record['collection'])}
                    />                    
                    <label className="form-check-label" for={"col-checkbox-" + record['collection']} >
                       {record['collection']}
                    </label>
                </div>
            </div>
            <div className='col-sm-3'>
                <span className="facet-result-count">{record['ontologiesCount']}</span>
            </div>
        </div>
        );
    }
    return result;
}