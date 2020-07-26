import React, { useState, useEffect } from 'react';
import { postWithAuth } from '../../axios';
import { addAlert } from '../../redux/actions/alert';
import { TransactionForm } from '../../components/Forms';
import { connect } from 'react-redux';

const AddTransaction = ({ alert, history, user }) => {
    const [submitting, setSubmitting] = useState(false);

    const onSubmitHandler = (
        date,
        product_id,
        type,
        quantity,
        info,
        customer_id
    ) => {
        setSubmitting(true);
        console.log(customer_id, type);
        postWithAuth(
            '/transactions',
            {
                date,
                product_id,
                type,
                quantity,
                info,
                customer_id,
            },
            (success) => {
                setSubmitting(false);
                alert('Transaksi berhasil ditambahkan', 'success');
                history.push('/transactions/get');
            },
            (error) => {
                setSubmitting(false);
                alert('Telah terjadi kesalahan');
            }
        );
    };
    return (
        <TransactionForm
            loading={submitting}
            onSubmit={onSubmitHandler}
            history={history}
        />
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
});

const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(AddTransaction);
