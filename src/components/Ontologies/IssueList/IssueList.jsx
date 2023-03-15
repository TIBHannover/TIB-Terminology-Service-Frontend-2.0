import React from "react";
import { userIsLoginByLocalStorage } from "../../User/Login/Auth";
import Login from "../../User/Login/Login";
import GithubController from '../../GithubController/GithubController';
import {createLabelTags, 
    createIssueDescription, 
    createIssueTitle} from './helper';


class IssueList extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            listOfIssues: [],
            waiting: true
        });
        this.setComponentData = this.setComponentData.bind(this);
        this.createIssuesList = this.createIssuesList.bind(this);
        this.gitHubController = new GithubController();
    }


    async setComponentData(){
        let username = "StroemPhi";
        let ontology = this.props.ontology;
        let issueTrackerUrl = typeof(ontology.config.tracker) !== "undefined" ? ontology.config.tracker : null;
        let listOfIssues = [];        
        if(issueTrackerUrl){
            listOfIssues = await this.gitHubController.getOntologyIssueListForUser(issueTrackerUrl, username);
        }
        this.setState({
            listOfIssues: listOfIssues,
            waiting: false
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
        return result;
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
                                {this.createIssuesList()}
                            </div>                            
                        </div>
                    }
                </div>
            </div>
            
        );
    }



}

export default IssueList;