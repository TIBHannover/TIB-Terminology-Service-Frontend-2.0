import {useEffect, useState} from "react";
import { useHistory } from "react-router";
import AuthTool from "../../User/Login/authTools";
import Toolkit from "../../common/Toolkit";
import {RenderNoteList} from "./renders/RenderNoteList";




const ALL_TYPE = 0
const TYPES_VALUES = ['all', 'ontology', 'class', 'property', 'individual']
const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_SIZE = 10




const NoteList = (props) => {
    let currentUrlParams = new URL(window.location).searchParams;                      
    let page = currentUrlParams.get('page') ? currentUrlParams.get('page') : DEFAULT_PAGE_NUMBER;
    let size = currentUrlParams.get('size') ? currentUrlParams.get('size') : DEFAULT_PAGE_SIZE; 
    let selectedType = currentUrlParams.get('type') ? currentUrlParams.get('type') : ALL_TYPE;
    selectedType = TYPES_VALUES.indexOf(selectedType) !== -1 ? TYPES_VALUES.indexOf(selectedType) : ALL_TYPE; 

    const [noteList, setNoteList] = useState([]);
    const [showNoteDetailPage, setShowNoteDetailPage] = useState(false);
    const [noteSubmited, setNoteSubmited] = useState(false);
    const [noteSubmitSeccuess, setNoteSubmitSeccuess] = useState(false);
    const [pageNumber, setPageNumber] = useState(parseInt(page));
    const [pageSize, setPageSize] = useState(size);
    const [noteTotalPageCount, setNoteTotalPageCount] = useState(0);
    const [selectedNoteId, setSelectedNoteId] = useState(-1);
    const [componentIsLoading, setComponentIsLoading] = useState(true);
    const [noteExist, setNoteExist] = useState(true);
    const [targetArtifactIri, setTargetArtifactIri] = useState(null);
    const [selectedArtifactType, setSelectedArtifactType] = useState(selectedType);

    const history = useHistory();


    function loadComponent(){        
        let url = new URL(window.location);     
        let inputNoteIdFromUrl = url.searchParams.get('noteId'); 
        let inputNoteId = !inputNoteIdFromUrl ? -1 : parseInt(inputNoteIdFromUrl);
        if(inputNoteId !== -1 && inputNoteId !== selectedNoteId){            
            setSelectedNoteId(inputNoteId);
            setShowNoteDetailPage(true);
            setComponentIsLoading(false);                        
        }
        else if(inputNoteId === -1){
            loadNoteList();
        }
        
        return true;
    }


    function loadNoteList(){
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});        
        let ontologyId = props.ontology.ontologyId;
        let type = TYPES_VALUES[selectedArtifactType];
        
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/notes_list?ontology=' + ontologyId;
        url += ('&page=' + pageNumber + '&size=' + pageSize)
        if(props.targetArtifactIri){
            url += ('&artifact_iri=' + props.targetArtifactIri)
        }
        if(type !== TYPES_VALUES[ALL_TYPE]){
            url += ('&artifact_type=' + type);
        }
                
        fetch(url, {headers:headers}).then((resp) => resp.json())
        .then((data) => {            
            let allNotes = data['_result']['notes'];
            let noteStats = data['_result']['stats'];                                  
            setNoteList(allNotes);
            setShowNoteDetailPage(false);
            setNoteTotalPageCount(noteStats['totalPageCount']);            
            setTargetArtifactIri(props.targetArtifactIri)
            setComponentIsLoading(false);            
        })        
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
        setComponentIsLoading(true);        
    }


    function handlePagination (value) {
        setPageNumber(value);
        setComponentIsLoading(true);        
    }


    function setNoteCreationResultStatus(newNoteId=false){           
        let success = false;
        if(newNoteId){            
            let newUrl = Toolkit.setParamInUrl('noteId', newNoteId);            
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
        setComponentIsLoading(true);           
    }


    function updateURL(){
        let currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set('type', TYPES_VALUES[selectedArtifactType]);
        currentUrlParams.set('page', pageNumber);
        currentUrlParams.set('size', pageSize);
        history.push(window.location.pathname + "?" + currentUrlParams.toString());                
    }


    useEffect(() => {
        loadComponent();
    }, []);


    useEffect(() => {        
        updateURL();
        loadComponent();        
        
    }, [pageNumber, pageSize, selectedArtifactType, showNoteDetailPage, noteSubmitSeccuess, noteSubmited, props.targetArtifactIri]);



    if(process.env.REACT_APP_NOTE_FEATURE !== "true"){            
        return null;
    }
    else{
        return(
            <RenderNoteList 
                noteSubmited={noteSubmited}
                noteSubmitSeccuess={noteSubmitSeccuess}
                noteDetailPage={showNoteDetailPage}
                componentIsLoading={componentIsLoading}
                targetArtifactType={props.targetArtifactType}
                targetArtifactLabel={props.targetArtifactLabel}
                targetArtifactIri={props.targetArtifactIri}
                ontologyId={props.ontology.ontologyId}
                isGeneric={props.isGeneric}
                selectedArtifactType={selectedArtifactType}
                noteExist={noteExist}
                noteTotalPageCount={noteTotalPageCount}
                noteListPage={pageNumber}
                selectedNoteId={selectedNoteId}
                notesList={noteList}
                noteSelectHandler={selectNote}
                artifactDropDownHandler={artifactDropDownHandler}
                handlePagination={handlePagination}
                setNoteCreationResultStatus={setNoteCreationResultStatus}
                backToListHandler={backToListClick}
                setNoteExistState={setNoteExist}
            />
        );
    }
}


export default NoteList;