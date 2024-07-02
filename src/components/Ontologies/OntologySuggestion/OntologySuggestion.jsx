import { useState } from "react";
import AlertBox from "../../common/Alerts/Alerts";
import TextEditor from "../../common/TextEditor/TextEditor";
import Toolkit from "../../../Libs/Toolkit";



const OntologySuggestion = (props) => {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formSubmitSuccess, setFormSubmitSuccess] = useState(false);
    const [editorState, setEditorState] = useState(null);
    const [randomNum1, setRandomNum1] = useState(Toolkit.getRandomInt(0, 11));
    const [randomNum2, setRandomNum2] = useState(Toolkit.getRandomInt(0, 11));




    return (
        <div className="row">
            <div className="col-sm-12 user-info-panel">
                <h4><b>Suggest your Ontology</b></h4>
                <p>Do you have an ontology that you would like to suggest to be included in the Ontology Library? 
                Please fill out the form below and we will review your suggestion.</p>
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
                {!formSubmitted && 
                    <>
                    <div className="row">
                        <div className="col-sm-8">
                            <label className="required_input" for="onto-suggest-username">Your name</label>
                            <input 
                                type="text"
                                onChange={() => {document.getElementById('onto-suggest-username').style.borderColor = '';}}                                                 
                                class="form-control" 
                                id="onto-suggest-username"
                                placeholder="Enter your fullname">
                            </input>
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-sm-8">
                            <label className="required_input" for="onto-suggest-email">Email</label>
                            <input 
                                type="text"
                                onChange={() => {document.getElementById('onto-suggest-email').style.borderColor = '';}}                                                 
                                class="form-control" 
                                id="onto-suggest-email"
                                placeholder="Enter your email">
                            </input>
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-sm-8">
                            <label className="required_input" for="onto-suggest-name">Ontology name</label>
                            <input 
                                type="text"
                                onChange={() => {document.getElementById('onto-suggest-name').style.borderColor = '';}}                                                 
                                class="form-control" 
                                id="onto-suggest-name"
                                placeholder="Enter the ontology's name">
                            </input>
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-sm-8">
                            <label className="required_input" for="onto-suggest-purl">Ontology purl</label>
                            <input 
                                type="text"
                                onChange={() => {document.getElementById('onto-suggest-purl').style.borderColor = '';}}                                                 
                                class="form-control" 
                                id="onto-suggest-purl"
                                placeholder="Enter the ontology's PURL">
                            </input>
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-sm-8">
                            <label className="required_input">Reason</label>
                            <TextEditor 
                                editorState={editorState} 
                                // textChangeHandlerFunction={onTextAreaChange}
                                wrapperClassName=""
                                editorClassName=""
                                placeholder="Please briefly describe the ontology and its purpose."
                                textSizeOptions={['Normal', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code']}
                                warpperId="contact-form-text-editor"
                            />  
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-sm-8">
                            <label for="onto-suggest-pprefix">Ontology preferred prefix</label>
                            <input 
                                type="text"                                
                                class="form-control" 
                                id="onto-suggest-pprefix"
                                placeholder="Enter the ontology's preferred prefix">
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
                                placeholder="Enter the ontology's URI">
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
                                placeholder="Enter the ontology's License URL">
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
                                placeholder="Enter the ontology's License Label">
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
                                placeholder="Enter the ontology's title">
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
                                placeholder="Enter the ontology's description">
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
                                placeholder="Name1,Name2,...">
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
                                placeholder="Enter the ontology's homepage URL">
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
                                placeholder="Enter the ontology's issue tracker URL">
                            </input>
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-sm-6">
                            <label className="required_input" for="onto-suggest-safe-q">What is {randomNum1 + " + " + randomNum2}</label>
                            <input 
                                type="text"                             
                                onChange={() => {document.getElementById('onto-suggest-safe-q').style.borderColor = '';}}                                                 
                                class="form-control" 
                                id="onto-suggest-safe-q">
                            </input>
                        </div>
                    </div>        
                    <br></br>
                    <div className="row">
                        <div className="col-sm-6">
                            <button type="button" class="btn btn-secondary">Submit</button>
                        </div>
                    </div>
                    </>
                }
            </div>            
        </div>
    );
}

export default OntologySuggestion;