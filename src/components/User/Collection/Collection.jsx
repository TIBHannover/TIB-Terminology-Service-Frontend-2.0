import {useState, useEffect, useContext} from "react";
import AddCollection from "./AddCollection";
import {fetchCollectionList} from "../../../api/userCollection";
import Toolkit from "../../../Libs/Toolkit";
import {AppContext} from "../../../context/AppContext";
import {storeUserSettings} from "../../../api/user";
import DeleteModalBtn from "../../common/DeleteModal/DeleteModal";
import {DeleteModal} from "../../common/DeleteModal/DeleteModal";
import {getTsPluginHeaders} from "../../../api/header";
import OntologyApi from "../../../api/ontology";
import SwitchButton from "../../common/SwitchButton/SwitchButton";


const UserCollection = () => {
  
  const appContext = useContext(AppContext);
  
  const [collections, setCollections] = useState([]);
  const [ontologiesListForSelection, setOntologiesListForSelection] = useState([]);
  
  
  async function fetchCollections() {
    const collections = await fetchCollectionList();
    setCollections(Toolkit.sortListOfObjectsByKey(collections, 'created_at'));
  }
  
  
  async function loadOntologiesForSelection() {
    let ontologyApi = new OntologyApi({});
    await ontologyApi.fetchOntologyList();
    let ontologyList = [];
    for (let ontology of ontologyApi.list) {
      let opt = {'text': '', 'id': ''};
      opt['text'] = ontology['ontologyId'];
      opt['id'] = ontology['ontologyId'];
      ontologyList.push(opt);
    }
    setOntologiesListForSelection(ontologyList);
  }
  
  
  async function handleCollectionCheckboxChange(event) {
    let targetId = event.target.dataset.id;
    let isChecked = event.target.checked;
    let selectedCollection = Toolkit.getObjectInListIfExist(collections, 'id', parseInt(targetId));
    let contextObject = {"title": selectedCollection['title'], "ontology_ids": selectedCollection['ontology_ids']};
    let userSttings = {...appContext.userSettings};
    if (isChecked) {
      userSttings.activeCollection = contextObject;
      userSttings.userCollectionEnabled = true;
    } else {
      userSttings.activeCollection = {"title": "", "ontology_ids": []};
      userSttings.userCollectionEnabled = false;
    }
    appContext.setUserSettings(userSttings);
    await storeUserSettings(userSttings);
  }
  
  
  async function disableTheDeletedCollection(collection) {
    if (appContext.userSettings.activeCollection['title'] === collection['title']) {
      let userSttings = {...appContext.userSettings};
      userSttings.activeCollection = {"title": "", "ontology_ids": []};
      userSttings.userCollectionEnabled = false;
      appContext.setUserSettings(userSttings);
      await storeUserSettings(userSttings);
    }
  }
  
  
  function collectionCheckboxIsChecked(collectionTitle) {
    if (appContext.userSettings.activeCollection['title'] === collectionTitle) {
      return true;
    }
    return false;
  }
  
  
  function renderCollections() {
    let list = [];
    let callHeader = getTsPluginHeaders({withAccessToken: true});
    callHeader['Content-Type'] = 'application/json';
    let redirectAfterDeleteEndpoint = process.env.REACT_APP_PROJECT_SUB_PATH + "/mycollections";
    let deleteEndpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/collection/delete/";
    for (let collection of collections) {
      list.push(
        <>
          <SwitchButton
            id={"collectionCheckbox" + collection['id']}
            dataId={collection['id']}
            label={collection['title']}
            smallText={collection['ontology_ids'].join(', ')}
            className="user-collection-checkbox"
            inLine={true}
            onChange={handleCollectionCheckboxChange}
            checked={collectionCheckboxIsChecked(collection['title'])}
          />
          <AddCollection
            editMode={true}
            editBtnText={<i className="fa fa-edit fa-borderless"></i>}
            collectionToEdit={collection}
            btnClass="extra-sm-btn ms-2"
            exstingCollectionList={collections}
            ontologiesListForSelection={ontologiesListForSelection}
          />
          <DeleteModal
            modalId={collection['id']}
            callHeaders={callHeader}
            deleteEndpoint={deleteEndpoint + collection['id'] + '/'}
            afterDeleteRedirectUrl={redirectAfterDeleteEndpoint}
            key={"deleteCollection" + collection['id']}
            afterDeleteProcess={disableTheDeletedCollection}
            objectToDelete={collection}
            method="DELETE"
            btnText={<i className="fa fa-close fa-borderless"></i>}
            btnClass="extra-sm-btn ms-2"
          />
          <p>
            {collection['description'] &&
              <small>{collection['description']}</small>
            }
          </p>
        </>
      );
    }
    return list;
  }
  
  
  useEffect(() => {
    fetchCollections();
    loadOntologiesForSelection();
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
        <AddCollection
          exstingCollectionList={collections}
          ontologiesListForSelection={ontologiesListForSelection}
        />
      </div>
    </div>
  );
}


export default UserCollection;