import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { Label, FormGroup } from 'reactstrap';

const RstPwPasswordForm = ({ onSubmit = () => {}, loading }) => {
	const schema = Yup.object().shape({
		password: Yup.string()
			.min(4, 'Password harus lebih dari 3 karakter')
			.required('Password harus diisi'),
		password2: Yup.string().when('password', {
			is: (val) => (val && val.length > 0 ? true : false),
			then: Yup.string().oneOf(
				[Yup.ref('password')],
				'Password tidak sama'
			),
		}),
	});

	const submitHandler = ({ password }) => {
		onSubmit(password);
	};

	return (
		<Formik
			initialValues={{
				password: '',
				password2: '',
			}}
			onSubmit={submitHandler}
			validationSchema={schema}>
			{({ errors, touched }) => (
				<Form>
					<FormGroup className="form-group has-float-label">
						<Label>New Password</Label>
						<Field
							className="form-control"
							name="password"
							type="password"
						/>
						{errors.password && touched.password && (
							<div className="feedback invalid d-block">
								{errors.password}
							</div>
						)}
					</FormGroup>
					<FormGroup className="form-group has-float-label">
						<Label>Re-type Password</Label>
						<Field
							className="form-control"
							name="password2"
							type="password"
						/>
						{errors.password2 && touched.password2 && (
							<div className="feedback invalid d-block">
								{errors.password2}
							</div>
						)}
					</FormGroup>
					<div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
						<div></div>
						<SubmitAndCancelButtons
							submitting={loading}
							history={history}
							action="Reset"
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};

RstPwPasswordForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	loading: state.loading,
});

export default connect(mapStateToProps)(RstPwPasswordForm);
