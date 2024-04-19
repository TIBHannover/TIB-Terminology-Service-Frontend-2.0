import {useState, useEffect, useContext} from "react";
import { getNoteDetail } from "../../../api/tsMicroBackendCalls";
import { NotFoundErrorPage } from "../../common/ErrorPages/ErrorPages";
import {createHtmlFromEditorJson, createTextEditorEmptyText}  from "../../common/TextEditor/TextEditor";
import { NoteDetailRender } from "./renders/NoteDetailRender";
import { OntologyPageContext } from "../../../context/OntologyPageContext";
import { NoteContext } from "../../../context/NoteContext";
import CommonUrlFactory from "../../../UrlFactory/CommonUrlFactory";
import * as SiteUrlParamNames from '../../../UrlFactory/UrlParamNames';



const NoteDetail = () => {

    /* 
        This component is responsible for rendering the note detail page.
        It uses the NoteContext to get the selected note id.
        It uses the OntologyPageContext to get the ontology information.
        It uses the getNoteDetail function to get the note detail from the backend.
    */

    const ontologyPageContext = useContext(OntologyPageContext);
    const noteContext = useContext(NoteContext);

    const [note, setNote] = useState({});
    const [noteContent, setNoteContent] = useState(createTextEditorEmptyText());
    const [noteNotFound, setNoteNotFound] = useState(false);
    const [currentUrl, setCurrentUrl] = useState(window.location.href);    
    
    const commonUrlFactory = new CommonUrlFactory();


    function getTheNote(){
        let noteId = noteContext.selectedNoteId;        
        getNoteDetail({noteId: noteId, ontologyId:ontologyPageContext.ontology.ontologyId}).then((result) => {
            if(result === '404'){
                setNoteNotFound(true);                
            }            
            else{    
                setNote(result['note']);
                noteContext.setSelectedNote(result['note']);
                setNoteContent(createHtmlFromEditorJson(result['note']['content']));                
                noteContext.setNumberOfPinned(result['number_of_pinned']);
                setNoteNotFound(false);                
            }
        });
    }


    function reloadNoteDetail(){        
        commonUrlFactory.deleteParam({name: SiteUrlParamNames.CommentId});
        setNote({});
        setCurrentUrl(commonUrlFactory.getCurrentUrl()); 
    }


    useEffect(() => {
        if(noteContext.selectedNoteId){
            getTheNote();
        }  
    }, []);

    useEffect(() => {        
        getTheNote();        
    }, [noteContext.selectedNoteId, currentUrl]);


    if(process.env.REACT_APP_NOTE_FEATURE !== "true"){            
        return null;
    }    

    if(noteNotFound){
        return (<NotFoundErrorPage />)
    }
    return(                           
        <NoteDetailRender 
            note={note}
            noteContent={noteContent}
            reloadNoteDetail={reloadNoteDetail}                        
        />
    );
}


export default NoteDetail;