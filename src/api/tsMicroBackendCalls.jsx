import AuthTool from "../components/User/Login/authTools";



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