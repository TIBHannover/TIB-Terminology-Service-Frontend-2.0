const callHeader = {
    'Accept': 'application/json'
  };
const getCallSetting = {method: 'GET', headers: callHeader};



class GithubController{
    constructor(){
        this.githubApiBaseUrl = "https://api.github.com/";
    }
    

    async getOntologyIssueListForUser(ontologyIssueTrackerUrl, username){
        try{
            let urlPath = ontologyIssueTrackerUrl.split("https://github.com/")[1];
            let url = this.githubApiBaseUrl + urlPath + "?creator=" + username;
            let issuesList = await fetch(url, getCallSetting);
            issuesList = await issuesList.json();
            return issuesList;
        }
        catch(e){
            return [];
        }        
    }   
}