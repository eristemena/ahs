import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
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
import { setLoading } from '../../redux/actions/loading';
import { get } from '../../axios';
import { Card, CardBody } from 'reactstrap';
import { intlMessage } from '../../language';
import SubmitAndCancelButton from './SubmitAndCancelButtons';
registerLocale('id', id);

const TransactionForm = ({
    onSubmit = () => {},
    submitting,
    stateDate,
    stateSelected = '',
    stateSelectedCustomer = '',
    stateQuantity = 1,
    stateType = 'sell',
    stateInfo = '',
    action,
    alert,
    history,
    language,
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
        product_id: Yup.number()
            .integer()
            .required(transactionForm.error.product),
        type: Yup.string().default('sell'),
        quantity: Yup.number().positive().required(),
        customer_id: Yup.number().typeError(transactionForm.error.customer).when('type', {
            is: (val) =>
                val && val.length > 0 && val === 'sell' ? true : false,
            then: Yup.number()
                .integer()
                .positive()
                .required(transactionForm.error.customer),
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

    const form = (errors, touched, setValues, values) => (
        <Card className="custom-form-card">
            <CardBody>
                <Form>
                    <FormGroup>
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
                    <FormGroup>
                        <Label className="d-block" for="product">
                            {transactionForm.product.label}
                        </Label>
                        <Select
                            id="product"
                            classNamePrefix="custom-searchable-select "
                            isLoading={loadingOwned}
                            isDisabled={loadingOwned}
                            noOptionsMessage={() => 'Produk tidak ditemukan'}
                            name="product_id"
                            options={owned}
                            value={{
                                value: values.product_id,
                                label:
                                    values.product_id > 0
                                        ? owned.map((own) => {
                                              if (
                                                  own.value ===
                                                  values.product_id
                                              ) {
                                                  return own.label;
                                              }
                                          })
                                        : transactionForm.product.placeholder,
                            }}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    product_id: e.value,
                                })
                            }
                            isSearchable
                        />
                        {errors.product_id && touched.product_id ? (
                            <div className="invalid-feedback d-block">
                                {errors.product_id}
                            </div>
                        ) : null}
                    </FormGroup>
                    <FormGroup>
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
                    <FormGroup>
                        <Label for="quantity">
                            {transactionForm.quantity.label}
                        </Label>
                        <Field
                            className="form-control"
                            id="quantity"
                            type="number"
                            min="0"
                            name="quantity"
                        />
                        {errors.quantity && touched.quantity ? (
                            <div className="invalid-feedback d-block">
                                {errors.quantity}
                            </div>
                        ) : null}
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
                                noOptionsMessage={() =>
                                    'Pelanggan tidak ditemukan'
                                }
                                name="product_id"
                                options={ownedCustomers}
                                value={{
                                    value: values.customer_id,
                                    label:
                                        values.customer_id > 0
                                            ? ownedCustomers.map((own) => {
                                                  if (
                                                      own.value ===
                                                      values.customer_id
                                                  ) {
                                                      return own.label;
                                                  }
                                              })
                                            : transactionForm.customer
                                                  .placeholder,
                                }}
                                onChange={(e) =>
                                    setValues({
                                        ...values,
                                        customer_id: e.value,
                                    })
                                }
                                isSearchable
                            />
                            {errors.customer_id && touched.customer_id ? (
                                <div className="invalid-feedback left-75 d-block">
                                    {errors.customer_id}
                                </div>
                            ) : null}
                        </FormGroup>
                    ) : null}
                    <FormGroup>
                        <Label for="info">{transactionForm.info.label}</Label>
                        <Field
                            className="form-control"
                            id="info"
                            name="info"
                            as="textarea"
                            maxLength="150"
                            cols="5"
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
    );

    const submitHandler = ({
        date,
        product_id,
        type,
        quantity,
        customer_id,
        info,
    }) => {
        const dateSend = moment(date).format('YYYY-MM-DD');
        onSubmit(
            dateSend,
            product_id,
            type,
            quantity,
            !customer_id || typeof customer_id === 'string'
                ? null
                : customer_id,
            info.length === 0 ? null : info
        );
    };

    return (
        <Formik
            initialValues={{
                date: stateDate || '',
                product_id: stateSelected || '',
                type: stateType || 'sell',
                quantity: stateQuantity || 1,
                customer_id: stateSelectedCustomer || '',
                info: stateInfo || '',
            }}
            enableReinitialize
            onSubmit={submitHandler}
            validationSchema={schema}>
            {({ errors, touched, setValues, values }) => (
                <Fragment>{form(errors, touched, setValues, values)}</Fragment>
            )}
        </Formik>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message) => dispatch(addAlert(message)),
    setLoading: (loading) => dispatch(setLoading(loading)),
});

const mapStateToProps = (state) => ({
    customer: state.customer,
    loading: state.loading,
    language: state.language,
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionForm);
