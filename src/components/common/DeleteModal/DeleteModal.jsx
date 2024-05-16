import {useState} from "react";
import AlertBox from "../Alerts/Alerts";


export const DeleteModalBtn = (props) => {
    return (
        <button type="button" 
                className={"btn btn-danger btn-sm btn-delete-note borderless-btn " + props.btnClass}
                data-toggle="modal" 
                data-target={"#deleteModal" + props.modalId}
                data-backdrop="static"
                >
                {props.btnText ? props.btnText : "Delete"}
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
            if(props.afterDeleteProcess && props.objectToDelete){
                props.afterDeleteProcess(props.objectToDelete);
            } 
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
            <div className="modal fade" id={"deleteModal" + props.modalId} tabindex="-1" role="dialog" aria-labelledby={"deleteModalLabel" + props.modalId} aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={"deleteModalLabel" + props.modalId}>Confirmation</h5>
                            {!submited && 
                                <button type="button" className="close close-btn-message-modal" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            }
                        </div>
                        <div className="modal-body">
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
                        <div className="modal-footer justify-content-center">                            
                            {!submited && <button type="button" className="btn btn-secondary" onClick={deleteResource}>Delete</button>}
                            {submited && <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={redirectAfterDelete}>Close</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteModalBtn;