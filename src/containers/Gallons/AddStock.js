import React, { useState, Fragment, useEffect } from 'react';
import { postWithAuth } from '../../axios';
import { addAlert } from '../../redux/actions/alert';
import { StockForm } from '../../components/Forms';
import { connect } from 'react-redux';
import CustomSpinner from '../../components/CustomSpinner';
import { setLoading } from '../../redux/actions/loading';

const AddStock = ({ alert, history, loading }) => {
    const [submitting, setSubmitting] = useState(false);
    const [newWindow, setNewWindow] = useState(false);

    useEffect(() => {
        const search = history.location.search;

        if (search.length > 0 && search.includes('shortcut')) {
            if (search.replace('?shortcut=', '') === 'true') {
                setNewWindow(true);
            } else {
                history.goBack();
                alert('Telah terjadi kesalahan');
            }
        }
    }, []);

    const onSubmitHandler = (date, type, quantity, customer_id, info) => {
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
            () => {
                setSubmitting(false);
                alert(`Transaksi berhasil ditambahkan. ${newWindow ? 'Halaman akan ditutup secara otomatis' : ''}`, 'success');
                if (newWindow) {
                    setTimeout(() => {
                        window.close();
                    }, 5000)
                } else {
                    history.goBack();
                }
            },
            (error) => {
                setSubmitting(false);
                alert(`Telah terjadi kesalahan: ${error && error.message}`);
            }
        );
    };
    return <Fragment>{!loading ? <StockForm submitting={submitting} onSubmit={onSubmitHandler} history={history} shortcut={newWindow} /> : <CustomSpinner loading={loading} type="page" />}</Fragment>;
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
    setLoading: (loading) => dispatch(setLoading(loading)),
});

const mapStateToProps = (state) => ({
    user: state.user,
    loading: state.loading,
});

export default connect(mapStateToProps, mapDispatchToProps)(AddStock);
