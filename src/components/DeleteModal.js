import React from 'react'

const DeleteModal = ({deleteHandler = () => {}, additionalText}) => {
    return (
        <div
            className="modal fade"
            tabIndex="-1"
            id="modal"
            role="dialog"
            data-backdrop="static"
            aria-hidden="true"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title text-danger">Warning!</h2>
                    </div>
                    <div className="modal-body py-3">
                        <p className="font-weight-bold text">
                            Are you really sure want to delete this item? {additionalText ? additionalText : null}
                        </p>
                        <p>(Note: You cannot undo this action)</p>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-dismiss="modal"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            data-dismiss="modal"
                            onClick={deleteHandler}
                        >
                            Delete Permanently
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal;
