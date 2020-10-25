import React, { useState, useEffect, Fragment } from 'react';
import { ProductForm } from '../../components/Forms';
import { put, get } from '../../axios';
import { connect } from 'react-redux';
import { addAlert, logout, setLoading } from '../../redux/actions';
import { checkAdminMerchant } from '../../utilities';
import { errorHandler } from '../../utilities';
import { CustomSpinner } from '../../components';

const EditProduct = ({ user, history, alert, loading, setLoading, logout }) => {
	const [submitting, setSubmitting] = useState(false);
	const [id, setId] = useState(null);
	const [name, setName] = useState(null);
	const [price, setPrice] = useState(null);
	const [buyingPrice, setBuyingPrice] = useState(null);
	const [group, setGroup] = useState(null);

	useEffect(() => {
		setLoading(true);
		if (!checkAdminMerchant(user)) {
			alert('Login sebagai admin merchant untuk menambahkan produk');
			return history.push('/products/get');
		}

		const search = history.location.search;

		if (!search.length > 0) {
			history.push('/products/get');
			return alert('Telah terjadi kesalahan');
		}

		if (!search.includes('id')) {
			history.push('/products/get');
			return alert('Telah terjadi kesalahan');
		}

		const queryId = search.replace('?id=', '');

		if (isNaN(queryId)) {
			history.push('/products/get');
			return alert('Telah terjadi kesalahan');
		}

		setId(queryId);
		get(
			`/products?id=${queryId}`,
			({ data }) => {
				const product = data[0];
				setName(product.name);
				setPrice(product.price);
				setBuyingPrice(product.buying_price);
				setGroup(product.group_id);
				setLoading(false);
			},
			(error) => {
				setLoading(false);
				history.push('/products/get');
				errorHandler(error, alert, logout);
			}
		);
	}, []);

	const submitHandler = (name, price, buying_price, group_id) => {
		setSubmitting(true);
		put(
			`/products/${id}`,
			{
				name,
				price,
				buying_price,
				group_id,
			},
			() => {
				alert('Produk berhasil diedit', 'success');
				setSubmitting(false);
				history.push('/products/get');
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
				<ProductForm
					onSubmit={submitHandler}
					submitting={submitting}
					stateName={name}
					statePrice={price}
					stateBuyingPrice={buyingPrice}
					stateGroup={group}
					action="Edit"
					history={history}
				/>
			) : (
				<CustomSpinner loading={loading} type="page" />
			)}
		</Fragment>
	);
};

const mapStateToProps = (state) => ({
	user: state.user,
	loading: state.loading,
});

const mapDispatchToProps = (dispatch) => ({
	alert: (message, type) => dispatch(addAlert(message, type)),
	setLoading: (loading) => dispatch(setLoading(loading)),
	logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProduct);
