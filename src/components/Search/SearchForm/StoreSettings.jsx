import {useState, useContext, useEffect} from "react";
import {storeSearchSettings, updateSearchSettings} from "../../../api/user";
import {AppContext} from "../../../context/AppContext";
import {storeUserSettings} from "../../../api/user";
import Login from "../../User/Login/TS/Login";
import AlertBox from "../../common/Alerts/Alerts";
import Modal from 'react-bootstrap/Modal';


const StoreUpdateSearchSetting = (props) => {
  const {settings, setSearchSettingIsModified, setLoadedSettingName} = props;
  
  const appContext = useContext(AppContext);
  
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  
  
  function returnSettingTitleIfValid() {
    let title = document.getElementById('searchSettingTitle').value;
    if (!title || title === '') {
      document.getElementById('searchSettingTitle').style.border = '1px solid red';
      return false;
    }
    return title;
  }
  
  
  async function store() {
    let settingTitle = returnSettingTitleIfValid();
    
    if (!settingTitle) {
      return;
    }
    setShowAlert(false);
    let description = document.getElementById('searchSettingDescription').value;
    let settingData = {
      'title': settingTitle,
      'description': description,
      'setting': settings
    };
    let response = await storeSearchSettings(settingData);
    if (response === "Title already exists") {
      setShowAlert(true);
      return;
    }
    if (response) {
      let userSettings = {...appContext.userSettings};
      userSettings.activeSearchSetting = response;
      userSettings.activeSearchSettingIsModified = false;
      appContext.setUserSettings(userSettings);
      await storeUserSettings(userSettings);
      setModalIsOpen(false);
    }
  }
  
  
  async function update() {
    let searchSettingDataInStore = appContext.userSettings.activeSearchSetting;
    let settingData = {
      'title': searchSettingDataInStore.title,
      'description': searchSettingDataInStore.description,
      'setting': settings
    };
    let response = await updateSearchSettings(searchSettingDataInStore.id, settingData);
    let userSettings = {...appContext.userSettings};
    userSettings.activeSearchSetting.setting = settings;
    userSettings.activeSearchSettingIsModified = false;
    appContext.setUserSettings(userSettings);
    setSearchSettingIsModified(false);
    await storeUserSettings(userSettings);
    return true;
  }
  
  
  if (!appContext.user) {
    const loginModalId = "loginModalSaveAdvSearchSetting";
    const saveBtn = <button type="button"
                            className="btn btn-secondary ms-2"
                            data-toggle="modal"
                            data-target={"#" + loginModalId}
                            data-backdrop="static"
                            data-keyboard="false"
    >
      Save
    </button>;
    return (
      <Login isModal={true} customLoginBtn={saveBtn} customModalId={loginModalId}/>
    );
  }
  
  return (
    <>
      {appContext.userSettings.activeSearchSetting.setting !== undefined &&
        <button className="btn btn-secondary ms-2" onClick={update}>Update</button>
      }
      {appContext.userSettings.activeSearchSetting.setting === undefined &&
        <button
          type="button"
          className={"btn btn-secondary ms-2"}
          data-toggle="modal"
          data-target={"#storeSearchSettingModal"}
          data-backdrop="static"
          onClick={() => {
            setModalIsOpen(true)
          }}
        >
          Save
        </button>
      }
      <Modal show={modalIsOpen} id={'storeSearchSettingModal'}>
        <Modal.Header className="modal-header">
          <h5 className="modal-title" id={"storeSearchSettingModalLabel"}>{"Store search settings"}</h5>
        </Modal.Header>
        <Modal.Body className="modal-body">
          {showAlert &&
            <AlertBox
              type="danger"
              message="Setting name already exists."
            />
          }
          <SearchSettingForm
            editMode={false}
          />
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <div className="col-auto mr-auto">
            <button type="button" className="btn btn-secondary close-btn-message-modal float-right"
                    data-dismiss="modal" onClick={() => {
              setModalIsOpen(false)
            }}>Close
            </button>
          </div>
          <button type="button" className="btn btn-secondary" onClick={store}>Save</button>
        </Modal.Footer>
      </Modal>
    </>
  );
  
}


export const SearchSettingForm = (props) => {
  const {editMode, settingToEdit} = props;
  
  useEffect(() => {
    if (editMode && settingToEdit) {
      document.getElementById('searchSettingTitle').value = settingToEdit['title'];
      document.getElementById('searchSettingDescription').value = settingToEdit['description'];
    }
  }, []);
  
  
  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <label className="required_input" htmlFor={"searchSettingTitle"}>Name</label>
          <input
            type="text"
            className="form-control"
            id={"searchSettingTitle"}
            placeholder="Enter a Name"
            // onChange={onTextInputChange}
          
          >
          </input>
        </div>
        {/* <small id={"max-char-message" + idPostfix}>Max 20 characters</small> */}
      </div>
      <br></br>
      <div className="row">
        <div className="col-sm-12">
          <label htmlFor={"searchSettingDescription"}>Description (optional)</label>
          <textarea
            className="form-control"
            id={"searchSettingDescription"}
            rows="5"
            placeholder="Enter a Description">
                    </textarea>
        </div>
      </div>
    </>
  );
  
  
}


export default StoreUpdateSearchSetting;