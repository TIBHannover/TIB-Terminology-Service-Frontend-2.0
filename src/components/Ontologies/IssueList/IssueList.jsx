import React from "react";
import { userIsLoginByLocalStorage } from "../../User/Login/Auth";
import Login from "../../User/Login/Login";
import GithubController from '../../GithubController/GithubController';
import {createLabelTags, 
    createIssueDescription, 
    createIssueTitle} from './helper';


const CLOSE_ISSUE_STATE = "closed";
const OPEN_ISSUE_STATE = "open";
const ALL_ISSUE_STATE = "all";
const OPEN_ISSUE_ID = 1;
const CLOSE_ISSUE_ID = 2;
const ALL_ISSUE_ID = 3;


class IssueList extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            listOfIssuesToRender: [],
            listOfOpenIssues: [],
            listOfClosedIssues: [],
            listOfAllIsses: [],
            waiting: true,
            contentForRender: "",
            selectedTypeId: OPEN_ISSUE_ID    
        });
        this.setComponentData = this.setComponentData.bind(this);
        this.createIssuesList = this.createIssuesList.bind(this);
        this.createIssueStateDropDown = this.createIssueStateDropDown.bind(this);
        this.handleIssueStateChange = this.handleIssueStateChange.bind(this);
        this.gitHubController = new GithubController();
    }


    async setComponentData(){
        if(this.props.listOfIssues.length !== 0){
            this.setState({
                waiting: false,
                contentForRender: this.props.issueListForRender
            });
            return true;
        }
        let username = "StroemPhi";
        let ontology = this.props.ontology;
        let issueTrackerUrl = typeof(ontology.config.tracker) !== "undefined" ? ontology.config.tracker : null;
        let listOfIssuesToRender = [];        
        if(issueTrackerUrl){
            listOfIssuesToRender = await this.gitHubController.getOntologyIssueListForUser(issueTrackerUrl, username, OPEN_ISSUE_STATE);
        }
        this.setState({
            listOfIssuesToRender: listOfIssuesToRender,
            listOfOpenIssues: listOfIssuesToRender,
            waiting: false
        }, () => {
            this.createIssuesList();
        });
    }


    handleIssueStateChange(e){

    }


    createIssueStateDropDown(){
        return [
            <div className='col-sm-4 form-inline'>
                <div class="form-group">
                    <label for="issue-state-types" className='col-form-label'>State</label>
                    <select className='site-dropdown-menu' id="issue-state-types" value={this.state.selectedTypeId} onChange={this.handleIssueStateChange}>
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
        this.setState({contentForRender: result});
        this.props.storeListOfGitIssuesContent(listOfIssues, result);
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
                                {this.state.contentForRender}
                            </div>
                            <div className="col-sm-4">
                                {this.createIssueStateDropDown()}
                            </div>                      
                        </div>
                    }
                </div>
            </div>
            
        );
    }



}

export default IssueList;