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


export async function editNoteComment({commentId, content, ontologyId}){
    try{
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});       
        let data = new FormData();
        data.append("comment_id", commentId);
        data.append("content", content);
        data.append("ontology_id", ontologyId);
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


export async function getNoteDetail({noteId, ontologyId}){
    try{
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});
        let url =  process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/note?id=' + noteId + '&withComments=True&ontology=' + ontologyId;
        let result = await fetch(url, {headers:headers});
        if (result.status === 404){
            return '404';
        }
        result = await result.json();        
        result['_result']['note']['comments_count'] = result['_result']['note']['comments'].length;
        return result['_result'];
    }
    catch(e){        
        return {}
    }
}



export async function getNoteList({ontologyId, type, pageNumber, pageSize, targetTerm=null, onlyOntologyOriginalNotes}){
    try{
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});                        
        
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/notes_list?ontology=' + ontologyId;
        url += ('&page=' + pageNumber + '&size=' + pageSize)
        if(targetTerm){
            url += ('&artifact_iri=' + targetTerm['iri'])
        }
        if(type){
            url += ('&artifact_type=' + type);
        }

        if(onlyOntologyOriginalNotes){
            url += '&onlyOriginalNotes=true';
        }

        let notes = await fetch(url, {headers:headers});
        notes = await notes.json();
        return notes['_result'];
    }
    catch (e){        
        return null;
    }
}



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
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});  
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
