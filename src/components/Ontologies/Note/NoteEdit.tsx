import { useEffect, useState, useContext } from "react";
import { createTextEditorStateFromJson } from "../../common/TextEditor/TextEditor";
import * as constantsVars from "./Constants";
import { submitNote } from "../../../api/note";
import { NoteCreationRender } from "./renders/NoteCreationRender";
import TermApi from "../../../api/term";
import { AppContext } from "../../../context/AppContext";
import { OntologyPageContext } from "../../../context/OntologyPageContext";
import FormLib from "../../../Libs/FormLib";
import type {
  EditorStateValue,
  InputChangeEvent,
  NoteEditProps,
  SelectChangeEvent,
  SelectedTerm,
} from "./types";

const NoteEdit = (props: NoteEditProps) => {
  /* 
      This component is responsible for rendering the note edit form.
      It uses the AppContext to get the user information.
      It uses the OntologyPageContext to get the ontology information.
      It uses the submitNote function to submit the note to the backend.
  */

  const appContext = useContext(AppContext);
  const ontologyPageContext = useContext(OntologyPageContext);

  const [targetArtifact, setTargetArtifact] = useState<number | string>(
    constantsVars.NOTE_COMPONENT_VALUES.indexOf(
      props.note.semantic_component_type ?? "",
    ),
  );
  const [visibility, setVisibility] = useState<number | string>(
    constantsVars.VISIBILITY_VALUES.indexOf(props.note.visibility),
  );
  const [editorState, setEditorState] = useState<EditorStateValue>(
    createTextEditorStateFromJson(props.note.content),
  );
  const [selectedTermFromAutoComplete, setSelectedTermFromAutoComplete] =
    useState<SelectedTerm>({
      iri: props.note.semantic_component_iri,
      label: props.note.semantic_component_label,
    });
  const [noteTitle, setNoteTitle] = useState(props.note.title);
  const [parentOntology, setParentOntology] = useState<string | null>(
    props.note.parent_ontology ? props.note.parent_ontology : null,
  );
  const [publishToParent, setPublishToParent] = useState(
    props.note.parent_ontology ? true : false,
  );

  function onTextInputChange(e?: InputChangeEvent) {
    const noteTitleElement = document.getElementById(
      "noteTitle" + props.note.id,
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
    setTargetArtifact(e.target.value);
  }

  function changeVisibility(e: SelectChangeEvent) {
    setVisibility(e.target.value);
  }

  function edit() {
    let formIsValid = true;
    let noteTitle = FormLib.getFieldByIdIfValid("noteTitle" + props.note.id);
    let selectedTargetTermIri = selectedTermFromAutoComplete["iri"];
    let selectedTargetTermLabel = selectedTermFromAutoComplete["label"];
    let noteContent = FormLib.getTextEditorValueIfValid(
      editorState as object,
      "noteContent" + props.note.id,
    );
    formIsValid = Boolean(noteTitle && noteContent);

    if (
      parseInt(String(targetArtifact)) !==
        constantsVars.ONTOLOGY_COMPONENT_ID &&
      !selectedTargetTermIri
    ) {
      const autoSuggestInput = document.getElementsByClassName(
        "react-autosuggest__input",
      )[0] as HTMLElement | undefined;
      if (autoSuggestInput) {
        autoSuggestInput.style.border = "1px solid red";
      }
      formIsValid = false;
    }

    if (!formIsValid) {
      return;
    }

    if (
      parseInt(String(targetArtifact)) === constantsVars.ONTOLOGY_COMPONENT_ID
    ) {
      selectedTargetTermIri = props.note.ontology_id;
      selectedTargetTermLabel = props.note.ontology_id;
    }

    let targetArtifactType =
      constantsVars.NOTE_COMPONENT_VALUES[Number(targetArtifact)];

    let data: any = {};
    data["noteId"] = props.note.id;
    data["title"] = noteTitle;
    data["semantic_component_iri"] = selectedTargetTermIri;
    data["content"] = noteContent;
    data["ontology_id"] = props.note.ontology_id;
    data["semantic_component_type"] = targetArtifactType;
    data["semantic_component_label"] = selectedTargetTermLabel;
    data["visibility"] = constantsVars.VISIBILITY_VALUES[Number(visibility)];
    if (publishToParent && parentOntology) {
      data["parentOntology"] = parentOntology;
    }
    submitNote(data, true).then((updatedNoteId) => {
      closeModal(true);
    });
  }

  function closeModal(reloadPage: boolean | string | object = false) {
    setEditorState(null);
    setSelectedTermFromAutoComplete({ iri: null, label: null });
    if (reloadPage) {
      let searchParams = new URLSearchParams(window.location.search);
      let locationObject = window.location;
      window.location.replace(
        locationObject.pathname + "?" + searchParams.toString(),
      );
    }
  }

  async function handleJumtoSelection(selectedTerm: SelectedTerm | null) {
    if (selectedTerm) {
      let termApi = new TermApi(
        ontologyPageContext.ontology.ontologyId,
        selectedTerm["iri"] ?? undefined,
        constantsVars.TERM_TYPES[Number(targetArtifact)],
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
    let termApi = new TermApi(
      props.note.ontology_id,
      props.note.semantic_component_iri,
      constantsVars.TERM_TYPES[Number(targetArtifact)],
    );
    termApi.fetchTerm().then((tsTerm) => {
      setParentOntology(tsTerm?.originalOntology ?? null);
      setSelectedTermFromAutoComplete({
        iri: props.note.semantic_component_iri,
        label: props.note.semantic_component_label,
      });
    });
  }, []);

  if (process.env.REACT_APP_NOTE_FEATURE !== "true") {
    return null;
  }
  if (!appContext.user) {
    return null;
  }

  return (
    <NoteCreationRender
      key={"note-edit-render-" + props.note.id}
      closeModal={closeModal}
      targetArtifact={targetArtifact}
      term={{
        iri: props.note.semantic_component_iri,
        label: props.note.semantic_component_label,
      }}
      changeArtifactType={changeArtifactType}
      visibility={visibility}
      changeVisibility={changeVisibility}
      ontologyId={props.note.ontology_id}
      noteTitle={noteTitle}
      onTextInputChange={onTextInputChange}
      editorState={editorState}
      onTextAreaChange={onTextAreaChange}
      submit={edit}
      targetNoteId={props.note.id}
      handleJumtoSelection={handleJumtoSelection}
      componentIdentity={constantsVars.TERM_TYPES[Number(targetArtifact)]}
      parentOntology={parentOntology}
      selectedTerm={selectedTermFromAutoComplete}
      handlePublishToParentCheckbox={handlePublishToParentCheckbox}
    />
  );
};

export default NoteEdit;
