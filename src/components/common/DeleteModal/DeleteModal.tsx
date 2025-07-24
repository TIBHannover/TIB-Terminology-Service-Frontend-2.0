import {useState} from "react";
import AlertBox from "../Alerts/Alerts";
import Modal from "react-bootstrap/Modal";


type DeleteModalButtonProps = {
    btnText?: string,
    btnClass?: string,
    setShowModal: (show: boolean) => void,
}


export const DeleteModalBtn = (props: DeleteModalButtonProps) => {
    const {btnClass, btnText, setShowModal} = props;
    return (
        <button type="button"
                className={"btn btn-danger btn-sm btn-delete-note borderless-btn " + btnClass}
                onClick={() => setShowModal(true)}
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
    method?: string,
    btnText?: string,
    btnClass?: string,

}

export const DeleteModal = (props: DeleteModalProps) => {
    const {
        modalId,
        deleteEndpoint,
        formData,
        callHeaders,
        afterDeleteProcess,
        afterDeleteRedirectUrl,
        objectToDelete,
        method
    } = props;
    const [submited, setSubmited] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const deleteResource = async () => {
        try {
            let postConfig: RequestInit = {method: 'POST', headers: callHeaders, body: formData};
            if (method === "DELETE") {
                postConfig = {method: method, headers: callHeaders, body: formData};
            }

            let result = await fetch(deleteEndpoint, postConfig);
            setSubmited(true);
            setDeleteSuccess(result.ok)
            if (afterDeleteProcess && objectToDelete) {
                afterDeleteProcess(objectToDelete);
            } else if (afterDeleteProcess) {
                afterDeleteProcess();
            }
        } catch (e) {
            setSubmited(true);
            setDeleteSuccess(false);
        }
    }


    const redirectAfterDelete = () => {
        window.location.replace(afterDeleteRedirectUrl);
    }


    return (
        <div>
            <DeleteModalBtn setShowModal={setShowModal} btnText={props.btnText} btnClass={props.btnClass}/>
            <Modal show={showModal} id={"deleteModal" + modalId}>
                <Modal.Header className="row">
                    <div className="col-sm-6">
                        <h5 className="modal-title" id={"deleteModalLabel" + modalId}>Confirmation</h5>
                    </div>
                    <div className="col-sm-6 text-end">
                        {!submited &&
                          <button type="button" className="close close-btn-message-modal"
                                  onClick={() => setShowModal(false)}>
                            <span aria-hidden="true">&times;</span>
                          </button>
                        }
                    </div>
                </Modal.Header>
                <Modal.Body>
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
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    {!submited && <button type="button" className="btn btn-secondary"
                                          onClick={deleteResource}>Delete</button>}
                    {submited && <button type="button" className="btn btn-secondary" data-dismiss="modal"
                                         onClick={redirectAfterDelete}>Close</button>}
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default DeleteModalBtn;