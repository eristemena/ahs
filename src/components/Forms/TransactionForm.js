import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import { addAlert } from '../../redux/actions/alert';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import Select from 'react-select';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import id from 'date-fns/locale/id';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import 'moment/locale/id';
import { get } from '../../axios';
import { Card, CardBody, Row, Col, InputGroup, FormGroup, InputGroupAddon, Label } from 'reactstrap';
import { intlMessage } from '../../language';
import SubmitAndCancelButton from './SubmitAndCancelButtons';
registerLocale('id', id);

const TransactionForm = ({
    onSubmit = () => {},
    submitting,
    action,
    alert,
    history,
    language,
}) => {
    const [owned, setOwned] = useState([]);
    const [loadingOwned, setLoadingOwned] = useState(false);
    const [ownedCustomers, setOwnedCustomers] = useState([]);
    const [loadingOwnedCustomer, setLoadingOwnedCustomer] = useState(false);
    
    const [products, setProducts] = useState([{product_id: null, quantity: 1}]);
    
    // dummy state to force re render
    const [re, setRe] = useState(false)

    const {
        transactions: { form: transactionForm },
    } = intlMessage(language);

    const schema = Yup.object().shape({
        date: Yup.date().typeError(transactionForm.error.date).required(),
        type: Yup.string(),
        customer_id: Yup.number().typeError(transactionForm.error.customer).when('type', {
            is: (val) =>
                val && val.length > 0 && val === 'sell',
            then: Yup.number()
                .typeError(transactionForm.error.customer)
                .integer()
                .positive(transactionForm.error.customer)
                .required(),
        }),
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
        info,
    }) => {
        const dateSend = moment(date).format('YYYY-MM-DD');
        let checkIfProductsEmpty = true;
        products.forEach((item) => {
            if (item.product_id === null) {
                checkIfProductsEmpty = false;
            }
        })

        if (!checkIfProductsEmpty) {
            return alert('Pilih produk')
        }

        onSubmit(
            dateSend,
            type,
            customer_id || null,
            products,
            info.length === 0 ? null : info
        );
    };

    return (
        <Formik
            initialValues={{
                date: null,
                type: 'sell',
                customer_id: null,
                info: '',
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
                                placeholderText={transactionForm.date.placeholder}
                                disabledKeyboardNavigation
                                maxDate={new Date()}
                                todayButton={`Hari ini (${moment(new Date()).format(
                                    'DD MMMM'
                                )})`}
                                onChange={(e) => setValues({ ...values, date: e })}
                            />
                            {errors.date && touched.date ? (
                                <div className="invalid-feedback d-block">
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
                                <Label for="sell" className="form-check-label">
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
                                <Label for="buy" className="form-check-label">
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
                                    name="product_id"
                                    options={ownedCustomers}
                                    onChange={(e) =>
                                        setValues({
                                            ...values,
                                            customer_id: e.value,
                                        })
                                    }
                                    placeholder={transactionForm.customer.placeholder}
                                    isSearchable
                                />
                                {errors.customer_id && touched.customer_id ? (
                                    <div className="invalid-feedback left-75 d-block">
                                        {errors.customer_id}
                                    </div>
                                ) : null}
                            </FormGroup>
                        ) : null}
                        <div className="mb-3">
                            {products.length > 0 || (
                                <p className="m-0">{transactionForm.product.label}</p>
                            )}
                            {products.map((item, index) => (
                                <Row>
                                    <Col xs={6}>
                                        <FormGroup>
                                            <Label className="d-block" for="product">
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
                                                value={item.product_id > 0 && {
                                                    value: item.product_id,
                                                    label: owned.map((own) => {
                                                        if (own.value === item.product_id) {
                                                            return own.label
                                                        }
                                                    })
                                                }}
                                                onChange={(e) => {
                                                    setProducts(prev => {
                                                        prev[index].product_id = e.value;
                                                        return prev;
                                                    });
                                                    setRe(!re)
                                                }}
                                                placeholder={transactionForm.product.placeholder}
                                                isSearchable
                                            />
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
                                                    min="1"
                                                    defaultValue="1"
                                                    name="quantity"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        e.persist()
                                                        setProducts(prev => {
                                                            prev[index].quantity = e.target.value * 1;
                                                            return prev;
                                                        });
                                                        setRe(!re)
                                                    }}
                                                />
                                                {index > 0 && (
                                                    <InputGroupAddon addonType="prepend">
                                                        <button 
                                                        className="btn btn-danger" 
                                                        type="button"
                                                        onClick={() => {
                                                            setProducts(prev => {
                                                                let placeholder = prev.filter((e, i) => i !== index)
                                                                return placeholder;
                                                            });
                                                            setRe(!re);
                                                        }}>
                                                            <i className="simple-icon-trash" />
                                                        </button>
                                                    </InputGroupAddon>
                                                )}
                                            </InputGroup>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            ))}
                            <button 
                            className="btn btn-primary mt-2" 
                            type="button"
                            onClick={() => setProducts([...products, {product_id: null, quantity: 1}])}
                            >Add Product</button>
                        </div>
                        <FormGroup id="info">
                            <Label for="info">{transactionForm.info.label}</Label>
                            <Field
                                className="form-control"
                                id="info"
                                name="info"
                                as="textarea"
                                maxLength="150"
                                rows="4"
                                placeholder={transactionForm.info.placeholder}
                            />
                        </FormGroup>
                        <SubmitAndCancelButton
                            submitting={submitting}
                            loading1={loadingOwned}
                            loading2={loadingOwnedCustomer}
                            action={action}
                            history={history}
                        />
                    </Form>
                </CardBody>
            </Card>
            )}
        </Formik>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message) => dispatch(addAlert(message)),
});

const mapStateToProps = (state) => ({
    language: state.language,
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionForm);
