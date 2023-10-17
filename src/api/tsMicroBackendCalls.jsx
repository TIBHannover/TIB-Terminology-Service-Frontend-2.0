import AuthTool from "../components/User/Login/authTools";



export async function submitNote(noteDataForm, editMode=false){
    try{
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});        
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT;
        let path = !editMode ?  '/note/create_note' : '/note/update_note';
        let extractKey = !editMode ? 'note_created' : 'note_updated';
        let result = await fetch(url + path, {method: 'POST',  headers:headers, body: noteDataForm});
        result = await result.json();
        result = result['_result'][extractKey]['id'];
        return result;
    }
    catch(e){
        return false;
    }
}



export async function submitNoteComment({noteId, content}){
    try{
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});       
        let data = new FormData();
        data.append("noteId", noteId);
        data.append("content", content);
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/create_comment';
        let result = await fetch(url, {method: 'POST',  headers:headers, body: data});
        result = await result.json();
        result = result['_result']['comment_created'];
        return result;

    }
    catch(e){
        return false;
    }
}


export async function editNoteComment({commentId, content}){
    try{
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});       
        let data = new FormData();
        data.append("comment_id", commentId);
        data.append("content", content);
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/update_comment';
        let result = await fetch(url, {method: 'POST',  headers:headers, body: data});
        result = await result.json();
        result = result['_result']['comment_updated'];
        return result;
    }
    catch(e){
        return false;
    }
}


export async function getNoteDetail({noteId}){
    try{
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});
        let url =  process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/note?id=' + noteId + '&withComments=True';
        let result = await fetch(url, {headers:headers});
        if (result.status === 404){
            return '404';
        }
        result = await result.json();
        let note = result['_result']['note'];
        note['comments_count'] = note['comments'].length;
        return note;
    }
    catch(e){        
        return {}
    }
}


export async function getOntologyGithubIssueList(ontologyIssueTrackerUrl, issueState, resultCountPerPage=10, pageNumber=1){
    try{ 
        let urlPath = ontologyIssueTrackerUrl.split("https://github.com/")[1];        
        let endpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/github/issuelist?';
        endpoint += ("path=" + encodeURIComponent(urlPath));
        endpoint += ("&state=" + issueState);
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
