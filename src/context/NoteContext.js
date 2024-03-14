import { createContext } from "react";

const blueprint = {
    isAdminForOntology: false,
    numberOfPinned: 0,
    setNumberOfPinned: function setTheNUmberOfPinnedNotesForAnOntology(){/* set numberOfPinned */},
    targetArtifactType: "",
    selectedTermInTree: null
};


export const NoteContext = createContext(blueprint);
