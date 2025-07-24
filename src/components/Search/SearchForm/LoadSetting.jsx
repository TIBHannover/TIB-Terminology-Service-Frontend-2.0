import {useState, useContext, useEffect} from "react";
import {fetchSearchSettings} from "../../../api/user";
import Login from "../../User/Login/TS/Login";
import {AppContext} from "../../../context/AppContext";
import SwitchButton from "../../common/SwitchButton/SwitchButton";
import AlertBox from "../../common/Alerts/Alerts";
import {deleteSearchSetting, storeUserSettings} from "../../../api/user";
import {SearchSettingForm} from "./StoreSettings";
import {updateSearchSettings} from "../../../api/user";
import Toolkit from "../../../Libs/Toolkit";
import Modal from 'react-bootstrap/Modal';


const LoadSetting = (props) => {
  const {loadFunc, resetAdvancedSearch, loadedSettingNameSetter} = props;
  
  const appContext = useContext(AppContext);
  
  const [settingsList, setSettingsList] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [settingToDelete, setSettingToDelete] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [editSuccess, setEditSuccess] = useState(null);
  const [editTitleError, setEditTitleError] = useState(false);
  const [settingToEdit, setSettingToEdit] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  
  
  function renderSettingsList() {
    let result = [];
    for (let setting of settingsList) {
      result.push(
        <>
          <SwitchButton
            id={"searchSettingSwitch" + setting['id']}
            dataId={setting['id']}
            label={setting['title']}
            className="search-setting-checkbox"
            inLine={true}
          />
          <button
            type="button"
            className="btn btn-secondary ms-2 extra-sm-btn"
            onClick={() => {
              setSettingToEdit(setting);
              setEditMode(true);
            }}
          >
            <i className="fa fa-edit"></i>
          </button>
          <button
            className="btn btn-danger btn-sm btn-delete-note borderless-btn extra-sm-btn ms-2"
            key={"deleteBtnUserSetting" + setting['id']}
            onClick={() => {
              setSettingToDelete(setting);
              setDeleteMode(true);
            }}
          >
            <i className="fa fa-close fa-borderless"></i>
          </button>
          <p><small>{setting['description']}</small></p>
        </>
      )
    }
    return result;
  }
  
  
  function loadSetting() {
    let settingId = document.querySelector('.search-setting-checkbox:checked')?.dataset?.id;
    let setting = settingsList.find(setting => setting['id'] == settingId);
    loadFunc(setting);
    setModalShow(false);
  }
  
  
  async function deleteSetting() {
    let deleted = await deleteSearchSetting(settingToDelete['id']);
    if (deleted) {
      setDeleteSuccess(true);
      if (appContext.userSettings.activeSearchSetting['id'] == settingToDelete['id']) {
        resetAdvancedSearch();
      }
      return true;
    }
    setDeleteSuccess(false);
    return;
  }
  
  
  function returnSettingTitleIfValid() {
    let title = document.getElementById('searchSettingTitle').value;
    if (!title || title === '') {
      document.getElementById('searchSettingTitle').style.border = '1px solid red';
      return false;
    }
    return title;
  }
  
  
  async function updateTitleAndDescription() {
    let settingTitle = returnSettingTitleIfValid();
    if (!settingTitle) {
      return;
    }
    let userSettings = {...appContext.userSettings};
    let description = document.getElementById('searchSettingDescription').value;
    let settingData = {
      'title': settingTitle,
      'description': description,
      'setting': settingToEdit['setting']
    };
    let response = await updateSearchSettings(settingToEdit['id'], settingData);
    if (response === "Title already exists") {
      setEditTitleError(true);
      return;
    }
    if (response) {
      setEditSuccess(true);
      if (appContext.userSettings.activeSearchSetting['id'] == settingToEdit['id']) {
        userSettings.activeSearchSetting.title = settingTitle;
        userSettings.activeSearchSetting.description = description;
        appContext.setUserSettings(userSettings);
        storeUserSettings(userSettings);
        loadedSettingNameSetter(settingTitle);
      }
      return true;
    }
    setEditSuccess(false);
    return true;
  }
  
  
  function fetchSettingList() {
    setDeleteMode(false);
    setEditMode(false);
    setDeleteSuccess(null);
    setEditSuccess(null);
    setEditTitleError(false);
    setModalShow(true);
    fetchSearchSettings().then((settingsList) => {
      setSettingsList(Toolkit.sortListOfObjectsByKey(settingsList, 'created_at'));
      let userSettings = appContext.userSettings;
      if (userSettings.activeSearchSetting && userSettings.activeSearchSetting['id']) {
        let activeCheckbox = document.getElementById("searchSettingSwitch" + userSettings.activeSearchSetting['id']);
        if (activeCheckbox) {
          activeCheckbox.checked = true;
        }
      }
    });
  }
  
  
  useEffect(() => {
    let userSettings = appContext.userSettings;
    if (userSettings.activeSearchSetting && userSettings.activeSearchSetting['id']) {
      let activeCheckbox = document.getElementById("searchSettingSwitch" + userSettings.activeSearchSetting['id']);
      if (activeCheckbox) {
        activeCheckbox.checked = true;
      }
    }
  }, [editMode, deleteMode]);
  
  
  if (!appContext.user) {
    const loginModalId = "loginModalLoadAdvSearchSetting";
    const loadBtn = <button type="button"
                            className="btn btn-secondary ms-2"
                            data-toggle="modal"
                            data-target={"#" + loginModalId}
                            data-backdrop="static"
                            data-keyboard="false"
    >
      My search settings
    </button>;
    return (
      <Login isModal={true} customLoginBtn={loadBtn} customModalId={loginModalId}/>
    );
  }
  
  
  return (
    <>
      <button
        type="button"
        className={"btn btn-secondary ms-2"}
        data-toggle="modal"
        data-target={"#SearchSettingListModal"}
        data-backdrop="static"
        onClick={fetchSettingList}
      >
        My search settings
      </button>
      <Modal show={modalShow} id={'SearchSettingListModal'}>
        <Modal.Header>
          {!editMode && !deleteMode &&
            <h5 className="modal-title" id={"SearchSettingListModalLabel"}>{"My search settings"}</h5>
          }
          {deleteMode && !editMode &&
            <h5 className="modal-title"
                id={"SearchSettingListModalLabel"}>{"Delete: " + settingToDelete['title']}</h5>
          }
          {editMode && !deleteMode &&
            <h5 className="modal-title" id={"SearchSettingListModalLabel"}>{"Edit: " + settingToEdit['title']}</h5>
          }
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-sm-12">
              {!deleteMode && !editMode && renderSettingsList()}
              {deleteMode && !editMode && deleteSuccess === null &&
                <AlertBox
                  type="danger"
                  message="Are you sure you want to delete this setting? This action is irreversible."
                  alertColumnclassName="col-sm-12"
                />
              }
              {deleteMode && !editMode && deleteSuccess === true &&
                <AlertBox
                  type="success"
                  message="Setting deleted successfully."
                  alertColumnclassName="col-sm-12"
                />
              }
              {deleteMode && !editMode && deleteSuccess === false &&
                <AlertBox
                  type="danger"
                  message="Setting could not be deleted. Please try again later."
                  alertColumnclassName="col-sm-12"
                />
              }
              {editMode && !deleteMode && editTitleError &&
                <AlertBox
                  type="danger"
                  message="Title already exists. Please choose a different title."
                  alertColumnclassName="col-sm-12"
                />
              }
              {editMode && !deleteMode && editSuccess === null &&
                <SearchSettingForm
                  editMode={true}
                  settingToEdit={settingToEdit}
                />
              }
              {editMode && !deleteMode && editSuccess === true &&
                <AlertBox
                  type="success"
                  message="Setting updated successfully."
                  alertColumnclassName="col-sm-12"
                />
              }
              {editMode && !deleteMode && editSuccess === false &&
                <AlertBox
                  type="danger"
                  message="Setting could not be updated. Please try again later."
                  alertColumnclassName="col-sm-12"
                />
              }
            </div>
          </div>
          <br></br>
        </Modal.Body>
        <Modal.Footer>
          <div className="col-auto mr-auto">
            {!deleteMode && !editMode &&
              <button type="button" className="btn btn-secondary close-btn-message-modal float-right"
                      data-dismiss="modal" onClick={() => setModalShow(false)}>Close</button>
            }
            {(deleteMode || editMode) &&
              <button type="button" className="btn btn-secondary close-btn-message-modal float-right"
                      onClick={fetchSettingList}>Back</button>
            }
          </div>
          {!deleteMode && !editMode &&
            <button type="button" className="btn btn-secondary" onClick={loadSetting}
                    data-dismiss="modal">Load</button>
          }
          {deleteMode && !editMode &&
            <button type="button" className="btn btn-secondary" onClick={deleteSetting}>Delete</button>
          }
          {!deleteMode && editMode &&
            <button type="button" className="btn btn-secondary" onClick={updateTitleAndDescription}>Save</button>
          }
        </Modal.Footer>
      </Modal>
    </>
  );
  
}

export default LoadSetting;