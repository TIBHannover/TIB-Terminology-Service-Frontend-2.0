import { useState, useEffect, useContext } from "react";
import AddCollection from "./AddCollection";
import { fetchCollectionList } from "../../../api/userCollection";
import Toolkit from "../../../Libs/Toolkit";
import { AppContext } from "../../../context/AppContext";
import { storeUserSettings } from "../../../api/user";
import DeleteModalBtn from "../../common/DeleteModal/DeleteModal";
import { DeleteModal } from "../../common/DeleteModal/DeleteModal";
import AuthLib from "../../../Libs/AuthLib";




const UserCollection = () => {

    const appContext = useContext(AppContext);

    const [collections, setCollections] = useState([]);



    async function fetchCollections() {
        const collections = await fetchCollectionList();
        setCollections(collections);
    }


    async function handleCollectionCheckboxChange(event) {
        let targetId = event.target.dataset.id;
        let isChecked = event.target.checked;
        let selectedCollection = Toolkit.getObjectInListIfExist(collections, 'id', parseInt(targetId));
        let contextObject = {"title": selectedCollection['title'], "ontology_ids": selectedCollection['ontology_ids']};
        let userSttings = {};
        if(isChecked){
            let allCollectionCheckboxes = document.getElementsByClassName('user-collection-checkbox');
            for(let checkbox of allCollectionCheckboxes){
                if(checkbox.dataset.id !== targetId){
                    checkbox.checked = false;
                }
            }
            
            appContext.setActiveUserCollection(contextObject);
            appContext.setUserCollectionEnabled(true);
            userSttings = {"userCollectionEnabled": true, "activeCollection": contextObject}
        }
        else{
            appContext.setActiveUserCollection({"title": "", "ontology_ids": []});
            appContext.setUserCollectionEnabled(false);
            userSttings = {"userCollectionEnabled": false, "activeCollection": {"title": "", "ontology_ids": []}}
        }    

        await storeUserSettings(userSttings);   
    }



    async function disableTheDeletedCollection(collection){        
        if(appContext.activeUserCollection['title'] === collection['title']){
            appContext.setActiveUserCollection({"title": "", "ontology_ids": []});
            appContext.setUserCollectionEnabled(false);
            let userSttings = {"userCollectionEnabled": false, "activeCollection": {"title": "", "ontology_ids": []}}
            await storeUserSettings(userSttings);   
        }
    }



    function collectionCheckboxIsChecked(collectionTitle){
        if(appContext.activeUserCollection['title'] === collectionTitle){
            return true;
        }
        return false;
    }


    function renderCollections() {
        let list = [];
        let callHeader = AuthLib.setHeaderForTsMicroBackend({withAccessToken:true});
        callHeader['Content-Type'] = 'application/json';
        let redirectAfterDeleteEndpoint = process.env.REACT_APP_PROJECT_SUB_PATH + "/mycollections";
        let deleteEndpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/collection/delete/";
        for(let collection of collections){            
            list.push(
                <>
                <div class="form-check form-switch">
                    <input 
                        class="form-check-input user-collection-checkbox" 
                        type="checkbox" 
                        role="switch" 
                        id={"collectionCheckbox" + collection['id']}
                        data-id={collection['id']} 
                        onChange={handleCollectionCheckboxChange}
                        checked={collectionCheckboxIsChecked(collection['title'])}
                    />
                    <label class="form-check-label" for={"collectionCheckbox" + collection['id']}>
                        {collection['title']}&nbsp;
                        (<small>{collection['ontology_ids'].join(', ')}</small>)
                        {collection['description'] &&
                            <small>{": " + collection['description']}</small>
                        }                        
                    </label>
                    <DeleteModalBtn 
                        modalId={collection['id']}   
                        key={"deleteBtnUserCollection" + collection['id']}
                        btnText={<i className="fa fa-close fa-borderless"></i>}
                        btnClass="extra-sm-btn ml-2"
                    />
                    <AddCollection 
                        editMode={true}
                        editBtnText={<i className="fa fa-edit fa-borderless"></i>}
                        collectionToEdit={collection}
                        btnClass="extra-sm-btn ml-2"
                    />
                </div>
                <DeleteModal
                    modalId={collection['id']}                    
                    callHeaders={callHeader}
                    deleteEndpoint={deleteEndpoint + collection['id']}
                    afterDeleteRedirectUrl={redirectAfterDeleteEndpoint}
                    key={"deleteCollection" + collection['id']}
                    afterDeleteProcess={disableTheDeletedCollection}
                    objectToDelete={collection}
                />                                
                </>
            );
        }        
        return list;
    }


    useEffect(() => {
        fetchCollections();
    }, []);


    return (
        <div className="row user-info-panel">
            <div className="col-sm-10">
                <h3>My Collections</h3>
                <br/>                            
                <div className="row">
                    <div className="col-sm-12">
                        {renderCollections()}
                    </div>
                </div>
            </div> 
            <div className="col-sm-2">
                <AddCollection />
            </div>           
        </div>
    );
}


export default UserCollection;