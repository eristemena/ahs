import React, { useState } from 'react';
import { postWithAuth, post } from '../../axios';
import { addAlert } from '../../redux/actions/alert';
import { connect } from 'react-redux';
import { RegisterForm } from '../../components/Forms';

const AddMerchant = ({ alert, history }) => {
	const [submitting, setSubmitting] = useState(false);

	const onSubmitHandler = (name, ahs, email, password) => {
		setSubmitting(true);
		postWithAuth(
			'/merchants',
			{
				name: ahs,
			},
			({ data }) => {
				post(
					'/auth/register',
					{
						name,
						email,
						password,
						group_id: 1,
						merchant_id: data.id,
					},
					(success) => {
						setSubmitting(false);
						alert('Merchant berhasil ditambahkan', 'success');
						history.goBack();
					},
					(error) => {
						setSubmitting(false);
						alert(
							`Telah terjadi kesalahan${
								error && error.message ? ': ' + error.message : ''
							}`
						);
					}
				);
			},
			(error) => {
				setSubmitting(false);
				alert(
					`Telah terjadi kesalahan${
						error && error.message ? ': ' + error.message : ''
					}`
				);
			}
		);
	};
	return <RegisterForm submitting={submitting} onSubmit={onSubmitHandler} />;
};

const mapDispatchToProps = (dispatch) => ({
	alert: (message, type) => dispatch(addAlert(message, type)),
});

export default connect(null, mapDispatchToProps)(AddMerchant);
