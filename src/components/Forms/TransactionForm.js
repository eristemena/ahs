import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { addAlert, logout } from '../../redux/actions';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import 'moment/locale/id';
import { get, postWithAuth, del } from '../../axios';
import {
	Card,
	CardBody,
	Row,
	Col,
	InputGroup,
	FormGroup,
	InputGroupAddon,
	Label,
} from 'reactstrap';
import { intlMessage } from '../../language';
import { CustomSpinner, Datepicker } from '../';
import { errorHandler } from '../../utilities';
import SubmitAndCancelButton from './SubmitAndCancelButtons';

const TransactionForm = ({
	onSubmit = () => {},
	submitting,
	action,
	alert,
	history,
	language,
	logout,
}) => {
	const [owned, setOwned] = useState([]);
	const [loadingOwned, setLoadingOwned] = useState(false);
	const [ownedCustomers, setOwnedCustomers] = useState([]);
	const [loadingOwnedCustomer, setLoadingOwnedCustomer] = useState(false);

	const [products, setProducts] = useState([
		{
			product_id: null,
			quantity: 1,
			stock_submitting: false,
			stock_added: false,
			gallon_id: null,
		},
	]);

	// dummy state to force re render
	const [re, setRe] = useState(false);

	const {
		transactions: { form: transactionForm },
	} = intlMessage(language);

	const schema = Yup.object().shape({
		date: Yup.date().typeError(transactionForm.error.date).required(),
		type: Yup.string(),
		customer_id: Yup.number()
			.typeError(transactionForm.error.customer)
			.when('type', {
				is: (val) => val && val.length > 0 && val === 'sell',
				then: Yup.number()
					.typeError(transactionForm.error.customer)
					.integer()
					.positive(transactionForm.error.customer)
					.required(),
			}),
		info: Yup.string().optional(),
	});

	useEffect(() => {
		setLoadingOwned(true);
		setLoadingOwnedCustomer(true);
		get(
			'/products',
			({ data }) => {
				if (!data.length > 0) {
					history.goBack();
					return alert('Anda belum memiliki produk');
				}
				setOwned(
					data.map(({ id, name }) => ({
						value: id,
						label: name,
					}))
				);
				setLoadingOwned(false);
			},
			(error) => {
				errorHandler(error, alert, logout);
				history.goBack();
				setLoadingOwned(false);
			}
		);
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
				errorHandler(error, alert, logout);
				history.goBack();
				setLoadingOwnedCustomer(false);
			}
		);
	}, []);

	const submitHandler = ({ date, type, customer_id, info }) => {
		const dateSend = moment(date).format('YYYY-MM-DD');
		let checkIfProductsEmpty = true;
		products.forEach((item) => {
			if (item.product_id === null) {
				checkIfProductsEmpty = false;
			}
		});

		if (!checkIfProductsEmpty) {
			return alert('Pilih produk');
		}

		onSubmit(
			dateSend,
			type,
			customer_id || null,
			products,
			info.length === 0 ? null : info
		);
	};

	const addStock = (
		date,
		type,
		quantity,
		customer_id,
		product,
		index,
		setTouched,
		touched
	) => {
		let dateEmpty = false;
		let customerEmpty = false;

		if (!date) {
			dateEmpty = true;
		}
		if (type === 'sell' && !customer_id) {
			customerEmpty = true;
		}
		if (dateEmpty || customerEmpty) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
			return setTouched({
				...touched,
				customer_id: customerEmpty,
				date: dateEmpty,
			});
		}

		if (!product) {
			return alert('Pilih produk');
		}

		setProducts((prevItems) =>
			prevItems.map((item, i) => {
				if (i === index) {
					item.stock_submitting = true;
				}
				return item;
			})
		);
		postWithAuth(
			'/stocks',
			{
				date: moment(date).format('YYYY-MM-DD'),
				type,
				quantity,
				info: null,
				customer_id,
			},
			({ data }) => {
				alert(`Stok galon berhasil ditambahkan`, 'success');
				setProducts((prevItems) =>
					prevItems.map((item, i) => {
						if (index === i) {
							item.stock_submitting = false;
							item.stock_added = true;
							item.gallon_id = data.id;
						}
						return item;
					})
				);
			},
			(error) => {
				errorHandler(error, alert, logout);
				setProducts((prevItems) =>
					prevItems.map((item, i) => {
						if (index === i) {
							item.stock_submitting = false;
							item.stock_added = false;
						}
						return item;
					})
				);
			}
		);
	};

	const deleteStock = (id, index) => {
		setProducts((prevItems) =>
			prevItems.map((item, i) => {
				if (i === index) {
					item.stock_submitting = true;
				}
				return item;
			})
		);
		del(
			`/stocks/${id}`,
			() => {
				alert(`Stok galon berhasil dihapus`, 'success');
				setProducts((prevItems) =>
					prevItems.map((item, i) => {
						if (index === i) {
							item.stock_submitting = false;
							item.stock_added = false;
						}
						return item;
					})
				);
			},
			(error) => {
				errorHandler(error, alert, logout);
				setProducts((prevItems) =>
					prevItems.map((item, i) => {
						if (index === i) {
							item.stock_submitting = false;
							item.stock_added = true;
						}
						return item;
					})
				);
			}
		);
	};

	return (
		<Formik
			initialValues={{
				date: null,
				type: 'sell',
				customer_id: null,
				info: '',
			}}
			enableReinitialize
			onSubmit={submitHandler}
			validationSchema={schema}>
			{({ errors, touched, setValues, values, setTouched }) => (
				<Card className="custom-form-card transaction">
					<CardBody>
						<Form>
							<FormGroup id="date">
								<Label className="d-block" for="date">
									{transactionForm.date.label}
								</Label>
								<Datepicker
									value={values.date}
									placeholder={
										transactionForm.date.placeholder
									}
									onChange={(e) =>
										setValues({
											...values,
											date: e,
										})
									}
								/>
								{errors.date && touched.date ? (
									<div className="feedback invalid left-75 d-block">
										{errors.date}
									</div>
								) : null}
							</FormGroup>
							<FormGroup id="type">
								<Label className="d-block">
									{transactionForm.type.label}
								</Label>
								<div className="form-check form-check-inline align-middle custom-form-check">
									<Field
										type="radio"
										name="type"
										value="sell"
										id="sell"
										className="form-check-input"
										onChange={(e) =>
											setValues({
												...values,
												type: e.target.value,
											})
										}
									/>
									<Label
										for="sell"
										className="form-check-label">
										{transactionForm.type.sell}
									</Label>
								</div>
								<div className="form-check form-check-inline align-middle custom-form-check">
									<Field
										type="radio"
										name="type"
										value="buy"
										id="buy"
										className="form-check-input"
										onChange={(e) =>
											setValues({
												...values,
												customer_id: 0,
												type: e.target.value,
											})
										}
									/>
									<Label
										for="buy"
										className="form-check-label">
										{transactionForm.type.buy}
									</Label>
								</div>
							</FormGroup>
							{values.type === 'sell' ? (
								<FormGroup>
									<Label className="d-block" for="customer">
										{transactionForm.customer.label}
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
										onChange={(e) =>
											setValues({
												...values,
												customer_id: e.value,
											})
										}
										placeholder={
											transactionForm.customer.placeholder
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
							<div className="mb-3">
								{products.map((item, index) => (
									<Row className="products-row">
										<Col xs={12} md={6}>
											<FormGroup>
												<Label
													className="d-block"
													for="product">
													{
														transactionForm.product
															.label
													}
												</Label>
												<Select
													id="product"
													classNamePrefix="custom-searchable-select "
													isLoading={loadingOwned}
													isDisabled={
														loadingOwned ||
														item.stock_submitting ||
														item.stock_added
													}
													noOptionsMessage={() => (
														<span className="position-relative">
															Produk tidak
															ditemukan,{' '}
															<Link
																to="/products/add?shortcut=true"
																className="stretched-link text-decoration-none">
																silahkan tambah
																produk baru
															</Link>
														</span>
													)}
													options={owned}
													value={
														item.product_id > 0 && {
															value:
																item.product_id,
															label: owned.map(
																(own) => {
																	if (
																		own.value ===
																		item.product_id
																	) {
																		return own.label;
																	} else {
																		return null;
																	}
																}
															),
														}
													}
													onChange={(e) => {
														setProducts((prev) => {
															prev[
																index
															].product_id =
																e.value;
															return prev;
														});
														setRe(!re);
													}}
													placeholder={
														transactionForm.product
															.placeholder
													}
													isSearchable
												/>
											</FormGroup>
										</Col>
										<Col xs={12} md={6}>
											<FormGroup>
												<Label>
													{
														transactionForm.quantity
															.label
													}
												</Label>
												<InputGroup>
													<Field
														className="form-control"
														type="number"
														min="1"
														defaultValue="1"
														name="quantity"
														disabled={
															item.stock_submitting ||
															item.stock_added
														}
														value={item.quantity}
														onChange={(e) => {
															e.persist();
															setProducts(
																(prev) => {
																	prev[
																		index
																	].quantity =
																		e.target
																			.value *
																		1;
																	return prev;
																}
															);
															setRe(!re);
														}}
													/>
													<InputGroupAddon addonType="prepend">
														{index > 0 &&
															!item.stock_added && (
																<Fragment>
																	<button
																		className={`btn btn-danger`}
																		type="button"
																		disabled={
																			item.stock_submitting ||
																			item.stock_added
																		}
																		onClick={() => {
																			setProducts(
																				(
																					prev
																				) =>
																					prev.filter(
																						(
																							e,
																							i
																						) =>
																							i !==
																							index
																					)
																			);
																			const isNextItemAdded = products.findIndex(
																				(
																					item,
																					i
																				) => {
																					if (
																						i ===
																						index +
																							1
																					) {
																						return (
																							item.stock_added ===
																							true
																						);
																					} else {
																						return false;
																					}
																				}
																			);
																			if (
																				isNextItemAdded >
																				0
																			) {
																				setProducts(
																					(
																						prevItems
																					) =>
																						prevItems.map(
																							(
																								item,
																								i
																							) => {
																								if (
																									index ===
																									i
																								) {
																									item.stock_added = false;
																								}
																								return item;
																							}
																						)
																				);
																			}
																			setRe(
																				!re
																			);
																		}}>
																		<i className="simple-icon-trash" />
																	</button>
																</Fragment>
															)}
														<button
															className={`btn ${
																item.stock_added
																	? 'btn-danger'
																	: 'btn-primary'
															} ${
																item.stock_submitting &&
																'disabled px-3 py-1'
															} `}
															type="button"
															title={
																!item.stock_added
																	? 'Tambah stok galon'
																	: 'Batal tambah stok galon'
															}
															disabled={
																item.stock_submitting
															}
															onClick={() =>
																!item.stock_added
																	? addStock(
																			values.date,
																			values.type,
																			item.quantity,
																			values.customer_id,
																			item.product_id
																				? true
																				: false,
																			index,
																			setTouched,
																			touched
																	  )
																	: deleteStock(
																			item.gallon_id,
																			index
																	  )
															}>
															{!item.stock_submitting ? (
																!item.stock_added ? (
																	<i className="fas fa-plus"></i>
																) : (
																	<i className="fas fa-times"></i>
																)
															) : (
																<CustomSpinner
																	type="button"
																	loading={
																		item.stock_submitting
																	}
																	className="small"
																/>
															)}
														</button>
													</InputGroupAddon>
												</InputGroup>
											</FormGroup>
											<div className="dropdown-divider dark divider"></div>
										</Col>
									</Row>
								))}
								<button
									className="btn btn-primary"
									type="button"
									onClick={() =>
										setProducts([
											...products,
											{
												product_id: null,
												quantity: 1,
											},
										])
									}>
									Add Product
								</button>
							</div>
							<FormGroup id="info">
								<Label for="info">
									{transactionForm.info.label}
								</Label>
								<Field
									className="form-control"
									id="info"
									name="info"
									as="textarea"
									maxLength="150"
									rows="4"
									placeholder={
										transactionForm.info.placeholder
									}
								/>
							</FormGroup>
							<SubmitAndCancelButton
								submitting={submitting}
								loading1={loadingOwned}
								loading2={loadingOwnedCustomer}
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

const mapDispatchToProps = (dispatch) => ({
	alert: (message, type) => dispatch(addAlert(message, type)),
	logout: () => dispatch(logout()),
});

const mapStateToProps = (state) => ({
	language: state.language,
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionForm);
