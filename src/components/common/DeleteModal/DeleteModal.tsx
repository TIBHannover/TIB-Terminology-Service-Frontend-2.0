import {useState} from "react";
import AlertBox from "../Alerts/Alerts";


type DeleteModalButtonProps = {
    btnText?: string,
    btnClass?: string,
    modalId: string
}


export const DeleteModalBtn = (props:DeleteModalButtonProps) => {
    const {btnClass, modalId, btnText} = props;
    return (
        <button type="button" 
                className={"btn btn-danger btn-sm btn-delete-note borderless-btn " + btnClass}
                data-toggle="modal" 
                data-target={"#deleteModal" + modalId}
                data-backdrop="static"
                >
                {btnText ? btnText : "Delete"}
        </button>
    );
}




type DeleteModalProps = {
    modalId: string,
    deleteEndpoint: string,
    formData: any,
    callHeaders: HeadersInit,
    afterDeleteProcess?: Function,
    objectToDelete?: object,
    afterDeleteRedirectUrl: string,
    method?: string

}

export const DeleteModal = (props:DeleteModalProps) => {
    const { modalId, deleteEndpoint, formData, callHeaders, afterDeleteProcess, afterDeleteRedirectUrl, objectToDelete, method } = props;
    const [submited, setSubmited] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);       
    
    const deleteResource = async () => {
        try{
            let postConfig:RequestInit = {method: 'POST',  headers:callHeaders, body: formData};
            if(method === "DELETE"){
                postConfig = {method: 'DELETE',  headers:callHeaders};
            }
            
            let result = await fetch(deleteEndpoint, postConfig);
            setSubmited(true);            
            setDeleteSuccess(result.ok)
            if(afterDeleteProcess && objectToDelete){
                afterDeleteProcess(objectToDelete);
            } 
            else if(afterDeleteProcess){
                afterDeleteProcess();
            } 
        }
        catch(e){
            setSubmited(true);
            setDeleteSuccess(false);
        }
    }


    const redirectAfterDelete = () => {              
        window.location.replace(afterDeleteRedirectUrl);
    }



    return (
        <div>            
            <div className="modal fade" id={"deleteModal" + modalId} tabIndex={-1} role="dialog" aria-labelledby={"deleteModalLabel" + modalId} aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={"deleteModalLabel" + modalId}>Confirmation</h5>
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