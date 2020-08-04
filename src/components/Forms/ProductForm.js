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
import * as Yup from 'yup';
import SubmitAndCancelButtons from './SubmitAndCancelButtons';
import { intlMessage } from '../../language';

const ProductForm = ({
    onSubmit = () => {},
    submitting,
    stateName = '',
    statePrice = '',
    stateBuyingPrice = '',
    history,
    action,
    language,
}) => {
    const {
        products: { form },
    } = intlMessage(language);

    const schema = Yup.object().shape({
        name: Yup.string().min(4, form.error.name.lt4).required(form.error.name.empty),
        price: Yup.number().integer().typeError(form.error.price.NaN).required(form.error.price.empty),
        buying_price: Yup.number().integer().typeError(form.error.buying_price.NaN).required(form.error.buying_price.empty),
    });

    const submitHandler = ({ name, price, buying_price }) => {
        onSubmit(name, price * 1, buying_price * 1);
    };

    const formGroup = (errors, touched) => (
        <Form>
            <FormGroup>
                <Label>{form.name}</Label>
                <Field className="form-control" name="name" />
                {errors.name && touched.name && (
                    <div className="invalid-feedback d-block">
                        {errors.name}
                    </div>
                )}
            </FormGroup>
            <FormGroup>
                <Label>{form.price}</Label>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>Rp.</InputGroupText>
                    </InputGroupAddon>
                    <Field className="form-control" name="price" />
                </InputGroup>

                {errors.price && touched.price && (
                    <div className="invalid-feedback d-block">
                        {errors.price}
                    </div>
                )}
            </FormGroup>
            <FormGroup>
                <Label>{form.buying_price}</Label>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>Rp.</InputGroupText>
                    </InputGroupAddon>
                    <Field className="form-control" name="buying_price" />
                </InputGroup>

                {errors.buying_price && touched.buying_price && (
                    <div className="invalid-feedback d-block">
                        {errors.buying_price}
                    </div>
                )}
            </FormGroup>
            <SubmitAndCancelButtons
                submitting={submitting}
                action={action}
                history={history}
            />
        </Form>
    );

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
                    <CardBody>{formGroup(errors, touched)}</CardBody>
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

const mapStateToProps = (state) => ({
    language: state.language,
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductForm);
