import { createContext } from "react";

const blueprint = {
    editorState: null,
    form: {
        "username": "",
        "email": "",
        "reason": "",
        "safeQestion": "",
        "safeAnswer": "",
        "name": "",
        "purl": "",
        "preferredPrefix": "",
        "uri": "",
        "licenseUrl": "",
        "licenseLabel": "",
        "title": "",
        "description": "",
        "creator": "",
        "homepage": "",
        "tracker": "",
        "ontologyFile": ""
    },
    setForm: () => {},
    onTextEditorChange: () => {},
}


export const OntologySuggestionContext = createContext(blueprint);