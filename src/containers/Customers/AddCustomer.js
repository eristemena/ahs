import React, { useState } from 'react';
import { CustomerForm } from '../../components/Forms';
import { connect } from 'react-redux';
import { postWithAuth } from '../../axios';
import { addAlert } from '../../redux/actions/alert';

const AddCustomer = ({ history, alert }) => {
    const [submitting, setSubmitting] = useState(false);

    const submitHandler = (name, email, phone, address) => {
        setSubmitting(true);
        postWithAuth(
            '/customers',
            {
                name,
                email,
                phone,
                address,
            },
            (success) => {
                setSubmitting(false);
                alert('Pelanggan berhasil ditambahkan', 'success');
                history.push('/customers/get')
            },
            (error) => {
                alert(`Telah terjadi kesalahan: ${error.message}`);
                setSubmitting(false);
            }
        );
    };
    return <CustomerForm submitting={submitting} onSubmit={submitHandler} history={history} />;
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
});

export default connect(null, mapDispatchToProps)(AddCustomer);
