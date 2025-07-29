import DropDown from "../common/DropDown/DropDown";
import {useState, useContext, useRef} from "react";
import Multiselect from "multiselect-react-dropdown";
import {olsSearch} from "../../api/search";
import TermLib from "../../Libs/TermLib";
import {AppContext} from "../../context/AppContext";
import {updateTermset, getTermset} from "../../api/term_set";
import FormLib from "../../Libs/FormLib";
import AlertBox from "../common/Alerts/Alerts";
import {useQuery} from "@tanstack/react-query";
import {GeneralErrorPage, NotFoundErrorPage} from "../common/ErrorPages/ErrorPages";
import {Link} from "react-router-dom";


const VISIBILITY_ONLY_ME = 1;
const VISIBILITY_TS_USRES = 2;
const VISIBILITY_PUBLIC = 3;
const VISIBILITY_VALUES = ['', 'me', 'internal', 'public']
const VISIBILITY_FOR_DROPDOWN = [
  {label: "Me (only you can visit this temset)", value: VISIBILITY_ONLY_ME},
  {label: "Internal (only TS users (not guests) can visit this termset)", value: VISIBILITY_TS_USRES},
  {label: "Public (open for everyone)", value: VISIBILITY_PUBLIC}
];


const EditTermset = (props) => {
  const termsetId = props.match.params.termsetId;
  
  const appContext = useContext(AppContext);
  
  const [termsetNameNotValid, setTermsetNameNotValid] = useState(false);
  const [newTermsetVisibility, setNewTermsetVisibility] = useState(VISIBILITY_ONLY_ME);
  const [termListOptions, setTermListOptions] = useState([]);
  const [selectedTerms, setSelectedTerms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTermsJson, setSelectedTermsJson] = useState([]);
  const [submited, setSubmited] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  
  const searchUnderRef = useRef(null);
  
  const {data, _, error} = useQuery({
    queryKey: ["termset", termsetId],
    queryFn: () => getTermset(termsetId),
    retry: 1
  });
  
  
  function onTermSelect(selectedTerms) {
    let termsJson = selectedTerms.map(term => term.json);
    setSelectedTermsJson(termsJson);
  }
  
  async function onSearchTermChange(query) {
    setLoading(true);
    if (query === "") {
      setTermListOptions([]);
      return true;
    }
    let inputQuery = {
      "searchQuery": query,
      "types": "class,property,individual",
    };
    if (appContext.userSettings.userCollectionEnabled) {
      inputQuery['ontologyIds'] = appContext.userSettings.activeCollection.ontology_ids.join(',');
    }
    let terms = await olsSearch(inputQuery, true);
    let options = [];
    for (let term of terms) {
      let opt = {};
      opt['text'] = `${term['ontologyId']}:${TermLib.extractLabel(term)} (${TermLib.getTermType(term)})`;
      opt['iri'] = term['iri'];
      opt['json'] = term;
      options.push(opt);
    }
    setLoading(false);
    setTermListOptions(options);
  }
  
  
  function submit() {
    let name = FormLib.getFieldByIdIfValid("termsetTitle");
    let description = document.getElementById("termsetDescription");
    if (!name) {
      return;
    }
    if (appContext.userTermsets.find((tset) => tset.name === name && tset.id !== data.id)) {
      setTermsetNameNotValid(true);
      return;
    }
    let payload = {
      id: data.id,
      name: name,
      visibility: VISIBILITY_VALUES[newTermsetVisibility],
      description: description ? description.value : "",
      terms: selectedTermsJson
    };
    console.log(payload);
    
    updateTermset(payload).then((updatedTermset) => {
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
  
  const backBtn = (
    <div className="row mt-4 mb-4">
      <div className="col-12">
        <Link className="btn-secondary p-1 text-white"
              to={process.env.REACT_APP_PROJECT_SUB_PATH + "/mytermsets"}>
          <i className="bi bi-arrow-left me-1"></i>
          My termset list
        </Link>
      </div>
    </div>
  );
  
  
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
        {backBtn}
      </>
    );
  } else if (submited && addedSuccess) {
    return (
      <>
        <div className="row user-info-panel">
          <AlertBox
            type="danger"
            message="Something went wrong. Please try again!"
            alertColumnClass="col-sm-12"
          />
        </div>
        {backBtn}
      </>
    )
  }
  
  
  if (!data && !error) {
    return (
      <div className="justify-content-center ontology-page-container">
        <div className="isLoading"></div>
      </div>
    );
  } else if (!data && error && error.status !== 404) {
    return (
      <div className="justify-content-center ontology-page-container">
        <GeneralErrorPage/>
      </div>
    );
  } else if (!data && error && error.status === 404) {
    return (
      <div className="justify-content-center ontology-page-container">
        <NotFoundErrorPage/>
      </div>
    );
  } else if (data && !appContext.userTermsets.find((tset) => tset.name === data.name)) {
    // non owner is not allowed to visit the edit page
    return (
      <div className="justify-content-center ontology-page-container">
        <NotFoundErrorPage/>
      </div>
    );
  } else if (data && !dataLoaded) {
    // load the set terms in the multi select input
    let options = [];
    let termsJson = [];
    for (let termWrapper of data.terms) {
      let term = termWrapper.json;
      let opt = {};
      opt['text'] = `${term['ontologyId']}:${TermLib.extractLabel(term)} (${TermLib.getTermType(term)})`;
      opt['iri'] = term['iri'];
      opt['json'] = term;
      options.push(opt);
      termsJson.push(term);
    }
    setSelectedTerms(options);
    setSelectedTermsJson(termsJson);
    setNewTermsetVisibility(data.visibility);
    setDataLoaded(true);
  }
  
  
  return (
    <div className="row user-info-panel">
      {backBtn}
      <div className="row mb-4">
        <div className="col-sm-12">
          <label className="required_input" htmlFor={"termsetTitle"}>Termset Name</label>
          <input
            type="text"
            className="form-control"
            id={"termsetTitle"}
            placeholder="Enter a Name"
            defaultValue={data.name}
            onClick={(e) => {
              setTermsetNameNotValid(false);
              e.target.style.borderColor = "";
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
            defaultValue={VISIBILITY_VALUES.findIndex((val) => val === data.visibility)}
            dropDownChangeHandler={(e) => {
              setNewTermsetVisibility(e.target.value)
            }}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-sm-12">
          <label for="search-terms">Terms</label>
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
            rows="5"
            placeholder="Enter a Description"
            defaultValue={data.description}
          >
          </textarea>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <button className="btn btn-secondary" onClick={submit}>Update</button>
        </div>
      </div>
    </div>
  );
  
}

export default EditTermset;
