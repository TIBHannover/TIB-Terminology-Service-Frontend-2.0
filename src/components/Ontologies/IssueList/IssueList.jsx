import React from "react";
import { userIsLoginByLocalStorage } from "../../User/Login/Auth";
import Login from "../../User/Login/Login";
import GithubController from '../../GithubController/GithubController';
import {createLabelTags, 
    createIssueDescription, 
    createIssueTitle} from './helper';


const CLOSE_ISSUE_STATE = "closed";
const OPEN_ISSUE_STATE = "open"
const ALL_ISSUE_STATE = "all"


class IssueList extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            listOfIssues: [],
            waiting: true,
            contentForRender: "",            
        });
        this.setComponentData = this.setComponentData.bind(this);
        this.createIssuesList = this.createIssuesList.bind(this);
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
        let listOfIssues = [];        
        if(issueTrackerUrl){
            listOfIssues = await this.gitHubController.getOntologyIssueListForUser(issueTrackerUrl, username, OPEN_ISSUE_STATE);
        }
        this.setState({
            listOfIssues: listOfIssues,
            waiting: false
        }, () => {
            this.createIssuesList();
        });
    }

    
    
    createIssuesList(){
        let listOfIssues = this.state.listOfIssues;
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
                    {userIsLoginByLocalStorage() &&
                        <div className="row">
                            <div className="col-sm-8">
                                {this.state.contentForRender}
                            </div>                            
                        </div>
                    }
                </div>
            </div>
            
        );
    }



}

export default IssueList;