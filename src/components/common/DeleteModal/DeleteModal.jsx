import {React, useState} from "react";


export const DeleteModalBtn = (props) => {
    return (
        <button type="button" 
                class="btn btn-danger btn-sm btn-delete-note borderless-btn" 
                data-toggle="modal" 
                data-target={"#deleteModal" + props.modalId}
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



    return (
        <div>            
            <div class="modal fade" id={"deleteModal" + props.modalId} tabindex="-1" role="dialog" aria-labelledby={"deleteModalLabel" + props.modalId} aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id={"deleteModalLabel" + props.modalId}>Confirmation</h5>
                            <button type="button" class="close close-btn-message-modal" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
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
                                <div className="row text-center">
                                    <div className="col-sm-8">                                    
                                        <div class="alert alert-success">
                                            Deleted successfully!                           
                                        </div>                        
                                    </div>
                                </div>
                            }
                            {submited && !deleteSuccess &&
                                <div className="row text-center">
                                    <div className="col-sm-8">
                                        <div class="alert alert-danger">
                                            Something went wrong. Please try again!
                                        </div>  
                                    </div>
                                </div>  
                            }
                        </div>
                        <div class="modal-footer justify-content-center">                            
                            {!submited && <button type="button" class="btn btn-danger" onClick={deleteResource}>Delete</button>}
                            {submited && <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteModalBtn;