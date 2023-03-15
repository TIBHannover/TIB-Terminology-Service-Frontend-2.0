import React from "react";
import { userIsLoginByLocalStorage } from "../../User/Login/Auth";
import Login from "../../User/Login/Login";
import GithubController from '../../GithubController/GithubController';


class IssueList extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            listOfIssues: []
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
            listOfIssues: listOfIssues
        });        
    }


    
    createLabelTags(labelsList){
        let result = [];
        for(let label of labelsList){
            result.push(                
                <span className="git-issue-label-tag" style={{backgroundColor: "#" + label['color']}}>
                    <a href={label['url']} className="git-issue-tag-link" target={"_blank"}>
                        {label['name']}
                    </a>
                </span>                        
            );
        }
        return result;
    }
    
    
    createIssuesList(){
        let listOfIssues = this.state.listOfIssues;
        let result = [];
        for(let issue of listOfIssues){            
            result.push(
                <div className="row">
                    <div className="col-sm-12 git-issue-card">
                        <a href={issue['html_url']} className="git-issue-title" target={"_blank"}>{issue['title']}</a>                        
                        {this.createLabelTags(issue['labels'])}
                        <br/>
                        <div>
                            <small>
                            {"#" + issue['number'] + " opened on " + issue['created_at'].split("T")[0] + " by " + issue['user']['login']}
                            </small>
                        </div>
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