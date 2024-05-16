import { useState, useEffect } from "react";
import Multiselect from "multiselect-react-dropdown";
import OntologyApi from "../../../api/ontology";
import { saveCollection } from "../../../api/userCollection";




const AddCollection = () => {

    const [selectedOntologies, setSelectedOntologies] = useState([]);
    const [ontologiesListForSelection, setOntologiesListForSelection] = useState([]);

    
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


    function handleOntologySelection(selectedList, selectedItem){      
        document.getElementById('collection-ontologies').style.border = '';  
        setSelectedOntologies(selectedList);                   
    }


    function onTextInputChange(e){
        e.target.style.border = '';
        document.getElementById('max-char-message').style.color = 'black';
    }


    async function saveNewCollection(){
        let collectionTitle = document.getElementById('collectionTitle').value;
        let formIsValid = true;
        if(!collectionTitle || collectionTitle === ''){
            document.getElementById('collectionTitle').style.border = '1px solid red';
            formIsValid = false;
        }
        if(collectionTitle.length > 20){
            document.getElementById('max-char-message').style.color = 'red';
            formIsValid = false;
        }
        if(selectedOntologies.length === 0){
            document.getElementById('collection-ontologies').style.border = '1px solid red';
            formIsValid = false;
        }
        let collectionDescription = document.getElementById('collectionDescription').value;
        let ontologyIds = [];
        for (let ontology of selectedOntologies){
            ontologyIds.push(ontology['id']);
        }
        let collectionData = {
            'title': collectionTitle,
            'description': collectionDescription,
            'ontology_ids': ontologyIds
        };
        let response = await saveCollection(collectionData);
        if(response){
            window.location.reload();
        }
    }



    useEffect(() => {
        loadOntologiesForSelection();                       
    }, []);


    return(
        <>
            <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#newCollectionModal" data-backdrop="static">
                    New Collection
            </button>

            <div class="modal fade" id="newCollectionModal" tabindex="-1" role="dialog" aria-labelledby="newCollectionModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="newCollectionModalLabel">New Collection</h5>                            
                        </div>
                        <div class="modal-body">
                            <div className="row">
                                <div className="col-sm-12">
                                    <label className="required_input" for="collectionTitle">Name</label>
                                    <input 
                                        type="text"                                                                                       
                                        class="form-control" 
                                        id="collectionTitle"
                                        placeholder="Enter a Name"
                                        onChange={onTextInputChange}
                                        >
                                    </input>  
                                </div>
                                <small id="max-char-message">Max 20 characters</small>
                            </div>
                            <br></br>                            
                            <div className='row'>                
                                <div className='col-sm-12'>
                                    <label className="required_input" for='collection-ontologies'>Ontologies</label>
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
                                            id="collection-ontologies"
                                            placeholder="Enter Ontology name ..."   
                                            className='multiselect-container'                     
                                        />
                                    }
                                </div>
                            </div> 
                            <br></br>  
                            <div className="row">
                                <div className="col-sm-12">
                                    <label for="collectionDescription">Description (optional)</label>
                                    <textarea                                         
                                        class="form-control" 
                                        id="collectionDescription"
                                        rows="5"
                                        placeholder="Enter a Description">
                                    </textarea>  
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <div className="col-auto mr-auto">
                                <button type="button" class="btn btn-secondary close-btn-message-modal float-right" data-dismiss="modal">Close</button>
                            </div>                             
                            <button type="button" class="btn btn-secondary" onClick={saveNewCollection}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddCollection;

