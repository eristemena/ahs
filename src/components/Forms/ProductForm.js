import React from 'react';
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
import * as Yup from 'yup';

const ProductForm = ({
    onSubmit = () => {},
    submitting,
    stateName = '',
    statePrice = '',
    stateBuyingPrice = '',
    history,
    action,
}) => {

    const schema = Yup.object().shape({
        name: Yup.string().min(4, "Nama harus lebih dari 3 karakter").required("Nama harus diisi"),
        price: Yup.number().integer().required("Harga jual harus diisi"),
        buying_price: Yup.number().integer().required("Harga beli harus diisi")
    })

    const submitHandler = ({ name, price, buying_price }) => {
        console.log(name, price, buying_price)
        onSubmit(name, price * 1, buying_price * 1);
    };

    return (
        <Formik
            initialValues={{
                name: stateName || '',
                price: statePrice || '',
                buying_price: stateBuyingPrice || '',
            }}
            onSubmit={submitHandler}
            enableReinitialize
            validationSchema={schema}>
            {({ errors, touched }) => (
                <Card className="custom-form-card">
                    <CardBody>
                        <Form>
                            <FormGroup>
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
                            <FormGroup>
                                <Label>Price</Label>
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
                                    <div className="invalid-feedback d-block">
                                        {errors.price}
                                    </div>
                                )}
                            </FormGroup>
                            <FormGroup>
                                <Label>Buying Price</Label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>Rp.</InputGroupText>
                                    </InputGroupAddon>
                                    <Field
                                        className="form-control"
                                        name="buying_price"
                                    />
                                </InputGroup>

                                {errors.buying_price && touched.buying_price && (
                                    <div className="invalid-feedback d-block">
                                        {errors.buying_price}
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
    submitting: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message) => dispatch(addAlert(message)),
});

export default connect(null, mapDispatchToProps)(ProductForm);
