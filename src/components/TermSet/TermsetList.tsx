import { useState, useContext } from "react";
import "../layout/termset.css";
import { Link } from 'react-router-dom';
import { DeleteModal } from "../common/DeleteModal/DeleteModal";
import { getTsPluginHeaders } from "../../api/header";
import { TsTermset } from "../../concepts";
import Pagination from "../common/Pagination/Pagination";
import { AppContext } from "../../context/AppContext";
import * as SiteUrlParamNames from "../../UrlFactory/UrlParamNames";
import EditTermset from "./EditTermset";

type CmpProps = {
  termsets: TsTermset[];
  redirectAfterDeleteEndpoint: string;
  backBtnText: string;
  from?: string;
};


const TermSetList = (props: CmpProps) => {
  const { termsets, redirectAfterDeleteEndpoint, backBtnText, from } = props;

  const [createMode, setCreateMode] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  function handlePagination(value: number) {
    setPage(value);
  }


  if (process.env.REACT_APP_TERMSET_FEATURE !== "true") {
    return <></>;
  }

  return (
    <>
      <div className="row">
        <div className={"col-sm-12 " + (!createMode ? "text-end" : "")}>
          <button className="btn btn-secondary create-termset-btn"
            onClick={() => {
              setCreateMode(!createMode);
            }}>
            {!createMode &&
              <>
                <i className="bi bi-plus-square me-2"></i>
                Termset
              </>
            }
            {createMode &&
              <>
                <i className="bi bi-arrow-left me-1"></i>
                {backBtnText}
              </>
            }
          </button>
        </div>
      </div>
      {createMode &&
        <EditTermset mode={"create"} />
      }
      {!createMode && termsets.slice((page - 1) * pageSize, page * pageSize).map((tset) => {
        return (
          <>
            <TermsetCard
              termset={tset}
              redirectAfterDeleteEndpoint={redirectAfterDeleteEndpoint}
              from={from}
            />

          </>
        );
      })
      }
      <div className="row">
        <div className="col-sm-12 text-center">
          <Pagination
            clickHandler={handlePagination}
            count={Math.ceil(termsets.length / pageSize)}
            initialPageNumber={page}
          />
        </div>
      </div>
    </>
  )
}


const TermsetCard = (props: { termset: TsTermset, redirectAfterDeleteEndpoint: string, from?: string }) => {
  const { termset, redirectAfterDeleteEndpoint, from } = props;
  let deleteEndpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/term_set/delete/";
  const callHeader = getTsPluginHeaders({ withAccessToken: true });
  let redirectAfterDeleteUrl = process.env.REACT_APP_PROJECT_SUB_PATH + redirectAfterDeleteEndpoint;
  const appContext = useContext(AppContext);

  const canEdit = appContext.user.id === termset.creator;
  const fromParam = from ? (`?${SiteUrlParamNames.From}=${from}`) : "";

  return (
    <div className="row">
      <div className="col-sm-12 term-set-card">
        <Link to={process.env.REACT_APP_PROJECT_SUB_PATH + "/termsets/" + termset.id + fromParam} style={{ marginTop: "2px" }}>
          <b>{termset.name}</b>
        </Link>
        {canEdit &&
          <>
            <Link
              to={process.env.REACT_APP_PROJECT_SUB_PATH + "/termsets/" + termset.id + "/edit" + fromParam}
              className="btn btn-sm borderless-btn"
              style={{ marginTop: "1px" }}
            >
              <i className="fa fa-edit fa-borderless edit-termset-icon"></i>
            </Link>
            <DeleteModal
              modalId={termset.id}
              callHeaders={callHeader}
              deleteEndpoint={deleteEndpoint + termset.id + "/"}
              afterDeleteRedirectUrl={redirectAfterDeleteUrl}
              key={"deleteCollection" + termset.id}
              afterDeleteProcess={() => {
              }}
              objectToDelete={termset}
              method="DELETE"
              //@ts-ignore
              btnText={<i className="fa fa-close fa-borderless"></i>}
              btnClass="extra-sm-btn ml-2"
            />
          </>
        }
      </div>
    </div>
  );
};


export default TermSetList;
