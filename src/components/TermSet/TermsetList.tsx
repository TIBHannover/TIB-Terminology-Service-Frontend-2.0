import { useState, useContext, useEffect } from "react";
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
  const [filteredTermsets, setFilteredTermsets] = useState<TsTermset[]>(termsets);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 10;

  function handlePagination(value: number) {
    setPage(value);
  }

  function filterTermsetList(e: React.ChangeEvent<HTMLInputElement>) {
    let query = e.target.value;
    if (query) {
      let filteredTermsets = termsets.filter((tset: TsTermset) => {
        if (tset.name.toLowerCase().includes(query.toLowerCase())) {
          return true;
        }
        return false;
      })
      setFilteredTermsets(filteredTermsets);
      setPage(1);
    } else {
      setFilteredTermsets(termsets);
      setPage(1);
    }
  }

  useEffect(() => {
    setFilteredTermsets(termsets);
    setIsLoading(false);
  }, [termsets]);


  if (process.env.REACT_APP_TERMSET_FEATURE !== "true") {
    return <></>;
  }

  return (
    <>
      <div className="row mb-4">
        {!createMode &&
          <div className="col-sm-10 ps-0">
            <input
              type="text"
              className="form-control ms-0"
              id="search-termset"
              aria-describedby="filter termset list"
              placeholder="Filter termset list ..."
              onChange={filterTermsetList}
            />
          </div>
        }
        <div className={"col-sm-2 " + (!createMode ? "text-end" : "")}>
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
      {isLoading &&
        <div className="justify-content-center ontology-page-container">
          <div className="isLoading"></div>
        </div>
      }
      {!createMode && filteredTermsets.slice((page - 1) * pageSize, page * pageSize).map((tset) => {
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
            count={Math.ceil(filteredTermsets.length / pageSize)}
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

  const canEdit = appContext?.user?.id === termset.creator;
  const fromParam = from ? (`?${SiteUrlParamNames.From}=${from}`) : "";

  return (
    <div className="row">
      <div className="col-sm-12 term-set-card">
        <div className="row">
          <div className="col-sm-6">
            <Link to={process.env.REACT_APP_PROJECT_SUB_PATH + "/termsets/" + termset.id + fromParam} style={{ marginTop: "2px" }}>
              <p className="fw-bold fs-6 d-inline">{termset.name}</p>
            </Link>

          </div>
          <div className="col-sm-6 text-end">
            {canEdit &&
              <>
                <Link
                  to={process.env.REACT_APP_PROJECT_SUB_PATH + "/termsets/" + termset.id + "/edit" + fromParam}
                  className="btn borderless-btn bg-white"
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
        <div className="row">
          <div className="col-12 d-flex flex-column">
            <small>{termset.created_at.split("T")[0] + " by " + termset.creator_name}</small>
            <small>{termset.description}</small>
          </div>
        </div>
      </div>
    </div>
  );
};


export default TermSetList;
