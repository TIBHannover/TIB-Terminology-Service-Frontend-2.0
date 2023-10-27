import {React, useState} from "react";
import AlertBox from "../Alerts/Alerts";


export const DeleteModalBtn = (props) => {
    return (
        <button type="button" 
                class="btn btn-danger btn-sm btn-delete-note borderless-btn" 
                data-toggle="modal" 
                data-target={"#deleteModal" + props.modalId}
                data-backdrop="static"
                >
                Delete
        </button>
    );
}



export const DeleteModal = (props) => {
    const [submited, setSubmited] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);       
    
    const deleteResource = async () => {
        try{
            let postConfig = {method: 'POST',  headers:props.callHeaders, body: props.formData};                        
            let result = await fetch(props.deleteEndpoint, postConfig);
            setSubmited(true);
            setDeleteSuccess(result.ok)
        }
        catch(e){
            setSubmited(true);
            setDeleteSuccess(false);
        }
    }


    const redirectAfterDelete = () => {
        window.location.replace(props.afterDeleteRedirectUrl);
    }



    return (
        <div>            
            <div class="modal fade" id={"deleteModal" + props.modalId} tabindex="-1" role="dialog" aria-labelledby={"deleteModalLabel" + props.modalId} aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id={"deleteModalLabel" + props.modalId}>Confirmation</h5>
                            {!submited && 
                                <button type="button" class="close close-btn-message-modal" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            }
                        </div>
                        <div class="modal-body">
                            {!submited && 
                                <span>
                                    Are you sure you want to delete this item? 
                                    <br></br>
                                    <strong>This action is not reversible.</strong>
                                </span>                                
                            }
                            {submited && deleteSuccess &&
                                <AlertBox 
                                    type="success"
                                    message="Deleted successfully!"
                                    alertColumnClass="col-sm-12"                                    
                                />                                
                            }
                            {submited && !deleteSuccess &&
                                <AlertBox
                                    type="danger" 
                                    message="Something went wrong. Please try again!"
                                    alertColumnClass="col-sm-12"
                                />                                 
                            }
                        </div>
                        <div class="modal-footer justify-content-center">                            
                            {!submited && <button type="button" class="btn btn-secondary" onClick={deleteResource}>Delete</button>}
                            {submited && <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={redirectAfterDelete}>Close</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteModalBtn;