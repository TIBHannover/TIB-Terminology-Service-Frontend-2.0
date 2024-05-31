import { useState, useContext } from "react";
import { fetchSearchSettings } from "../../../api/user";
import Login from "../../User/Login/TS/Login";
import { AppContext } from "../../../context/AppContext";



const LoadSetting = (props) => {
    const {loadFunc} = props;

    const appContext = useContext(AppContext);

    const [settingsList, setSettingsList] = useState([]);

    
    function renderSettingsList(){
        let result = [];
        for(let setting of settingsList){
            result.push(
                <div className="form-check" key={setting['id']}>
                    <input 
                        className="form-check-input" 
                        type="radio"                         
                        name="settingsList" 
                        id={"searchSettingSwitch" + setting['id']} 
                        value={setting['id']}                             
                    />
                    <label class="form-check-label" for={"searchSettingSwitch" + setting['id']}>
                        {setting['title']}&nbsp;                        
                        {setting['description'] &&
                            <small>{": " + setting['description']}</small>
                        }                        
                    </label>
                </div>
            )
        }
        return result;
    }



    function loadSetting(){
        let settingId = document.querySelector('input[name="settingsList"]:checked').value;
        let setting = settingsList.find(setting => setting['id'] == settingId);        
        loadFunc(setting);
    }


    function fetchSettingList(){
        fetchSearchSettings().then((settingsList) => {
            setSettingsList(settingsList);
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
                            Load
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
                Load
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
                                   {renderSettingsList()}
                                </div>                                
                            </div>                                                   
                            <br></br>                            
                        </div>
                        <div className="modal-footer">
                            <div className="col-auto mr-auto">
                                <button type="button" className="btn btn-secondary close-btn-message-modal float-right" data-dismiss="modal">Close</button>
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