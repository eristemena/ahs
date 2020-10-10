import React from 'react';
import PropTypes from 'prop-types';
import { addAlert } from '../../redux/actions/alert';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Label, FormGroup, CardBody, Card } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import CustomSpinner from '../CustomSpinner';
import * as Yup from 'yup';

function RegisterForm({ onSubmit = () => {}, submitting, history }) {
    const schema = Yup.object().shape({
        name: Yup.string().min(4, "Nama harus lebih dari 3 karakter").required('Nama perlu diisi'),
        email: Yup.string()
            .email('Email tidak valid')
            .required('Email perlu diisi'),
        ahs: Yup.string().required('Nama AHS perlu diisi'),
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

    const submitHandler = ({ name, email, ahs, password }) => {
        onSubmit(name, ahs, email, password);
    };

    return (
        <Formik
            initialValues={{
                name: '',
                email: '',
                ahs: '',
                password: '',
                password2: '',
            }}
            onSubmit={submitHandler}
            validationSchema={schema}>
            {({ errors, touched }) => (
                <Card className="custom-form-card">
                    <CardBody>
                        <Form>
                            <FormGroup>
                                <Label>Nama Lengkap</Label>
                                <Field className="form-control" name="name" />
                                {errors.name && touched.name ? (
                                    <div className="feedback invalid d-block">
                                        {errors.name}
                                    </div>
                                ) : null}
                            </FormGroup>
                            <FormGroup>
                                <Label>Alamat Email</Label>
                                <Field className="form-control" name="email" />
                                {errors.email && touched.email ? (
                                    <div className="feedback invalid d-block">
                                        {errors.email}
                                    </div>
                                ) : null}
                            </FormGroup>
                            <FormGroup>
                                <Label>Nama AHS</Label>
                                <Field className="form-control" name="ahs" />
                                {errors.ahs && touched.ahs ? (
                                    <div className="feedback invalid d-block">
                                        {errors.ahs}
                                    </div>
                                ) : null}
                            </FormGroup>
                            <FormGroup>
                                <Label>Password</Label>
                                <Field
                                    className="form-control"
                                    name="password"
                                    type="password"
                                />
                                {errors.password && touched.password ? (
                                    <div className="feedback invalid d-block">
                                        {errors.password}
                                    </div>
                                ) : null}
                            </FormGroup>
                            <FormGroup>
                                <Label>Ketik Ulang Password</Label>
                                <Field
                                    className="form-control"
                                    name="password2"
                                    type="password"
                                />
                                {errors.password2 && touched.password2 ? (
                                    <div className="feedback invalid d-block">
                                        {errors.password2}
                                    </div>
                                ) : null}
                            </FormGroup>
                            <div className="mt-3">
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
}

RegisterForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message) => dispatch(addAlert(message)),
});

export default withRouter(connect(null, mapDispatchToProps)(RegisterForm));
