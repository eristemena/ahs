import React, { useState, Fragment } from 'react';
import { postWithAuth } from '../../axios';
import { addAlert } from '../../redux/actions/alert';
import { StockForm } from '../../components/Forms';
import { connect } from 'react-redux';
import CustomSpinner from '../../components/CustomSpinner';

const AddStock = ({ alert, history, loading }) => {
    const [submitting, setSubmitting] = useState(false);

    const onSubmitHandler = (
        date,
        type,
        quantity,
        customer_id,
        info
    ) => {
        setSubmitting(true);
        postWithAuth(
            '/stocks',
            {
                date,
                type,
                quantity,
                info,
                customer_id,
            },
            (success) => {
                setSubmitting(false);
                alert('Transaksi berhasil ditambahkan', 'success');
                history.goBack();
            },
            (error) => {
                setSubmitting(false);
                alert(`Telah terjadi kesalahan: ${error && error.message}`);
            }
        );
    };
    return (
        <Fragment>
            {!loading ? (
                <StockForm
                    submitting={submitting}
                    onSubmit={onSubmitHandler}
                    history={history}
                />
            ) : (
                <CustomSpinner loading={loading} type="page" />
            )}
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

export default connect(mapStateToProps, mapDispatchToProps)(AddStock);
