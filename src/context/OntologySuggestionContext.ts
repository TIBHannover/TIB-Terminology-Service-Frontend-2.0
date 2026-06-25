import { createContext } from "react";

type OntologySuggestionContextData = {
  [key: string]: any;
  editorState: any;
  form: Record<string, any>;
  setForm: (form: any) => void;
  onTextEditorChange: (editorState: any) => void;
  validationResult: { error: any[]; info: any[] };
  validationResults: { error: any[]; info: any[] };
};

const blueprint: OntologySuggestionContextData = {
  editorState: null,
  form: {
    username: "",
    email: "",
    reason: "",
    name: "",
    purl: "",
    ontologyFile: "",
  },
  setForm: () => {},
  onTextEditorChange: () => {},
  validationResult: { error: [], info: [] },
  validationResults: { error: [], info: [] },
};

export const OntologySuggestionContext = createContext(blueprint);
