import React, { useState } from 'react';
import { GroupForm } from '../../../components/Forms';
import { postWithAuth } from '../../../axios';
import { connect } from 'react-redux';
import { addAlert, logout } from '../../../redux/actions/';
import { errorHandler } from '../../../utilities';

const AddGroup = ({ history, alert, logout }) => {
	const [submitting, setSubmitting] = useState(false);

	const submitHandler = (name, quantity) => {
		setSubmitting(true);
		postWithAuth(
			'/products_groups',
			{
				name,
				quantity,
			},
			(success) => {
				alert('Grup berhasil ditambahkan', 'success');
				history.push('/products/groups/get');
				setSubmitting(false);
			},
			(error) => {
				errorHandler(error, alert, logout);
				setSubmitting(false);
			}
		);
	};
	return (
		<GroupForm
			submitting={submitting}
			history={history}
			onSubmit={submitHandler}
		/>
	);
};

const mapDispatchToProps = (dispatch) => ({
	alert: (message, type) => dispatch(addAlert(message, type)),
	logout: () => dispatch(logout()),
});

export default connect(null, mapDispatchToProps)(AddGroup);
