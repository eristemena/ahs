import React, { useState, useEffect } from 'react';
import { addAlert } from '../redux/actions/alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Label, FormGroup, Button, Spinner } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import CustomSpinner from './CustomSpinner';

const CustomerForm = ({
    stateName = '',
    stateEmail = '',
    statePhone = '',
    stateAddress = '',
    onSubmit = () => {},
    alert,
    submitting,
    loading,
    history,
}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    useEffect(() => {
        setName(stateName);
        setEmail(stateEmail);
        setPhone(statePhone);
        setAddress(stateAddress);
    }, [stateName, statePhone, stateEmail, stateAddress]);

    const validateName = (value) => {
        let error;
        if (!value) {
            error = 'Nama perlu diisi';
        }
        return error;
    };

    const validateEmail = (value) => {
        let error;
        if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
            error = 'Alamat email salah';
        }
        return error;
    };

    const validatePhone = (value) => {
        let error;
        if (!value) {
            error = 'Nomor telepon perlu diisi';
        } else if (isNaN(value)) {
            error = 'Nomor telepon harus angka';
        } else if (value.length < 3) {
            error = 'Nomor telepon harus lebih dari 3 angka';
        }
        return error;
    };

    const validateAddress = (value) => {
        let error;
        if (!value) {
            error = 'Alamat perlu diisi';
        } else if (value.length < 3) {
            error = 'Alamat harus lebih dari 3 karakter';
        }
        return error;
    };

    const submitHandler = ({ name, email, phone, address }) => {
        onSubmit(name, email.length > 0 ? email : null, phone, address);
    };

    return (
        <Formik
            initialValues={{
                name: stateName || '',
                email: stateEmail || '',
                phone: statePhone || '',
                address: stateAddress || '',
            }}
            onSubmit={submitHandler}>
            {({ errors, touched }) => (
                <Form>
                    <FormGroup className="form-group has-float-label">
                        <Label>Name</Label>
                        <Field
                            className="form-control"
                            name="name"
                            validate={validateName}
                        />
                        {errors.name && touched.name && (
                            <div className="invalid-feedback d-block">
                                {errors.name}
                            </div>
                        )}
                    </FormGroup>
                    <FormGroup className="form-group has-float-label">
                        <Label>Email</Label>
                        <Field
                            className="form-control"
                            name="email"
                            type="email"
                            validate={validateEmail}
                        />
                        {errors.email && touched.email && (
                            <div className="invalid-feedback d-block">
                                {errors.email}
                            </div>
                        )}
                    </FormGroup>
                    <FormGroup className="form-group has-float-label">
                        <Label>Phone</Label>
                        <Field
                            className="form-control"
                            name="phone"
                            validate={validatePhone}
                        />
                        {errors.phone && touched.phone && (
                            <div className="invalid-feedback d-block">
                                {errors.phone}
                            </div>
                        )}
                    </FormGroup>
                    <FormGroup className="form-group has-float-label">
                        <Label>Address</Label>
                        <Field
                            className="form-control"
                            as="textarea"
                            name="address"
                            validate={validateAddress}
                        />
                        {errors.address && touched.address && (
                            <div className="invalid-feedback d-block">
                                {errors.address}
                            </div>
                        )}
                    </FormGroup>
                    <div className="customer-buttons">
                        <button
                            className={`btn btn-primary mr-2 ${
                                loading ? 'disabled' : ''
                            }`}
                            type="submit"
                            disabled={loading}>
                            <CustomSpinner loading={loading} type="button" />
                            <span className={`${loading ? 'd-none' : ''}`}>
                                Submit
                            </span>
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => history.goBack()}>
                            Cancel
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

CustomerForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message) => dispatch(addAlert(message)),
});

const mapStateToProps = (state) => ({
    loading: state.loading,
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomerForm);
