import {useContext, useState} from "react";
import {AppContext} from "../../context/AppContext";
import "../layout/termset.css";
import {Link} from 'react-router-dom';
import DeleteModalBtn from "../common/DeleteModal/DeleteModal";
import {DeleteModal} from "../common/DeleteModal/DeleteModal";
import {getTsPluginHeaders} from "../../api/header";
import CreateTermsetPage from "./CreateTermset";


const TermSetList = () => {
  const appContext = useContext(AppContext);
  
  const [createMode, setCreateMode] = useState(false);
  
  const callHeader = getTsPluginHeaders({withAccessToken: true});
  let deleteEndpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/term_set/delete/";
  let redirectAfterDeleteEndpoint = process.env.REACT_APP_PROJECT_SUB_PATH + "/mytermsets";
  
  if(process.env.REACT_APP_TERMSET_FEATURE !== "true") {
    return "";
  }
  
  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <button className={"btn btn-secondary create-termset-btn " + (!createMode ? "float-right" : "")}
                  onClick={() => {
                    setCreateMode(!createMode);
                  }}>
            {!createMode &&
              <>
                <i className="bi bi-plus-square mr-2"></i>
                Termset
              </>
            }
            {createMode &&
              <>
                <i className="bi bi-arrow-left mr-1"></i>
                My termset list
              </>
            }
          </button>
        </div>
      </div>
      {createMode &&
        <CreateTermsetPage/>
      }
      {!createMode && appContext.userTermsets.map((tset) => {
        return (
          <div className="row">
            <div className="col-sm-12 term-set-card">
              <Link to={process.env.REACT_APP_PROJECT_SUB_PATH + "/termsets/" + tset.id} style={{ marginTop: "2px" }}>
                <b>{tset.name}</b>
              </Link>
              <Link
                to={process.env.REACT_APP_PROJECT_SUB_PATH + "/termsets/" + tset.id + "/edit"}
                className="btn btn-sm borderless-btn"
                style={{marginTop: "1px"}}
              >
                <i className="fa fa-edit fa-borderless edit-termset-icon"></i>
              </Link>
              <DeleteModalBtn
                modalId={tset.id}
                key={"deleteBtnUserCollection" + tset.id}
                btnText={<i className="fa fa-close fa-borderless"></i>}
                btnClass="extra-sm-btn ml-2"
              />
              <DeleteModal
                modalId={tset.id}
                callHeaders={callHeader}
                deleteEndpoint={deleteEndpoint + tset.id + "/"}
                afterDeleteRedirectUrl={redirectAfterDeleteEndpoint}
                key={"deleteCollection" + tset.id}
                afterDeleteProcess={() => {
                }}
                objectToDelete={tset}
                method="DELETE"
              />
            </div>
          </div>
        )
      })
      
      }
    </>
  )
}

export default TermSetList;
