import DropDown from "../common/DropDown/DropDown";
import { useState, useContext, useRef } from "react";
import Multiselect from "multiselect-react-dropdown";
import { olsSearch } from "../../api/search";
import TermLib from "../../Libs/TermLib";
import { AppContext } from "../../context/AppContext";
import { createTermset } from "../../api/term_set";
import FormLib from "../../Libs/FormLib";
import AlertBox from "../common/Alerts/Alerts";
import TermApi from "../../api/term";


const VISIBILITY_ONLY_ME = 1;
const VISIBILITY_TS_USRES = 2;
const VISIBILITY_PUBLIC = 3;
const VISIBILITY_VALUES = ['', 'me', 'internal', 'public']
const VISIBILITY_FOR_DROPDOWN = [
  { label: "Me (only you can visit this temset)", value: VISIBILITY_ONLY_ME },
  { label: "Internal (only TS users (not guests) can visit this termset)", value: VISIBILITY_TS_USRES },
  { label: "Public (open for everyone)", value: VISIBILITY_PUBLIC }
];


const CreateTermSetPage = (props) => {

  const appContext = useContext(AppContext);

  const [termsetNameNotValid, setTermsetNameNotValid] = useState(false);
  const [newTermsetVisibility, setNewTermsetVisibility] = useState(VISIBILITY_ONLY_ME);
  const [termListOptions, setTermListOptions] = useState([]);
  const [selectedTerms, setSelectedTerms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submited, setSubmited] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);


  const searchUnderRef = useRef(null);

  function onTermSelect(selectedTerms) {
    setSelectedTerms(selectedTerms);
  }

  async function onSearchTermChange(query) {
    setLoading(true);
    if (query === "") {
      setTermListOptions([]);
      return true;
    }
    let inputQuery = {
      searchQuery: query,
      selectedOntologies: [],
      selectedTypes: [],
      selectedCollections: [],
      obsoletes: false,
      exact: false,
      includeImported: false,
      isLeaf: false,
      searchInValues: ["label"],
      searchUnderIris: [],
      searchUnderAllIris: [],
      fromOntologyPage: false
    };
    if (appContext.userSettings.userCollectionEnabled) {
      inputQuery["selectedOntologies"] = appContext.userSettings.activeCollection.ontology_ids;
    }
    //@ts-ignore
    let searchRes = await olsSearch(inputQuery);
    let terms = !Array.isArray(searchRes) ? searchRes.elements : [];
    let options = [];
    for (let term of terms) {
      let opt = {};
      opt['text'] = `${term.ontologyId}:${term.label} (${term.type})`;
      opt['iri'] = term.iri;
      opt['ontologyId'] = term.ontologyId;
      options.push(opt);
    }
    setLoading(false);
    setTermListOptions(options);
  }


  async function submit() {
    let name = FormLib.getFieldByIdIfValid("termsetTitle");
    let description = document.getElementById("termsetDescription");
    if (!name) {
      return;
    }
    if (appContext.userTermsets.find((tset) => tset.name === name)) {
      setTermsetNameNotValid(true);
      return;
    }

    setSubmitLoading(true);
    let selectedTermsV2 = [];
    for (let term of selectedTerms) {
      let termApi = new TermApi(term['ontologyId'], term['iri']);
      await termApi.fetchTerm();
      selectedTermsV2.push(termApi.term);
    }
    let data = {
      name: name,
      visibility: VISIBILITY_VALUES[newTermsetVisibility],
      description: description ? description.value : "",
      terms: selectedTermsV2
    };

    createTermset(data).then((newTermset) => {
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

  if (submited && addedSuccess) {
    return (
      <div className="row user-info-panel">
        <AlertBox
          type="success"
          message="Added successfully!"
          alertColumnClass="col-sm-12"
        />
      </div>
    );
  } else if (submited && addedSuccess) {
    return (
      <div className="row user-info-panel">
        <AlertBox
          type="danger"
          message="Something went wrong. Please try again!"
          alertColumnClass="col-sm-12"
        />
      </div>
    )
  }

  return (
    <div className="row user-info-panel">
      <div className="row mb-4">
        <div className="col-sm-12">
          <label className="required_input" htmlFor={"termsetTitle"}>Termset Name</label>
          <input
            type="text"
            className="form-control"
            id={"termsetTitle"}
            placeholder="Enter a Name"
            onClick={(e) => {
              // setTermsetNameNotValid(false);
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
            placeholder="Enter a Description">
          </textarea>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <button className="btn btn-secondary" onClick={submit}>
            Create
            {submitLoading && <div className="isLoading-btn"></div>}
          </button>
        </div>
      </div>
    </div>
  );

}

export default CreateTermSetPage;