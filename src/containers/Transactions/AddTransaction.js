import React, { useState, useEffect, Fragment } from 'react';
import { postWithAuth } from '../../axios';
import { addAlert } from '../../redux/actions/alert';
import { TransactionForm } from '../../components/Forms';
import { connect } from 'react-redux';
import CustomSpinner from '../../components/CustomSpinner';

const AddTransaction = ({ alert, history, user, loading }) => {
    const [submitting, setSubmitting] = useState(false);

    const onSubmitHandler = (
        date,
        product_id,
        type,
        quantity,
        customer_id,
        info
    ) => {
        setSubmitting(true);
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
                alert(`Telah terjadi kesalahan: ${error.message}`);
            }
        );
    };
    return (
        <Fragment>
            <CustomSpinner loading={loading} type="page" />
            {!loading ? (
                <TransactionForm
                    submitting={submitting}
                    onSubmit={onSubmitHandler}
                    history={history}
                />
            ) : null}
        </Fragment>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
});

const mapStateToProps = (state) => ({
    user: state.user,
    loading: state.loading,
});

export default connect(mapStateToProps, mapDispatchToProps)(AddTransaction);
