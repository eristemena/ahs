import React, { useEffect, useState, Fragment } from 'react';
import { get, put } from '../../axios';
import { addAlert, setLoading, logout } from '../../redux/actions';
import { TransactionEditForm } from '../../components/Forms';
import { connect } from 'react-redux';
import CustomSpinner from '../../components/CustomSpinner';
import { errorHandler } from '../../utilities';

const EditTransaction = ({ alert, history, loading, setLoading, logout }) => {
	const [submitting, setSubmitting] = useState(false);
	const [date, setDate] = useState('');
	const [productId, setProductId] = useState('');
	const [quantity, setQuantity] = useState('');
	const [info, setInfo] = useState(null);
	const [type, setType] = useState('');
	const [customer, setCustomer] = useState('');

	useEffect(() => {
		setLoading(true);
		const search = history.location.search;
		if (!search.length > 0) {
			history.push('/transactions/get');
			return alert('Telah terjadi kesalahan');
		}

		if (!search.includes('id')) {
			history.push('/transactions/get');
			return alert('Telah terjadi kesalahan');
		}

		const query = search.replace('?id=', '');

		if (!query.match(/^\d+$/)) {
			history.push('/transactions/get');
			return alert('Telah terjadi kesalahan');
		}

		get(
			`/transactions?id=${query}`,
			({ data }) => {
				const item = data[0];
				setDate(new Date(item.date));
				setProductId(item.product_id * 1);
				setQuantity(item.quantity * 1);
				setType(item.type);
				if (item.info) {
					setInfo(item.info);
				}
				setCustomer(item.customer ? item.customer.id * 1 : '');
				setLoading(false);
			},
			(error) => {
				errorHandler(error, alert, logout);
				setLoading(false);
			}
		);
	}, []);

	const onSubmitHandler = (
		date,
		product_id,
		type,
		quantity,
		customer_id,
		info
	) => {
		setSubmitting(true);
		put(
			`/transactions/${history.location.search.replace('?id=', '')}`,
			{
				date,
				product_id,
				type,
				quantity,
				info,
				customer_id,
			},
			() => {
				setSubmitting(false);
				alert('Transaksi berhasil diedit', 'success');
				history.push('/transactions/get');
			},
			(error) => {
				setSubmitting(false);
				errorHandler(error, alert, logout);
			}
		);
	};
	return (
		<Fragment>
			{!loading ? (
				<TransactionEditForm
					submitting={submitting}
					stateDate={date}
					stateProduct={productId}
					stateQuantity={quantity}
					stateInfo={info}
					stateType={type}
					stateCustomer={customer}
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
	loading: state.loading,
	user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditTransaction);
