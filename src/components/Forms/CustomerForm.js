import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Label, FormGroup, CardBody, Card } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import CustomSpinner from '../CustomSpinner';
import * as Yup from 'yup';

const CustomerForm = ({
    stateName = '',
    stateEmail = '',
    statePhone = '',
    stateAddress = '',
    onSubmit = () => {},
    submitting,
    history,
}) => {

    const schema = Yup.object().shape({
        name: Yup.string().required("Nama harus diisi"),
        email: Yup.string().email('Email tidak valid'),
        phone: Yup.number().required("Nomor telepon perlu diisi"),
        address: Yup.string().min(4, "Alamat harus lebih dari 3 karakter").required("Alamat harus diisi")
    })

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
            onSubmit={submitHandler}
            enableReinitialize
            validationSchema={schema}>
            {({ errors, touched }) => (
                <Card className="custom-form-card">
                    <CardBody>
                        <Form>
                            <FormGroup className="form-group">
                                <Label>Name</Label>
                                <Field
                                    className="form-control"
                                    name="name"
                                />
                                {errors.name && touched.name && (
                                    <div className="invalid-feedback d-block">
                                        {errors.name}
                                    </div>
                                )}
                            </FormGroup>
                            <FormGroup className="form-group">
                                <Label>Email</Label>
                                <Field
                                    className="form-control"
                                    name="email"
                                />
                                {errors.email && touched.email && (
                                    <div className="invalid-feedback d-block">
                                        {errors.email}
                                    </div>
                                )}
                            </FormGroup>
                            <FormGroup className="form-group">
                                <Label>Phone</Label>
                                <Field
                                    className="form-control"
                                    name="phone"
                                />
                                {errors.phone && touched.phone && (
                                    <div className="invalid-feedback d-block">
                                        {errors.phone}
                                    </div>
                                )}
                            </FormGroup>
                            <FormGroup className="form-group">
                                <Label>Address</Label>
                                <Field
                                    className="form-control"
                                    as="textarea"
                                    name="address"
                                />
                                {errors.address && touched.address && (
                                    <div className="invalid-feedback d-block">
                                        {errors.address}
                                    </div>
                                )}
                            </FormGroup>
                            <div>
                                <button
                                    className={`btn btn-primary submit-button mr-2 ${
                                        submitting ? 'disabled' : ''
                                    }`}
                                    type="submit"
                                    disabled={submitting}>
                                    <CustomSpinner
                                        loading={submitting}
                                        type="button"
                                    />
                                    <span
                                        className={`${
                                            submitting ? 'd-none' : ''
                                        }`}>
                                        Submit
                                    </span>
                                </button>
                                <button
                                    className="btn btn-secondary cancel-button"
                                    type="button"
                                    onClick={() => history.goBack()}>
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            )}
        </Formik>
    );
};

CustomerForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    loading: state.loading,
});

export default connect(mapStateToProps)(CustomerForm);
