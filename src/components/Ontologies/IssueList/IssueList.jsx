import React from "react";
import { userIsLoginByLocalStorage } from "../../User/Login/Auth";
import Login from "../../User/Login/Login";
import GithubController from '../../GithubController/GithubController';
import Pagination from "../../common/Pagination/Pagination";
import { withRouter } from 'react-router-dom';
import {createLabelTags, 
    createIssueDescription, 
    createIssueTitle, 
    getIssuesBasedOnState} from './helper';


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
            pageCount: 10,
            noMoreIssuesExist: false     
        });
        this.setComponentData = this.setComponentData.bind(this);
        this.createIssuesList = this.createIssuesList.bind(this);
        this.createIssueStateDropDown = this.createIssueStateDropDown.bind(this);
        this.handleIssueStateChange = this.handleIssueStateChange.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
        this.updateURL = this.updateURL.bind(this);
        this.createPagination = this.createPagination.bind(this);
        this.gitHubController = new GithubController();
    }


    async setComponentData(forceReload=false){
        if(this.props.lastState && !forceReload){
            this.setState({...this.props.lastState});
            return true;
        }        
        let ontology = this.props.ontology;
        let issueTrackerUrl = typeof(ontology.config.tracker) !== "undefined" ? ontology.config.tracker : null;        
        let listOfIssues = [];        
        let username = this.state.username;
        let url = new URL(window.location);
        let pageNumber = this.state.pageNumber;
        let stateIdInUrl = url.searchParams.get('stateId');       
        stateIdInUrl = !stateIdInUrl ? OPEN_ISSUE_ID : parseInt(stateIdInUrl);        
        if(issueTrackerUrl){
            listOfIssues = await this.gitHubController.getOntologyIssueListForUser(issueTrackerUrl, username, ISSUE_STATES_VALUES[stateIdInUrl], this.state.pageCount, pageNumber);
        }
        if(listOfIssues.length === 0){
            this.setState({
                waiting: false,
                noMoreIssuesExist: true
            });
            this.updateURL(pageNumber, stateIdInUrl);
            return true;
        }
        this.setState({            
            // listOfOpenIssues: listOfOpenIssues,            
            listOfIssuesToRender: listOfIssues,            
            waiting: false,
            issueTrackerUrl: issueTrackerUrl,           
            selectedTypeId: stateIdInUrl,
            pageNumber: pageNumber,
            noMoreIssuesExist: false
        }, () => {
            this.createIssuesList();
            this.updateURL(pageNumber, stateIdInUrl);
        });
    }


    async handleIssueStateChange(e){
        this.setState({waiting:true});
        let selectedIssueStateId = parseInt(e.target.value);
        let targetIssueList = [];
        let listOfAllIssues = this.state.listOfAllIssues;
        let listOfClosedIssues = this.state.listOfClosedIssues;
        if(selectedIssueStateId === OPEN_ISSUE_ID){
            targetIssueList = this.state.listOfOpenIssues;            
        }
        else if(selectedIssueStateId === CLOSE_ISSUE_ID){            
            if(listOfClosedIssues.length === 0){
                targetIssueList = await this.gitHubController.getOntologyIssueListForUser(this.state.issueTrackerUrl, this.state.username, ISSUE_STATES_VALUES[CLOSE_ISSUE_ID]);
                listOfClosedIssues = targetIssueList;
            }
            else{
                targetIssueList = listOfClosedIssues;
            }
        }
        else{            
            if(listOfAllIssues.length === 0){
                targetIssueList = await this.gitHubController.getOntologyIssueListForUser(this.state.issueTrackerUrl, this.state.username, ISSUE_STATES_VALUES[ALL_ISSUE_ID]);
                listOfAllIssues = targetIssueList;
            }
            else{
                targetIssueList = listOfAllIssues;
            }
        }

        this.setState({
            selectedTypeId: selectedIssueStateId,
            listOfIssuesToRender: targetIssueList,
            listOfClosedIssues: listOfClosedIssues,
            listOfAllIssues: listOfAllIssues,
            waiting: false,
            pageNumber: 1
        }, ()=>{
            this.createIssuesList();
            this.updateURL(1, selectedIssueStateId);
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
                    {!userIsLoginByLocalStorage() && 
                        <Login isModal={false} />
                    }
                    {this.state.waiting && <div className="isLoading"></div>}
                    {userIsLoginByLocalStorage() && !this.state.waiting &&
                        <div className="row">
                            <div className="col-sm-8">
                                {!this.state.noMoreIssuesExist && this.state.contentForRender}
                                {this.state.noMoreIssuesExist && 
                                    <div class="alert alert-info">
                                        No Result. 
                                    </div>
                                }
                            </div>
                            <div className="col-sm-4">
                                {this.createIssueStateDropDown()}
                                <br></br>
                                {this.createPagination()}
                            </div>                      
                        </div>
                    }
                </div>
            </div>
            
        );
    }



}

export default withRouter(IssueList);