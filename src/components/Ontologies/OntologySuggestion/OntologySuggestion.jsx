import { useState , useContext} from "react";
import AlertBox from "../../common/Alerts/Alerts";
import TextEditor from "../../common/TextEditor/TextEditor";
import Toolkit from "../../../Libs/Toolkit";
import { OntologySuggestionContext } from "../../../context/OntologySuggestionContext";
import FormLib from "../../../Libs/FormLib";
import { submitOntologySuggestion } from "../../../api/user";
import draftToMarkdown from 'draftjs-to-markdown';
import {convertToRaw } from 'draft-js';



const OntologySuggestion = (props) => {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formSubmitSuccess, setFormSubmitSuccess] = useState(false);
    const [editorState, setEditorState] = useState(null);
    const [randomNum1, setRandomNum1] = useState(Toolkit.getRandomInt(0, 11));
    const [randomNum2, setRandomNum2] = useState(Toolkit.getRandomInt(0, 11));
    const [selectedFile, setSelectedFile] = useState(null);
    const [withUpload, setWithUpload] = useState(false);
    const [progressStep, setProgressStep] = useState(0);
    const [progressBarValue, setProgressBarValue] = useState(1);
    const [form, setForm] = useState({
        "username": "",
        "email": "",
        "reason": "",
        "safeQestion": "",
        "safeAnswer": "",
        "name": "",
        "purl": "",
        "preferredPrefix": "",
        "uri": "",
        "licenseUrl": "",
        "licenseLabel": "",
        "title": "",
        "description": "",
        "creator": "",
        "homepage": "",
        "tracker": "",
        "ontologyFile": ""
    });


    function handleFileChange(event){
        setSelectedFile(event.target.files[0]);
    };


    function onTextEditorChange (newEditorState){
        document.getElementsByClassName('rdw-editor-main')[0].style.border = '';
        setEditorState(newEditorState);                
    };


    function onNextClick(){
        if (progressStep === 1){
            let username = FormLib.getFieldByIdIfValid('onto-suggest-username');
            let email = FormLib.getFieldByIdIfValid('onto-suggest-email');
            if (!username || !email){
                return;
            }
        }
        if (progressStep === 2){
            let name = FormLib.getFieldByIdIfValid('onto-suggest-name');
            let purl = FormLib.getFieldByIdIfValid('onto-suggest-purl');
            let reason = FormLib.getTextEditorValueIfValid(editorState, 'contact-form-text-editor');
            if (!name || !purl || !reason){
                return;
            }
            let formData = form;
            reason = editorState.getCurrentContent();        
            reason = draftToMarkdown(convertToRaw(reason));
            formData.reason = reason;
            setForm(formData);
        }       
        
        let nextStep = progressStep + 1;
        setProgressBarValue(progressBarValue + 20);
        setProgressStep(nextStep);
    }



    function submit(){
        let safeQ = FormLib.getFieldByIdIfValid('onto-suggest-safe-q');
        if (!safeQ){
            return;
        }
        submitOntologySuggestion(form).then((success) => {
            if (success){
                setFormSubmitted(true);
                setFormSubmitSuccess(true);
            } else {
                setFormSubmitted(true);
                setFormSubmitSuccess(false);
            }
        });
    }



    const contextData = {
        editorState: editorState,
        form: form,
        setForm: setForm,
        onTextEditorChange: onTextEditorChange
    }

    return (
        <OntologySuggestionContext.Provider value={contextData}>
        <div className="row">
            <div className="col-sm-12 user-info-panel">
                <h4><b>Suggest your Ontology</b></h4>    
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style={{width: progressBarValue + "%"}} aria-valuenow={progressBarValue} aria-valuemin="0" aria-valuemax="100"></div>
                </div>            
                <br></br>
                {formSubmitted && formSubmitSuccess &&
                    <>
                    <AlertBox
                        type="success"
                        message="Thank you! Your query has been submitted successfully."
                    />
                    <a className="btn btn-secondary" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologysuggestion"}>New suggestion</a>
                    </>
                }
                {formSubmitted && !formSubmitSuccess &&
                    <>
                    <AlertBox
                        type="danger"
                        message="Sorry! Something went wrong. Please try again later."
                    />
                    <a className="btn btn-secondary" href={process.env.REACT_APP_PROJECT_SUB_PATH +  "/ontologysuggestion"}>New suggestion</a>
                    </>
                }
                {progressStep === 0 && !formSubmitted &&
                    <p>Do you have an ontology that you would like to suggest to be included in the Ontology Library? 
                    Please fill out the form below and we will review your suggestion.</p>
                }
                {progressStep === 1 && !formSubmitted && 
                    <UserForm />     
                }
                {progressStep === 2 && !formSubmitted &&
                    <OntologyMainMetaDataForm />
                }
                {progressStep === 3 && !formSubmitted &&
                    <OntologyExtraMetadataForm />
                }
                {progressStep === 4 && !formSubmitted &&
                    <>
                    <div className="row">
                        <div className="col-sm-6">
                            <label className="required_input" for="onto-suggest-safe-q">What is {randomNum1 + " + " + randomNum2}</label>
                            <input 
                                type="text"                             
                                onChange={(e) => {
                                    e.target.style.borderColor = '';
                                    let formData = form;
                                    formData.safeAnswer = e.target.value;
                                    formData.safeQestion = `${randomNum1}+${randomNum2}`;
                                    setForm(formData);
                                }}
                                class="form-control" 
                                id="onto-suggest-safe-q">
                            </input>
                        </div>
                    </div>        
                    <br></br>                    
                    </>
                }    
                <br></br>            
                {progressStep !== 0 && !formSubmitted &&
                    <button type="button" class="btn btn-secondary mr-3" onClick={() => {
                        let nextStep = progressStep - 1;
                        setProgressBarValue(progressBarValue - 20);
                        setProgressStep(nextStep)
                        }}
                        >
                        Previous
                    </button>
                }
                {progressStep === 4 && !formSubmitted &&
                    <button type="button" class="btn btn-secondary" onClick={submit}>Submit</button>
                }
                {progressStep !== 4 && !formSubmitted &&
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




const UserForm = () => {    
    const componentContext = useContext(OntologySuggestionContext);
    return (
        <>
            {/* <div className="row">
                <div className="col-sm-8">
                    <label className="custom-file-upload" for="onto-suggest-file">
                    <i className="fa fa-upload"></i>
                    ontology config YAML
                    </label>
                    <input type="file" id="onto-suggest-file" onChange={handleFileChange} />  
                </div>
            </div>
            <br></br>                                       */}
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
                        placeholder="Enter your fullname"  
                        defaultValue={componentContext.form.username}                        
                        >
                    </input>
                </div>
            </div>
            <br></br>
            <div className="row">
                <div className="col-sm-8">
                    <label className="required_input" for="onto-suggest-email">Email</label>
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
        </>
    );
}



const OntologyMainMetaDataForm = () => {
    const componentContext = useContext(OntologySuggestionContext);
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
                <label className="required_input">Reason</label>
                <TextEditor 
                    editorState={componentContext.editorState} 
                    textChangeHandlerFunction={componentContext.onTextEditorChange}
                    wrapperClassName=""
                    editorClassName=""
                    placeholder="Please briefly describe the ontology and its purpose."
                    textSizeOptions={['Normal', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code']}
                    wrapperId="contact-form-text-editor"
                />  
            </div>
        </div>
        </>
    );
}   



const OntologyExtraMetadataForm = () => {
    const componentContext = useContext(OntologySuggestionContext);

    return (
        <>
             <div className="row">
                <div className="col-sm-8">
                    <label for="onto-suggest-pprefix">Ontology preferred prefix</label>
                    <input 
                        type="text"                                
                        class="form-control" 
                        id="onto-suggest-pprefix"
                        placeholder="Enter the ontology's preferred prefix"
                        onChange={(e) => {                            
                            let form = componentContext.form;
                            form.preferredPrefix = e.target.value;
                            componentContext.setForm(form);
                        }}
                        defaultValue={componentContext.form.preferredPrefix}
                        >
                    </input>
                </div>
            </div>
            <br></br>
            <div className="row">
                <div className="col-sm-8">
                    <label for="onto-suggest-uri">Ontology URI</label>
                    <input 
                        type="text"                                
                        class="form-control" 
                        id="onto-suggest-uri"
                        placeholder="Enter the ontology's URI"
                        onChange={(e) => {                            
                            let form = componentContext.form;
                            form.uri = e.target.value;
                            componentContext.setForm(form);
                        }}
                        defaultValue={componentContext.form.uri}
                        >
                    </input>
                </div>
            </div>
            <br></br>
            <div className="row">
                <div className="col-sm-8">
                    <label for="onto-suggest-licenseUrl">Ontology License URL</label>
                    <input 
                        type="text"                                
                        class="form-control" 
                        id="onto-suggest-licenseUrl"
                        placeholder="Enter the ontology's License URL"
                        onChange={(e) => {                            
                            let form = componentContext.form;
                            form.licenseUrl = e.target.value;
                            componentContext.setForm(form);
                        }}
                        defaultValue={componentContext.form.licenseUrl}
                        >
                    </input>
                </div>
            </div>
            <br></br>
            <div className="row">
                <div className="col-sm-8">
                    <label for="onto-suggest-licenseName">Ontology License Name</label>
                    <input 
                        type="text"                                
                        class="form-control" 
                        id="onto-suggest-licenseName"
                        placeholder="Enter the ontology's License Label"
                        onChange={(e) => {                            
                            let form = componentContext.form;
                            form.licenseLabel = e.target.value;
                            componentContext.setForm(form);
                        }}
                        defaultValue={componentContext.form.licenseLabel}
                        >
                    </input>
                </div>
            </div>
            <br></br>
            <div className="row">
                <div className="col-sm-8">
                    <label for="onto-suggest-title">Ontology title</label>
                    <input 
                        type="text"                                
                        class="form-control" 
                        id="onto-suggest-title"
                        placeholder="Enter the ontology's title"
                        onChange={(e) => {                            
                            let form = componentContext.form;
                            form.title = e.target.value;
                            componentContext.setForm(form);
                        }}
                        defaultValue={componentContext.form.title}
                        >
                    </input>
                </div>
            </div>
            <br></br>
            <div className="row">
                <div className="col-sm-8">
                    <label for="onto-suggest-discription">Ontology Description</label>
                    <textarea 
                        rows={5}
                        cols={20}                         
                        class="form-control" 
                        id="onto-suggest-discription"
                        placeholder="Enter the ontology's description"
                        onChange={(e) => {                            
                            let form = componentContext.form;
                            form.description = e.target.value;
                            componentContext.setForm(form);
                        }}
                        defaultValue={componentContext.form.description}
                        >
                    </textarea>
                </div>
            </div>
            <br></br>
            <div className="row">
                <div className="col-sm-8">
                    <label for="onto-suggest-creators">Ontology Creators (comma separated)</label>
                    <input 
                        type="text"                                
                        class="form-control" 
                        id="onto-suggest-creators"
                        placeholder="Name1,Name2,..."
                        onChange={(e) => {                            
                            let form = componentContext.form;
                            form.creator = e.target.value;
                            componentContext.setForm(form);
                        }}
                        defaultValue={componentContext.form.creator}
                        >
                    </input>
                </div>
            </div>
            <br></br>
            <div className="row">
                <div className="col-sm-8">
                    <label for="onto-suggest-homepage">Ontology HomePage URL</label>
                    <input 
                        type="text"                                
                        class="form-control" 
                        id="onto-suggest-homepage"
                        placeholder="Enter the ontology's homepage URL"
                        onChange={(e) => {                            
                            let form = componentContext.form;
                            form.homepage = e.target.value;
                            componentContext.setForm(form);
                        }}
                        defaultValue={componentContext.form.homepage}
                        >
                    </input>
                </div>
            </div>
            <br></br>
            <div className="row">
                <div className="col-sm-8">
                    <label for="onto-suggest-tracker">Ontology issue tracker URL (Example: GitHub issues list)</label>
                    <input 
                        type="text"                                
                        class="form-control" 
                        id="onto-suggest-tracker"
                        placeholder="Enter the ontology's issue tracker URL"
                        onChange={(e) => {                            
                            let form = componentContext.form;
                            form.tracker = e.target.value;
                            componentContext.setForm(form);
                        }}
                        defaultValue={componentContext.form.tracker}
                        >
                    </input>
                </div>
            </div>
        </>
    );
}





export default OntologySuggestion;