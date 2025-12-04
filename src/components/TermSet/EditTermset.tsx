import DropDown from "../common/DropDown/DropDown";
import { useState, useContext, useRef } from "react";
import Multiselect from "multiselect-react-dropdown";
import { olsSearch } from "../../api/search";
import { AppContext } from "../../context/AppContext";
import { updateTermset, getTermset, createTermset } from "../../api/term_set";
import FormLib from "../../Libs/FormLib";
import AlertBox from "../common/Alerts/Alerts";
import { useQuery } from "@tanstack/react-query";
import { NotFoundErrorPage } from "../common/ErrorPages/ErrorPages";
import { Link } from "react-router-dom";
import { TermsetEditComProps } from "./types";
import { OntologyTermDataV2 } from "../../api/types/ontologyTypes";
import { TermFactory } from "../../concepts";
import * as SiteUrlParamNames from "../../UrlFactory/UrlParamNames";
import CommonUrlFactory from "../../UrlFactory/CommonUrlFactory";
import { withRouter } from "react-router-dom";
import Login from "../User/Login/TS/Login";


const VISIBILITY_ONLY_ME = 1;
const VISIBILITY_TS_USRES = 2;
const VISIBILITY_PUBLIC = 3;
const VISIBILITY_VALUES = ['', 'me', 'internal', 'public']
const VISIBILITY_FOR_DROPDOWN = [
  { label: "Me (only you can visit this temset)", value: VISIBILITY_ONLY_ME },
  { label: "Internal (only TS users (not guests) can visit this termset)", value: VISIBILITY_TS_USRES },
  { label: "Public (open for everyone)", value: VISIBILITY_PUBLIC }
];


type MultiSelectOption = {
  text?: string;
  iri?: string;
  json?: OntologyTermDataV2;
}

const EditTermset = (props: TermsetEditComProps) => {
  const termsetId = props.match.params.termsetId;
  const mode = props.mode ?? "edit";

  const urlFactory = new CommonUrlFactory();
  const from = urlFactory.getParam({ name: SiteUrlParamNames.From });

  const appContext = useContext(AppContext);

  const [termsetNameNotValid, setTermsetNameNotValid] = useState(false);
  const [newTermsetVisibility, setNewTermsetVisibility] = useState(VISIBILITY_ONLY_ME);
  const [termListOptions, setTermListOptions] = useState<MultiSelectOption[]>([]);
  const [selectedTerms, setSelectedTerms] = useState<MultiSelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTermsJson, setSelectedTermsJson] = useState<OntologyTermDataV2[]>([]);
  const [submited, setSubmited] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);


  const searchUnderRef = useRef(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["termset", termsetId],
    queryFn: () => getTermset(termsetId ?? ""),
    retry: 1,
    enabled: mode === "edit"
  });


  function onTermSelect(selectedTerms: MultiSelectOption[]) {
    let termsJson = selectedTerms.map(term => term.json ?? {});
    setSelectedTermsJson(termsJson);
  }

  async function onSearchTermChange(query: string) {
    setLoading(true);
    if (!query) {
      setTermListOptions([]);
      return true;
    }
    let inputQuery = {
      "searchQuery": query,
      "types": "class,property,individual",
      "ontologyIds": ""
    };
    if (appContext.userSettings.userCollectionEnabled) {
      inputQuery['ontologyIds'] = appContext.userSettings.activeCollection.ontology_ids.join(',');
    }
    let searchResult = await olsSearch(inputQuery, true);
    let terms = "elements" in searchResult ? searchResult.elements : searchResult;
    let options: MultiSelectOption[] = [];
    //@ts-ignore
    for (let term of terms) {
      let opt: MultiSelectOption = {};
      opt['text'] = `${term.ontologyId}:${term.label} (${term.type})`;
      opt['iri'] = term.iri;
      opt['json'] = term.term;
      options.push(opt);
    }
    setLoading(false);
    setTermListOptions(options);
  }


  function submitEdit() {
    if (!data) {
      return;
    }
    let name = FormLib.getFieldByIdIfValid("termsetTitle");
    let description = document.getElementById("termsetDescription") as HTMLTextAreaElement;
    if (!name) {
      return;
    }
    if (appContext.userTermsets.find((tset) => tset.name === name && tset.id !== data.id)) {
      setTermsetNameNotValid(true);
      return;
    }
    data.name = name;
    data.visibility = VISIBILITY_VALUES[newTermsetVisibility];
    data.description = description ? description.value : "";
    data.terms = selectedTermsJson;

    updateTermset(data).then((updatedTermset) => {
      if (updatedTermset) {
        let userTermsets = [...appContext.userTermsets];
        let oldSetIndex = userTermsets.findIndex((tset) => tset.id === updatedTermset.id);
        userTermsets.splice(oldSetIndex, 1);
        userTermsets.push(updatedTermset);
        userTermsets.sort((s1, s2) => s1.name.localeCompare(s2.name));
        appContext.setUserTermsets(userTermsets);
        setSubmited(true);
        setAddedSuccess(true);
        return true;
      }
      setSubmited(true);
      setAddedSuccess(false);
    });
  }

  function submitCreate() {
    let name = FormLib.getFieldByIdIfValid("termsetTitle");
    let description = document.getElementById("termsetDescription") as HTMLTextAreaElement;
    console.log(description.value);
    if (!name) {
      return;
    }
    if (appContext.userTermsets.find((tset) => tset.name === name)) {
      setTermsetNameNotValid(true);
      return;
    }

    let termsetData = {
      name: name,
      visibility: VISIBILITY_VALUES[newTermsetVisibility],
      description: description ? description.value : "",
      terms: selectedTermsJson
    };

    createTermset(termsetData).then((newTermset) => {
      if (newTermset) {
        let userTermsets = [...appContext.userTermsets];
        userTermsets.push(newTermset);
        userTermsets.sort((s1, s2) => s1.name.localeCompare(s2.name));
        appContext.setUserTermsets(userTermsets);
        setSubmited(true);
        setAddedSuccess(true);
        return true;
      }
      setSubmited(true);
      setAddedSuccess(false);
    });
  }

  const backBtn = (
    <div className="row mt-4 mb-4">
      <div className="col-12">
        <Link className="btn-secondary p-1 text-white"
          to={process.env.REACT_APP_PROJECT_SUB_PATH + (from !== "browse" ? "/mytermsets" : "/termsets")}>
          <i className="bi bi-arrow-left me-1"></i>
          termset list
        </Link>
      </div>
    </div>
  );

  if (!appContext.user) {
    return (<Login isModal={false}></Login>);
  }


  if (submited && addedSuccess) {
    return (
      <>
        <div className="row user-info-panel">
          <AlertBox
            type="success"
            message="Added successfully!"
            alertColumnClass="col-sm-12"
          />
        </div>
        {mode === "edit" && backBtn}
      </>
    );
  } else if (submited && !addedSuccess) {
    return (
      <>
        <div className="row user-info-panel">
          <AlertBox
            type="danger"
            message="Something went wrong. Please try again!"
            alertColumnClass="col-sm-12"
          />
        </div>
        {mode === "edit" && backBtn}
      </>
    )
  }


  if (mode === "edit" && !data && !isError) {
    return (
      <div className="justify-content-center ontology-page-container">
        <div className="isLoading"></div>
      </div>
    );
  } else if (mode === "edit" && !data && isError) {
    return (
      <div className="justify-content-center ontology-page-container">
        <NotFoundErrorPage />
      </div>
    );
  } else if (mode === "edit" && data && !appContext.userTermsets.find((tset) => tset.name === data.name)) {
    // non owner is not allowed to visit the edit page
    return (
      <div className="justify-content-center ontology-page-container">
        <NotFoundErrorPage />
      </div>
    );
  } else if (mode === "edit" && data && !dataLoaded) {
    // load the terms in the multi select input
    let options: MultiSelectOption[] = [];
    let termsJson = [];
    for (let t of data.terms) {
      let term = TermFactory.createTermForTS(t);
      let opt: MultiSelectOption = {};
      opt['text'] = `${term.ontologyId}:${term.label} (${term.type})`;
      opt['iri'] = term.iri;
      opt['json'] = term.term;
      options.push(opt);
      termsJson.push(term.term);
    }
    setSelectedTerms(options);
    setSelectedTermsJson(termsJson);
    setNewTermsetVisibility(VISIBILITY_VALUES.indexOf(data.visibility));
    setDataLoaded(true);
  }


  return (
    <div className="row user-info-panel">
      {mode === "edit" && backBtn}
      <div className="row mb-4">
        <div className="col-sm-12">
          <label className="required_input" htmlFor={"termsetTitle"}>Termset Name</label>
          <input
            type="text"
            className="form-control"
            id={"termsetTitle"}
            placeholder="Enter a Name"
            defaultValue={mode === "edit" ? data?.name : ""}
            onClick={(e: React.MouseEvent<HTMLInputElement>) => {
              setTermsetNameNotValid(false);
              e.currentTarget.style.borderColor = "";
            }}
          >
          </input>
          {termsetNameNotValid &&
            <small className="text-danger">Termset already exist.</small>
          }
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-sm-12">
          <DropDown
            options={VISIBILITY_FOR_DROPDOWN}
            dropDownId="termset_visibility_dropdown"
            dropDownTitle="Visibility"
            defaultValue={mode === "edit" ? VISIBILITY_VALUES.findIndex((val) => val === data?.visibility) : 0}
            dropDownChangeHandler={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNewTermsetVisibility(parseInt(e.currentTarget.value))
            }}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-sm-12">
          <label htmlFor="search-terms">Terms</label>
          <Multiselect
            isObject={true}
            options={termListOptions}
            selectedValues={selectedTerms}
            onSelect={onTermSelect}
            onRemove={onTermSelect}
            onSearch={onSearchTermChange}
            displayValue={"text"}
            avoidHighlightFirstOption={true}
            loading={loading}
            closeIcon={"cancel"}
            id="search-terms"
            placeholder={"class, property, individual"}
            ref={searchUnderRef}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-sm-12">
          <label htmlFor={"termsetDescription"}>Description (optional)</label>
          <textarea
            className="form-control"
            id={"termsetDescription"}
            rows={5}
            placeholder="Enter a Description"
            defaultValue={mode === "edit" ? data?.description : ""}
          >
          </textarea>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <button className="btn btn-secondary" onClick={mode === "edit" ? submitEdit : submitCreate}>
            {mode === "edit" ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );

}

export default withRouter(EditTermset);
