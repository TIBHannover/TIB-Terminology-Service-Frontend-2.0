import {createBrowserHistory} from 'history';
import * as SiteUrlParamNames from './UrlParamNames';


  

class NoteUrlFactory {
  constructor() {
    this.baseUrl = window.location.pathname;
    let url = new URL(window.location); 
    this.history = createBrowserHistory();
    this.page = url.searchParams.get(SiteUrlParamNames.Page);
    this.size = url.searchParams.get(SiteUrlParamNames.Size);
    this.originalNotes = url.searchParams.get(SiteUrlParamNames.OriginalNotes);
    this.noteType = url.searchParams.get(SiteUrlParamNames.NoteType);
    this.noteId = url.searchParams.get(SiteUrlParamNames.NoteId);
    this.commentId = url.searchParams.get(SiteUrlParamNames.CommentId);
  }


  setNoteId({noteId}){
    let currentUrlParams = new URLSearchParams(window.location.search);  
    currentUrlParams.set(SiteUrlParamNames.NoteId, noteId);
    this.history.push(this.baseUrl + "?" + currentUrlParams.toString());           
  }


  update({page, size, originalNotes, noteType}){
    let currentUrlParams = new URLSearchParams();
    currentUrlParams.set(SiteUrlParamNames.Page, page);
    currentUrlParams.set(SiteUrlParamNames.Size, size);
    currentUrlParams.set(SiteUrlParamNames.OriginalNotes, originalNotes);
    currentUrlParams.set(SiteUrlParamNames.NoteType, noteType);    
    this.history.push(this.baseUrl + "?" + currentUrlParams.toString());     
  }



  getCurrentNoteLink({noteId, fullLink=false}){
    let searchParams = new URLSearchParams(window.location.search);        
    searchParams.set(SiteUrlParamNames.NoteId, noteId);
    searchParams.delete(SiteUrlParamNames.Page);
    searchParams.delete(SiteUrlParamNames.Size);
    searchParams.delete(SiteUrlParamNames.NoteType);
    searchParams.delete(SiteUrlParamNames.CommentId);
    if(fullLink){
        return window.location.origin + window.location.pathname + "?" +  searchParams.toString();
    }
    return window.location.pathname + "?" +  searchParams.toString();
  }



  getCommentLink({commentId}){
    let searchParams = new URLSearchParams(window.location.search);        
    searchParams.set(SiteUrlParamNames.CommentId, commentId);
    return window.location.origin + window.location.pathname + "?" +  searchParams.toString();
  }



  getNoteListLink({page, size}){
    let currentUrl = window.location.href;
    let searchParams = new URLSearchParams(window.location.search);
    let locationObject = window.location;
    searchParams.set(SiteUrlParamNames.Page, page);
    searchParams.set(SiteUrlParamNames.Size, size);   
    if (currentUrl.includes(SiteUrlParamNames.NoteId)){
        // we are on the note page                
        searchParams.delete(SiteUrlParamNames.NoteId);                 
    }
    return locationObject.pathname + "?" +  searchParams.toString();
  }


  getCommentDeleteRedirectLink(){
    let searchParams = new URLSearchParams(window.location.search);        
    searchParams.delete(SiteUrlParamNames.CommentId);
    return window.location.pathname + "?" +  searchParams.toString();
  }





}

export default NoteUrlFactory;