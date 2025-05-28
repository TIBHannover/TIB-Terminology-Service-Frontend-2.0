import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import "../layout/termset.css";
import { Link } from 'react-router-dom';
import DeleteModalBtn from "../common/DeleteModal/DeleteModal";
import { DeleteModal } from "../common/DeleteModal/DeleteModal";
import { getTsPluginHeaders } from "../../api/header";



const TermSetList = () => {
  const appContext = useContext(AppContext);


  const callHeader = getTsPluginHeaders({ withAccessToken: true });
  let deleteEndpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/term_set/delete/";
  let redirectAfterDeleteEndpoint = process.env.REACT_APP_PROJECT_SUB_PATH + "/mytermsets";

  return (
    <>
      {appContext.userTermsets.map((tset) => {
        return (
          <div className="row">
            <div className="col-sm-12 term-set-card">
              <Link>
                <b>{tset.name}</b>
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
                afterDeleteProcess={() => { }}
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
