import { useEffect, useState, useContext } from "react";
import * as constantsVars from "./Constants";
import { submitNote } from "../../../api/note";
import { NoteCreationRender } from "./renders/NoteCreationRender";
import TermApi from "../../../api/term";
import { OntologyPageContext } from "../../../context/OntologyPageContext";
import { AppContext } from "../../../context/AppContext";
import { NoteContext } from "../../../context/NoteContext";
import FormLib from "../../../Libs/FormLib";
import type {
  EditorStateValue,
  InputChangeEvent,
  NoteContextValue,
  NoteCreationProps,
  SelectChangeEvent,
  SelectedTerm,
} from "./types";

const NoteCreation = (props: NoteCreationProps) => {
  /* 
      This component is responsible for rendering the note creation form.
      It uses the AppContext to get the user information.
      It uses the NoteContext.

  */

  const noteContext = useContext(NoteContext) as unknown as NoteContextValue;
  const appContext = useContext(AppContext);
  const ontologyPageContext = useContext(OntologyPageContext);
  let targetType = constantsVars.NOTE_COMPONENT_VALUES.indexOf(
    noteContext.selectedTermTypeInTree ?? "ontology",
  );
  targetType = targetType !== -1 ? targetType : 1;
  let selectedTerm = noteContext.selectedTermInTree
    ? {
        iri: noteContext.selectedTermInTree["iri"],
        label: noteContext.selectedTermInTree["label"],
      }
    : { iri: null, label: null };

  const [targetArtifactType, setTargetArtifactType] = useState<number | string>(
    targetType,
  );
  const [visibility, setVisibility] = useState<number | string>(
    constantsVars.VISIBILITY_ONLY_ME,
  );
  const [editorState, setEditorState] = useState<EditorStateValue>(null);
  const [selectedTermFromAutoComplete, setSelectedTermFromAutoComplete] =
    useState<SelectedTerm>(selectedTerm);
  const [parentOntology, setParentOntology] = useState<string | null>(null);
  const [publishToParent, setPublishToParent] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const noteIdForRender = "-add-note";

  function onTextInputChange() {
    const noteTitleElement = document.getElementById(
      "noteTitle" + noteIdForRender,
    ) as HTMLInputElement | null;
    if (noteTitleElement) {
      noteTitleElement.style.borderColor = "";
      setNoteTitle(noteTitleElement.value);
    }
  }

  function onTextAreaChange(newEditorState: EditorStateValue) {
    const editorElement = document.getElementsByClassName(
      "rdw-editor-main",
    )[0] as HTMLElement | undefined;
    if (editorElement) {
      editorElement.style.border = "";
    }
    setEditorState(newEditorState);
  }

  function changeArtifactType(e: SelectChangeEvent) {
    setTargetArtifactType(e.target.value);
    setParentOntology(null);
    setSelectedTermFromAutoComplete({ iri: null, label: null });
  }

  function changeVisibility(e: SelectChangeEvent) {
    setVisibility(e.target.value);
  }

  function closeModal(newNoteId: boolean | string | object = true) {
    setEditorState(null);
    setSelectedTermFromAutoComplete({ iri: null, label: null });
    setParentOntology(null);
  }

  function submit() {
    let formIsValid = true;
    let noteTitle = FormLib.getFieldByIdIfValid("noteTitle" + noteIdForRender);
    let selectedTargetTermIri = selectedTermFromAutoComplete["iri"];
    let selectedTargetTermLabel = selectedTermFromAutoComplete["label"];
    let noteContent = FormLib.getTextEditorValueIfValid(
      editorState as object,
      "noteContent" + noteIdForRender,
    );
    formIsValid = Boolean(noteTitle && noteContent);

    if (
      parseInt(String(targetArtifactType)) !==
        constantsVars.ONTOLOGY_COMPONENT_ID &&
      !selectedTargetTermIri
    ) {
      const autoSuggestInput = document
        .getElementById("edit-note-modal" + noteIdForRender)
        ?.getElementsByClassName("react-autosuggest__input")[0] as
        | HTMLElement
        | undefined;
      if (autoSuggestInput) {
        autoSuggestInput.style.border = "1px solid red";
      }
      formIsValid = false;
    }

    if (!formIsValid) {
      return;
    }

    if (
      parseInt(String(targetArtifactType)) ===
      constantsVars.ONTOLOGY_COMPONENT_ID
    ) {
      selectedTargetTermIri = ontologyPageContext.ontology.ontologyId;
      selectedTargetTermLabel = ontologyPageContext.ontology.ontologyId;
    }

    let targetType =
      constantsVars.NOTE_COMPONENT_VALUES[Number(targetArtifactType)];

    if (noteContext.selectedTermInTree) {
      // Note creation for an specific term in from term detail tabel
      selectedTargetTermIri = noteContext.selectedTermInTree["iri"];
      selectedTargetTermLabel = noteContext.selectedTermInTree["label"];
      targetType = noteContext.selectedTermTypeInTree ?? targetType;
    }
    let data: any = {};
    data["title"] = noteTitle;
    data["semantic_component_iri"] = selectedTargetTermIri;
    data["semantic_component_label"] = selectedTargetTermLabel;
    data["content"] = noteContent;
    data["ontology_id"] = ontologyPageContext.ontology.ontologyId;
    data["semantic_component_type"] = targetType;
    data["visibility"] = constantsVars.VISIBILITY_VALUES[Number(visibility)];
    if (publishToParent && parentOntology) {
      data["parentOntology"] = parentOntology;
    }
    submitNote(data).then((newNoteId) => {
      noteContext.setNoteCreationResultStatus(newNoteId);
      closeModal(newNoteId);
    });
  }

  async function handleJumtoSelection(selectedTerm: SelectedTerm | null) {
    if (selectedTerm) {
      const autoSuggestInput = document
        .getElementById("edit-note-modal" + noteIdForRender)
        ?.getElementsByClassName("react-autosuggest__input")[0] as
        | HTMLElement
        | undefined;
      if (autoSuggestInput) {
        autoSuggestInput.style.border = "";
      }
      let termApi = new TermApi(
        ontologyPageContext.ontology.ontologyId,
        selectedTerm["iri"] ?? undefined,
        constantsVars.TERM_TYPES[Number(targetArtifactType)],
      );
      let tsTerm = await termApi.fetchTerm();
      setSelectedTermFromAutoComplete(selectedTerm);
      setParentOntology(tsTerm?.originalOntology ?? null);
    }
  }

  function handlePublishToParentCheckbox(e: InputChangeEvent) {
    setPublishToParent(e.target.checked);
  }

  useEffect(() => {
    if (noteContext.selectedTermInTree) {
      let termApi = new TermApi(
        ontologyPageContext.ontology.ontologyId,
        noteContext.selectedTermInTree["iri"] ?? undefined,
        constantsVars.TERM_TYPES[Number(targetArtifactType)],
      );
      termApi.fetchTerm().then((tsTerm) => {
        setParentOntology(tsTerm?.originalOntology ?? null);
      });
    }
  }, [noteContext.selectedTermInTree]);

  if (process.env.REACT_APP_NOTE_FEATURE !== "true") {
    return null;
  }

  return (
    <NoteCreationRender
      key={"note-creation-render"}
      closeModal={closeModal}
      targetArtifact={targetArtifactType}
      changeArtifactType={changeArtifactType}
      visibility={visibility}
      changeVisibility={changeVisibility}
      noteTitle={noteTitle}
      onTextInputChange={onTextInputChange}
      editorState={editorState}
      onTextAreaChange={onTextAreaChange}
      submit={submit}
      targetNoteId={noteIdForRender}
      mode={"newNote"}
      handleJumtoSelection={handleJumtoSelection}
      componentIdentity={constantsVars.TERM_TYPES[Number(targetArtifactType)]}
      parentOntology={parentOntology}
      selectedTerm={selectedTermFromAutoComplete}
      handlePublishToParentCheckbox={handlePublishToParentCheckbox}
    />
  );
};

export default NoteCreation;
