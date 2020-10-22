import React, { useState } from 'react';
import { CustomerForm } from '../../components/Forms';
import { connect } from 'react-redux';
import { postWithAuth } from '../../axios';
import { addAlert, logout } from '../../redux/actions';
import { errorHandler } from '../../utilities';

const AddCustomer = ({ history, alert, logout }) => {
	const [submitting, setSubmitting] = useState(false);

	const submitHandler = (name, email, phone, address) => {
		setSubmitting(true);
		postWithAuth(
			'/customers',
			{
				name,
				email,
				phone,
				address,
			},
			() => {
				setSubmitting(false);
				alert('Pelanggan berhasil ditambahkan', 'success');
				if (
					history.location.search.replace('?shortcut=', '') === 'true'
				) {
					history.goBack();
				} else {
					history.push('/customers/get');
				}
			},
			(error) => {
				errorHandler(error, alert, logout);
				setSubmitting(false);
			}
		);
	};
	return (
		<CustomerForm
			submitting={submitting}
			onSubmit={submitHandler}
			history={history}
		/>
	);
};

const mapDispatchToProps = (dispatch) => ({
	alert: (message, type) => dispatch(addAlert(message, type)),
	logout: () => dispatch(logout()),
});

export default connect(null, mapDispatchToProps)(AddCustomer);
