const callHeader = {
    'Accept': 'application/json',
    'Authorization' : 'Bearer ' + localStorage.getItem('token')
  };
const getCallSetting = {method: 'GET', headers: callHeader};



class GithubController{
    constructor(){
        this.githubApiBaseUrl = "https://api.github.com/";
    }
    

    async getOntologyIssueListForUser(ontologyIssueTrackerUrl, username, issueState, resultCountPerPage=10, pageNumber=1){
        try{
            if(!ontologyIssueTrackerUrl){
                return [];
            }
            let urlPath = ontologyIssueTrackerUrl.split("https://github.com/")[1];            
            let url = this.githubApiBaseUrl + "repos/" + urlPath + "?creator=" + username + "&state=" + issueState + "&per_page=" + resultCountPerPage + "&page=" + pageNumber;            
            let issuesList = await fetch(url, getCallSetting);
            issuesList = await issuesList.json();            
            for(let issue of issuesList){
                issue['labels'] = await this.getAnIssueLabelsList(issue);
            }
            return issuesList;
        }
        catch(e){
            // console.info(e)
            return [];
        }        
    }
    
    async getAnIssueLabelsList(issueObject){        
        try{            
            let url = issueObject['labels_url'].split("{/name}")[0];            
            let labels = await fetch(url, getCallSetting);
            labels = await labels.json();
            return labels;            
        }
        catch(e){
            return [];
        }
    }
}

export default GithubController;