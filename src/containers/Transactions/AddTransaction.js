import React, { useState, Fragment } from 'react';
import { postWithAuth } from '../../axios';
import { addAlert, logout } from '../../redux/actions';
import { TransactionForm } from '../../components/Forms';
import { connect } from 'react-redux';
import { errorHandler } from '../../utilities';
import CustomSpinner from '../../components/CustomSpinner';

const AddTransaction = ({ alert, history, loading, logout }) => {
	const [submitting, setSubmitting] = useState(false);

	const onSubmitHandler = (date, type, customer_id, products, info) => {
		setSubmitting(true);
		products.forEach((product, index) => {
			postWithAuth(
				'/transactions',
				{
					date,
					product_id: product.product_id,
					type,
					quantity: product.quantity,
					info,
					customer_id,
				},
				() => {
					if (index + 1 === products.length) {
						setSubmitting(false);
						alert('Transaksi berhasil ditambahkan', 'success');
						history.push('/transactions/get');
					}
				},
				(error) => {
					setSubmitting(false);
					errorHandler(error, alert, logout);
				}
			);
		});
	};

	return (
		<Fragment>
			<CustomSpinner loading={loading} type="page" />
			{!loading ? (
				<TransactionForm
					submitting={submitting}
					onSubmit={onSubmitHandler}
					history={history}
				/>
			) : null}
		</Fragment>
	);
};

const mapDispatchToProps = (dispatch) => ({
	alert: (message, type) => dispatch(addAlert(message, type)),
	logout: () => dispatch(logout()),
});

const mapStateToProps = (state) => ({
	user: state.user,
	loading: state.loading,
});

export default connect(mapStateToProps, mapDispatchToProps)(AddTransaction);
