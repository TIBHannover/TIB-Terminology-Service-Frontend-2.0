import { useState } from "react";



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


export const PinnModalBtn = (props) => {

    if(!props.isAdminForOntology){
        return "";
    }

    return (
        <button type="button" 
                class="btn btn-sm borderless-btn note-action-menu-btn" 
                data-toggle="modal" 
                data-target={"#pinModal" + props.modalId}
                data-backdrop="static"
                >
                {props.note['pinned'] ? "Unpin" : "Pin"}                 
        </button>
    );
    
} 



export const PinnModal = (props) => {
    const [submited, setSubmited] = useState(false);
    const [pinnedSuccess, setPinnedSuccess] = useState(false);

    let formData = new FormData();
    formData.append("ontology", props.note['ontology_id']);
    formData.append("note_id", props.note['id']);
    formData.append("pinned", !Boolean(props.note['pinned']));    
    
    let pinnUrl = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/update_pin';  
    
    async function pinNote(){
        try{
            let postConfig = {method: 'POST',  headers:props.callHeaders, body: formData};                        
            let result = await fetch(pinnUrl, postConfig);
            setSubmited(true);
            setPinnedSuccess(result.ok)
            redirectAfterPin();
        }
        catch(e){
            setSubmited(true);
            setPinnedSuccess(false);
            redirectAfterPin();
        }
    }


    const redirectAfterPin = () => {
        window.location.replace(window.location.href);
    }



    return (
        <div>            
            <div class="modal fade" id={"pinModal" + props.modalId} tabindex="-1" role="dialog" aria-labelledby={"pinModalLabel" + props.modalId} aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id={"pinModalLabel" + props.modalId}>Confirmation</h5>
                            {!submited && 
                                <button type="button" class="close close-btn-message-modal" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            }
                        </div>
                        <div class="modal-body">
                            {!submited && 
                                <span>
                                    Are you sure you want to {props.note['pinned'] ? "Unpin" : "Pin"} this note?                                     
                                </span>                                
                            }                            
                        </div>
                        <div class="modal-footer justify-content-center">                            
                            {!submited && <button type="button" class="btn btn-secondary" onClick={pinNote}>
                                {props.note['pinned'] ? "Unpin" : "Pin"}
                            </button>}
                            {/* {submited && <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={redirectAfterDelete}>Close</button>} */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
