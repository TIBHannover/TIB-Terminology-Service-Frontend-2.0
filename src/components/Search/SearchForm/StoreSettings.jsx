import { useState, useContext } from "react";
import { storeSearchSettings, updateSearchSettings } from "../../../api/user";
import { AppContext } from "../../../context/AppContext";
import { storeUserSettings } from "../../../api/user";



const StoreSearchSettings = (props) => {
    const {settings, setSearchSettingIsModified} = props;

    const appContext = useContext(AppContext);

    const [showAlert, setShowAlert] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(true);



    function returnSettingTitleIfValid(){
        let title = document.getElementById('searchSettingTitle').value;        
        if(!title || title === ''){
            document.getElementById('searchSettingTitle').style.border = '1px solid red';
            return false;
        }
        return title;
    }


    async function store(){        
        let settingTitle = returnSettingTitleIfValid();        
        
        if(!settingTitle){
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
        if(response){
            closeModal();
        }
    }


    async function update(){
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



    function closeModal(newNoteId=true){                
        let modalBackDrop = document.getElementsByClassName('modal-backdrop');
        document.body.classList.remove('modal-open');
        if(modalBackDrop.length === 1){
            modalBackDrop[0].remove();
        }
        setModalIsOpen(false);;         
    }



    return(
        <>
            {appContext.userSettings.activeSearchSetting.setting !== undefined  &&
                <button className="btn btn-secondary ml-2" onClick={update}>Update</button>
            }
            {appContext.userSettings.activeSearchSetting.setting === undefined  &&
                <button 
                    type="button" 
                    className={"btn btn-secondary ml-2"}
                    data-toggle="modal" 
                    data-target={"#storeSearchSettingModal"} 
                    data-backdrop="static"
                    >
                    Save
                </button>
            }           
            {modalIsOpen &&
            <div className="modal fade" id={'storeSearchSettingModal'} tabindex="-1" role="dialog" aria-labelledby={"storeSearchSettingModalLabel"} aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={"storeSearchSettingModalLabel"}>{"Store search settings"}</h5>                            
                        </div>
                        <div className="modal-body">
                            {/* {showAlert &&
                                <AlertBox 
                                    type="danger"
                                    message="Collection name already exists."
                                />
                            } */}
                            <div className="row">
                                <div className="col-sm-12">
                                    <label className="required_input" for={"searchSettingTitle"}>Name</label>
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
                                    <label for={"searchSettingDescription"}>Description (optional)</label>
                                    <textarea                                         
                                        className="form-control" 
                                        id={"searchSettingDescription"}
                                        rows="5"
                                        placeholder="Enter a Description">
                                    </textarea>  
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="col-auto mr-auto">
                                <button id="modalCloseBtn" type="button" className="btn btn-secondary close-btn-message-modal float-right" data-dismiss="modal">Close</button>
                            </div>                             
                            <button type="button" className="btn btn-secondary" onClick={store}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
            }
        </>
    );

}

export default StoreSearchSettings;