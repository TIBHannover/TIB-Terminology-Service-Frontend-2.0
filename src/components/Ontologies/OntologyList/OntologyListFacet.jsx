import { useState, useEffect } from "react";


export const OntologyListFacet = (props) => {

    const [collectionBoxes, setCollectionBoxes] = useState('');

    
    function createCollectionsCheckBoxes(){            
        let result = [];
        for (let record of props.allCollections){
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
                            onClick={props.handleFacetCollection}                            
                            checked={props.selectedCollections.includes(record['collection'])}
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
        setCollectionBoxes(result);
    }


    useEffect(() => {
        createCollectionsCheckBoxes();
    },[]);


    useEffect(()=> {
        createCollectionsCheckBoxes();               
    }, [props.selectedCollections, props.allCollections]);


    return(
        <div className="row">
            <div className='col-sm-12' id="ontology-list-facet-grid">            
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
                                value={props.enteredKeyword !== "" ? props.enteredKeyword : ""}
                                onChange={props.filterWordChange}
                                />
                        </div>                    
                    </div>
                </div>
                {process.env.REACT_APP_COLLECTION_FACET_SHOWN === "true" &&
                    <div className='row ontology-list-facet-section-box'>
                        <h3 className='h-headers ontology-list-facet-header'>Collection</h3>
                        <div  className="col-sm-12 facet-box" >
                            <div className='facet-switch-holder'>                                
                                <div class="form-check form-switch">                            
                                    <input class="form-check-input toggle-input" type="checkbox" role="switch" id="facet-switch" onChange={props.onSwitchChange} />                            
                                    <label class="form-check-label" for="facet-switch">Intersection</label>
                                </div>                          
                            </div>
                            <div>
                                {collectionBoxes}   
                            </div>               
                        </div>
                    </div>
                }            
            </div>
        </div>
    );
}