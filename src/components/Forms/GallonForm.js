import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    Label,
    FormGroup,
    CardBody,
    Card,
    InputGroup,
    InputGroupAddon,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import SubmitAndCancelButtons from './SubmitAndCancelButtons';

const GallonForm = ({
    onSubmit = () => {},
    stateName,
    stateStock,
    submitting,
    action,
    history,
}) => {
    const [overwrite, setOverwrite] = useState(false);
    const [overwriting, setOverwriting] = useState(false)

    const overwriteToggle = () => setOverwrite(!overwrite);

    const schema = Yup.object().shape({
        name: Yup.string().required('Nama galon harus diisi'),
        stock: Yup.number()
            .integer()
            .typeError('Stok harus angka')
            .min(0)
            .required('Stok harus diisi'),
    });

    const submitHandler = ({ name, stock }) => {
        onSubmit(name, stock);
    };

    const formGroup = (errors, touched) => (
        <Form>
            <FormGroup>
                <Label>Name</Label>
                <Field className="form-control" name="name" />
                {errors.name && touched.name && (
                    <div className="invalid-feedback d-block">
                        {errors.name}
                    </div>
                )}
            </FormGroup>
            <FormGroup>
                <Label>Stock</Label>
                <InputGroup>
                    <Field
                        className="form-control"
                        name="stock"
                        disabled={action && !overwriting ? true : false}
                    />
                    {action && !overwriting ? (
                        <InputGroupAddon addonType="append">
                            <button
                                className="btn btn-primary input-group-append-button px-3"
                                onClick={(e) => {
                                    e.preventDefault();
                                    overwriteToggle()
                                }}>
                                <span className="mr-2">Overwrite</span>
                                <i className="simple-icon-pencil"></i>
                            </button>
                        </InputGroupAddon>
                    ) : null}
                    {errors.stock && touched.stock && (
                        <div className="invalid-feedback d-block">
                            {errors.stock}
                        </div>
                    )}
                </InputGroup>
            </FormGroup>
            <SubmitAndCancelButtons
                submitting={submitting}
                action={action}
                history={history}
            />
        </Form>
    );

    return (
        <Fragment>
            <Formik
                initialValues={{
                    name: stateName || '',
                    stock: stateStock || '',
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
            <Modal isOpen={overwrite} toggle={overwriteToggle} backdrop="static">
                <ModalHeader>
                    <h3 className="modal-title text-danger">Warning!</h3>
                </ModalHeader>
                <ModalBody>
                    <p>
                        Are you really sure want to overwrite this item's
                        stock?
                    </p>
                </ModalBody>
                <ModalFooter>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                            overwriteToggle();
                            setOverwriting(true)
                        }}>
                        Overwrite
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={overwriteToggle}>
                        Cancel
                    </button>
                </ModalFooter>
            </Modal>
        </Fragment>
    );
};

GallonForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    stateName: PropTypes.string,
    stateStock: PropTypes.string,
    submitting: PropTypes.bool.isRequired,
    action: PropTypes.string,
    history: PropTypes.object.isRequired,
};

export default GallonForm;
