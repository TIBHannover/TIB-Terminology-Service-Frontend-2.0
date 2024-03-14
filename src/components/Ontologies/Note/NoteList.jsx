import {useEffect, useState, useContext} from "react";
import { useHistory } from "react-router";
import AuthTool from "../../User/Login/authTools";
import Toolkit from "../../../Libs/Toolkit";
import { NoteListRender } from "./renders/NoteListRender";
import { getNoteList } from "../../../api/tsMicroBackendCalls";
import { OntologyPageContext } from "../../../context/OntologyPageContext";
import { NoteContext } from "../../../context/NoteContext";




const ALL_TYPE = 0
const TYPES_VALUES = ['all', 'ontology', 'class', 'property', 'individual']
const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_SIZE = 10




const NoteList = (props) => {
    let currentUrlParams = new URL(window.location).searchParams;                      
    let page = currentUrlParams.get('page') ? currentUrlParams.get('page') : DEFAULT_PAGE_NUMBER;
    let size = currentUrlParams.get('size') ? currentUrlParams.get('size') : DEFAULT_PAGE_SIZE;
    let originalNotes = currentUrlParams.get('originalNotes') === "true" ? true : false;     
    let selectedType = TYPES_VALUES.indexOf(props.termType);
    if(selectedType < 0){
        selectedType = currentUrlParams.get('type') ? TYPES_VALUES.indexOf(currentUrlParams.get('type')) : ALL_TYPE
    }        
        
    let inputNoteIdFromUrl = currentUrlParams.get('noteId'); 
    inputNoteIdFromUrl = !inputNoteIdFromUrl ? -1 : parseInt(inputNoteIdFromUrl);


    const ontologyPageContext = useContext(OntologyPageContext);

    const [noteList, setNoteList] = useState([]);
    const [showNoteDetailPage, setShowNoteDetailPage] = useState(false);
    const [noteSubmited, setNoteSubmited] = useState(false);
    const [noteSubmitSeccuess, setNoteSubmitSeccuess] = useState(false);
    const [pageNumber, setPageNumber] = useState(parseInt(page));
    const [pageSize, setPageSize] = useState(size);
    const [noteTotalPageCount, setNoteTotalPageCount] = useState(0);
    const [selectedNoteId, setSelectedNoteId] = useState(inputNoteIdFromUrl);
    const [componentIsLoading, setComponentIsLoading] = useState(true);
    const [noteExist, setNoteExist] = useState(true);    
    const [selectedArtifactType, setSelectedArtifactType] = useState(selectedType);
    const [isAdminForOntology, setIsAdminForOntology] = useState(false);
    const [numberOfPinned, setNumberOfPinned] = useState(0);
    const [onlyOntologyOriginalNotes, setOnlyOntologyOriginalNotes] = useState(originalNotes);

    const history = useHistory();


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


    async function checkIsAdmin(){        
        let callHeaders = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});  
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
            let newUrl = Toolkit.setParamInUrl('noteId', newNoteId);
            setSelectedNoteId(newNoteId);            
            history.push(newUrl);
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


    function updateURL(){
        let currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set('type', TYPES_VALUES[selectedArtifactType]);
        currentUrlParams.set('page', pageNumber);
        currentUrlParams.set('size', pageSize);
        currentUrlParams.set('originalNotes', onlyOntologyOriginalNotes);
        history.push(window.location.pathname + "?" + currentUrlParams.toString());                
    }


    useEffect(() => {
        loadComponent();
        checkIsAdmin();
    }, []);


    useEffect(() => {      
        setComponentIsLoading(true);   
        updateURL();
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


export default NoteList;