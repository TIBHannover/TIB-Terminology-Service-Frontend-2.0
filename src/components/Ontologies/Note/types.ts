import type { ChangeEvent, MouseEvent, ReactNode } from "react";
import type { NoteData, CommentData } from "../../../api/types/noteTypes";
import type { TsTerm } from "../../../concepts";

export type Note = NoteData;

export type NoteComment = CommentData & {
  is_reported?: boolean;
  can_edit?: boolean;
};

export type SelectedTerm = Pick<TsTerm, "iri" | "label"> | {
  iri: string | null | undefined;
  label: string | null | undefined;
};

export type EditorStateValue = unknown;

export type SelectChangeEvent = ChangeEvent<HTMLSelectElement>;
export type InputChangeEvent = ChangeEvent<HTMLInputElement>;
export type ButtonClickEvent = MouseEvent<HTMLButtonElement>;
export type NoteSelectEvent = MouseEvent<HTMLElement>;
export type NoteContextValue = {
  isAdminForOntology: boolean;
  numberOfPinned: number;
  numberOfpinned?: number;
  setNumberOfPinned: (value: number | string) => void;
  selectedTermTypeInTree?: string;
  selectedTermInTree?: SelectedTerm | null;
  noteSelectHandler: (event: NoteSelectEvent) => void;
  setNoteCreationResultStatus: (newNoteId?: string | boolean | object) => void;
  selectedNoteId: number | string | null;
  selectedNote: Note | Record<string, never>;
  setSelectedNote: (note: Note) => void;
};

export type NoteCardProps = {
  note: Note;
};

export type NoteCardHeaderProps = {
  note: Note;
};

export type CommentCardProps = {
  comment: NoteComment;
  commentEditHandler: (event: ButtonClickEvent) => void;
};

export type CommentCardHeaderProps = {
  comment: NoteComment;
  editHandlerFunc: (event: ButtonClickEvent) => void;
};

export type PinnModalBtnProps = {
  note: Note;
  setShowModal: (showModal: boolean) => void;
};

export type PinnModalProps = {
  note: Note;
  modalId: string;
  callHeaders?: unknown;
};

export type NoteCreationProps = {
  targetArtifactType?: string;
};

export type NoteEditProps = {
  note: Note;
  term?: string;
};

export type NoteListProps = {
  termType?: string;
  term?: TsTerm;
};

export type NoteCommentListProps = {
  note: Note;
  noteDetailReloader: () => void;
};

export type NoteCreationRenderProps = {
  closeModal: (reloadPage?: boolean | string | object) => void;
  targetArtifact: number | string;
  term?: SelectedTerm;
  changeArtifactType: (event: SelectChangeEvent) => void;
  visibility: number | string;
  changeVisibility: (event: SelectChangeEvent) => void;
  ontologyId?: string;
  noteTitle: string;
  onTextInputChange: (event?: InputChangeEvent) => void;
  editorState: EditorStateValue;
  onTextAreaChange: (newEditorState: EditorStateValue) => void;
  submit: () => void;
  targetNoteId: string | number;
  mode?: "newNote";
  handleJumtoSelection: (selectedTerm: SelectedTerm | null) => Promise<void>;
  componentIdentity: string;
  parentOntology: string | null;
  selectedTerm: SelectedTerm;
  handlePublishToParentCheckbox: (event: InputChangeEvent) => void;
};

export type NoteDetailRenderProps = {
  note: Note;
  noteContent: string;
  reloadNoteDetail: () => void;
};

export type NoteCommentListRenderProps = {
  note: Note;
  handleEditButton: (event: ButtonClickEvent) => void;
  commentEditorState: EditorStateValue;
  onTextAreaChange: (newEditorState: EditorStateValue) => void;
  editMode: boolean;
  submitComment: () => void;
  edit: () => void;
  cancelEdit: () => void;
};

export type NoteListRenderProps = {
  noteSubmited: boolean;
  noteSubmitSeccuess: boolean;
  noteDetailPage: boolean;
  componentIsLoading: boolean;
  onlyOntologyOriginalNotes: boolean;
  selectedArtifactType: number | string;
  noteExist: boolean;
  noteTotalPageCount: number | string;
  noteListPage: number;
  notesList: Note[];
  artifactDropDownHandler: (event: SelectChangeEvent) => void;
  handlePagination: (value: number) => void;
  backToListHandler: () => void;
  setNoteExistState: (noteExists: boolean) => void;
  handleOntologyOriginalNotesCheckbox: (event: InputChangeEvent) => void;
};

export type RowContent = ReactNode | ReactNode[];
