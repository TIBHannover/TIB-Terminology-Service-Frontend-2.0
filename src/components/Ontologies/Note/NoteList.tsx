import { useEffect, useState, useContext } from "react";
import { NoteListRender } from "./renders/NoteListRender";
import { getNoteList } from "../../../api/note";
import { OntologyPageContext } from "../../../context/OntologyPageContext";
import { NoteContext } from "../../../context/NoteContext";
import NoteUrlFactory from "../../../UrlFactory/NoteUrlFactory";
import { getTsPluginHeaders } from "../../../api/header";
import { getTourProfile } from "../../../tours/controller";
import type { NoteListResponse } from "../../../api/types/noteTypes";
import type {
  InputChangeEvent,
  Note,
  NoteListProps,
  NoteSelectEvent,
  SelectChangeEvent,
} from "./types";

const ALL_TYPE = 0;
const TYPES_VALUES = ["all", "ontology", "class", "property", "individual"];
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const NoteProvider = NoteContext.Provider as any;

const NoteList = (props: NoteListProps) => {
  /* 
      This component is responsible for rendering the list of notes for the ontology.
      It uses the NoteUrlFactory to get the selected note type, page number and note id from the url.
      It requires the ontologyPageContext to get the ontology information.
      It uses the NoteContext to pass the note information to the child components.        
  */

  const ontologyPageContext = useContext(OntologyPageContext);

  const noteUrlFactory = new NoteUrlFactory();

  let selectedType = TYPES_VALUES.indexOf(props.termType ?? "");
  if (selectedType < 0) {
    selectedType = noteUrlFactory.noteType
      ? TYPES_VALUES.indexOf(noteUrlFactory.noteType)
      : ALL_TYPE;
  }

  const [noteList, setNoteList] = useState<Note[]>([]);
  const [showNoteDetailPage, setShowNoteDetailPage] = useState(false);
  const [noteSubmited, setNoteSubmited] = useState(false);
  const [noteSubmitSeccuess, setNoteSubmitSeccuess] = useState(false);
  const [pageNumber, setPageNumber] = useState(
    parseInt(
      String(noteUrlFactory.page ? noteUrlFactory.page : DEFAULT_PAGE_NUMBER),
    ),
  );
  const [pageSize, setPageSize] = useState<number | string>(
    noteUrlFactory.size ? noteUrlFactory.size : DEFAULT_PAGE_SIZE,
  );
  const [noteTotalPageCount, setNoteTotalPageCount] = useState(0);
  const [selectedNoteId, setSelectedNoteId] = useState(
    !noteUrlFactory.noteId ? -1 : parseInt(noteUrlFactory.noteId),
  );
  const [selectedNote, setSelectedNote] = useState<
    Note | Record<string, never>
  >({});
  const [componentIsLoading, setComponentIsLoading] = useState(true);
  const [noteExist, setNoteExist] = useState(true);
  const [selectedArtifactType, setSelectedArtifactType] = useState<
    number | string
  >(selectedType);
  const [isAdminForOntology, setIsAdminForOntology] = useState(false);
  const [numberOfPinned, setNumberOfPinned] = useState(0);
  const [onlyOntologyOriginalNotes, setOnlyOntologyOriginalNotes] = useState(
    noteUrlFactory.originalNotes === "true" ? true : false,
  );

  function loadComponent() {
    if (selectedNoteId !== -1) {
      setShowNoteDetailPage(true);
      setComponentIsLoading(false);
    } else {
      loadNoteList();
    }

    return true;
  }

  function loadNoteList() {
    let ontologyId = ontologyPageContext.ontology.ontologyId;
    let type: string | null = TYPES_VALUES[Number(selectedArtifactType)];

    if (type === TYPES_VALUES[ALL_TYPE]) {
      type = null;
    }

    getNoteList({
      ontologyId: ontologyId,
      type: type ?? undefined,
      pageNumber: pageNumber,
      pageSize: pageSize,
      targetTerm: props.term,
      onlyOntologyOriginalNotes: onlyOntologyOriginalNotes,
    }).then((notes: NoteListResponse | null) => {
      if (notes) {
        let allNotes = notes.notes;
        let noteStats = notes.stats;
        setNoteList(allNotes);
        setShowNoteDetailPage(false);
        setNoteTotalPageCount(Number(noteStats.totalPageCount ?? 0));
        setNumberOfPinned(Number(noteStats.number_of_pinned ?? 0));
        setComponentIsLoading(false);
      }
    });
  }

  async function checkIsOntologyAdmin() {
    let callHeaders = getTsPluginHeaders({ withAccessToken: true });
    let url =
      process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/admin/is_entity_admin/";
    let formData: Record<string, string> = {};
    formData["ontologyId"] = ontologyPageContext.ontology.ontologyId;
    let postConfig = {
      method: "POST",
      headers: callHeaders,
      body: JSON.stringify(formData),
    };
    try {
      let result: any = await fetch(url, postConfig);
      result = await result.json();
      result = result["_result"]["is_admin"];
      result ? setIsAdminForOntology(true) : setIsAdminForOntology(false);
    } catch (e) {
      setIsAdminForOntology(false);
    }
  }

  function selectNote(e: NoteSelectEvent) {
    let noteId =
      (e.currentTarget as HTMLElement).getAttribute("value") ??
      (e.currentTarget as HTMLElement).getAttribute("data-value") ??
      "-1";
    setShowNoteDetailPage(true);
    setSelectedNoteId(parseInt(noteId));
    setNoteSubmited(false);
  }

  function artifactDropDownHandler(e: SelectChangeEvent) {
    setSelectedArtifactType(e.target.value);
    setPageNumber(DEFAULT_PAGE_NUMBER);
    setPageSize(DEFAULT_PAGE_SIZE);
    setNoteSubmited(false);
  }

  function handlePagination(value: number) {
    setPageNumber(value);
  }

  function setNoteCreationResultStatus(newNoteId: string | boolean = false) {
    let success = false;
    if (newNoteId) {
      setSelectedNoteId(parseInt(String(newNoteId)));
      noteUrlFactory.setNoteId({ noteId: String(newNoteId) });
      success = true;
    }

    setNoteSubmited(true);
    setNoteSubmitSeccuess(success);
    setTimeout(() => {
      setNoteSubmited(false);
    }, 5000);
  }

  function backToListClick() {
    setSelectedNoteId(-1);
    setShowNoteDetailPage(false);
    setNoteSubmited(false);
  }

  function handleOntologyOriginalNotesCheckbox(e: InputChangeEvent) {
    setOnlyOntologyOriginalNotes(e.target.checked);
  }

  useEffect(() => {
    loadComponent();
    checkIsOntologyAdmin();
    let tourP = getTourProfile();
    if (!tourP.ontoNotesPage && process.env.REACT_APP_SITE_TOUR === "true") {
      if (document.getElementById("tour-trigger-btn")) {
        document.getElementById("tour-trigger-btn")?.click();
      }
    }
  }, []);

  useEffect(() => {
    setComponentIsLoading(true);
    noteUrlFactory.update({
      page: pageNumber,
      size: pageSize,
      originalNotes: onlyOntologyOriginalNotes,
      noteType: TYPES_VALUES[Number(selectedArtifactType)],
    });
    loadComponent();
  }, [
    pageNumber,
    pageSize,
    selectedArtifactType,
    showNoteDetailPage,
    noteSubmited,
    onlyOntologyOriginalNotes,
    props.term,
  ]);

  if (process.env.REACT_APP_NOTE_FEATURE !== "true") {
    return null;
  }

  const noteContextData = {
    isAdminForOntology: isAdminForOntology,
    numberOfPinned: numberOfPinned,
    setNumberOfPinned: setNumberOfPinned,
    selectedTermTypeInTree: props.termType,
    selectedTermInTree: props.term,
    noteSelectHandler: selectNote,
    setNoteCreationResultStatus: setNoteCreationResultStatus,
    selectedNoteId: selectedNoteId,
    selectedNote: selectedNote,
    setSelectedNote: setSelectedNote,
  };

  return (
    <NoteProvider value={noteContextData}>
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
        handleOntologyOriginalNotesCheckbox={
          handleOntologyOriginalNotesCheckbox
        }
      />
    </NoteProvider>
  );
};

export default NoteList;
