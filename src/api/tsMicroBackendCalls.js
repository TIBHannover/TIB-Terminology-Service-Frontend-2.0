import { getTsPluginHeaders } from "./header";




export async function getOntologyGithubIssueList(ontologyIssueTrackerUrl, issueState, issueType, resultCountPerPage=10, pageNumber=1){
    try{ 
        let urlPath = ontologyIssueTrackerUrl.split("https://github.com/")[1];        
        let endpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/github/issuelist?';
        endpoint += ("path=" + encodeURIComponent(urlPath));
        endpoint += ("&state=" + issueState);
        endpoint += ("&type=" + issueType);
        endpoint += ("&size=" + resultCountPerPage);
        endpoint += ("&page=" + pageNumber);
        let header = {};
        header["X-TS-Frontend-Id"] = process.env.REACT_APP_PROJECT_ID;
        header["X-TS-Frontend-Token"] = process.env.REACT_APP_MICRO_BACKEND_TOKEN;
        let result = await fetch(endpoint, {headers:header});
        result = await result.json();
        result = result['_result']            
        return result.issues;
    }
    catch(e){            
        return [];
    }        
}



export async function sendResolveRequest({objectType, objectId, action, creatorUsername}){
    try{
        let headers = getTsPluginHeaders({withAccessToken:true});  
        let formData = new FormData();
        formData.append('objectType', objectType);
        formData.append('objectId', objectId);
        formData.append('action', action);
        formData.append('creatorUsername', creatorUsername);
        let resolveUrl = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/report/resolve_report';
        let result = await fetch(resolveUrl, {method:'POST', headers:headers, body:formData});
        if (result.status !== 200){
            return false;
        }
        result = await result.json();
        return result['_result']['resolved'];
    }
    catch(e){
        return false;
    }
}



export async function getReportList(){
    try{
        let headers = getTsPluginHeaders({withAccessToken:true});         
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/report/report_list';
        let result = await fetch(url, {method:'GET', headers:headers});
        if (result.status !== 200){
            return [];
        }
        result = await result.json();
        return result['_result']['reports'];
    }
    catch(e){
        return [];
    }
}



export async function getGitRepoTemplates({repoUrl, gitUsername}){
    try{
        let headers = getTsPluginHeaders({withAccessToken:true});         
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/github/get_issue_templates';
        let formData = new FormData();
        formData.append("repo_url", repoUrl);
        formData.append("username", gitUsername);
        let result = await fetch(url, {method:'POST', headers:headers, body:formData});
        if (result.status !== 200){
            return false;
        }
        result = await result.json();
        return result['_result']['templates'];
    }
    catch(e){        
        return false;
    }
}



export async function submitGitIssue({repoUrl, gitUsername, issueTitle, issueBody, issueType, ontologyId}){
    try{
        let data = new FormData();
        let headers = getTsPluginHeaders({withAccessToken:true});       
        data.append("ontology_id", ontologyId);
        data.append("username", gitUsername);        
        data.append("title", issueTitle);
        data.append("content", issueBody);        
        data.append("issueType", issueType);
        data.append("repo_url", repoUrl);
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/github/submit_issue';
        let result = await fetch(url, {method:'POST', headers:headers, body:data});
        if (result.status !== 200){
            return false;
        }
        result = await result.json();
        return result['_result']['new_issue_url'];
    }
    catch(e){
        return false;
    }
}

