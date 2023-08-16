import React from "react";



const DeleteModal = (props) => {
    return (
        <div>
            <button type="button" 
                class="btn btn-danger btn-sm btn-delete-note borderless-btn" 
                data-toggle="modal" 
                data-target={"#deleteModal" + props.modalId}
                >
                Delete
            </button>
            <div class="modal fade" id={"deleteModal" + props.modalId} tabindex="-1" role="dialog" aria-labelledby={"deleteModalLabel" + props.modalId} aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id={"deleteModalLabel" + props.modalId}>Confirmation</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete this item? 
                        <strong>This action is not reversible.</strong>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger">Delete</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;