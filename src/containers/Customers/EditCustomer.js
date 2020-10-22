import React, { useState, useEffect, Fragment } from 'react';
import { CustomerForm } from '../../components/Forms';
import { connect } from 'react-redux';
import { put, get } from '../../axios';
import { addAlert, setLoading, logout } from '../../redux/actions';
import { CustomSpinner } from '../../components';
import { errorHandler } from '../../utilities';

const EditCustomer = ({ history, alert, setLoading, loading, logout }) => {
	const [submitting, setSubmitting] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');

	useEffect(() => {
		setLoading(true);
		if (!history.location.search.includes('id')) {
			history.push('/customers/get');
			return alert('Telah terjadi kesalahan');
		}

		const id = history.location.search.replace('?id=', '');

		if (isNaN(id)) {
			history.push('/customers/get');
			return alert('Telah terjadi kesalahan');
		}

		get(
			`/customers?id=${id}`,
			({ data }) => {
				if (data.length === 0) {
					history.push('/customers/get');
					return alert('Customer tidak ditemukan');
				}
				const { name, email, phone, address } = data[0];
				setName(name);
				if (email) {
					setEmail(email);
				}
				setPhone(phone);
				setAddress(address);
				setLoading(false);
			},
			(error) => {
				history.push('/customers/get');
				errorHandler(error, alert, logout);
				setLoading(false);
			}
		);
	}, []);

	const submitHandler = (name, email, phone, address) => {
		setSubmitting(true);
		const id = history.location.search.replace('?id=', '');
		put(
			`/customers/${id}`,
			{
				name,
				email,
				phone,
				address,
			},
			() => {
				setSubmitting(false);
				alert('Pelanggan berhasil diedit', 'success');
				history.push('/customers/get');
			},
			(error) => {
				errorHandler(error, alert, logout);
				setSubmitting(false);
			}
		);
	};
	return (
		<Fragment>
			<CustomSpinner loading={loading} type="page" />
			{!loading ? (
				<CustomerForm
					submitting={submitting}
					onSubmit={submitHandler}
					stateName={name}
					stateEmail={email}
					statePhone={phone}
					stateAddress={address}
					history={history}
					action="Edit"
				/>
			) : null}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(EditCustomer);
