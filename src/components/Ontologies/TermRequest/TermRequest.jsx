import {useState, useEffect, useContext} from "react";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {EditorState, convertToRaw} from 'draft-js';
import {stateFromMarkdown} from 'draft-js-import-markdown';
import draftToMarkdown from 'draftjs-to-markdown';
import templatePath from './termRequestTemplate.md';
import TextEditor from "../../common/TextEditor/TextEditor";
import {getGitRepoTemplates, submitGitIssue} from "../../../api/tsMicroBackendCalls";
import {OntologyPageContext} from "../../../context/OntologyPageContext";
import PropTypes from 'prop-types';
import {AppContext} from "../../../context/AppContext";
import Login from "../../User/Login/TS/Login";
import Modal from "react-bootstrap/Modal";


const TermRequest = (props) => {
  
  /* 
      The Term Request component is used to create a new issue or term request in the ontology repository.
      The component is only available for users who are logged in with their GitHub account.
      Renders term request or general issue based on an input props named reportType.
      reportType can be either 
          - "termRequest"
          - "general"
      
      The component uses the OntologyPageContext to get the ontology information.
  */
  
  const ontologyPageContext = useContext(OntologyPageContext);
  const appContext = useContext(AppContext);
  
  const [editorState, setEditorState] = useState(null);
  const [submitFinished, setSubmitFinished] = useState(false);
  const [errorInSubmit, setErrorInSubmit] = useState(false);
  const [newIssueUrl, setNewIssueUrl] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [issueTemplates, setIssueTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [issueTitle, setIssueTitle] = useState("");
  const [loginModal, setLoginModal] = useState(false);
  
  
  function onTextAreaChange(newEditorState) {
    document.getElementsByClassName('rdw-editor-main')[0].style.border = '';
    setEditorState(newEditorState);
  }
  
  
  function setTermRequestTemplate() {
    if (props.reportType === "termRequest") {
      fetch(templatePath)
        .then((response) => response.text())
        .then((text) => {
          setEditorState(EditorState.createWithContent(stateFromMarkdown(text)));
        });
    }
  }
  
  
  function loadTemplates() {
    getGitRepoTemplates({
      repoUrl: ontologyPageContext.ontology.repo_url,
      gitUsername: localStorage.getItem('ts_username')
    })
      .then((templates) => {
        setIssueTemplates(templates);
      });
  }
  
  
  function createIssueTemplatesDropDown() {
    let templates = issueTemplates;
    let result = [];
    let value = 1;
    if (!templates) {
      return "";
    }
    for (let temp of templates) {
      result.push(
        <option value={value} key={value} url={temp['template_url']}>{temp['template_name']}</option>
      );
      value += 1;
    }
    return result;
  }
  
  
  function templateDropDownChange(e) {
    setSelectedTemplate(e.target.value);
    
    let selectedTemplateUrl = e.target.options[e.target.selectedIndex].getAttribute('url');
    if (!selectedTemplateUrl) {
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
  
  
  function onTextInputChange() {
    document.getElementById('issueTitle').style.borderColor = '';
    setIssueTitle(document.getElementById('issueTitle').value);
  }
  
  
  function submitIssueRequest() {
    let issueTitle = document.getElementById('issueTitle').value;
    let formIsValid = true;
    let issueContent = "";
    if (!editorState) {
      document.getElementsByClassName('rdw-editor-main')[0].style.border = '1px solid red';
      formIsValid = false;
    } else {
      issueContent = editorState.getCurrentContent();
      issueContent = draftToMarkdown(convertToRaw(issueContent));
    }
    
    if (!issueTitle || issueTitle === "") {
      document.getElementById('issueTitle').style.borderColor = 'red';
      formIsValid = false;
    }
    if (!issueContent || issueContent.trim() === "") {
      document.getElementsByClassName('rdw-editor-main')[0].style.border = '1px solid red';
      formIsValid = false;
    }
    
    if (!formIsValid) {
      return;
    }
    
    submitGitIssue({
      repoUrl: ontologyPageContext.ontology.repo_url,
      gitUsername: localStorage.getItem('ts_username'),
      issueTitle: issueTitle,
      issueBody: issueContent,
      issueType: props.reportType,
      ontologyId: ontologyPageContext.ontology.ontologyId
    }).then((createdIssueUrl) => {
      if (createdIssueUrl) {
        setErrorInSubmit(false);
        setSubmitFinished(true);
        setNewIssueUrl(createdIssueUrl);
      } else {
        setErrorInSubmit(true);
        setSubmitFinished(true);
        setNewIssueUrl("");
      }
    });
  }
  
  
  function openModal() {
    if (!appContext.user) {
      setLoginModal(true);
      setTimeout(() => setLoginModal(false), 1000);
      return;
    }
    setModalIsOpen(true);
    if (props.reportType === "general" && localStorage.getItem('authProvider') === 'github') {
      loadTemplates();
    }
  }
  
  
  function goBackToModalContent() {
    setErrorInSubmit(false);
    setSubmitFinished(false);
    setNewIssueUrl("");
  }
  
  
  function closeModal() {
    if (props.reportType === "general") {
      setEditorState(null);
    }
    setSubmitFinished(false);
    setErrorInSubmit(false);
    setNewIssueUrl("");
    setModalIsOpen(false);
    setSelectedTemplate(0);
    setIssueTitle("");
  }
  
  
  useEffect(() => {
    setTermRequestTemplate();
    setIssueTitle("");
  }, []);
  
  
  if (process.env.REACT_APP_GITHUB_ISSUE_REQUEST_FEATURE !== "true") {
    return "";
  }
  
  if (appContext.user && localStorage.getItem('authProvider') !== 'github') {
    return "";
  }
  
  return (
    <>
      <button type="button"
              className={"btn btn-secondary issue-report-btn stour-github-issue-open-btn-" + props.reportType}
              onClick={openModal}
      >
        {props.reportType === "termRequest" ? "File a Term Request" : "File a General Issue "}
      </button>
      <Login isModal={true} showModal={loginModal} withoutButton={true}/>
      <Modal show={modalIsOpen} fullscreen={true} id={props.reportType + "_issue_modal"}>
        <Modal.Header className="row">
          <div className="row">
            <div className="col-sm-6">
              <h4 className="modal-title">
                File {props.reportType === "termRequest" ? "a Term Request for " : "a General Issue for "}
                {ontologyPageContext.ontology.ontologyId}
              </h4>
            </div>
            <div className="col-sm-6 text-end">
              <button onClick={closeModal} type="button" className="close close-mark-btn"
                      data-dismiss="modal">&times;</button>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          {!submitFinished &&
            <>
              {props.reportType === "general" &&
                <div className="alert alert-info">
                  <strong>Note:</strong> Please select a proper issue template (if exist). These templates
                  are defined by the repository owner and are the expected way of reporting an issue.
                </div>
              }
              <div className="row">
                <div className="col-sm-8">
                  {props.reportType === "general" &&
                    <div className="form-group">
                      <label htmlFor="issue-templates" className='col-form-label'>Issue Template</label>
                      <select className='site-dropdown-menu list-result-per-page-dropdown-menu'
                              id="issue-templates" value={selectedTemplate} onChange={templateDropDownChange}>
                        <option value={0} key={0}>None</option>
                        {createIssueTemplatesDropDown()}
                      </select>
                    </div>
                  }
                  <label className="required_input" htmlFor="issueTitle">
                    {props.reportType === "general" ? "Issue Title" : "Term Request Title"}
                  </label>
                  <input type="text" className="form-control" value={issueTitle} onChange={() => {
                    onTextInputChange()
                  }} id="issueTitle" placeholder="Enter Title ..."></input>
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
            </>
          }
          {submitFinished && !errorInSubmit &&
            <div className="row text-center">
              <div className="col-sm-12">
                <div className="alert alert-success">
                  Your Request is submitted successfully!
                  <br></br>
                  You can find all the submitted term requests and issues in your profile:
                  <a href={process.env.REACT_APP_PROJECT_SUB_PATH + '/submitedIssueRequests'}>
                    <b>My Submitted Issues</b>
                  </a>
                </div>
                <a href={newIssueUrl} target="_blank" rel="noreferrer nofollow">{newIssueUrl}</a>
              </div>
            </div>
          }
          {submitFinished && errorInSubmit &&
            <div className="row text-center">
              <div className="col-sm-12">
                <div className="alert alert-danger">
                  Something went wrong. Please try again!
                </div>
              </div>
            </div>
          }
        </Modal.Body>
        <Modal.Footer>
          {submitFinished && errorInSubmit &&
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12 d-flex justify-content-center">
                  <button type="button" className="btn btn-secondary" onClick={goBackToModalContent}>Go Back
                  </button>
                </div>
              </div>
            </div>
          }
          {!submitFinished &&
            <button type="button" className="btn btn-secondary submit-term-request-modal-btn"
                    onClick={submitIssueRequest}>Submit</button>
          }
        </Modal.Footer>
      </Modal>
    </>
  );
}


TermRequest.propTypes = {
  reportType: PropTypes.string.isRequired
};


export default TermRequest;