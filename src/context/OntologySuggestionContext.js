import { createContext } from "react";

const blueprint = {
    editorState: null,
    form: {
        "username": "",
        "email": "",
        "reason": "",        
        "name": "",
        "purl": "",        
        "ontologyFile": ""
    },
    setForm: () => {},
    onTextEditorChange: () => {},
    validationResults: {"error": [], "info": []},
}


export const OntologySuggestionContext = createContext(blueprint);