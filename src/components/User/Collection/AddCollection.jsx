import { useState, useEffect, useContext } from "react";
import Multiselect from "multiselect-react-dropdown";
import OntologyApi from "../../../api/ontology";
import { saveCollection, updateCollection } from "../../../api/userCollection";
import { storeUserSettings } from "../../../api/user";
import { AppContext } from "../../../context/AppContext";
import AlertBox from "../../common/Alerts/Alerts";




const AddCollection = (props) => {
    const {editMode, collectionToEdit, editBtnText, btnClass, exstingCollectionList} = props;

    const appContext = useContext(AppContext);

    const [selectedOntologies, setSelectedOntologies] = useState([]);
    const [ontologiesListForSelection, setOntologiesListForSelection] = useState([]);
    const [showAlert, setShowAlert] = useState(false);

    const idPostfix = editMode ? collectionToEdit['id'] : '';

    
    async function loadOntologiesForSelection(){
        let ontologyApi = new OntologyApi({});
        await ontologyApi.fetchOntologyList();
        let ontologyList = [];
        for (let ontology of ontologyApi.list){
            let opt = {'text': '', 'id': ''};
            opt['text'] = ontology['ontologyId'];
            opt['id'] = ontology['ontologyId'];
            ontologyList.push(opt);
        }
        setOntologiesListForSelection(ontologyList);
    }


    function handleOntologySelection(selectedList, selectedItem){      
        document.getElementById('collection-ontologies' + idPostfix).style.border = '';          
        setSelectedOntologies(selectedList);                   
    }


    function onTextInputChange(e){
        e.target.style.border = '';
        document.getElementById('max-char-message' + idPostfix).style.color = 'black';
        setShowAlert(false);
    }


    function returnCollectionTitleIfValid(){
        let collectionTitle = document.getElementById('collectionTitle' + idPostfix).value;

        if(!editMode){
            for (let collection of exstingCollectionList){
                if(collection['title'] === collectionTitle){
                    setShowAlert(true);
                    return false;
                }
            }
        }

        if(editMode){
            for (let collection of exstingCollectionList){
                if(collection['title'] === collectionTitle && collection['id'] !== collectionToEdit['id']){
                    setShowAlert(true);
                    return false;
                }
            }
        }
        
        if(!collectionTitle || collectionTitle === ''){
            document.getElementById('collectionTitle' + idPostfix).style.border = '1px solid red';
            return false;
        }
        if(collectionTitle.length > 20){
            document.getElementById('max-char-message' + idPostfix).style.color = 'red';
            return false;
        }

        return collectionTitle;
    }



    async function saveNewCollection(){
        let collectionTitle = returnCollectionTitleIfValid();
        let formIsValid = collectionTitle ? true : false;
        
        if(selectedOntologies.length === 0){
            document.getElementById('collection-ontologies' + idPostfix).style.border = '1px solid red';
            formIsValid = false;
        }
        if(!formIsValid){
            return;
        }
        setShowAlert(false);
        let collectionDescription = document.getElementById('collectionDescription' + idPostfix).value;
        let ontologyIds = [];
        for (let ontology of selectedOntologies){
            ontologyIds.push(ontology['id']);
        }
        let collectionData = {
            'title': collectionTitle,
            'description': collectionDescription,
            'ontology_ids': ontologyIds
        };
        let response = null;
        if(!editMode){
            response = await saveCollection(collectionData);
            response && window.location.reload();
        }
        else{
            response = await updateCollection(collectionToEdit['id'], collectionData);
            if(response && appContext.activeUserCollection['title'] === collectionToEdit['title']){
                let contextObject = {"title": collectionTitle, "ontology_ids": ontologyIds};
                let userSttings = {"userCollectionEnabled": true, "activeCollection": contextObject}
                await storeUserSettings(userSttings);
            }            
            window.location.reload();
        }
        
    }



    useEffect(() => {
        loadOntologiesForSelection();  
        if(editMode){
            let collectionOntologies = [];
            for (let ontologyId of collectionToEdit['ontology_ids']){
                let opt = {'text': '', 'id': ''};
                opt['text'] = ontologyId;
                opt['id'] = ontologyId;
                collectionOntologies.push(opt);
            }            
            setSelectedOntologies(collectionOntologies);
            document.getElementById('collectionTitle' + idPostfix).value = collectionToEdit['title'];
            document.getElementById('collectionDescription' + idPostfix).value = collectionToEdit['description'];
        }                     
    }, []);


    const modalId = editMode ? 'editCollectionModal' + idPostfix : 'newCollectionModal';
    return(
        <>
            <button 
                type="button" 
                className={"btn btn-secondary " + btnClass}
                data-toggle="modal" 
                data-target={"#" + modalId} 
                data-backdrop="static"
                >
                {!editMode ? "New Collection" : editBtnText}
            </button>

            <div className="modal fade" id={modalId} tabindex="-1" role="dialog" aria-labelledby={modalId + "Label"} aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={modalId + "Label"}>{!editMode ? "New Collection" : "Edit Collection"}</h5>                            
                        </div>
                        <div className="modal-body">
                            {showAlert &&
                                <AlertBox 
                                    type="danger"
                                    message="Collection name already exists."
                                />
                            }
                            <div className="row">
                                <div className="col-sm-12">
                                    <label className="required_input" for={"collectionTitle" + idPostfix}>Name</label>
                                    <input 
                                        type="text"                                                                                       
                                        className="form-control" 
                                        id={"collectionTitle" + idPostfix}
                                        placeholder="Enter a Name"
                                        onChange={onTextInputChange}                                        
                                        >
                                    </input>  
                                </div>
                                <small id={"max-char-message" + idPostfix}>Max 20 characters</small>
                            </div>
                            <br></br>                            
                            <div className='row'>                
                                <div className='col-sm-12'>
                                    <label className="required_input" for={'collection-ontologies' + idPostfix}>Ontologies</label>
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
                                            id={"collection-ontologies" + idPostfix}
                                            placeholder="Enter Ontology name ..."   
                                            className='multiselect-container'                     
                                        />
                                    }
                                </div>
                            </div> 
                            <br></br>  
                            <div className="row">
                                <div className="col-sm-12">
                                    <label for={"collectionDescription" + idPostfix}>Description (optional)</label>
                                    <textarea                                         
                                        className="form-control" 
                                        id={"collectionDescription" + idPostfix}
                                        rows="5"
                                        placeholder="Enter a Description">
                                    </textarea>  
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="col-auto mr-auto">
                                <button type="button" className="btn btn-secondary close-btn-message-modal float-right" data-dismiss="modal">Close</button>
                            </div>                             
                            <button type="button" className="btn btn-secondary" onClick={saveNewCollection}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddCollection;

