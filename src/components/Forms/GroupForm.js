import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Label, FormGroup, CardBody, Card, InputGroup } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import SubmitAndCancelButtons from './SubmitAndCancelButtons';
import { intlMessage } from '../../language';

const GroupForm = ({
	onSubmit = () => {},
	submitting,
	stateName = '',
	stateQuantity = '',
	history,
	action,
	language,
}) => {
	const {
		groups: { form },
	} = intlMessage(language);

	const schema = Yup.object().shape({
		name: Yup.string()
			.min(2, form.error.name.lt2)
			.required(form.error.name.empty),
		quantity: Yup.number()
			.typeError(form.error.quantity.NaN)
			.required(form.error.quantity.empty),
	});

	const submitHandler = ({ name, quantity }) => {
		onSubmit(name, quantity * 1);
	};

	return (
		<Formik
			initialValues={{
				name: stateName || '',
				quantity:
					typeof stateQuantity === 'number' ? stateQuantity : '',
			}}
			onSubmit={submitHandler}
			enableReinitialize
			validationSchema={schema}>
			{({ errors, touched }) => (
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
								<Label>{form.quantity}</Label>
								<InputGroup>
									<Field
										className="form-control"
										name="quantity"
										type="number"
									/>
								</InputGroup>
								{errors.quantity && touched.quantity && (
									<div className="feedback invalid left-50 d-block">
										{errors.quantity}
									</div>
								)}
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

GroupForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	submitting: PropTypes.bool.isRequired,
	stateName: PropTypes.string,
	stateQuantity: PropTypes.string,
};

const mapStateToProps = (state) => ({
	language: state.language,
});

export default connect(mapStateToProps)(GroupForm);
