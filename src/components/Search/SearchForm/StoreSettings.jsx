import { useState, useContext, useEffect } from "react";
import { storeSearchSettings, updateSearchSettings } from "../../../api/user";
import { AppContext } from "../../../context/AppContext";
import { storeUserSettings } from "../../../api/user";
import Login from "../../User/Login/TS/Login";



const StoreSearchSettings = (props) => {
    const {settings, setSearchSettingIsModified, editMode, setLoadedSettingName} = props;

    const appContext = useContext(AppContext);

    const [showAlert, setShowAlert] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(true);
    const editIdPostFix = editMode ? 'Edit' : '';



    function returnSettingTitleIfValid(){
        let title = document.getElementById('searchSettingTitle' + editIdPostFix).value;        
        if(!title || title === ''){
            document.getElementById('searchSettingTitle' + editIdPostFix).style.border = '1px solid red';
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
            let userSettings = {...appContext.userSettings};
            userSettings.activeSearchSetting = response;
            userSettings.activeSearchSettingIsModified = false;
            appContext.setUserSettings(userSettings);
            await storeUserSettings(userSettings);
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


    async function updateTitleAndDescription(){        
        let settingTitle = returnSettingTitleIfValid();                        
        if(!settingTitle){
            return;
        }        
        setShowAlert(false);
        let userSettings = {...appContext.userSettings};
        let description = document.getElementById('searchSettingDescription' + editIdPostFix).value;              
        let settingData = {
            'title': settingTitle,
            'description': description,
            'setting': settings 
        };        
        let response = await updateSearchSettings(appContext.userSettings.activeSearchSetting.id, settingData);        
        if(response){
            userSettings.activeSearchSetting.title = settingTitle;
            userSettings.activeSearchSetting.description = description;
            appContext.setUserSettings(userSettings);
            storeUserSettings(userSettings);
            setLoadedSettingName && setLoadedSettingName(settingTitle);
            closeModal();
        }
    }



    function closeModal(newNoteId=true){                
        let modalBackDrop = document.getElementsByClassName('modal-backdrop');
        document.body.classList.remove('modal-open');
        if(modalBackDrop.length === 1){
            modalBackDrop[0].remove();
        }
        setModalIsOpen(false);;         
    }


    useEffect(() => {        
        if(editMode){            
            document.getElementById('searchSettingTitle' + editIdPostFix).value = appContext.userSettings.activeSearchSetting.title;
            document.getElementById('searchSettingDescription' + editIdPostFix).value = appContext.userSettings.activeSearchSetting.description;
        }                     
    }, []);


    useEffect(() => {        
        if(editMode && modalIsOpen){            
            document.getElementById('searchSettingTitle' + editIdPostFix).value = appContext.userSettings.activeSearchSetting.title;
            document.getElementById('searchSettingDescription' + editIdPostFix).value = appContext.userSettings.activeSearchSetting.description;
        }                     
    }, [modalIsOpen]);



    if(!appContext.user){
        const loginModalId = "loginModalSaveAdvSearchSetting";
        const saveBtn = <button type="button" 
                            class="btn btn-secondary ml-2" 
                            data-toggle="modal" 
                            data-target={"#" + loginModalId}
                            data-backdrop="static"
                            data-keyboard="false"                                    
                            >
                            Save
                        </button>;
        return (            
            <Login isModal={true}  customLoginBtn={saveBtn} customModalId={loginModalId} />
        );
    }
    
    return(
        <>
            {!editMode && appContext.userSettings.activeSearchSetting.setting !== undefined  &&
                <button className="btn btn-secondary ml-2" onClick={update}>Update</button>
            }
            {!editMode && appContext.userSettings.activeSearchSetting.setting === undefined  &&
                <button 
                    type="button" 
                    className={"btn btn-secondary ml-2"}
                    data-toggle="modal" 
                    data-target={"#storeSearchSettingModal"} 
                    data-backdrop="static"
                    onClick={()=> {setModalIsOpen(true)}}
                    >
                    Save
                </button>
            }           
            {editMode &&
                <button 
                    type="button" 
                    className={"btn btn-secondary ml-2 extra-sm-btn"}
                    data-toggle="modal" 
                    data-target={"#storeSearchSettingModal" + editIdPostFix} 
                    data-backdrop="static"
                    onClick={()=> {setModalIsOpen(true)}}
                    >
                    <i className="fa fa-edit"></i>
                </button>
            }
            {modalIsOpen &&
            <div className="modal fade" id={'storeSearchSettingModal' + editIdPostFix} tabindex="-1" role="dialog" aria-labelledby={"storeSearchSettingModalLabel" + editIdPostFix} aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={"storeSearchSettingModalLabel" + editIdPostFix}>{"Store search settings"}</h5>                            
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
                                    <label className="required_input" for={"searchSettingTitle" + editIdPostFix}>Name</label>
                                    <input 
                                        type="text"                                                                                       
                                        className="form-control" 
                                        id={"searchSettingTitle" + editIdPostFix}
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
                                    <label for={"searchSettingDescription" + editIdPostFix}>Description (optional)</label>
                                    <textarea                                         
                                        className="form-control" 
                                        id={"searchSettingDescription" + editIdPostFix}
                                        rows="5"
                                        placeholder="Enter a Description">
                                    </textarea>  
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="col-auto mr-auto">
                                <button type="button" className="btn btn-secondary close-btn-message-modal float-right" data-dismiss="modal" onClick={()=> {setModalIsOpen(false)}}>Close</button>
                            </div>                             
                            {!editMode && <button type="button" className="btn btn-secondary" onClick={store}>Save </button>}
                            {editMode && <button type="button" className="btn btn-secondary" onClick={updateTitleAndDescription}>Save</button>}
                        </div>
                    </div>
                </div>
            </div>
            }
        </>
    );

}

export default StoreSearchSettings;