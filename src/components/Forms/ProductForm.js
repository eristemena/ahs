import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addAlert } from '../../redux/actions/alert';
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
import { Formik, Form, Field } from 'formik';
import CustomSpinner from '../CustomSpinner';

const ProductForm = ({
    onSubmit = () => {},
    submitting,
    stateName = '',
    statePrice = '',
    stateBuyingPrice = '',
    history,
    action,
}) => {
    
    const validateName = (value) => {
        let error;
        if (!value) {
            error = 'Nama perlu diisi';
        } else if (value.length < 3) {
            error = 'Nama harus lebih dari 3 huruf';
        }
        return error;
    };

    const validatePrice = (value) => {
        let error;
        if (!value) {
            error = 'Harga jual perlu diisi';
        } else if (isNaN(value)) {
            error = 'Harga harus angka';
        }
        return error;
    };

    const submitHandler = ({ name, price, buyingPrice }) => {
        onSubmit(name, price * 1, buyingPrice * 1);
    };

    return (
        <Formik
            initialValues={{
                name: stateName || '',
                price: statePrice || '',
                buyingPrice: stateBuyingPrice || '',
            }}
            onSubmit={submitHandler}
            enableReinitialize>
            {({ errors, touched }) => (
                <Card className="custom-form-card">
                    <CardBody>
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
                                <Label>Price</Label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>Rp.</InputGroupText>
                                    </InputGroupAddon>
                                    <Field
                                        className="form-control"
                                        name="price"
                                        validate={validatePrice}
                                    />
                                </InputGroup>

                                {errors.price && touched.price && (
                                    <div className="invalid-feedback d-block">
                                        {errors.price}
                                    </div>
                                )}
                            </FormGroup>
                            <FormGroup className="form-group has-float-label">
                                <Label>Buying Price</Label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>Rp.</InputGroupText>
                                    </InputGroupAddon>
                                    <Field
                                        className="form-control"
                                        name="buyingPrice"
                                        validate={validatePrice}
                                    />
                                </InputGroup>

                                {errors.buyingPrice && touched.buyingPrice && (
                                    <div className="invalid-feedback d-block">
                                        {errors.buyingPrice}
                                    </div>
                                )}
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
                                        {action ? action : 'Submit'}
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

ProductForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message) => dispatch(addAlert(message)),
});

export default connect(null, mapDispatchToProps)(ProductForm);
