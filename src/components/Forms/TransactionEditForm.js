import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { addAlert } from '../../redux/actions/alert';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import Select from 'react-select';
import { FormGroup, Label } from 'reactstrap';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import id from 'date-fns/locale/id';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import 'moment/locale/id';
import { get } from '../../axios';
import { Card, CardBody, Row, Col, InputGroup } from 'reactstrap';
import { intlMessage } from '../../language';
import SubmitAndCancelButton from './SubmitAndCancelButtons';
registerLocale('id', id);

const TransactionEditForm = ({
    stateDate,
    stateType,
    stateCustomer,
    stateProduct,
    stateQuantity,
    stateInfo,
    onSubmit = () => {},
    history,
    language,
    submitting,
    alert,
}) => {
    const [owned, setOwned] = useState([]);
    const [loadingOwned, setLoadingOwned] = useState(false);
    const [ownedCustomers, setOwnedCustomers] = useState([]);
    const [loadingOwnedCustomer, setLoadingOwnedCustomer] = useState(false);

    const {
        transactions: { form: transactionForm },
    } = intlMessage(language);

    const schema = Yup.object().shape({
        date: Yup.date().required(transactionForm.error.date),
        type: Yup.string(),
        customer_id: Yup.number()
            .nullable(true)
            .when('type', {
                is: (val) => val && val.length > 0 && val === 'sell',
                then: Yup.number()
                    .integer()
                    .nullable(false)
                    .typeError(transactionForm.error.customer)
                    .required(transactionForm.error.customer),
            }),
        product_id: Yup.number()
            .typeError(transactionForm.product)
            .integer()
            .required(),
        quantity: Yup.number().required(transactionForm.quantity),
        info: Yup.string().optional(),
    });

    useEffect(() => {
        setLoadingOwned(true);
        setLoadingOwnedCustomer(true);
        get(
            '/products',
            ({ data }) => {
                if (!data.length > 0) {
                    history.goBack();
                    return alert('Anda belum memiliki produk');
                }
                setOwned(
                    data.map(({ id, name }) => ({ value: id, label: name }))
                );
                setLoadingOwned(false);
            },
            (error) => {
                history.goBack();
                alert('Telah terjadi kesalahan');
                setLoadingOwned(false);
            }
        );
        get(
            `/customers`,
            ({ data }) => {
                setOwnedCustomers(
                    data.map(({ id, name }) => ({
                        value: id,
                        label: name,
                    }))
                );
                setLoadingOwnedCustomer(false);
            },
            (error) => {
                history.goBack();
                alert('Telah terjadi kesalahan');
                setLoadingOwnedCustomer(false);
            }
        );
    }, []);

    const submitHandler = ({
        date,
        type,
        customer_id,
        product_id,
        quantity,
        info,
    }) => {
        const dateSend = moment(date).format('YYYY-MM-DD');
        onSubmit(
            dateSend,
            product_id,
            type,
            quantity,
            customer_id || null,
            info.length === 0 ? null : info
        );
    };

    return (
        <Formik
            initialValues={{
                date: stateDate || '',
                type: stateType || 'sell',
                customer_id: stateCustomer || null,
                product_id: stateProduct || null,
                quantity: stateQuantity || 1,
                info: stateInfo || '',
            }}
            enableReinitialize
            onSubmit={submitHandler}
            validationSchema={schema}>
            {({ errors, touched, setValues, values }) => (
                <Card className="custom-form-card">
                    <CardBody>
                        <Form>
                            <FormGroup id="date">
                                <Label className="d-block" for="date">
                                    {transactionForm.date.label}
                                </Label>
                                <ReactDatePicker
                                    selected={values.date}
                                    locale="id"
                                    popperPlacement="bottom"
                                    id="date"
                                    name="date"
                                    dateFormat="dd MMMM yyyy"
                                    className="form-control date-picker"
                                    placeholderText={
                                        transactionForm.date.placeholder
                                    }
                                    disabledKeyboardNavigation
                                    maxDate={new Date()}
                                    todayButton={`Hari ini (${moment(
                                        new Date()
                                    ).format('DD MMMM')})`}
                                    onChange={(e) =>
                                        setValues({ ...values, date: e })
                                    }
                                />
                                {errors.date && touched.date ? (
                                    <div className="feedback invalid d-block">
                                        {errors.date}
                                    </div>
                                ) : null}
                            </FormGroup>
                            <FormGroup id="type">
                                <Label className="d-block">
                                    {transactionForm.type.label}
                                </Label>
                                <div className="form-check form-check-inline align-middle custom-form-check">
                                    <Field
                                        type="radio"
                                        name="type"
                                        value="sell"
                                        id="sell"
                                        className="form-check-input"
                                    />
                                    <Label
                                        for="sell"
                                        className="form-check-label">
                                        {transactionForm.type.sell}
                                    </Label>
                                </div>
                                <div className="form-check form-check-inline align-middle custom-form-check">
                                    <Field
                                        type="radio"
                                        name="type"
                                        value="buy"
                                        id="buy"
                                        className="form-check-input"
                                        onChange={() =>
                                            setValues({
                                                ...values,
                                                customer_id: 0,
                                                type: 'buy',
                                            })
                                        }
                                    />
                                    <Label
                                        for="buy"
                                        className="form-check-label">
                                        {transactionForm.type.buy}
                                    </Label>
                                </div>
                            </FormGroup>
                            {values.type === 'sell' ? (
                                <FormGroup>
                                    <Label className="d-block" for="customer">
                                        {transactionForm.customer.label}
                                    </Label>
                                    <Select
                                        id="customer"
                                        classNamePrefix="custom-searchable-select "
                                        isLoading={loadingOwnedCustomer}
                                        isDisabled={loadingOwnedCustomer}
                                        noOptionsMessage={() => (
                                            <span className="position-relative">
                                                Pelanggan tidak ditemukan,{' '}
                                                <Link
                                                    to="/customers/add?shortcut=true"
                                                    className="stretched-link text-decoration-none">
                                                    silahkan tambah pelanggan
                                                    baru
                                                </Link>
                                            </span>
                                        )}
                                        options={ownedCustomers}
                                        onChange={(e) =>
                                            setValues({
                                                ...values,
                                                customer_id: e.value,
                                            })
                                        }
                                        value={
                                            values.customer_id && {
                                                value: values.customer_id,
                                                label: ownedCustomers.map(
                                                    (own) =>
                                                        own.value ===
                                                        values.customer_id
                                                            ? own.label
                                                            : ''
                                                ),
                                            }
                                        }
                                        placeholder={
                                            transactionForm.customer.placeholder
                                        }
                                        isSearchable
                                    />
                                    {errors.customer_id &&
                                    touched.customer_id ? (
                                        <div className="feedback invalid left-75 d-block">
                                            {errors.customer_id}
                                        </div>
                                    ) : null}
                                </FormGroup>
                            ) : null}
                            <Row>
                                <Col xs={6}>
                                    <FormGroup>
                                        <Label
                                            className="d-block"
                                            for="product">
                                            {transactionForm.product.label}
                                        </Label>
                                        <Select
                                            id="product"
                                            classNamePrefix="custom-searchable-select "
                                            isLoading={loadingOwned}
                                            isDisabled={loadingOwned}
                                            noOptionsMessage={() => (
                                                <span className="position-relative">
                                                    Produk tidak ditemukan,{' '}
                                                    <Link
                                                        to="/products/add?shortcut=true"
                                                        className="stretched-link text-decoration-none">
                                                        silahkan tambah produk
                                                        baru
                                                    </Link>
                                                </span>
                                            )}
                                            options={owned}
                                            onChange={(e) =>
                                                setValues({
                                                    ...values,
                                                    product_id: e.value,
                                                })
                                            }
                                            value={
                                                values.product_id && {
                                                    value: values.product_id,
                                                    label: owned.map((own) =>
                                                        own.value ===
                                                        values.product_id
                                                            ? own.label
                                                            : ''
                                                    ),
                                                }
                                            }
                                            placeholder={
                                                transactionForm.product
                                                    .placeholder
                                            }
                                            isSearchable
                                        />
                                        {errors.product_id &&
                                        touched.product_id ? (
                                            <div className="feedback invalid d-block">
                                                {errors.product_id}
                                            </div>
                                        ) : null}
                                    </FormGroup>
                                </Col>
                                <Col xs={6}>
                                    <FormGroup>
                                        <Label>
                                            {transactionForm.quantity.label}
                                        </Label>
                                        <InputGroup>
                                            <Field
                                                className="form-control"
                                                type="number"
                                                min="0"
                                                name="quantity"
                                            />
                                        </InputGroup>
                                        {errors.quantity && touched.quantity ? (
                                            <div className="feedback invalid d-block">
                                                {errors.quantity}
                                            </div>
                                        ) : null}
                                    </FormGroup>
                                </Col>
                            </Row>
                            <FormGroup id="info">
                                <Label for="info">
                                    {transactionForm.info.label}
                                </Label>
                                <Field
                                    className="form-control"
                                    id="info"
                                    name="info"
                                    as="textarea"
                                    maxLength="150"
                                    rows="4"
                                    placeholder={
                                        transactionForm.info.placeholder
                                    }
                                />
                            </FormGroup>
                            <SubmitAndCancelButton
                                submitting={submitting}
                                loading1={loadingOwned}
                                loading2={loadingOwnedCustomer}
                                action="Edit"
                                history={history}
                            />
                        </Form>
                    </CardBody>
                </Card>
            )}
        </Formik>
    );
};

const mapStateToProps = (state) => ({
    language: state.language,
});

const mapDispatchToProps = (dispatch) => ({
    alert: (message) => dispatch(addAlert(message)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionEditForm);
