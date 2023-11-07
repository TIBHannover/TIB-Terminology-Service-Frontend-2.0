import React from "react";
import { withAuth } from "react-oidc-context";
import { withRouter } from 'react-router-dom';
import {createLabelTags, 
    createIssueDescription, 
    createIssueTitle, loadUrlParameter, setTypeRadioBtn} from './helper';
import { getOntologyGithubIssueList } from "../../../api/tsMicroBackendCalls";
import DropDown from "../../common/DropDown/DropDown";
import TermRequest from '../TermRequest/TermRequest';
import RenderIfLogin from '../../User/Login/RequireLogin';



const OPEN_ISSUE_ID = 1;
const CLOSE_ISSUE_ID = 2;
const ALL_ISSUE_ID = 3;
const ISSUE_STATES_VALUES = ["", "open", "closed", "all"]
const ISSUE_STATES_FOR_DROPDOWN = [    
    {label: "Open", value:OPEN_ISSUE_ID},
    {label: "All", value:ALL_ISSUE_ID},
    {label: "Closed", value:CLOSE_ISSUE_ID}    
];



class IssueList extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            listOfIssuesToRender: [],
            listOfOpenIssues: [],
            listOfClosedIssues: [],
            listOfAllIssues: [],
            waiting: true,
            contentForRender: "",
            selectedStateId: OPEN_ISSUE_ID,            
            issueTrackerUrl: null,
            pageNumber: 1,
            resultCountPerPage: 10,
            noMoreIssuesExist: false,
            selectedType: "issue"
        });
        this.setComponentData = this.setComponentData.bind(this);
        this.createIssuesList = this.createIssuesList.bind(this);        
        this.handleIssueStateChange = this.handleIssueStateChange.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
        this.updateURL = this.updateURL.bind(this);
        this.createPagination = this.createPagination.bind(this);
        this.loadTheComponentPreviousState = this.loadTheComponentPreviousState.bind(this);  
        this.handleTypeChange = this.handleTypeChange.bind(this);      
    }


    async setComponentData(reload=false){
        if(this.props.lastState && !reload){
            this.loadTheComponentPreviousState();
            return true;
        }
        
        let ontology = this.props.ontology;
        let issueTrackerUrl = typeof(ontology.config.tracker) !== "undefined" ? ontology.config.tracker : null;
        let listOfIssues = [];                 
        let urlParameter = loadUrlParameter();        
        let pageNumber = urlParameter['pageNumber'] ? urlParameter['pageNumber'] : this.state.pageNumber;
        let selectedStateId = urlParameter['selectedStateId'] ? urlParameter['selectedStateId'] : this.state.selectedStateId;
        let selectedType = urlParameter['selectedType'] ? urlParameter['selectedType'] : this.state.selectedType;              
        setTypeRadioBtn(selectedType);  
        let issueStateValue =  ISSUE_STATES_VALUES[selectedStateId];
        let resultCountPerPage = this.state.resultCountPerPage;
        listOfIssues = await getOntologyGithubIssueList(issueTrackerUrl, issueStateValue, selectedType, resultCountPerPage, pageNumber);
        if(listOfIssues.length === 0){
            this.setState({
                waiting: false,
                noMoreIssuesExist: true
            });           
            return true;
        }
        this.setState({
            listOfIssuesToRender: listOfIssues,
            waiting: false,
            issueTrackerUrl: issueTrackerUrl,
            selectedStateId: selectedStateId,
            pageNumber: pageNumber,
            noMoreIssuesExist: false,
            selectedType: selectedType
        }, () => {
            this.createIssuesList();            
        });
    }

    
    loadTheComponentPreviousState(){
        this.setState({...this.props.lastState});
        this.updateURL(this.props.lastState.pageNumber, this.props.lastState.selectedStateId, 'issue');
    }
        
    
    handleIssueStateChange(e){
        this.setState({waiting:true});
        let selectedIssueStateId = parseInt(e.target.value);
        this.setState({
            selectedStateId: selectedIssueStateId,
            pageNumber: 1
        }, ()=>{
            this.updateURL(this.state.pageNumber, this.state.selectedStateId, this.state.selectedType);
        });        
        localStorage.setItem("selectedIssueStateId", selectedIssueStateId);
    }

    
    handlePagination (e) {
        let paginationDirection = e.target.dataset.value;
        let pageNumber = parseInt(this.state.pageNumber);
        if(paginationDirection === "minus" && pageNumber > 1){
            pageNumber -= 1;
        }
        else if(paginationDirection === "plus"){
            pageNumber += 1;
        }
        this.setState({
          pageNumber: pageNumber,
          waiting: true         
        }, ()=> {            
            this.updateURL(this.state.pageNumber, this.state.selectedStateId, this.state.selectedType);
        })
    }


    handleTypeChange(e){        
        this.setState({
            selectedType: e.target.value,
            pageNumber: 1,
            waiting: true
        });
        this.updateURL(1, this.state.selectedStateId, e.target.value);
    }


    updateURL(pageNumber, stateId, type){
        let currentUrlParams = new URLSearchParams();
        currentUrlParams.append('page', pageNumber);
        currentUrlParams.append('stateId', stateId);      
        currentUrlParams.append('type', type);              
        this.props.history.push(window.location.pathname + "?" + currentUrlParams.toString());
        this.setComponentData(true);
    }


    createPagination(){
        return [
            <ul className='pagination-holder'>
                <li className='pagination-btn pagination-start'>
                   <a className='pagination-link' data-value={'minus'} onClick={this.handlePagination}>Previous</a>
                </li>                
                <li className='pagination-btn pagination-end'>
                    <a className='pagination-link'  data-value={'plus'} onClick={this.handlePagination}>Next</a>
                </li>
            </ul>
        ];
    }

    
    
    createIssuesList(){
        let listOfIssues = this.state.listOfIssuesToRender;
        let result = [];
        for(let issue of listOfIssues){            
            result.push(
                <div className="row">
                    <div className="col-sm-12 git-issue-card">
                        {createIssueTitle(issue)}
                        {createLabelTags(issue['labels'])}
                        <br/>
                        {createIssueDescription(issue)}
                    </div>
                </div>
            );
        }
        this.setState({contentForRender: result}, () => {
            this.props.storeListOfGitIssuesState(this.state);
        });        
    }


    componentDidMount(){
        this.setComponentData();
    }


    render(){
        if(process.env.REACT_APP_GITHUB_ISSUE_LIST_FEATURE !== "true"){            
            return null;
        }
        return (
            <div className="row tree-view-container list-container">
                <div className="col-sm-12">
                    <div className="row">
                        <div className="col-sm-3">                                
                            <DropDown 
                                options={ISSUE_STATES_FOR_DROPDOWN}
                                dropDownId="issue-state-types"
                                dropDownTitle="State"
                                dropDownValue={this.state.selectedStateId}
                                dropDownChangeHandler={this.handleIssueStateChange}
                            /> 
                        </div>
                        <div className="col-sm-3">                                    
                            <div class="form-check-inline form-check-inline-github-issue">
                                <label class="form-check-label">
                                    <input type="radio" id="issue_radio" class="form-check-input form-check-input-github-issue custom-radio-btn-input" name="typeRadio" value={"issue"} onChange={this.handleTypeChange}/>
                                    Issue
                                </label>
                            </div>
                            <div class="form-check-inline form-check-inline-github-issue">
                                <label class="form-check-label">
                                    <input type="radio" id="pr_radio" class="form-check-input form-check-input-github-issue custom-radio-btn-input" name="typeRadio" value={"pr"} onChange={this.handleTypeChange}/>
                                    Pull Request
                                </label>
                            </div>                                                                
                        </div> 
                        <div className="col-sm-3">
                            {this.createPagination()}
                        </div>                        
                    </div>                                       
                        <div className="row">                            
                            <div className="col-sm-9">
                                {this.state.waiting && <div className="isLoading"></div>} 
                                {!this.state.waiting && !this.state.noMoreIssuesExist && this.state.contentForRender}
                                {!this.state.waiting && this.state.noMoreIssuesExist && 
                                    <div class="alert alert-info">
                                        No Result. 
                                    </div>
                                }                                                            
                            </div>
                            
                            <div className="col-sm-3">
                                <RenderIfLogin component={<TermRequest ontology={this.props.ontology} reportType={"general"} />} />
                                <br></br>
                                <RenderIfLogin component={<TermRequest ontology={this.props.ontology} reportType={"termRequest"} />} />
                            </div>
                        </div>                                                         
                </div>
            </div>
            
        );
    }



}

export default withAuth(withRouter(IssueList));