import React from "react";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import { stateFromMarkdown } from 'draft-js-import-markdown';
import draftToMarkdown from 'draftjs-to-markdown';
import templatePath from './template.md';



const GENERIC_ISSUE_ID = "1";
const TERM_REQUEST_ISSUE_ID = "2";


class TermRequest extends React.Component{
    constructor(props){
        super(props);      
        this.state = {
            editorState:  null,
            issueType: GENERIC_ISSUE_ID,
            submitFinished: false,
            errorInSubmit: false,
            newIssueUrl: "",
            modalIsOpen: false
        };
        this.onTextAreaChange = this.onTextAreaChange.bind(this);
        this.createGenericIssueFields = this.createGenericIssueFields.bind(this);
        this.createIssueTypeDropDown = this.createIssueTypeDropDown.bind(this);
        this.changeIssueType = this.changeIssueType.bind(this);
        this.setTermRequestTemplate = this.setTermRequestTemplate.bind(this);
        this.submitIssueRequest = this.submitIssueRequest.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

    }



    setTermRequestTemplate(issueType){        
        if(issueType === TERM_REQUEST_ISSUE_ID){
            fetch(templatePath)
            .then((response) => response.text()) 
            .then((text) => {            
                this.setState({
                    editorState:  EditorState.createWithContent(stateFromMarkdown(text)),
                });
            });
        }
        else{
            this.setState({editorState:null})
        }       
        
    }

    onTextAreaChange = (newEditorState) => {
        this.setState({ editorState: newEditorState });
      };


    createGenericIssueFields(){
        return [
            <Editor
                editorState={this.state.editorState}
                onEditorStateChange={this.onTextAreaChange}
                toolbar={{
                    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link'],
                    inline: {
                    options: ['bold', 'italic', 'underline', 'strikethrough'],
                    },
                    blockType: {
                    inDropdown: true,
                    options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
                    },
                    list: {
                    inDropdown: true,
                    options: ['unordered', 'ordered'],
                    },
                }}
            />
        ];
    }

    createIssueTypeDropDown(){
        return [            
            <div class="form-group">
                <label for="issue-types" className='col-form-label'>Issue Type</label>
                <select className='site-dropdown-menu list-result-per-page-dropdown-menu' id="issue-types" value={this.state.issueType} onChange={this.changeIssueType}>
                    <option value={GENERIC_ISSUE_ID} key={GENERIC_ISSUE_ID}>General</option>
                    <option value={TERM_REQUEST_ISSUE_ID} key={TERM_REQUEST_ISSUE_ID}>Term Request</option>                            
                </select>  
            </div>            
        ];
    }


    changeIssueType(e){                   
        this.setState({
            issueType: e.target.value
        }, ()=>{
            this.setTermRequestTemplate(e.target.value); 
        });
    }


    submitIssueRequest(){
        let issueTitle = document.getElementById('issueTitle').value;
        let issueContent = this.state.editorState.getCurrentContent();        
        issueContent = draftToMarkdown(convertToRaw(issueContent));
        let data = new FormData();
        data.append("ontology_id", this.props.ontologyId);
        data.append("username", localStorage.getItem("ts_username"));
        data.append("frontend_id", process.env.REACT_APP_PROJECT_ID);
        data.append("title", issueTitle);
        data.append("content", issueContent);
        data.append("access_token", localStorage.getItem("token"));
        data.append("auth_provider", 'github');
        fetch(process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/github/submit_github_issue', {method: 'POST', body: data})
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
        this.setState({
            editorState:  null,
            issueType: GENERIC_ISSUE_ID,
            submitFinished: false,
            errorInSubmit: false,
            newIssueUrl: "",
            modalIsOpen: false
        });
    }
   

    render(){
        return(
            <span>
            <button type="button" 
                class="btn btn-primary" 
                data-toggle="modal" 
                data-target="#term-request-modal" 
                data-backdrop="static"
                data-keyboard="false"
                onClick={this.openModal}
                >
                File a new Issue 
            </button>
            
            {this.state.modalIsOpen && <div class="modal" id="term-request-modal">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">                    
                        <div class="modal-header">
                            <h4 class="modal-title">File an issue for this Ontology</h4>
                            <button type="button" class="close close-mark-btn" data-dismiss="modal">&times;</button>
                        </div>
                        <br></br>
                        <span>
                            {!this.state.submitFinished && 
                                <div class="modal-body">
                                    <p>You can file a new issue here. The issue can have a General Topic or a new Term Request</p>
                                    
                                    <div className="row">
                                        <div className="col-sm-8">
                                            {this.createIssueTypeDropDown()}
                                            <label className="required_input" for="issueTitle">Issue Title</label>
                                            <input type="text" class="form-control" id="issueTitle" placeholder="Enter Issue Title"></input>
                                        </div>
                                    </div>
                                    <br></br>
                                    <div className="row">
                                        <div className="col-sm-10">
                                            {this.createGenericIssueFields()}                                    
                                        </div>
                                    </div>

                                </div>
                            }
                            {this.state.submitFinished && !this.state.errorInSubmit &&
                                <div className="row text-center">
                                    <div className="col-sm-12">                                    
                                        <div class="alert alert-success">
                                            Your issue is requested successfully!
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