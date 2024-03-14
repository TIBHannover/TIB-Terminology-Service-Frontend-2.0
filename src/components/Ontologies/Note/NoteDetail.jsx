import {useState, useEffect, useContext} from "react";
import { useHistory } from "react-router";
import { getNoteDetail } from "../../../api/tsMicroBackendCalls";
import { NotFoundErrorPage } from "../../common/ErrorPages/ErrorPages";
import {createHtmlFromEditorJson, createTextEditorEmptyText}  from "../../common/TextEditor/TextEditor";
import { NoteDetailRender } from "./renders/NoteDetailRender";
import { OntologyPageContext } from "../../../context/OntologyPageContext";
import { NoteContext } from "../../../context/NoteContext";



const NoteDetail = (props) => {

    const ontologyPageContext = useContext(OntologyPageContext);
    const noteContext = useContext(NoteContext);

    const [note, setNote] = useState({});
    const [noteContent, setNoteContent] = useState(createTextEditorEmptyText());
    const [noteNotFound, setNoteNotFound] = useState(false);
    const [currentUrl, setCurrentUrl] = useState(window.location.href);    

    const history = useHistory();


    function getTheNote(){
        let noteId = props.noteId;        
        getNoteDetail({noteId: noteId, ontologyId:ontologyPageContext.ontology.ontologyId}).then((result) => {
            if(result === '404'){
                setNoteNotFound(true);                
            }            
            else{    
                setNote(result['note']);
                setNoteContent(createHtmlFromEditorJson(result['note']['content']));                
                noteContext.setNumberOfPinned(result['number_of_pinned']);
                setNoteNotFound(false);                
            }
        });
    }


    function reloadNoteDetail(){
        let searchParams = new URLSearchParams(window.location.search);     
        searchParams.delete('comment');        
        history.push(window.location.pathname + "?" +  searchParams.toString());
        setNote({});
        setCurrentUrl(window.location.pathname + "?" +  searchParams.toString()); 
    }


    useEffect(() => {
        if(props.noteId){
            getTheNote();
        }  
    }, []);

    useEffect(() => {        
        getTheNote();        
    }, [props.noteId, currentUrl]);


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