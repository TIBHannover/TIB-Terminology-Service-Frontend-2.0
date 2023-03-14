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
                            Issues
                        </div>
                    }
                </div>
            </div>
            
        );
    }



}

export default IssueList;