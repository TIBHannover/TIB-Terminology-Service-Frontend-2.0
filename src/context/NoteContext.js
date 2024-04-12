import { createContext } from "react";

const blueprint = {
    isAdminForOntology: false,
    numberOfPinned: 0,
    setNumberOfPinned: function setTheNUmberOfPinnedNotesForAnOntology(){/* set numberOfPinned */},
    selectedTermTypeInTree: "",
    selectedTermInTree: null,
    noteSelectHandler: function handleNoteSelectionInList(){},
    setNoteCreationResultStatus: function setNoteCreationResultStatusInNoteList(){},
    selectedNoteId: null
};


export const NoteContext = createContext(blueprint);
