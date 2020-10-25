import React, { useState, Fragment } from 'react';
import { postWithAuth } from '../../axios';
import { addAlert, setLoading, logout } from '../../redux/actions';
import { StockForm } from '../../components/Forms';
import { connect } from 'react-redux';
import CustomSpinner from '../../components/CustomSpinner';
import { errorHandler } from '../../utilities';

const AddStock = ({ alert, history, loading, logout }) => {
	const [submitting, setSubmitting] = useState(false);

	const onSubmitHandler = (date, type, quantity, customer_id, info) => {
		setSubmitting(true);
		postWithAuth(
			'/stocks',
			{
				date,
				type,
				quantity,
				info,
				customer_id,
			},
			() => {
				setSubmitting(false);
				alert('Transaksi berhasil ditambahkan', 'success');
				history.goBack();
			},
			(error) => {
				errorHandler(error, alert, logout);
				setSubmitting(false);
			}
		);
	};
	return (
		<Fragment>
			{!loading ? (
				<StockForm
					submitting={submitting}
					onSubmit={onSubmitHandler}
					history={history}
				/>
			) : (
				<CustomSpinner loading={loading} type="page" />
			)}
		</Fragment>
	);
};

const mapDispatchToProps = (dispatch) => ({
	alert: (message, type) => dispatch(addAlert(message, type)),
	setLoading: (loading) => dispatch(setLoading(loading)),
	logout: () => dispatch(logout()),
});

const mapStateToProps = (state) => ({
	user: state.user,
	loading: state.loading,
});

export default connect(mapStateToProps, mapDispatchToProps)(AddStock);
