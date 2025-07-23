import {useState, useContext, useEffect} from "react";
import AlertBox from "../../common/Alerts/Alerts";
import TextEditor from "../../common/TextEditor/TextEditor";
import Toolkit from "../../../Libs/Toolkit";
import {OntologySuggestionContext} from "../../../context/OntologySuggestionContext";
import FormLib from "../../../Libs/FormLib";
import {
  submitOntologySuggestion,
  runShapeTest,
  checkSuggestionExist,
  checkOntologyPurlIsValidUrl
} from "../../../api/ontology";
import draftToMarkdown from 'draftjs-to-markdown';
import {convertToRaw} from 'draft-js';
import {getCollectionsAndThierOntologies} from "../../../api/collection";
import {useQuery} from "@tanstack/react-query";
import Multiselect from 'multiselect-react-dropdown';
import CommonUrlFactory from "../../../UrlFactory/CommonUrlFactory";
import * as SiteUrlParamNames from '../../../UrlFactory/UrlParamNames';
import {Link} from "react-router-dom";


const ONTOLOGY_SUGGESTION_INTRO_STEP = 0;
const ONTOLOGY_MAIN_METADATA_SETP = 1;
const ONTOLOGY_EXTRA_METADATA_STEP = 2;
const USER_FORM_STEP = 3;
const PROGRESS_BAR_INCREMENT_PERCENTAGE = 25;


const OntologySuggestion = () => {
  const urlManager = new CommonUrlFactory();
  const inputCollectionId = urlManager.getParam({name: SiteUrlParamNames.CollectionId});
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitSuccess, setFormSubmitSuccess] = useState(false);
  const [submitWait, setSubmitWait] = useState(false);
  const [runningTest, setRunningTest] = useState(false);
  const [testFailed, setTestFailed] = useState(false);
  const [editorState, setEditorState] = useState(null);
  const [progressStep, setProgressStep] = useState(ONTOLOGY_SUGGESTION_INTRO_STEP);
  const [progressBarValue, setProgressBarValue] = useState(1);
  const [shapeValidationError, setShapeValidationError] = useState({"error": [], "info": []});
  const [shapeTestIsReady, setShapeTestIsReady] = useState(false);
  const [ontologyExist, setOntologyExist] = useState(false);
  const [existingOntologyId, setExistingOntologyId] = useState("");
  const [existingCollections, setExistingCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState(inputCollectionId ? [inputCollectionId] : []);
  const [collectionSuggestMode, setCollectionSuggestMode] = useState(false);
  const [missingCollectionIds, setMissingCollectionIds] = useState([]);
  const [suggestionExist, setSuggestionExist] = useState(false);
  const [purlIsNotValidMessage, setPurlIsNotValidMessage] = useState("");
  const [queryEnabled, setQueryEnabled] = useState(true);
  const [nextBtnLoading, setNextBtnLoading] = useState(false);
  const [form, setForm] = useState({
    "username": "",
    "email": "",
    "reason": "",
    "name": "",
    "purl": "",
    "collection_ids": inputCollectionId ? inputCollectionId : "",
    "collection_suggestion": false
  });
  
  const collectionWithOntologyListQuery = useQuery({
    queryKey: ['allCollectionsWithTheirOntologies'],
    queryFn: getCollectionsAndThierOntologies,
    enabled: queryEnabled
  });
  
  let collectionIds = [];
  if (collectionWithOntologyListQuery.data) {
    for (let col in collectionWithOntologyListQuery.data) {
      collectionIds.push(col);
    }
  }
  const collections = collectionIds;
  
  
  function onTextEditorChange(newEditorState) {
    document.getElementsByClassName('rdw-editor-main')[0].style.border = '';
    setEditorState(newEditorState);
  };
  
  
  async function shapeTest(purl) {
    if (!shapeTestIsReady) {
      setRunningTest(true);
      let validationResult = await runShapeTest(purl);
      if (!validationResult || validationResult["shape_test_failed"]) {
        setTestFailed(true);
        setRunningTest(false);
        setShapeTestIsReady(true);
        return;
      }
      if (validationResult.error.length === 0 && validationResult.info.length === 0) {
        setShapeValidationError({"error": [], "info": []});
        setProgressBarValue(progressBarValue + 2 * PROGRESS_BAR_INCREMENT_PERCENTAGE);
        setProgressStep(USER_FORM_STEP);
        setRunningTest(false);
        setShapeTestIsReady(true);
        return;
      }
      setShapeValidationError(validationResult);
      setRunningTest(false);
      setShapeTestIsReady(true);
    }
  }
  
  
  async function runOntologyMainMetaDataValidation(ontoPurl) {
    let ontoExist = false;
    let existingOnto = "";
    let existingCollectionsList = [];
    let selectedCollectionIds = [];
    let missingCollections = [];
    if (process.env.REACT_APP_PROJECT_ID === "general") {
      selectedCollectionIds = selectedCollections;
    } else {
      // on projects frontend. Collection is preselected for the app.
      selectedCollectionIds.push(process.env.REACT_APP_PROJECT_NAME)
    }
    for (let col in collectionWithOntologyListQuery.data) {
      // find the collection ids that contains the provided ontology purl
      let ontologies = collectionWithOntologyListQuery.data[col];
      for (let onto of ontologies) {
        if (onto['ontologyPurl'] === ontoPurl) {
          existingOnto = onto['ontologyId'];
          existingCollectionsList.push(col);
          ontoExist = true;
        }
      }
    }
    for (let colId of selectedCollectionIds) {
      // if the selected collection ids by user (to add the ontology) are not configured in the system, then
      // the selected collection ids should be part of the onto suggest request.
      if (!existingCollectionsList.includes(colId)) {
        missingCollections.push(colId);
      }
    }
    
    if (ontoExist && missingCollections.length === 0) {
      // onto exist and there is no new selected collection to add it. process is over.
      setOntologyExist(true);
      setExistingOntologyId(existingOnto);
      setExistingCollections(existingCollectionsList);
      setMissingCollectionIds([]);
      setCollectionSuggestMode(false);
      return true;
    } else if (ontoExist && missingCollections.length !== 0) {
      // ontology exist but there are some missing collection ids. suggest add to collection.
      let formData = form;
      formData.collection_suggestion = true;
      formData.collection_ids = missingCollections;
      setForm(formData);
      setOntologyExist(true);
      setExistingOntologyId(existingOnto);
      setExistingCollections(existingCollectionsList);
      setCollectionSuggestMode(true);
      setMissingCollectionIds(missingCollections);
      return true;
    }
    
    // if we reach here, it means the ontology does not exist in the system. run the onto suggest.
    let suggestionAlreadyExist = await checkSuggestionExist(ontoPurl);
    if (suggestionAlreadyExist) {
      setSuggestionExist(true);
      return
    }
    
    await shapeTest(ontoPurl);
    return true;
    
  }
  
  async function ontologyPurlIsValid(ontoPurl) {
    /**
     * it should:
     *  return 2xx on call
     *  point to either a .owl or .ttl file
     */
    
    let purlIsValidRes = await checkOntologyPurlIsValidUrl(ontoPurl);
    if (!purlIsValidRes["valid"]) {
      document.getElementById('onto-suggest-purl').style.borderColor = 'red';
      setPurlIsNotValidMessage(purlIsValidRes["reason"]);
      return false;
    }
    setPurlIsNotValidMessage("");
    return true;
  }
  
  
  async function onNextClick() {
    setNextBtnLoading(true);
    if (progressStep === ONTOLOGY_SUGGESTION_INTRO_STEP) {
      setProgressBarValue(progressBarValue + PROGRESS_BAR_INCREMENT_PERCENTAGE);
      setProgressStep(ONTOLOGY_MAIN_METADATA_SETP);
    } else if (progressStep === ONTOLOGY_MAIN_METADATA_SETP) {
      let name = FormLib.getFieldByIdIfValid('onto-suggest-name');
      let purl = FormLib.getFieldByIdIfValid('onto-suggest-purl');
      if (!name || !purl) {
        setNextBtnLoading(false);
        return;
      }
      if (!await ontologyPurlIsValid(purl)) {
        setNextBtnLoading(false);
        return;
      }
      await runOntologyMainMetaDataValidation(purl);
      setProgressBarValue(progressBarValue + PROGRESS_BAR_INCREMENT_PERCENTAGE);
      setProgressStep(ONTOLOGY_EXTRA_METADATA_STEP);
    } else if (progressStep === ONTOLOGY_EXTRA_METADATA_STEP) {
      setProgressBarValue(progressBarValue + PROGRESS_BAR_INCREMENT_PERCENTAGE);
      setProgressStep(USER_FORM_STEP);
    }
    setNextBtnLoading(false);
  }
  
  
  function submit() {
    let username = FormLib.getFieldByIdIfValid('onto-suggest-username');
    let email = FormLib.getFieldByIdIfValid('onto-suggest-email');
    let reason = FormLib.getTextEditorValueIfValid(editorState, 'contact-form-text-editor');
    if (!username || !email || !reason) {
      return;
    }
    setSubmitWait(true);
    let formData = form;
    reason = editorState.getCurrentContent();
    reason = draftToMarkdown(convertToRaw(reason));
    formData.reason = reason;
    
    submitOntologySuggestion(formData).then((result) => {
      setFormSubmitSuccess(result);
      setFormSubmitted(true);
      setSubmitWait(false);
      setProgressBarValue(progressBarValue + PROGRESS_BAR_INCREMENT_PERCENTAGE);
    });
  }
  
  
  function noErrorsAndLoading() {
    return !formSubmitted && !submitWait && !runningTest && !suggestionExist;
  }
  
  useEffect(() => {
    if (collectionWithOntologyListQuery.data) {
      setQueryEnabled(false);
    }
  }, [collectionWithOntologyListQuery.data]);
  
  
  const contextData = {
    editorState: editorState,
    form: form,
    setForm: setForm,
    validationResult: shapeValidationError,
    collections: collections,
    selectedCollections: selectedCollections,
    setSelectedCollections: setSelectedCollections,
    ontologyExist: ontologyExist,
    existingOntologyId: existingOntologyId,
    missingCollectionIds: missingCollectionIds,
    existingCollections: existingCollections,
    inputCollectionId: inputCollectionId,
    purlIsNotValidMessage: purlIsNotValidMessage,
    setPurlIsNotValidMessage: setPurlIsNotValidMessage,
    testFailed: testFailed,
    onTextEditorChange: onTextEditorChange
  }
  
  const submitedSeccessfully = formSubmitted && formSubmitSuccess && !submitWait;
  const submitedFailed = formSubmitted && !formSubmitSuccess && !submitWait;
  const showNewSuggestionBtn = (submitedSeccessfully || submitedFailed || (ontologyExist && !collectionSuggestMode) || suggestionExist);
  
  if (process.env.REACT_APP_ONTOLOGY_SUGGESTION !== "true") {
    return "";
  }
  
  return (
    <OntologySuggestionContext.Provider value={contextData}>
      <div className="row">
        <div className="col-sm-12 user-info-panel">
          <h4><b>Suggest your Ontology {inputCollectionId ? `for ${inputCollectionId}` : ""}</b></h4>
          <div className="progress">
            <div className="progress-bar" role="progressbar" style={{width: progressBarValue + "%"}}
                 aria-valuenow={progressBarValue} aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          <br></br>
          {submitedSeccessfully &&
            <>
              <AlertBox
                type="success"
                message="Thank you! Your query has been submitted successfully. We will inform you about our decision via email."
              />
            </>
          }
          {submitedFailed &&
            <>
              <AlertBox
                type="danger"
                message={
                  <div className="text-center">
                    Sorry! Something went wrong. Please try again later.
                    <br/>
                    <br/>
                    You can report this incident to us via:
                    <Link className="btn btn-secondary ms-2" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/contact"}>
                      Contact us
                    </Link>
                  </div>
                }
              />
            </>
          }
          {submitWait &&
            <div className="row">
              <div className="col-12 text-center">
                <div className="spinner-border text-dark" role="status">
                  <span className="visually-hidden"></span>
                </div>
                <div className="">Please wait ...</div>
              </div>
            </div>
          }
          {runningTest &&
            <div className="row">
              <div className="col-12 text-center">
                <div className="spinner-border text-dark" role="status">
                  <span className="visually-hidden"></span>
                </div>
                <div className="">Testing the ontology metadata ...</div>
              </div>
            </div>
          }
          {testFailed && progressStep === ONTOLOGY_EXTRA_METADATA_STEP &&
            <>
              <AlertBox
                type="danger"
                message={
                  <div className="text-center">
                    The ontology metadata test cannot be performed on this ontology.
                    <br/>
                    <br/>
                    <p className="text-center">
                      <b>Attention</b> You can skip this step by clicking <b>Next</b> and submit the ontology without a
                      test report.
                    </p>
                  </div>
                }
              />
            </>
          }
          {suggestionExist &&
            <>
              <AlertBox
                type="info"
                message="This ontology is already suggested to us by another user
                        . As we are processing the ontology, we cannot accept your request at the moment. 
                        Thank for your understanding!
                        "
              />
            </>
          }
          {progressStep === ONTOLOGY_SUGGESTION_INTRO_STEP && noErrorsAndLoading() &&
            <Intro/>
          }
          {progressStep === ONTOLOGY_MAIN_METADATA_SETP && noErrorsAndLoading() &&
            <OntologyMainMetaDataForm/>
          }
          {progressStep === ONTOLOGY_EXTRA_METADATA_STEP && noErrorsAndLoading() &&
            <OntologyExtraMetadataForm/>
          }
          {progressStep === USER_FORM_STEP && noErrorsAndLoading() &&
            <UserForm/>
          }
          <br></br>
          {(progressStep !== ONTOLOGY_SUGGESTION_INTRO_STEP && noErrorsAndLoading()) && !(ontologyExist && !collectionSuggestMode) &&
            <button type="button" className="btn btn-secondary mr-3" onClick={() => {
              let nextStep = progressStep - 1;
              setProgressBarValue(progressBarValue - PROGRESS_BAR_INCREMENT_PERCENTAGE);
              setProgressStep(nextStep)
            }}
            >
              Previous
            </button>
          }
          {showNewSuggestionBtn &&
            <a className="btn btn-secondary" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologysuggestion"}>New
              suggestion</a>
          }
          {progressStep === USER_FORM_STEP && noErrorsAndLoading() && !(ontologyExist && !collectionSuggestMode) &&
            <button type="button" className="btn btn-secondary" onClick={submit}>Submit</button>
          }
          {(progressStep !== USER_FORM_STEP && noErrorsAndLoading()) && !(ontologyExist && !collectionSuggestMode) &&
            <>
              <button type="button" className="btn btn-secondary" onClick={onNextClick}
              >
                Next
                {nextBtnLoading && <div className="isLoading-btn"></div>}
              </button>
            </>
          }
        </div>
      </div>
    </OntologySuggestionContext.Provider>
  );
}


const OntologyExtraMetadataForm = () => {
  const [infoIsExpanded, setInfoIsExpanded] = useState(false);
  const componentContext = useContext(OntologySuggestionContext);
  
  function renderErrosWithTheirInputFields() {
    let result = [];
    for (let error of componentContext.validationResult.error) {
      let errorContent = Toolkit.transformLinksInStringToAnchor(error['text']);
      result.push(
        <>
          <div className="p-2 alert alert-danger" dangerouslySetInnerHTML={{__html: errorContent}}></div>
          <label htmlFor={"missing-metadata-" + error['about']}>{error['about']}</label>
          <input
            type="text"
            onChange={(e) => {
              e.target.style.borderColor = '';
              let form = componentContext.form;
              form[error['about']] = e.target.value;
              componentContext.setForm(form);
            }}
            className="form-control"
            id={"missing-metadata-" + error['about']}
            defaultValue={componentContext.form[error['about']]}
          >
          </input>
          <br></br>
          <br></br>
        </>
      );
    }
    
    if (result.length === 0) {
      result.push(
        <AlertBox
          type="info"
          message="No issue found with this ontology's shape."
        />
      );
    }
    return result;
  }
  
  
  function renderInfo() {
    return componentContext.validationResult.info.map((i) => {
      let infoContent = Toolkit.transformLinksInStringToAnchor(i);
      return (<>
        <div className="p-2 alert alert-info" dangerouslySetInnerHTML={{__html: infoContent}}></div>
        <br></br></>)
    });
  }
  
  
  if (componentContext.ontologyExist) {
    return (
      <>
        <AlertBox
          type="info"
          message="This ontology already exists in the system."
        />
        Check: &nbsp;
        <b>
          <Link to={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + componentContext.existingOntologyId}>
            {componentContext.existingOntologyId}
          </Link>
        </b>
        <br/>
        Part of these collections:
        <ul>
          {componentContext.existingCollections.map((colId) => {
            return (
              <li>
                <Link href={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies?collection=' + colId}>
                  {colId}
                </Link>
              </li>)
          })}
        </ul>
        <br/>
        {componentContext.missingCollectionIds.length !== 0 &&
          <>
            <h5><b>Missing from your selected collection(s)</b></h5>
            <ul>
              {componentContext.missingCollectionIds.map((colId) => {
                return (<li>{colId}</li>)
              })}
            </ul>
            Would you like to add this ontology to these collection(s)? &nbsp;
            <b>If yes, click on the Next button</b>
          </>
        }
        <br/><br/>
      </>
    );
  }
  
  if (!componentContext.testFailed) {
    return (
      <>
        <h5><b>Missing metadata</b></h5>
        <p>
          The following metadata are missing from the ontology. Please consider adding them.
        </p>
        <p>
          <b>Attention</b> You can skip this step and submit the ontology without adding the missing metadata.
          However, <b>the chance of your ontology getting indexed in TIB TS will be lower.</b>
        </p>
        <br></br>
        {renderErrosWithTheirInputFields()}
        <br></br>
        <button type="button" className="btn btn-sm btn-secondary mb-2"
                onClick={() => setInfoIsExpanded(!infoIsExpanded)}>
          {!infoIsExpanded && <><i className="fa fa-angle-double-down fa-borderless fs-6"></i>More</>}
          {infoIsExpanded && <><i className="fa fa-angle-double-up fa-borderless fs-6"></i>Less</>}
        </button>
        {infoIsExpanded &&
          <>
            <h5><b>Warnings (no action needed)</b></h5>
            {renderInfo()}
          </>
        }
        <hr></hr>
      </>
    );
  }
  return "";
}


const Intro = () => {
  return (
    <>
      <p>Before starting, please make sure you prepaired these information:</p>
      <ul>
        <li>Your name and email</li>
        <li>Ontology name and PURL</li>
        <li>Reason for suggesting the ontology (short text)</li>
      </ul>
      <br></br>
      <p>
        <b>Attention</b>
        <br></br>
        The ontology you are suggesting will be validated against the following SHACL shape. This shape tests
        whether the ontology contains a rich set of metadata or not. <br></br>
        <a href="https://www.purl.org/ontologymetadata/shape/20240502" target="_blank" className="ms-1"
           rel="noopener noreferrer">
          https://www.purl.org/ontologymetadata/shape/20240502
        </a>
      </p>
      <p>Click next to start</p>
    </>
  );
}


const UserForm = () => {
  const componentContext = useContext(OntologySuggestionContext);
  return (
    <>
      <div className="row">
        <div className="col-sm-8">
          <label className="required_input" htmlFor="onto-suggest-username">Your name</label>
          <input
            type="text"
            onChange={(e) => {
              e.target.style.borderColor = '';
              let form = componentContext.form;
              form.username = e.target.value;
              componentContext.setForm(form);
            }}
            className="form-control"
            id="onto-suggest-username"
            placeholder="Enter your fullname. E.g., John Doe"
            defaultValue={componentContext.form.username}
          >
          </input>
        </div>
      </div>
      <br></br>
      <div className="row">
        <div className="col-sm-8">
          <label className="required_input" htmlFor="onto-suggest-email">Email</label>
          <small> (we use this email to inform you about our decision regarding indexing your ontology.)</small>
          <input
            type="text"
            onChange={(e) => {
              e.target.style.borderColor = '';
              let form = componentContext.form;
              form.email = e.target.value;
              componentContext.setForm(form);
            }}
            className="form-control"
            id="onto-suggest-email"
            placeholder="Enter your email"
            defaultValue={componentContext.form.email}
          >
          </input>
        </div>
      </div>
      <br></br>
      <div className="row">
        <div className="col-sm-8">
          <label className="required_input">Reason</label>
          <TextEditor
            editorState={componentContext.editorState}
            textChangeHandlerFunction={componentContext.onTextEditorChange}
            wrapperClassName=""
            editorClassName=""
            placeholder="Please briefly describe the ontology and its purpose and why it should get indexed in TIB TS."
            textSizeOptions={['Normal']}
            wrapperId="contact-form-text-editor"
          />
        </div>
      </div>
    </>
  );
}


const OntologyMainMetaDataForm = () => {
  const componentContext = useContext(OntologySuggestionContext);
  
  function onSelectRemoveCollection(selectedList, selectedItem) {
    let form = componentContext.form;
    let collectionIds = "";
    for (let collectionId of selectedList) {
      collectionIds += collectionId + ",";
    }
    collectionIds = collectionIds.slice(0, -1);
    form.collection_ids = collectionIds;
    componentContext.setForm(form);
    componentContext.setSelectedCollections(selectedList);
  }
  
  
  return (
    <>
      {componentContext.purlIsNotValidMessage &&
        <div className="row">
          <div className="col-sm-12">
            <AlertBox type="danger" message={
              <div className="text-center">
                We cannot proceed with your request.
                <br/>
                <br/>
                Reason: {componentContext.purlIsNotValidMessage}
                <br/>
                If you believe the PURL is correct, then please report this issue via:
                <Link className="btn btn-secondary ms-2" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/contact"}>
                  Contact us
                </Link>
              </div>
            }></AlertBox>
          </div>
        </div>
      }
      <div className="row">
        <div className="col-sm-8">
          <label className="required_input" htmlFor="onto-suggest-name">Ontology name</label>
          <input
            type="text"
            onChange={(e) => {
              e.target.style.borderColor = '';
              let form = componentContext.form;
              form.name = e.target.value;
              componentContext.setForm(form);
            }}
            className="form-control"
            id="onto-suggest-name"
            placeholder="Enter the ontology's name"
            defaultValue={componentContext.form.name}
          >
          </input>
        </div>
      </div>
      <br></br>
      <div className="row">
        <div className="col-sm-8">
          <label className="required_input" htmlFor="onto-suggest-purl">Ontology purl</label>
          <input
            type="text"
            onChange={(e) => {
              e.target.style.borderColor = '';
              let form = componentContext.form;
              form.purl = e.target.value;
              componentContext.setForm(form);
              componentContext.setPurlIsNotValidMessage("");
            }}
            className="form-control"
            id="onto-suggest-purl"
            placeholder="Enter the ontology's PURL"
            defaultValue={componentContext.form.purl}
          >
          </input>
        </div>
      </div>
      {process.env.REACT_APP_PROJECT_ID === "general" && !componentContext.inputCollectionId &&
        <>
          <br></br>
          <div className="row">
            <div className="col-sm-8">
              <label>Collection in TIB (optional)</label>
              <Multiselect
                isObject={false}
                options={componentContext.collections}
                selectedValues={componentContext.selectedCollections}
                onSelect={onSelectRemoveCollection}
                onRemove={onSelectRemoveCollection}
                avoidHighlightFirstOption={true}
                closeIcon={"cancel"}
                id="onto-suggest-collection"
                placeholder="Click here to select collections"
              />
            </div>
          </div>
        </>
      }
    </>
  );
}


export default OntologySuggestion;
