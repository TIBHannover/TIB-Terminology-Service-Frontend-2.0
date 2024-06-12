import { useState, useContext } from "react";
import { fetchSearchSettings } from "../../../api/user";
import Login from "../../User/Login/TS/Login";
import { AppContext } from "../../../context/AppContext";
import SwitchButton from "../../common/SwitchButton/SwitchButton";
import AlertBox from "../../common/Alerts/Alerts";




const LoadSetting = (props) => {
    const {loadFunc} = props;

    const appContext = useContext(AppContext);

    const [settingsList, setSettingsList] = useState([]);
    const [deleteMode, setDeleteMode] = useState(false);
    const [settingToDelete, setSettingToDelete] = useState(null);
    const [settingToEdit, setSettingToEdit] = useState(null);
    const [editMode, setEditMode] = useState(false);

    
    function renderSettingsList(){
        let result = [];
        for(let setting of settingsList){           
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
                        className="btn btn-secondary ml-2 extra-sm-btn"                        
                        >
                        <i className="fa fa-edit"></i>
                    </button>             
                    <button 
                        className="btn btn-danger btn-sm btn-delete-note borderless-btn extra-sm-btn ml-2" 
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



    function loadSetting(){
        let settingId = document.querySelector('.search-setting-checkbox:checked')?.dataset?.id;
        let setting = settingsList.find(setting => setting['id'] == settingId);        
        loadFunc(setting);
    }


    function deleteSetting(){
        setDeleteMode(true);
        // let settingId = document.querySelector('.search-setting-checkbox:checked')?.dataset?.id;
        // let setting = settingsList.find(setting => setting['id'] == settingId);        
        // loadFunc(setting);
    }



    function fetchSettingList(){
        setDeleteMode(false);
        setEditMode(false);
        fetchSearchSettings().then((settingsList) => {
            setSettingsList(settingsList);
            let userSettings = appContext.userSettings;
            if(userSettings.activeSearchSetting && userSettings.activeSearchSetting['id']){
                let activeCheckbox = document.getElementById("searchSettingSwitch" + userSettings.activeSearchSetting['id']);
                if(activeCheckbox){
                    activeCheckbox.checked = true;
                }
            }
        });
    }





    if(!appContext.user){
        const loginModalId = "loginModalLoadAdvSearchSetting";
        const loadBtn = <button type="button" 
                            class="btn btn-secondary ml-2" 
                            data-toggle="modal" 
                            data-target={"#" + loginModalId}
                            data-backdrop="static"
                            data-keyboard="false"                                    
                            >
                            My search settings
                        </button>;
        return (            
            <Login isModal={true}  customLoginBtn={loadBtn} customModalId={loginModalId} />
        );
    }

    
    return(
        <>
            <button 
                type="button" 
                className={"btn btn-secondary ml-2"}
                data-toggle="modal" 
                data-target={"#SearchSettingListModal"} 
                data-backdrop="static"
                onClick={fetchSettingList}
                >
                My search settings
            </button>            
            <div className="modal fade" id={'SearchSettingListModal'} tabindex="-1" role="dialog" aria-labelledby={"SearchSettingListModalLabel"} aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={"SearchSettingListModalLabel"}>{"My search settings"}</h5>                            
                        </div>
                        <div className="modal-body">                            
                            <div className="row">
                                <div className="col-sm-12">
                                   {!deleteMode && !editMode && renderSettingsList()}
                                   {deleteMode && !editMode &&
                                        <AlertBox 
                                            type="danger" 
                                            message="Are you sure you want to delete this setting? This action is irreversible."
                                            alertColumnClass="col-sm-12"
                                        />
                                   }
                                </div>                                
                            </div>                                                   
                            <br></br>                            
                        </div>
                        <div className="modal-footer">
                            <div className="col-auto mr-auto">
                                {!deleteMode && !editMode && 
                                    <button type="button" className="btn btn-secondary close-btn-message-modal float-right" data-dismiss="modal">Close</button>
                                }
                                {(deleteMode || editMode) && 
                                    <button type="button" className="btn btn-secondary close-btn-message-modal float-right" onClick={() => {
                                        setDeleteMode(false);
                                        setEditMode(false);
                                    
                                    }}>Back</button>
                                }
                            </div>                             
                            <button type="button" className="btn btn-secondary" onClick={loadSetting} data-dismiss="modal">Load</button>
                        </div>
                    </div>
                </div>
            </div>            
        </>
    );

}

export default LoadSetting;