import React from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

const DeleteModal = ({
	deleteHandler = () => {},
	additionalText,
	toggle,
	setToggle = () => {},
}) => {
	return (
		<Modal isOpen={toggle}>
			<ModalHeader>
				<h2 className="modal-title text-danger">Warning!</h2>
			</ModalHeader>
			<ModalBody className="py-3">
				<p className="font-weight-bold text">
					Are you really sure want to delete this item?{' '}
					{additionalText}
				</p>
				<p>(Note: You cannot undo this action)</p>
			</ModalBody>
			<ModalFooter>
				<button
					type="button"
					className="btn btn-secondary"
					onClick={() => setToggle(false)}>
					Cancel
				</button>
				<button
					type="button"
					className="btn btn-danger"
					onClick={() => {
						deleteHandler();
						setToggle(false);
					}}>
					Delete Permanently
				</button>
			</ModalFooter>
		</Modal>
	);
};

export default DeleteModal;
