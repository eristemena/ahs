import React from 'react';
import PropTypes from 'prop-types';
import { Label, FormGroup, Button, Spinner } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import CustomSpinner from './CustomSpinner';

function LoginForm({ onSubmit = () => {}, loading, errorMessage = {} }) {
    const validateEmail = (value) => {
        let error;
        if (!value) {
            error = 'Silakan masukkan alamat email Anda';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
            error = 'Alamat email salah';
        } else if (errorMessage.emailNotFound) {
            error = 'Email tidak ditemukan';
        }
        return error;
    };

    const validatePassword = (value) => {
        let error;
        if (!value) {
            error = 'Silakan masukkan kata sandi Anda';
        } else if (value.length < 4) {
            error = 'Kata sandi harus lebih dari 3 karakter';
        } else if (errorMessage.wrongPassword) {
            error = 'Kata sandi salah';
        }
        return error;
    };

    const submitHandler = ({ email, password }) => {
        onSubmit(email, password);
    };

    return (
        <Formik
            initialValues={{
                email: process.env.REACT_APP_EMAIL || '',
                password: process.env.REACT_APP_PASSWORD || '',
            }}
            onSubmit={submitHandler}>
            {({ errors, touched }) => (
                <Form>
                    <FormGroup className="form-group has-float-label">
                        <Label>Email</Label>
                        <Field
                            className="form-control"
                            name="email"
                            validate={validateEmail}
                        />
                        {errors.email && touched.email && (
                            <div className="invalid-feedback d-block">
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
                            validate={validatePassword}
                        />
                        {errors.password && touched.password && (
                            <div className="invalid-feedback d-block">
                                {errors.password}
                            </div>
                        )}
                    </FormGroup>
                    <div className="d-flex justify-content-between align-items-center">
                        <Link
                            to="#"
                            className="custom-login-form-forgot-password">
                            Lupa password?
                        </Link>
                        <Button
                            className={`custom-login-button px-4 py-2 ${
                                loading ? 'disabled' : ''
                            }`}
                            size="md"
                            type="submit"
                            disabled={loading}>
                            <Spinner
                                className={`${
                                    !loading ? 'd-none' : ''
                                } custom-loading-spinner`}
                            />
                            <span className={`${loading ? 'd-none' : ''}`}>
                                Login
                            </span>
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    loading: state.loading,
});

export default connect(mapStateToProps)(LoginForm);
