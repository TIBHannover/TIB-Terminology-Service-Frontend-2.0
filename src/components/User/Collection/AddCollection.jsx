import {useState, useEffect, useContext} from "react";
import Multiselect from "multiselect-react-dropdown";
import {saveCollection, updateCollection} from "../../../api/userCollection";
import {storeUserSettings} from "../../../api/user";
import {AppContext} from "../../../context/AppContext";
import AlertBox from "../../common/Alerts/Alerts";
import Modal from "react-bootstrap/Modal";


const AddCollection = (props) => {
  const {editMode, collectionToEdit, editBtnText, btnClass, exstingCollectionList, ontologiesListForSelection} = props;
  
  const appContext = useContext(AppContext);
  
  const [selectedOntologies, setSelectedOntologies] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const idPostfix = editMode ? collectionToEdit['id'] : '';
  
  
  function handleOntologySelection(selectedList, selectedItem) {
    document.getElementById('collection-ontologies' + idPostfix).style.border = '';
    setSelectedOntologies(selectedList);
  }
  
  
  function onTextInputChange(e) {
    e.target.style.border = '';
    document.getElementById('max-char-message' + idPostfix).style.color = 'black';
    setShowAlert(false);
  }
  
  
  function returnCollectionTitleIfValid() {
    let collectionTitle = document.getElementById('collectionTitle' + idPostfix).value;
    
    if (!editMode) {
      for (let collection of exstingCollectionList) {
        if (collection['title'] === collectionTitle) {
          setShowAlert(true);
          return false;
        }
      }
    }
    
    if (editMode) {
      for (let collection of exstingCollectionList) {
        if (collection['title'] === collectionTitle && collection['id'] !== collectionToEdit['id']) {
          setShowAlert(true);
          return false;
        }
      }
    }
    
    if (!collectionTitle || collectionTitle === '') {
      document.getElementById('collectionTitle' + idPostfix).style.border = '1px solid red';
      return false;
    }
    if (collectionTitle.length > 20) {
      document.getElementById('max-char-message' + idPostfix).style.color = 'red';
      return false;
    }
    
    return collectionTitle;
  }
  
  
  async function saveNewCollection() {
    let collectionTitle = returnCollectionTitleIfValid();
    let formIsValid = collectionTitle ? true : false;
    
    if (selectedOntologies.length === 0) {
      document.getElementById('collection-ontologies' + idPostfix).style.border = '1px solid red';
      formIsValid = false;
    }
    if (!formIsValid) {
      return;
    }
    setShowAlert(false);
    let collectionDescription = document.getElementById('collectionDescription' + idPostfix).value;
    let ontologyIds = [];
    for (let ontology of selectedOntologies) {
      ontologyIds.push(ontology['id']);
    }
    let collectionData = {
      'title': collectionTitle,
      'description': collectionDescription,
      'ontology_ids': ontologyIds
    };
    let response = null;
    if (!editMode) {
      response = await saveCollection(collectionData);
      response && window.location.reload();
    } else {
      response = await updateCollection(collectionToEdit['id'], collectionData);
      if (response && appContext.userSettings.activeCollection['title'] === collectionToEdit['title']) {
        let contextObject = {"title": collectionTitle, "ontology_ids": ontologyIds};
        let userSttings = {...appContext.userSettings};
        userSttings.userCollectionEnabled = true;
        userSttings.activeCollection = contextObject;
        appContext.setUserSettings(userSttings);
        await storeUserSettings(userSttings);
      }
      window.location.reload();
    }
    
  }
  
  
  useEffect(() => {
    if (editMode) {
      let collectionOntologies = [];
      for (let ontologyId of collectionToEdit['ontology_ids']) {
        let opt = {'text': '', 'id': ''};
        opt['text'] = ontologyId;
        opt['id'] = ontologyId;
        collectionOntologies.push(opt);
      }
      setSelectedOntologies(collectionOntologies);
    }
  }, []);
  
  
  const modalId = editMode ? 'editCollectionModal' + idPostfix : 'newCollectionModal';
  return (
    <>
      <button
        type="button"
        className={"btn btn-secondary " + btnClass}
        onClick={() => setShowModal(true)}
      >
        {!editMode ? "New Collection" : editBtnText}
      </button>
      
      <Modal show={showModal} id={modalId}>
        <Modal.Header>
          <h5 className="modal-title" id={modalId + "Label"}>{!editMode ? "New Collection" : "Edit Collection"}</h5>
        </Modal.Header>
        <Modal.Body>
          {showAlert &&
            <AlertBox
              type="danger"
              message="Collection name already exists."
            />
          }
          <div className="row">
            <div className="col-sm-12">
              <label className="required_input" htmlFor={"collectionTitle" + idPostfix}>Name</label>
              <input
                type="text"
                className="form-control"
                id={"collectionTitle" + idPostfix}
                placeholder="Enter a Name"
                onChange={onTextInputChange}
                defaultValue={editMode ? collectionToEdit['title'] : ""}
              >
              </input>
            </div>
            <small id={"max-char-message" + idPostfix}>Max 20 characters</small>
          </div>
          <br></br>
          <div className='row'>
            <div className='col-sm-12'>
              <label className="required_input" htmlFor={'collection-ontologies' + idPostfix}>Ontologies</label>
              {ontologiesListForSelection && ontologiesListForSelection.length !== 0 &&
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
              <label htmlFor={"collectionDescription" + idPostfix}>Description (optional)</label>
              <textarea
                className="form-control"
                id={"collectionDescription" + idPostfix}
                rows="5"
                placeholder="Enter a Description"
                defaultValue={editMode ? collectionToEdit['description'] : ""}
              >
                  </textarea>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="col-auto mr-auto">
            <button type="button" className="btn btn-secondary close-btn-message-modal float-right"
                    onClick={() => setShowModal(false)}>Close
            </button>
          </div>
          <button type="button" className="btn btn-secondary" onClick={saveNewCollection}>Save</button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddCollection;

