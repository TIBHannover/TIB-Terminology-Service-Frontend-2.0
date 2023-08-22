import React from "react";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import { stateFromMarkdown } from 'draft-js-import-markdown';
import draftToMarkdown from 'draftjs-to-markdown';
import AuthTool from "../../User/Login/authTools";
import templatePath from './termRequestTemplate.md';
import TextEditor from "../../common/TextEditor/TextEditor";



class TermRequest extends React.Component{
    constructor(props){
        super(props);      
        this.state = {
            editorState:  null,            
            submitFinished: false,
            errorInSubmit: false,
            newIssueUrl: "",
            modalIsOpen: false,
            issueTemplates: [],
            selectedTemplate: 0,
            selectedTemplateText: ""
        };
        this.onTextAreaChange = this.onTextAreaChange.bind(this);            
        this.submitIssueRequest = this.submitIssueRequest.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onTextInputChange = this.onTextInputChange.bind(this);
        this.createIssueTemplatesDropDown = this.createIssueTemplatesDropDown.bind(this);
        this.loadTemplates = this.loadTemplates.bind(this);
        this.templateDropDownChange = this.templateDropDownChange.bind(this);
        this.setTermRequestTemplate = this.setTermRequestTemplate.bind(this);

        if(localStorage.getItem('authProvider') === 'github'){
            this.loadTemplates();
        }        
    }




    onTextAreaChange = (newEditorState) => {
        document.getElementsByClassName('rdw-editor-main')[0].style.border = '';
        this.setState({ editorState: newEditorState });
      };



    setTermRequestTemplate(){        
        if(this.props.reportType === "termRequest"){
            fetch(templatePath)
            .then((response) => response.text()) 
            .then((text) => {            
                this.setState({
                    editorState:  EditorState.createWithContent(stateFromMarkdown(text)),
                });
            });
        }                      
    }


    loadTemplates(){        
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});       
        let data = new FormData();
        data.append("repo_url", this.props.ontology.config.repoUrl);
        data.append("username", localStorage.getItem('ts_username'));
        fetch(process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/github/get_issue_templates', {method: 'POST', headers:headers, body: data})
            .then((response) => response.json())
            .then((data) => {
                if(data['_result']){
                    this.setState({                       
                        issueTemplates: data['_result']['templates'] 
                    });
                }
                else{
                    this.setState({                        
                        issueTemplates: false
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    issueTemplates: false
                });
            });
    }



    createIssueTemplatesDropDown(){        
        let templates = this.state.issueTemplates;
        
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



    templateDropDownChange(e){
        this.setState({
            selectedTemplate: e.target.value
        });      

        let selectedTemplateUrl = e.target.options[e.target.selectedIndex].getAttribute('url');
        if(!selectedTemplateUrl){
            this.setState({
                editorState:  EditorState.createWithContent(stateFromMarkdown("")),
            }); 
            return;
        }
        fetch(selectedTemplateUrl)
            .then(resp => resp.text())
            .then((templateText) => {
                this.setState({
                    editorState:  EditorState.createWithContent(stateFromMarkdown(templateText)),
                });
                document.getElementsByClassName('rdw-editor-main')[0].style.border = '';
            });
    }



    onTextInputChange(){       
        document.getElementById('issueTitle').style.borderColor = '';
    }


    submitIssueRequest(){
        let issueTitle = document.getElementById('issueTitle').value; 
        let formIsValid = true;
        let issueContent = "";
        if(!this.state.editorState){            
            document.getElementsByClassName('rdw-editor-main')[0].style.border = '1px solid red';
            formIsValid = false;
        }
        else{
            issueContent = this.state.editorState.getCurrentContent();        
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
                
        let issueTypeSelect = document.getElementById('issue-types');
        let data = new FormData();
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});       
        data.append("ontology_id", this.props.ontology.ontologyId);
        data.append("username", localStorage.getItem("ts_username"));        
        data.append("title", issueTitle);
        data.append("content", issueContent);        
        data.append("issueType", this.props.reportType);
        data.append("repo_url", this.props.ontology.config.repoUrl);
        
        fetch(process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/github/submit_issue', {method: 'POST', headers:headers, body: data})
            .then((response) => response.json())
            .then((data) => {
                if(data['_result']){
                    this.setState({
                        errorInSubmit: false,
                        submitFinished: true,
                        newIssueUrl: data['_result']['new_issue_url'] 
                    });
                }
                else{
                    this.setState({
                        errorInSubmit: true,
                        submitFinished: true,
                        newIssueUrl: ""
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    errorInSubmit: true,
                    submitFinished: true,
                    newIssueUrl: ""
                });
            });
    }



    openModal(){
        this.setState({modalIsOpen: true});
    }



    closeModal(){
        let editorState = this.state.editorState;
        if(this.props.reportType === "general"){
            editorState = null;
        }      
        this.setState({
            editorState:  editorState,            
            submitFinished: false,
            errorInSubmit: false,
            newIssueUrl: "",
            modalIsOpen: false,
            selectedTemplate: 0
        });
    }


    componentDidMount(){
        this.setTermRequestTemplate();
    }

   

    render(){
        if(process.env.REACT_APP_GITHUB_ISSUE_REQUEST_FEATURE !== "true"){            
            return null;
        }
        if(localStorage.getItem('authProvider') !== 'github'){
            return "";
        }
        return(
            <span>            
            <button type="button" 
                class="btn btn-primary issue-report-btn" 
                data-toggle="modal" 
                data-target={"#" + this.props.reportType + "_issue_modal"}
                data-backdrop="static"
                data-keyboard="false"
                onClick={this.openModal}
                >
                {this.props.reportType === "termRequest" ? "File a Term Request" : "File a General Issue "} 
            </button>
            
            {this.state.modalIsOpen && <div class="modal" id={this.props.reportType + "_issue_modal"}>
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">                    
                        <div class="modal-header">
                            <h4 class="modal-title">
                                File {this.props.reportType === "termRequest" ? "a Term Request for " : "a General Issue for "} 
                                {this.props.ontology.ontologyId}
                            </h4>
                            <button type="button" class="close close-mark-btn" data-dismiss="modal">&times;</button>
                        </div>
                        <br></br>
                        <span>
                            {!this.state.submitFinished && 
                                <div class="modal-body">
                                {this.props.reportType === "general" &&                           
                                    <div class="alert alert-info">                                        
                                        <strong>Note:</strong> Please select a proper issue template (if exist). These templates 
                                        are defined by the repository owner and are the expected way of reporting an issue.                                         
                                    </div>
                                }
                                    <div className="row">
                                        <div className="col-sm-8">                                            
                                            {this.props.reportType === "general" &&    
                                                <div class="form-group">
                                                    <label for="issue-templates" className='col-form-label'>Issue Template</label>
                                                    <select className='site-dropdown-menu list-result-per-page-dropdown-menu' id="issue-templates" value={this.state.selectedTemplate} onChange={this.templateDropDownChange}>
                                                        <option value={0} key={0}>None</option>
                                                        {this.createIssueTemplatesDropDown()}
                                                    </select>  
                                                </div>
                                            }                                            
                                            <label className="required_input" for="issueTitle">
                                                {this.props.reportType === "general" ? "Issue Title" : "Term Request Title"}
                                            </label>
                                            <input type="text" class="form-control" onChange={() => {this.onTextInputChange()}} id="issueTitle" placeholder="Enter Title ..."></input>
                                        </div>
                                    </div>
                                    <br></br>
                                    <div className="row">
                                        <div className="col-sm-10">                                        
                                            <TextEditor 
                                                editorState={this.state.editorState} 
                                                textChangeHandlerFunction={this.onTextAreaChange}
                                                wrapperClassName="git-issue-content-box"
                                                editorClassName=""
                                                placeholder="Content"
                                            />                                                                                           
                                        </div>
                                    </div>

                                </div>
                            }
                            {this.state.submitFinished && !this.state.errorInSubmit &&
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
                                        <a href={this.state.newIssueUrl} target="_blank">{this.state.newIssueUrl}</a>
                                    </div>
                                </div>
                            }
                            {this.state.submitFinished && this.state.errorInSubmit &&
                                <div className="row text-center">
                                    <div className="col-sm-10">
                                        <div class="alert alert-danger">
                                            Something went wrong. Please try again!
                                        </div>  
                                    </div>
                                </div>                                                              
                            }
                        </span>                        
                        
                        <div class="modal-footer">                            
                            <button type="button" class="btn btn-secondary close-term-request-modal-btn mr-auto" data-dismiss="modal" onClick={this.closeModal}>Close</button>
                            {!this.state.submitFinished && 
                                <button type="button" class="btn btn-primary submit-term-request-modal-btn" onClick={this.submitIssueRequest}>Submit</button>
                            }
                        </div>
                    </div>
                </div>
            </div>}
            </span>
        );
    }
}

export default TermRequest;