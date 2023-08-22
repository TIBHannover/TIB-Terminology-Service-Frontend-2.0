import AuthTool from "../components/User/Login/authTools";



export async function submitNote(noteDataForm){
    try{
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});  
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/create_note';
        let result = await fetch(url, {method: 'POST',  headers:headers, body: noteDataForm});
        result = await result.json();
        result = result['_result']['note_created']['id'];
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
