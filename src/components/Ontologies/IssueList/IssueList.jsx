import React from "react";
import { UserIsLogin } from "../../User/Login/Auth";
import LoginForm from "../../User/Login/Login";
import GithubController from '../../GithubController/GithubController';
import { withAuth } from "react-oidc-context";
import { withRouter } from 'react-router-dom';
import {createLabelTags, 
    createIssueDescription, 
    createIssueTitle, setUrlParameter} from './helper';


const OPEN_ISSUE_ID = 1;
const CLOSE_ISSUE_ID = 2;
const ALL_ISSUE_ID = 3;
const ISSUE_STATES_VALUES = ["", "open", "closed", "all"]



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
            selectedTypeId: OPEN_ISSUE_ID,
            username: "StroemPhi",
            issueTrackerUrl: null,
            pageNumber: 1,
            resultCountPerPage: 10,
            noMoreIssuesExist: false     
        });
        this.setComponentData = this.setComponentData.bind(this);
        this.createIssuesList = this.createIssuesList.bind(this);
        this.createIssueStateDropDown = this.createIssueStateDropDown.bind(this);
        this.handleIssueStateChange = this.handleIssueStateChange.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
        this.updateURL = this.updateURL.bind(this);
        this.createPagination = this.createPagination.bind(this);
        this.loadTheComponentPreviousState = this.loadTheComponentPreviousState.bind(this);
        this.gitHubController = new GithubController(this.props.auth.user?.access_token);
    }


    async setComponentData(reload=false){
        if(this.props.lastState && !reload){
            this.loadTheComponentPreviousState();
            return true;
        }
        let ontology = this.props.ontology;
        let issueTrackerUrl = typeof(ontology.config.tracker) !== "undefined" ? ontology.config.tracker : null;
        let listOfIssues = [];
        let username = this.state.username;                
        let urlParameter = setUrlParameter(reload, this.state.pageNumber, this.state.selectedTypeId);
        let pageNumber = urlParameter['pageNumber'];
        let selectedTypeId = urlParameter['selectedTypeId'];
        let issueStateValue =  ISSUE_STATES_VALUES[selectedTypeId];
        let resultCountPerPage = this.state.resultCountPerPage;
        listOfIssues = await this.gitHubController.getOntologyIssueListForUser(issueTrackerUrl, username, issueStateValue, resultCountPerPage, pageNumber);
        if(listOfIssues.length === 0){
            this.setState({
                waiting: false,
                noMoreIssuesExist: true
            });
            this.updateURL(pageNumber, selectedTypeId);
            return true;
        }
        this.setState({
            listOfIssuesToRender: listOfIssues,
            waiting: false,
            issueTrackerUrl: issueTrackerUrl,
            selectedTypeId: selectedTypeId,
            pageNumber: pageNumber,
            noMoreIssuesExist: false
        }, () => {
            this.createIssuesList();
            this.updateURL(pageNumber, selectedTypeId);
        });
    }

    
    loadTheComponentPreviousState(){
        this.setState({...this.props.lastState});
        this.updateURL(this.props.lastState.pageNumber, this.props.lastState.selectedTypeId);
    }
        
    
    handleIssueStateChange(e){
        this.setState({waiting:true});
        let selectedIssueStateId = parseInt(e.target.value);
        this.setState({
            selectedTypeId: selectedIssueStateId,
            pageNumber: 1
        }, ()=>{
            this.setComponentData(true);
        });        
        localStorage.setItem("selectedIssueStateId", selectedIssueStateId);
    }

    
    handlePagination (e) {
        let paginationDirection = e.target.dataset.value;
        let pageNumber = this.state.pageNumber;
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
            this.setComponentData(true);
        })
    }


    updateURL(pageNumber, stateId){
        let currentUrlParams = new URLSearchParams();
        currentUrlParams.append('page', pageNumber);
        currentUrlParams.append('stateId', stateId);              
        this.props.history.push(window.location.pathname + "?" + currentUrlParams.toString());
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


    createIssueStateDropDown(){
        return [
            <div className='col-sm-4 form-inline'>
                <div class="form-group">
                    <label for="issue-state-types" className='col-form-label'>State</label>
                    <select className='site-dropdown-menu list-result-per-page-dropdown-menu' id="issue-state-types" value={this.state.selectedTypeId} onChange={this.handleIssueStateChange}>
                    <option value={OPEN_ISSUE_ID} key={OPEN_ISSUE_ID}>Open</option>
                    <option value={CLOSE_ISSUE_ID} key={CLOSE_ISSUE_ID}>Closed</option>
                    <option value={ALL_ISSUE_ID} key={ALL_ISSUE_ID}>All</option>                    
                    </select>  
                </div>                                                                                
            </div>
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
        return (
            <div className="row tree-view-container">
                <div className="col-sm-12">
                    {!this.props.auth.isAuthenticated && 
                        <LoginForm onlyLoginButton={false} />
                    }
                    {this.state.waiting && <div className="isLoading"></div>}
                    {this.props.auth.isAuthenticated && !this.state.waiting &&                        
                        <div className="row">
                            <div className="row">
                                {this.createIssueStateDropDown()}
                            </div>                            
                            <div className="col-sm-8">
                                {!this.state.noMoreIssuesExist && this.state.contentForRender}
                                {this.state.noMoreIssuesExist && 
                                    <div class="alert alert-info">
                                        No Result. 
                                    </div>
                                }
                                {this.createPagination()}                                
                            </div>                            
                        </div>
                    }
                </div>
            </div>
            
        );
    }



}

export default withAuth(withRouter(IssueList));