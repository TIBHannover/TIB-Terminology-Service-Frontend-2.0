import { useState, useEffect } from "react";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import { stateFromMarkdown } from 'draft-js-import-markdown';
import draftToMarkdown from 'draftjs-to-markdown';
import AuthTool from "../../User/Login/authTools";
import templatePath from './termRequestTemplate.md';
import TextEditor from "../../common/TextEditor/TextEditor";
import { getGitRepoTemplates } from "../../../api/tsMicroBackendCalls";



const TermRequest = (props) => {

    const [editorState, setEditorState] = useState(null);
    const [submitFinished, setSubmitFinished] = useState(false);
    const [errorInSubmit, setErrorInSubmit] = useState(false);
    const [newIssueUrl, setNewIssueUrl] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [issueTemplates, setIssueTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(0);    
    const [issueTitle, setIssueTitle] = useState("");
 


    function onTextAreaChange(newEditorState){
        document.getElementsByClassName('rdw-editor-main')[0].style.border = '';
        setEditorState(newEditorState);        
    }


    
    function setTermRequestTemplate(){        
        if(props.reportType === "termRequest"){
            fetch(templatePath)
            .then((response) => response.text()) 
            .then((text) => {     
                setEditorState(EditorState.createWithContent(stateFromMarkdown(text)));                
            });
        }                      
    }


    
    function loadTemplates(){                
        getGitRepoTemplates({repoUrl:props.ontology.config.repoUrl, gitUsername: localStorage.getItem('ts_username')})
        .then((templates) => {
            setIssueTemplates(templates);
        });        
    }



    function createIssueTemplatesDropDown(){        
        let templates = issueTemplates;        
        let result = [];
        let value = 1;
        if(!templates){
            return "";
        }
        for(let temp of templates){
            result.push(
                <option value={value} key={value} url={temp['template_url']}>{temp['template_name']}</option> 
            );
            value += 1;
        }
        return result;
    }



    function templateDropDownChange(e){
        setSelectedTemplate(e.target.value);        

        let selectedTemplateUrl = e.target.options[e.target.selectedIndex].getAttribute('url');
        if(!selectedTemplateUrl){
            setEditorState(EditorState.createWithContent(stateFromMarkdown("")));            
            return;
        }
        fetch(selectedTemplateUrl)
            .then(resp => resp.text())
            .then((templateText) => {
                setEditorState(EditorState.createWithContent(stateFromMarkdown(templateText)));                
                document.getElementsByClassName('rdw-editor-main')[0].style.border = '';
            });
    }



    function onTextInputChange(){       
        document.getElementById('issueTitle').style.borderColor = '';
        setIssueTitle(document.getElementById('issueTitle').value);        
    }



    function submitIssueRequest(){
        let issueTitle = document.getElementById('issueTitle').value; 
        let formIsValid = true;
        let issueContent = "";
        if(!editorState){            
            document.getElementsByClassName('rdw-editor-main')[0].style.border = '1px solid red';
            formIsValid = false;
        }
        else{
            issueContent = editorState.getCurrentContent();        
            issueContent = draftToMarkdown(convertToRaw(issueContent));  
        }
        
        if(!issueTitle || issueTitle === ""){
            document.getElementById('issueTitle').style.borderColor = 'red';
            formIsValid = false;
        }        
        if(!issueContent || issueContent.trim() === ""){
            document.getElementsByClassName('rdw-editor-main')[0].style.border = '1px solid red';
            formIsValid = false;
        }

        if(!formIsValid){
            return;
        }
                        
        let data = new FormData();
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});       
        data.append("ontology_id", props.ontology.ontologyId);
        data.append("username", localStorage.getItem("ts_username"));        
        data.append("title", issueTitle);
        data.append("content", issueContent);        
        data.append("issueType", props.reportType);
        data.append("repo_url", props.ontology.config.repoUrl);
        
        fetch(process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/github/submit_issue', {method: 'POST', headers:headers, body: data})
            .then((response) => response.json())
            .then((data) => {
                if(data['_result']){
                    setErrorInSubmit(false);
                    setSubmitFinished(true);
                    setNewIssueUrl(data['_result']['new_issue_url']);                    
                }
                else{
                    setErrorInSubmit(true);
                    setSubmitFinished(true);
                    setNewIssueUrl("");                    
                }
            })
            .catch((error) => {
                setErrorInSubmit(true);
                setSubmitFinished(true);
                setNewIssueUrl("");                
            });
    }



    function openModal(){
        setModalIsOpen(true); 
        if(props.reportType === "general" && localStorage.getItem('authProvider') === 'github'){            
            loadTemplates();
        }        
    }



    function goBackToModalContent(){
        setErrorInSubmit(false);
        setSubmitFinished(false);
        setNewIssueUrl("");        
    }


    
    function closeModal(){        
        if(props.reportType === "general"){            
            setEditorState(null);
        }              
        setSubmitFinished(false);
        setErrorInSubmit(false);
        setNewIssueUrl("");
        setModalIsOpen(false);
        setSelectedTemplate(0);        
    }



    useEffect(() => {
        setTermRequestTemplate();
    },[]);


    if(process.env.REACT_APP_GITHUB_ISSUE_REQUEST_FEATURE !== "true"){            
        return null;
    }
    if(localStorage.getItem('authProvider') !== 'github'){
        return "";
    }

    return(
        <>            
        <button type="button" 
            class="btn btn-secondary issue-report-btn" 
            data-toggle="modal" 
            data-target={"#" + props.reportType + "_issue_modal"}
            data-backdrop="static"
            data-keyboard="false"
            onClick={openModal}
            >
            {props.reportType === "termRequest" ? "File a Term Request" : "File a General Issue "} 
        </button>
        
        {modalIsOpen && 
        <div class="modal" id={props.reportType + "_issue_modal"}>
            <div class="modal-dialog modal-xl">
                <div class="modal-content">                    
                    <div class="modal-header">
                        <h4 class="modal-title">
                            File {props.reportType === "termRequest" ? "a Term Request for " : "a General Issue for "} 
                            {props.ontology.ontologyId}
                        </h4>
                        <button onClick={closeModal} type="button" class="close close-mark-btn" data-dismiss="modal">&times;</button>
                    </div>
                    <br></br>
                    <span>
                        {!submitFinished && 
                            <div class="modal-body">
                            {props.reportType === "general" &&                           
                                <div class="alert alert-info">                                        
                                    <strong>Note:</strong> Please select a proper issue template (if exist). These templates 
                                    are defined by the repository owner and are the expected way of reporting an issue.                                         
                                </div>
                            }
                                <div className="row">
                                    <div className="col-sm-8">                                            
                                        {props.reportType === "general" &&    
                                            <div class="form-group">
                                                <label for="issue-templates" className='col-form-label'>Issue Template</label>
                                                <select className='site-dropdown-menu list-result-per-page-dropdown-menu' id="issue-templates" value={selectedTemplate} onChange={templateDropDownChange}>
                                                    <option value={0} key={0}>None</option>
                                                    {createIssueTemplatesDropDown()}
                                                </select>  
                                            </div>
                                        }                                            
                                        <label className="required_input" for="issueTitle">
                                            {props.reportType === "general" ? "Issue Title" : "Term Request Title"}
                                        </label>
                                        <input type="text" class="form-control" value={issueTitle}  onChange={() => {onTextInputChange()}} id="issueTitle" placeholder="Enter Title ..."></input>
                                    </div>
                                </div>
                                <br></br>
                                <div className="row">
                                    <div className="col-sm-10">                                        
                                        <TextEditor 
                                            editorState={editorState} 
                                            textChangeHandlerFunction={onTextAreaChange}
                                            wrapperClassName="git-issue-content-box"
                                            editorClassName=""
                                            placeholder="Content"
                                            textSizeOptions={['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code']}
                                        />                                                                                           
                                    </div>
                                </div>

                            </div>
                        }
                        {submitFinished && !errorInSubmit &&
                            <div className="row text-center">
                                <div className="col-sm-12">                                    
                                    <div class="alert alert-success">
                                        Your Request is submitted successfully!
                                        <br></br>
                                        You can find all the submitted term requests and issues in your profile:
                                        <a href={process.env.REACT_APP_PROJECT_SUB_PATH + '/submitedIssueRequests'}>
                                            <b>My Submitted Issues</b>
                                        </a>
                                    </div>
                                    <a href={newIssueUrl} target="_blank">{newIssueUrl}</a>
                                </div>
                            </div>
                        }
                        {submitFinished && errorInSubmit &&
                            <div className="row text-center">
                                <div className="col-sm-12">
                                    <div class="alert alert-danger">
                                        Something went wrong. Please try again!
                                    </div>  
                                </div>
                            </div>                                                              
                        }
                    </span>                        
                    
                    <div class="modal-footer">                            
                        {/* <button type="button" class="btn btn-secondary close-term-request-modal-btn mr-auto" data-dismiss="modal">Close</button> */}
                        {submitFinished && errorInSubmit &&
                            <div class="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 d-flex justify-content-center">
                                        <button type="button" class="btn btn-secondary" onClick={goBackToModalContent}>Go Back</button>
                                    </div>                                        
                                </div>                                    
                            </div>
                        }
                        {!submitFinished && 
                            <button type="button" class="btn btn-secondary submit-term-request-modal-btn" onClick={submitIssueRequest}>Submit</button>
                        }
                    </div>
                </div>
            </div>
        </div>}
        </>
    );
}



export default TermRequest;