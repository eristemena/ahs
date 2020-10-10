import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { Label, FormGroup } from 'reactstrap';
import SubmitAndCancelButtons from './SubmitAndCancelButtons'

const RstPwFindEmailForm = ({ onSubmit = () => {}, loading, history }) => {
    const schema = Yup.object().shape({
        email: Yup.string().email().required('Email is required'),
    });

    const submitHandler = ({ email }) => {
        onSubmit(email);
    };

    return (
        <Formik
            initialValues={{
                email: '',
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
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                        <div></div>
                        <SubmitAndCancelButtons submitting={loading} history={history} action="Submit" />
                    </div>
                </Form>
            )}
        </Formik>
    );
};

RstPwFindEmailForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    loading: state.loading,
});

export default connect(mapStateToProps)(RstPwFindEmailForm);
