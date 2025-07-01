import {useState, useContext, useRef} from "react";
import AlertBox from "../common/Alerts/Alerts";
import Multiselect from "multiselect-react-dropdown";
import {AppContext} from "../../context/AppContext";
import {getJumpToResult} from "../../api/search";
import TermLib from "../../Libs/TermLib";
import {updateTermset} from "../../api/term_set";
import TermApi from "../../api/term";

export const AddTermModalBtn = (props) => {
  const {modalId} = props;
  return (
    <a
      className={"btn btn-secondary btn-sm borderless-btn"}
      data-toggle="modal"
      data-target={"#addToTermsetModal-" + modalId}
      data-backdrop="static"
    >
      <i className="bi bi-plus-square"></i>
      {" terms"}
    </a>
  );
}


export const AddTermModal = (props) => {
  const {termset, modalId} = props;
  const appContext = useContext(AppContext);
  
  const [submited, setSubmited] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [termListOptions, setTermListOptions] = useState([]);
  const [selectedTerms, setSelectedTerms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  
  const searchUnderRef = useRef(null);
  
  
  async function submitNewTermsToSet() {
    setSubmitLoading(true);
    let selectedTermsV2 = [];
    for (let term of selectedTerms) {
      let termApi = new TermApi(term['ontologyId'], term['iri']);
      await termApi.fetchTerm();
      selectedTermsV2.push(termApi.term);
    }
    const payload = {};
    payload['id'] = termset.id;
    payload['name'] = termset.name;
    payload['description'] = termset.description;
    payload['visibility'] = termset.visibility;
    payload['terms'] = [...termset.terms.map(term => term.json), ...selectedTermsV2];
    updateTermset(payload).then((updatedTermset) => {
      if (updatedTermset) {
        let userTermsets = [...appContext.userTermsets];
        let tsInex = userTermsets.findIndex(tset => tset.id === updatedTermset.id);
        userTermsets.splice(tsInex, 1);
        userTermsets.push(updatedTermset);
        appContext.setUserTermsets(userTermsets);
        setSubmited(true);
        setAddedSuccess(true);
      } else {
        setSubmited(true);
        setAddedSuccess(false);
      }
      setSubmitLoading(false);
    });
  }
  
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
      "searchQuery": query,
      // "types": "class,property,individual",
    };
    if (appContext.userSettings.userCollectionEnabled) {
      inputQuery['ontologyIds'] = appContext.userSettings.activeCollection.ontology_ids.join(',');
    }
    let terms = await getJumpToResult(inputQuery, 10);
    let options = [];
    for (let term of terms) {
      let opt = {};
      opt['text'] = `${term['ontology_name']}:${TermLib.extractLabel(term)} (${TermLib.getTermType(term)})`;
      opt['iri'] = term['iri'];
      opt['ontologyId'] = term['ontology_name'];
      options.push(opt);
    }
    setLoading(false);
    setTermListOptions(options);
  }
  
  
  function closeModal() {
    setAddedSuccess(false);
    setSubmited(false);
    setSelectedTerms([]);
  }
  
  
  return (
    <div>
      <div className="modal fade" id={"addToTermsetModal-" + modalId} tabIndex={-1} role="dialog"
           aria-labelledby={"addToTermsetModal-" + modalId} aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title"
                  id={"addToTermsetModal-" + modalId}>{`Add terms to this set`}</h5>
              {!submited &&
                <button onClick={closeModal} type="button" className="close" data-dismiss="modal"
                        aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              }
            </div>
            <div className="modal-body">
              {!submited &&
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
              }
              {submited && addedSuccess &&
                <AlertBox
                  type="success"
                  message="Added successfully!"
                  alertColumnClass="col-sm-12"
                />
              }
              {submited && !addedSuccess &&
                <AlertBox
                  type="danger"
                  message="Something went wrong. Please try again!"
                  alertColumnClass="col-sm-12"
                />
              }
            </div>
            <div className="modal-footer justify-content-center">
              {!submited &&
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={submitNewTermsToSet}>
                  {"Add"}
                  {submitLoading && <div className="isLoading-btn"></div>}
                </button>
              }
              {submited &&
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={() => {
                    closeModal();
                    window.location.reload();
                  }}
                >
                  Close
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
