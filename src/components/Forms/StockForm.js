import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { addAlert, logout } from '../../redux/actions';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import Select from 'react-select';
import { FormGroup, Label } from 'reactstrap';
import { Datepicker } from '../';
import moment from 'moment';
import 'moment/locale/id';
import { get } from '../../axios';
import { Card, CardBody } from 'reactstrap';
import { intlMessage } from '../../language';
import SubmitAndCancelButton from './SubmitAndCancelButtons';
import { errorHandler } from '../../utilities';

const StockForm = ({
	onSubmit = () => {},
	submitting,
	stateDate,
	stateSelectedCustomer = '',
	stateQuantity = 1,
	stateType = 'sell',
	stateInfo = '',
	action,
	alert,
	history,
	language,
	logout,
}) => {
	const [ownedCustomers, setOwnedCustomers] = useState([]);
	const [loadingOwnedCustomer, setLoadingOwnedCustomer] = useState(false);

	const { gallons } = intlMessage(language);

	const schema = Yup.object().shape({
		date: Yup.date().required(gallons.form.error.date),
		type: Yup.string().default('sell'),
		quantity: Yup.number().positive().required(),
		customer_id: Yup.number().when('type', {
			is: (val) =>
				val && val.length > 0 && val !== 'buy' ? true : false,
			then: Yup.number()
				.integer()
				.positive()
				.required(gallons.form.error.customer),
		}),
		info: Yup.string().optional(),
	});

	useEffect(() => {
		setLoadingOwnedCustomer(true);
		get(
			`/customers`,
			({ data }) => {
				setOwnedCustomers(
					data.map(({ id, name }) => ({
						value: id,
						label: name,
					}))
				);
				setLoadingOwnedCustomer(false);
			},
			(error) => {
				history.push('/gallons/stocks/get');
				setLoadingOwnedCustomer(false);
				errorHandler(error, alert, logout);
			}
		);
	}, []);

	const submitHandler = ({ date, type, quantity, customer_id, info }) => {
		const dateSend = moment(date).format('YYYY-MM-DD');
		onSubmit(
			dateSend,
			type,
			quantity,
			!customer_id || typeof customer_id === 'string'
				? null
				: customer_id,
			info.length === 0 ? null : info
		);
	};

	return (
		<Formik
			initialValues={{
				date: stateDate || '',
				type: stateType || 'sell',
				quantity: stateQuantity || 1,
				customer_id: stateSelectedCustomer || '',
				info: stateInfo || '',
			}}
			enableReinitialize
			onSubmit={submitHandler}
			validationSchema={schema}>
			{({ errors, touched, setValues, values }) => (
				<Card className="custom-form-card">
					<CardBody>
						<Form>
							<FormGroup>
								<Label className="d-block" for="date">
									{gallons.form.date.name}
								</Label>
								<Datepicker
									value={values.date}
									placeholder={gallons.form.date.placeholder}
									onChange={(e) =>
										setValues({ ...values, date: e })
									}
								/>
								{errors.date && touched.date ? (
									<div className="feedback invalid d-block">
										{errors.date}
									</div>
								) : null}
							</FormGroup>
							<FormGroup>
								<Label className="d-block">
									{gallons.form.type.name}
								</Label>
								<div className="form-check form-check-inline align-middle custom-form-check">
									<Field
										type="radio"
										name="type"
										value="sell"
										id="sell"
										className="form-check-input"
									/>
									<Label
										for="sell"
										className="form-check-label">
										{gallons.form.type.sell}
									</Label>
								</div>
								<div className="form-check form-check-inline align-middle custom-form-check">
									<Field
										type="radio"
										name="type"
										value="buy"
										id="buy"
										className="form-check-input"
										onChange={() =>
											setValues({
												...values,
												customer_id: 0,
												type: 'buy',
											})
										}
									/>
									<Label
										for="buy"
										className="form-check-label">
										{gallons.form.type.buy}
									</Label>
								</div>
								<div className="form-check form-check-inline align-middle custom-form-check">
									<Field
										type="radio"
										name="type"
										value="borrow"
										id="borrow"
										className="form-check-input"
									/>
									<Label
										for="borrow"
										className="form-check-label">
										{gallons.form.type.borrow}
									</Label>
								</div>
								<div className="form-check form-check-inline align-middle custom-form-check">
									<Field
										type="radio"
										name="type"
										value="return"
										id="return"
										className="form-check-input"
									/>
									<Label
										for="return"
										className="form-check-label">
										{gallons.form.type.return}
									</Label>
								</div>
							</FormGroup>
							<FormGroup>
								<Label for="quantity">
									{gallons.form.quantity}
								</Label>
								<Field
									className="form-control"
									id="quantity"
									type="number"
									min="0"
									name="quantity"
								/>
								{errors.quantity && touched.quantity ? (
									<div className="feedback invalid d-block">
										{errors.quantity}
									</div>
								) : null}
							</FormGroup>
							{values.type !== 'buy' ? (
								<FormGroup>
									<Label className="d-block" for="customer">
										{gallons.form.customer.name}
									</Label>
									<Select
										id="customer"
										classNamePrefix="custom-searchable-select "
										isLoading={loadingOwnedCustomer}
										isDisabled={loadingOwnedCustomer}
										noOptionsMessage={() => (
											<span className="position-relative">
												Pelanggan tidak ditemukan,{' '}
												<Link
													to="/customers/add?shortcut=true"
													className="stretched-link text-decoration-none">
													silahkan tambah pelanggan
													baru
												</Link>
											</span>
										)}
										name="product_id"
										options={ownedCustomers}
										value={{
											value: values.customer_id,
											label:
												values.customer_id > 0
													? ownedCustomers.map(
															(own) => {
																if (
																	own.value ===
																	values.customer_id
																) {
																	return own.label;
																}
															}
													  )
													: gallons.form.customer
															.placeholder,
										}}
										onChange={(e) =>
											setValues({
												...values,
												customer_id: e.value,
											})
										}
										isSearchable
									/>
									{errors.customer_id &&
									touched.customer_id ? (
										<div className="feedback invalid left-75 d-block">
											{errors.customer_id}
										</div>
									) : null}
								</FormGroup>
							) : null}
							<FormGroup>
								<Label for="info">
									{gallons.form.info.name}
								</Label>
								<Field
									className="form-control"
									id="info"
									name="info"
									as="textarea"
									maxLength="150"
									rows="4"
									placeholder={gallons.form.info.placeholder}
								/>
							</FormGroup>
							<SubmitAndCancelButton
								submitting={submitting}
								loading1={loadingOwnedCustomer}
								action={action}
								history={history}
							/>
						</Form>
					</CardBody>
				</Card>
			)}
		</Formik>
	);
};

StockForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	submitting: PropTypes.bool.isRequired,
	stateDate: PropTypes.instanceOf(Date),
	stateSelected: PropTypes.number,
	stateSelectedCustomer: PropTypes.number,
	stateQuantity: PropTypes.number,
	stateType: PropTypes.string,
	stateInfo: PropTypes.string,
	action: PropTypes.string,
	history: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
	alert: (message) => dispatch(addAlert(message)),
	logout: () => dispatch(logout()),
});

const mapStateToProps = (state) => ({
	language: state.language,
});

export default connect(mapStateToProps, mapDispatchToProps)(StockForm);
