import { useState, useEffect, useContext } from "react";
import AddCollection from "./AddCollection";
import { fetchCollectionList } from "../../../api/userCollection";
import Toolkit from "../../../Libs/Toolkit";
import { AppContext } from "../../../context/AppContext";
import { storeUserSettings } from "../../../api/user";




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


    function renderCollections() {
        let list = [];
        for(let collection of collections){            
            list.push(
                <>
                <div class="form-check form-switch">
                    <input 
                        class="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        id={"collectionCheckbox" + collection['id']}
                        data-id={collection['id']} 
                        onChange={handleCollectionCheckboxChange}
                    />
                    <label class="form-check-label" for={"collectionCheckbox" + collection['id']}>
                        {collection['title']}&nbsp;
                        (<small>{collection['ontology_ids'].join(', ')}</small>)
                        {collection['description'] &&
                            <small>{": " + collection['description']}</small>
                        }                        
                    </label>
                </div>                
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