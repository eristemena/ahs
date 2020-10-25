import React, { useState } from 'react';
import { ProductForm } from '../../components/Forms';
import { postWithAuth } from '../../axios';
import { connect } from 'react-redux';
import { addAlert, logout } from '../../redux/actions';
import { errorHandler } from '../../utilities';

const AddProduct = ({ history, alert, logout }) => {
	const [submitting, setSubmitting] = useState(false);

	const submitHandler = (name, price, buying_price, group_id) => {
		setSubmitting(true);
		postWithAuth(
			'/products',
			{
				name,
				price,
				buying_price,
				group_id,
			},
			() => {
				alert('Produk berhasil ditambahkan', 'success');
				setSubmitting(false);
				if (
					history.location.search.replace('?shortcut=', '') === 'true'
				) {
					history.goBack();
				} else {
					history.push('/products/get');
				}
			},
			(error) => {
				errorHandler(error, alert, logout);
				history.push('/products/get');
				setSubmitting(false);
			}
		);
	};
	return (
		<div>
			<ProductForm
				onSubmit={submitHandler}
				submitting={submitting}
				history={history}
			/>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	alert: (message, type) => dispatch(addAlert(message, type)),
	logout: () => dispatch(logout()),
});

export default connect(null, mapDispatchToProps)(AddProduct);
