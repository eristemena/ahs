import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
	Label,
	FormGroup,
	CardBody,
	Card,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
} from 'reactstrap';
import { addAlert, logout } from '../../redux/actions';
import { Formik, Form, Field } from 'formik';
import Select from 'react-select';
import { get } from '../../axios';
import * as Yup from 'yup';
import { errorHandler } from '../../utilities';
import SubmitAndCancelButtons from './SubmitAndCancelButtons';
import { intlMessage } from '../../language';

const ProductForm = ({
	onSubmit = () => {},
	submitting,
	stateName,
	statePrice,
	stateBuyingPrice,
	stateGroup = null,
	history,
	action,
	language,
	alert,
	logout,
}) => {
	const {
		products: { form },
	} = intlMessage(language);

	const [group, setGroup] = useState([]);
	const [groupLoading, setGroupLoading] = useState(false);
	const [groupFailed, setGroupFailed] = useState(false);

	useEffect(() => {
		setGroupLoading(true);
		get(
			'/products_groups',
			({ data }) => {
				setGroup(
					data.map((item) => ({ value: item.id, label: item.name }))
				);
				setGroupLoading(false);
			},
			(error) => {
				errorHandler(error, alert, logout);
				setGroupFailed(true);
				setGroupLoading(false);
			}
		);
	}, []);

	const schema = Yup.object().shape({
		name: Yup.string()
			.min(4, form.error.name.lt4)
			.required(form.error.name.empty),
		price: Yup.number()
			.integer()
			.typeError(form.error.price.NaN)
			.required(form.error.price.empty),
		buying_price: Yup.number()
			.integer()
			.typeError(form.error.buying_price.NaN)
			.required(form.error.buying_price.empty),
		group_id: Yup.number().integer().nullable(true),
	});

	const submitHandler = ({ name, price, buying_price, group_id }) => {
		// console.log(group_id)
		onSubmit(name, price * 1, buying_price * 1, group_id);
	};

	return (
		<Formik
			initialValues={{
				name: stateName || '',
				price: typeof statePrice === 'number' ? statePrice : '',
				buying_price:
					typeof stateBuyingPrice === 'number'
						? stateBuyingPrice
						: '',
				group_id: stateGroup || null,
			}}
			onSubmit={submitHandler}
			enableReinitialize
			validationSchema={schema}>
			{({ errors, touched, values, setValues }) => (
				<Card className="custom-form-card">
					<CardBody>
						<Form>
							<FormGroup>
								<Label>{form.name}</Label>
								<Field className="form-control" name="name" />
								{errors.name && touched.name && (
									<div className="feedback invalid d-block">
										{errors.name}
									</div>
								)}
							</FormGroup>
							<FormGroup>
								<Label>{form.price}</Label>
								<InputGroup>
									<InputGroupAddon addonType="prepend">
										<InputGroupText>Rp.</InputGroupText>
									</InputGroupAddon>
									<Field
										className="form-control"
										name="price"
									/>
								</InputGroup>

								{errors.price && touched.price && (
									<div className="feedback invalid left-75 d-block">
										{errors.price}
									</div>
								)}
							</FormGroup>
							<FormGroup>
								<Label>{form.buying_price}</Label>
								<InputGroup>
									<InputGroupAddon addonType="prepend">
										<InputGroupText>Rp.</InputGroupText>
									</InputGroupAddon>
									<Field
										className="form-control"
										name="buying_price"
									/>
								</InputGroup>
								{errors.buying_price &&
									touched.buying_price && (
										<div className="feedback invalid left-75 d-block">
											{errors.buying_price}
										</div>
									)}
							</FormGroup>
							<FormGroup>
								<Label>Group</Label>
								<Select
									classNamePrefix="custom-searchable-select "
									isLoading={groupLoading}
									isDisabled={groupLoading}
									noOptionsMessage={() =>
										!groupFailed ? (
											<span className="position-relative">
												Grup tidak ditemukan,{' '}
												<Link
													to="/products/groups/add?shortcut=true"
													className="stretched-link text-decoration-none">
													silahkan tambah grup baru
												</Link>
											</span>
										) : (
											'Telah terjadi kesalahan'
										)
									}
									options={group}
									onChange={(e) =>
										setValues({
											...values,
											group_id: e && e.value,
										})
									}
									value={
										values.group_id && {
											value: values.group_id,
											label: group.map((item) =>
												item.value === values.group_id
													? item.label
													: ''
											),
										}
									}
									placeholder="--Pilih group--"
									isSearchable
									isClearable
								/>
							</FormGroup>
							<SubmitAndCancelButtons
								submitting={submitting}
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

ProductForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	submitting: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
	alert: (message) => dispatch(addAlert(message)),
	logout: () => dispatch(logout()),
});

const mapStateToProps = (state) => ({
	language: state.language,
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductForm);
