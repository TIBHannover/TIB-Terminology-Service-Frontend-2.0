import {useState, useContext, useEffect, useRef} from "react";
import AlertBox from "../common/Alerts/Alerts";
import Multiselect from "multiselect-react-dropdown";
import {AppContext} from "../../context/AppContext";
import {createTermset, addTermToMultipleSets, removeTermFromSet} from "../../api/term_set";
import FormLib from "../../Libs/FormLib";
import Toolkit from "../../Libs/Toolkit";
import {getJumpToResultV2} from "../../api/search";
import TermLib from "../../Libs/TermLib";


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
  const {modalId} = props;
  const appContext = useContext(AppContext);
  
  const [submited, setSubmited] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [selectedTermsetIds, setSelectedTermsetIds] = useState([]);
  const [termsetNameNotValid, setTermsetNameNotValid] = useState(false);
  
  const [termListOptions, setTermListOptions] = useState([]);
  const [selectedTerms, setSelectedTerms] = useState(null);
  const [loading, setLoading] = useState(true);
  
  
  const searchUnderRef = useRef(null);
  
  
  function submitNewTermset() {
    return;
  }
  
  function onTermSelect(event) {
    return;
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
    let terms = await getJumpToResultV2(query);
    let options = [];
    for (let term of terms) {
      let opt = {};
      opt['text'] = `${term['ontologyId']}:${TermLib.extractLabel(term)} (${TermLib.getTermType(term)})`;
      opt['iri'] = term['iri'];
      options.push(opt);
    }
    setLoading(false);
    setTermListOptions(options);
  }
  
  
  function closeModal() {
    setAddedSuccess(false);
    setSubmited(false);
    setCreateMode(false);
    setSelectedTermsetIds([]);
  }
  
  
  // useEffect(() => {
  //     let options = [];
  //     let existingSets = [];
  //     let removeLoadingMap = new Map(removeLoading);
  //     for (let tset of appContext.userTermsets) {
  //         if (!tset.terms.find((tsetTerm) => tsetTerm.iri === term.iri)) {
  //             options.push({"text": tset.name, "id": tset.id});
  //         } else {
  //             removeLoadingMap.set(tset.id, false);
  //             existingSets.push({name: tset.name, id: tset.id});
  //         }
  //     }
  //     setTermExistingSets(existingSets)
  //     setRemoveLoading(removeLoadingMap);
  //     setTermSets(options);
  // }, [term, appContext.userTermsets]);
  
  
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
                  onClick={() => {
                    if (createMode) {
                      submitNewTermset();
                    }
                  }}>
                  {"Add"}
                </button>
              }
              {submited &&
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={closeModal}>Close
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
