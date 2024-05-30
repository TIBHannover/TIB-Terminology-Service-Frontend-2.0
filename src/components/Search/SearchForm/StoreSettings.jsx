import { useState } from "react";



const StoreSearchSettings = (props) => {

    const [showAlert, setShowAlert] = useState(false);



    function returnSettingTitleIfValid(){
        let title = document.getElementById('searchSettingTitle').value;
        if(!title || title === ''){
            document.getElementById('searchSettingTitle').style.border = '1px solid red';
            return false;
        }
    }


    async function store(){
        let settingTitle = returnSettingTitleIfValid();
        let formIsValid = settingTitle ? true : false;
        
        if(!formIsValid){
            return;
        }
        setShowAlert(false);
        let description = document.getElementById('searchSettingDescription').value;              
        let settingData = {
            'title': settingTitle,
            'description': description,
            'setting': {}
        };
        let response = null;
    }



    return(
        <>
            <button 
                type="button" 
                className={"btn btn-secondary ml-2"}
                data-toggle="modal" 
                data-target={"#storeSearchSettingModal"} 
                data-backdrop="static"
                >
                Save
            </button>

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
                                <button type="button" className="btn btn-secondary close-btn-message-modal float-right" data-dismiss="modal">Close</button>
                            </div>                             
                            <button type="button" className="btn btn-secondary" onClick={store}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}

export default StoreSearchSettings;