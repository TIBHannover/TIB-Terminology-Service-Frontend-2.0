

export function buildNoteAboutPart(note){
    let url = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + note['ontology_id'];
    let label = "";
    if (note['semantic_component_type'] === "ontology"){
        label = note['ontology_id'];
    }
    else if (note['semantic_component_type'] === "class"){
        url += ('/terms?iri=' + encodeURIComponent(note['semantic_component_iri']))
        label = note['semantic_component_label'];
    }
    else if (note['semantic_component_type'] === "property"){
        url += ('/props?iri=' + encodeURIComponent(note['semantic_component_iri']))
        label = note['semantic_component_label'];
    }
    else{
        url += ('/individuals?iri=' + encodeURIComponent(note['semantic_component_iri']))
        label = note['semantic_component_label'];
    }

    return (
        <a  href={url} target="_blank">
            <b>{label}</b>
        </a>
    );
}
