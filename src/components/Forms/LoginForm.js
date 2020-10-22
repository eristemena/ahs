import React from 'react';
import PropTypes from 'prop-types';
import { Label, FormGroup } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import CustomSpinner from '../CustomSpinner';
import * as Yup from 'yup';

function LoginForm({ onSubmit = () => {}, loggingIn }) {
	const schema = Yup.object().shape({
		email: Yup.string()
			.email('Email tidak valid')
			.required('Email perlu diisi'),
		password: Yup.string().required('Password perlu diisi'),
	});

	const submitHandler = ({ email, password }) => {
		onSubmit(email, password);
	};

	return (
		<Formik
			initialValues={{
				email: process.env.REACT_APP_EMAIL || '',
				password: process.env.REACT_APP_PASSWORD || '',
			}}
			onSubmit={submitHandler}
			validationSchema={schema}>
			{({ errors, touched }) => (
				<Form>
					<FormGroup className="form-group has-float-label">
						<Label>Email</Label>
						<Field className="form-control" name="email" />
						{errors.email && touched.email && (
							<div className="feedback invalid d-block">
								{errors.email}
							</div>
						)}
					</FormGroup>
					<FormGroup className="form-group has-float-label">
						<Label>Password</Label>
						<Field
							className="form-control"
							type="password"
							name="password"
						/>
						{errors.password && touched.password && (
							<div className="feedback invalid left-75 d-block">
								{errors.password}
							</div>
						)}
					</FormGroup>
					<div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
						<Link
							to="/password-reset"
							className="custom-login-form-forgot-password">
							Lupa password?
						</Link>
						<button
							className={`btn btn-primary login-button ${
								loggingIn ? 'disabled' : ''
							}`}
							type="submit"
							disabled={loggingIn}>
							<CustomSpinner loading={loggingIn} type="button" />
							<span className={`${loggingIn ? 'd-none' : ''}`}>
								Login
							</span>
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
}

LoginForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	loggingIn: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	loggingIn: state.loading,
});

export default connect(mapStateToProps)(LoginForm);
