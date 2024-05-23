import {useEffect, useState, useContext} from "react";
import { NoteListRender } from "./renders/NoteListRender";
import { getNoteList } from "../../../api/note";
import { OntologyPageContext } from "../../../context/OntologyPageContext";
import { NoteContext } from "../../../context/NoteContext";
import NoteUrlFactory from "../../../UrlFactory/NoteUrlFactory";
import PropTypes from 'prop-types';
import { getTsPluginHeaders } from "../../../api/header";




const ALL_TYPE = 0
const TYPES_VALUES = ['all', 'ontology', 'class', 'property', 'individual']
const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_SIZE = 10




const NoteList = (props) => {
    /* 
        This component is responsible for rendering the list of notes for the ontology.
        It uses the NoteUrlFactory to get the selected note type, page number and note id from the url.
        It requires the ontologyPageContext to get the ontology information.
        It uses the NoteContext to pass the note information to the child components.        
    */

    const ontologyPageContext = useContext(OntologyPageContext);
    
    const noteUrlFactory = new NoteUrlFactory();                
        
    let selectedType = TYPES_VALUES.indexOf(props.termType);
    if(selectedType < 0){
        selectedType = noteUrlFactory.noteType ? TYPES_VALUES.indexOf(noteUrlFactory.noteType) : ALL_TYPE
    }        
            

    const [noteList, setNoteList] = useState([]);
    const [showNoteDetailPage, setShowNoteDetailPage] = useState(false);
    const [noteSubmited, setNoteSubmited] = useState(false);
    const [noteSubmitSeccuess, setNoteSubmitSeccuess] = useState(false);
    const [pageNumber, setPageNumber] = useState(parseInt(noteUrlFactory.page ? noteUrlFactory.page : DEFAULT_PAGE_NUMBER));
    const [pageSize, setPageSize] = useState(noteUrlFactory.size ? noteUrlFactory.size : DEFAULT_PAGE_SIZE);
    const [noteTotalPageCount, setNoteTotalPageCount] = useState(0);
    const [selectedNoteId, setSelectedNoteId] = useState(!noteUrlFactory.noteId ? -1 : parseInt(noteUrlFactory.noteId));
    const [componentIsLoading, setComponentIsLoading] = useState(true);
    const [noteExist, setNoteExist] = useState(true);    
    const [selectedArtifactType, setSelectedArtifactType] = useState(selectedType);
    const [isAdminForOntology, setIsAdminForOntology] = useState(false);
    const [numberOfPinned, setNumberOfPinned] = useState(0);
    const [onlyOntologyOriginalNotes, setOnlyOntologyOriginalNotes] = useState(noteUrlFactory.originalNotes === "true" ? true : false);
        


    function loadComponent(){                        
        if(selectedNoteId !== -1){            
            setShowNoteDetailPage(true);
            setComponentIsLoading(false);                        
        }
        else{
            loadNoteList();
        }
        
        return true;
    }


    function loadNoteList(){             
        let ontologyId = ontologyPageContext.ontology.ontologyId;
        let type = TYPES_VALUES[selectedArtifactType];
                        
        if(type === TYPES_VALUES[ALL_TYPE]){
            type = null;
        }

        getNoteList({ontologyId:ontologyId, type:type, pageNumber:pageNumber, pageSize:pageSize, targetTerm:props.term, onlyOntologyOriginalNotes:onlyOntologyOriginalNotes})
        .then((notes) => {
            let allNotes = notes['notes'];
            let noteStats = notes['stats'];                                  
            setNoteList(allNotes);
            setShowNoteDetailPage(false);
            setNoteTotalPageCount(noteStats['totalPageCount']);     
            setNumberOfPinned(noteStats['number_of_pinned']);            
            setComponentIsLoading(false);  
        });

    }


    async function checkIsOntologyAdmin(){        
        let callHeaders = getTsPluginHeaders({withAccessToken: true});
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/admin/is_entity_admin'; 
        let formData = new FormData();
        formData.append("ontologyId", ontologyPageContext.ontology.ontologyId);
        let postConfig = {method: 'POST',  headers:callHeaders, body: formData};        
        try{
            let result = await fetch(url, postConfig);
            result = await result.json();
            result = result['_result']['is_admin'];
            result ? setIsAdminForOntology(true) : setIsAdminForOntology(false);
        }
        catch (e){            
            setIsAdminForOntology(false);
        }
    }



    function selectNote(e){
        let noteId = e.target.attributes.value.nodeValue;       
        setShowNoteDetailPage(true);
        setSelectedNoteId(noteId);
        setNoteSubmited(false);             
    }


    function artifactDropDownHandler(e){     
        setSelectedArtifactType(e.target.value);
        setPageNumber(DEFAULT_PAGE_NUMBER);
        setPageSize(DEFAULT_PAGE_SIZE);
        setNoteSubmited(false);          
    }


    function handlePagination (value) {        
        setPageNumber(value);              
    }


    function setNoteCreationResultStatus(newNoteId=false){           
        let success = false;
        if(newNoteId){                               
            setSelectedNoteId(newNoteId);                        
            noteUrlFactory.setNoteId({noteId:newNoteId}); 
            success = true;
        }

        setNoteSubmited(true);
        setNoteSubmitSeccuess(success);        
        setTimeout(() => {
            setNoteSubmited(false);            
        }, 5000);        
    }


    function backToListClick(){
        setSelectedNoteId(-1);
        setShowNoteDetailPage(false);
        setNoteSubmited(false);             
    }


    function handleOntologyOriginalNotesCheckbox(e){          
        setOnlyOntologyOriginalNotes(e.target.checked);
    }



    useEffect(() => {
        loadComponent();
        checkIsOntologyAdmin();        
    }, []);


    useEffect(() => {      
        setComponentIsLoading(true);   
        noteUrlFactory.update({
            page:pageNumber, 
            size:pageSize, 
            originalNotes:onlyOntologyOriginalNotes, 
            noteType:TYPES_VALUES[selectedArtifactType]
        });
        loadComponent();              
        
    }, [pageNumber, pageSize, selectedArtifactType, showNoteDetailPage, noteSubmited, onlyOntologyOriginalNotes, props.term]);



    if(process.env.REACT_APP_NOTE_FEATURE !== "true"){            
        return null;
    }
    else{
        const noteContextData = {
            isAdminForOntology: isAdminForOntology,
            numberOfPinned: numberOfPinned,
            setNumberOfPinned: setNumberOfPinned,
            selectedTermTypeInTree: props.termType,
            selectedTermInTree: props.term,
            noteSelectHandler: selectNote,
            setNoteCreationResultStatus: setNoteCreationResultStatus,
            selectedNoteId: selectedNoteId
        };

        return(
            <NoteContext.Provider value={noteContextData}>
                <NoteListRender 
                    noteSubmited={noteSubmited}
                    noteSubmitSeccuess={noteSubmitSeccuess}
                    noteDetailPage={showNoteDetailPage}
                    componentIsLoading={componentIsLoading}
                    onlyOntologyOriginalNotes={onlyOntologyOriginalNotes}                                                              
                    selectedArtifactType={selectedArtifactType}
                    noteExist={noteExist}
                    noteTotalPageCount={noteTotalPageCount}
                    noteListPage={pageNumber}                    
                    notesList={noteList}                    
                    artifactDropDownHandler={artifactDropDownHandler}
                    handlePagination={handlePagination}                    
                    backToListHandler={backToListClick}
                    setNoteExistState={setNoteExist}                    
                    handleOntologyOriginalNotesCheckbox={handleOntologyOriginalNotesCheckbox}
                />
            </NoteContext.Provider>
        );
    }
}


NoteList.propTypes = {
    term: PropTypes.string.isRequired,
    termType: PropTypes.string.isRequired
}


export default NoteList;