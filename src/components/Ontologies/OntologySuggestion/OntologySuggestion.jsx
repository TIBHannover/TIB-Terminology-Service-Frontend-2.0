import { useState , useContext, useEffect} from "react";
import AlertBox from "../../common/Alerts/Alerts";
import TextEditor from "../../common/TextEditor/TextEditor";
import Toolkit from "../../../Libs/Toolkit";
import { OntologySuggestionContext } from "../../../context/OntologySuggestionContext";
import FormLib from "../../../Libs/FormLib";
import { runShapeTest, submitOntologySuggestion } from "../../../api/ontology";
import draftToMarkdown from 'draftjs-to-markdown';
import {convertToRaw } from 'draft-js';
import CollectionApi from "../../../api/collection";
import Multiselect from 'multiselect-react-dropdown';


const ONTOLOGY_SUGGESTION_INTRO_STEP = 0;
const ONTOLOGY_MAIN_METADATA_SETP = 1;
const ONTOLOGY_EXTRA_METADATA_STEP = 2;
const USER_FORM_STEP = 3;
const PROGRESS_BAR_INCREMENT_PERCENTAGE = 25;



const OntologySuggestion = () => {
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
    const [collections, setCollections] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [form, setForm] = useState({
        "username": "",
        "email": "",
        "reason": "",        
        "name": "",
        "purl": "",
        "collection_ids": ""
    });


    function onTextEditorChange (newEditorState){
        document.getElementsByClassName('rdw-editor-main')[0].style.border = '';
        setEditorState(newEditorState);                
    };


    async function onNextClick(){
        if(progressStep === ONTOLOGY_SUGGESTION_INTRO_STEP){
            setProgressBarValue(progressBarValue + PROGRESS_BAR_INCREMENT_PERCENTAGE);
            setProgressStep(ONTOLOGY_MAIN_METADATA_SETP);
        }else if (progressStep === ONTOLOGY_MAIN_METADATA_SETP){            
            let name = FormLib.getFieldByIdIfValid('onto-suggest-name');
            let purl = FormLib.getFieldByIdIfValid('onto-suggest-purl');
            if (!name || !purl){
                return;
            }
            if(!shapeTestIsReady){
                setRunningTest(true);
                let validationResult = await runShapeTest(purl);
                if (!validationResult){
                    setTestFailed(true);
                    setRunningTest(false);
                    return;
                }
                if (validationResult.error.length === 0){
                    setShapeValidationError({"error":[], "info":[]});                
                    setProgressBarValue(progressBarValue + 2*PROGRESS_BAR_INCREMENT_PERCENTAGE);
                    setProgressStep(USER_FORM_STEP);
                    setRunningTest(false);
                    setShapeTestIsReady(true);
                    return;
                }
                setShapeValidationError(validationResult);                
                setRunningTest(false);
                setShapeTestIsReady(true);
            }
            setProgressBarValue(progressBarValue + PROGRESS_BAR_INCREMENT_PERCENTAGE);
            setProgressStep(ONTOLOGY_EXTRA_METADATA_STEP);
        }else if (progressStep === ONTOLOGY_EXTRA_METADATA_STEP){    
            // let valid = true;
            // for(let error of shapeValidationError.error){
            //     let inputField = document.getElementById("missing-metadata-" + error['about']);
            //     if (inputField && inputField.value === ""){
            //         inputField.style.borderColor = 'red';
            //         valid = false;
            //     }
            // }
            // if (!valid){
            //     return;
            // }
            
            setProgressBarValue(progressBarValue + PROGRESS_BAR_INCREMENT_PERCENTAGE);
            setProgressStep(USER_FORM_STEP);            
        }       
    }



    function submit(){       
        let username = FormLib.getFieldByIdIfValid('onto-suggest-username');
        let email = FormLib.getFieldByIdIfValid('onto-suggest-email');
        let reason = FormLib.getTextEditorValueIfValid(editorState, 'contact-form-text-editor');
        if (!username || !email || !reason){
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


    function noErrorsAndLoading(){
        return !formSubmitted && !submitWait && !runningTest && !testFailed;
    }


    useEffect(async() => {
        let collectionApi = new CollectionApi();
        await collectionApi.fetchCollectionsWithStats();
        let collections = [];
        for (let colStats of collectionApi.collectionsList){
            collections.push(colStats['collection']);
        }
        setCollections(collections);
    },[]);



    const contextData = {
        editorState: editorState,
        form: form,
        setForm: setForm,
        onTextEditorChange: onTextEditorChange,
        validationResult: shapeValidationError,
        collections: collections,
        selectedCollections: selectedCollections,
    }

    const submitedSeccessfully = formSubmitted && formSubmitSuccess && !submitWait;
    const submitedFailed = formSubmitted && !formSubmitSuccess && !submitWait;

    return (
        <OntologySuggestionContext.Provider value={contextData}>
        <div className="row">
            <div className="col-sm-12 user-info-panel">
                <h4><b>Suggest your Ontology</b></h4>    
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style={{width: progressBarValue + "%"}} aria-valuenow={progressBarValue} aria-valuemin="0" aria-valuemax="100"></div>
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
                        message="Sorry! Something went wrong. Please try again later."
                    />                    
                    </>
                }
                {submitWait &&
                    <div className="row">
                        <div className="col-12 text-center">                
                            <div class="spinner-border text-dark" role="status">
                                <span class="visually-hidden"></span>                            
                            </div>
                            <div className="">Please wait ...</div>
                        </div>
                    </div>
                }   
                {runningTest &&
                    <div className="row">
                        <div className="col-12 text-center">                
                            <div class="spinner-border text-dark" role="status">
                                <span class="visually-hidden"></span>                            
                            </div>
                            <div className="">Testing the ontology shape ...</div>
                        </div>
                    </div>
                }             
                {testFailed &&
                    <>
                    <AlertBox
                        type="danger"
                        message="Sorry! We cannot test this ontology's shape. Please try again later."
                    />                    
                    </>
                }
                {(submitedSeccessfully || testFailed ||  submitedFailed) && 
                    <a className="btn btn-secondary" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologysuggestion"}>New suggestion</a>
                }
                {progressStep === ONTOLOGY_SUGGESTION_INTRO_STEP && noErrorsAndLoading() &&
                    <Intro />
                }
                {progressStep === ONTOLOGY_MAIN_METADATA_SETP && noErrorsAndLoading() &&
                    <OntologyMainMetaDataForm />                    
                }
                {progressStep === ONTOLOGY_EXTRA_METADATA_STEP && noErrorsAndLoading() &&
                    <OntologyExtraMetadataForm />
                }
                {progressStep === USER_FORM_STEP && noErrorsAndLoading() &&
                    <UserForm />
                }    
                <br></br>            
                {progressStep !== ONTOLOGY_SUGGESTION_INTRO_STEP && noErrorsAndLoading() &&
                    <button type="button" class="btn btn-secondary mr-3" onClick={() => {
                        let nextStep = progressStep - 1;
                        setProgressBarValue(progressBarValue - PROGRESS_BAR_INCREMENT_PERCENTAGE);
                        setProgressStep(nextStep)
                        }}
                        >
                        Previous
                    </button>
                }
                {progressStep === USER_FORM_STEP && noErrorsAndLoading() &&
                    <button type="button" class="btn btn-secondary" onClick={submit}>Submit</button>
                }
                {progressStep !== USER_FORM_STEP && noErrorsAndLoading() &&
                    <>                                        
                    <button type="button" class="btn btn-secondary" onClick={onNextClick}
                        >
                        Next
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

    function renderErrosWithTheirInputFields(){
        let result = [];
        for (let error of componentContext.validationResult.error){
            let errorContent = Toolkit.transformLinksInStringToAnchor(error['text']);
            result.push(
                <>
                <div className="p-2 alert alert-danger" dangerouslySetInnerHTML={{ __html: errorContent }}></div>                
                <label for={"missing-metadata-" + error['about']}>{error['about']}</label>
                <input 
                    type="text"
                    onChange={(e) => {
                        e.target.style.borderColor = '';
                        let form = componentContext.form;
                        form[error['about']] = e.target.value;
                        componentContext.setForm(form);                        
                    }}                                                         
                    class="form-control" 
                    id={"missing-metadata-" + error['about']}
                    defaultValue={componentContext.form[error['about']]}
                    >
                </input>
                <br></br>
                <br></br>
                </>
            );
        }
        return result;
    }


    function renderInfo(){
        return componentContext.validationResult.info.map((i) =>{
            let infoContent = Toolkit.transformLinksInStringToAnchor(i);
            return (<><div className="p-2 alert alert-info" dangerouslySetInnerHTML={{ __html: infoContent }}></div><br></br></>)
        });
    }
    


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
        <button type="button" class="btn btn-sm btn-secondary mb-2" onClick={() => setInfoIsExpanded(!infoIsExpanded)}>
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



const Intro = () => {
    return(
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
            <a href="https://www.purl.org/ontologymetadata/shape/20240502" target="_blank" className="ml-1">
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
                    <label className="required_input" for="onto-suggest-username">Your name</label>
                    <input 
                        type="text"
                        onChange={(e) => {
                            e.target.style.borderColor = '';
                            let form = componentContext.form;
                            form.username = e.target.value;
                            componentContext.setForm(form);
                        }}                                                         
                        class="form-control" 
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
                    <label className="required_input" for="onto-suggest-email">Email</label>
                    <small> (we use this email to inform you about our decision regarding indexing your ontology.)</small>
                    <input 
                        type="text"
                        onChange={(e) => {
                            e.target.style.borderColor = '';
                            let form = componentContext.form;
                            form.email = e.target.value;
                            componentContext.setForm(form);
                        }}                                                 
                        class="form-control" 
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

    function onSelectRemoveCollection(selectedList, selectedItem){
        let form = componentContext.form;
        let collectionIds = "";
        for(let collectionId of selectedList){
            collectionIds += collectionId + ",";
        }
        collectionIds = collectionIds.slice(0, -1);
        form.collection_ids = collectionIds;
        componentContext.setForm(form);
    }


    function getSelectedCollections(){
        let selectedCollections = [];
        let spilitedList = componentContext.form.collection_ids.split(",");
        for(let collection of spilitedList){
            if (collection !== ""){
                selectedCollections.push(collection);
            }
        }
        return selectedCollections;
    }


    return(
        <>
        <div className="row">
            <div className="col-sm-8">
                <label className="required_input" for="onto-suggest-name">Ontology name</label>
                <input 
                    type="text"
                    onChange={(e) => {
                        e.target.style.borderColor = '';
                        let form = componentContext.form;
                        form.name = e.target.value;
                        componentContext.setForm(form);
                    }}                                                 
                    class="form-control" 
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
                <label className="required_input" for="onto-suggest-purl">Ontology purl</label>
                <input 
                    type="text"
                    onChange={(e) => {
                        e.target.style.borderColor = '';
                        let form = componentContext.form;
                        form.purl = e.target.value;
                        componentContext.setForm(form);
                    }}                                                 
                    class="form-control" 
                    id="onto-suggest-purl"
                    placeholder="Enter the ontology's PURL"
                    defaultValue={componentContext.form.purl}
                    >
                </input>
            </div>
        </div>
        <br></br>
        <div className="row">
            <div className="col-sm-8">
                <label>Collection in TIB (optional)</label>
                <Multiselect
                    isObject={false}
                    options={componentContext.collections}  
                    selectedValues={getSelectedCollections()}
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
    );
}   


export default OntologySuggestion;