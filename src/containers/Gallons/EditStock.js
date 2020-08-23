import React, { useState, Fragment, useEffect } from 'react';
import { put, get } from '../../axios';
import { addAlert } from '../../redux/actions/alert';
import { StockForm } from '../../components/Forms';
import { connect } from 'react-redux';
import CustomSpinner from '../../components/CustomSpinner';
import { checkAdminMerchant } from '../../utilities';
import { setLoading } from '../../redux/actions/loading';

const EditStock = ({ alert, user, loading, history, setLoading }) => {
    const [submitting, setSubmitting] = useState(false);
    const [id, setId] = useState(null);
    const [date, setDate] = useState(null);
    const [type, setType] = useState(null);
    const [quantity, setQuantity] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [info, setInfo] = useState(null);

    useEffect(() => {
        setLoading(true);
        if (!checkAdminMerchant(user)) {
            alert('Login sebagai admin merchant untuk menambahkan produk');
            history.goBack();
        }

        const search = history.location.search;

        if (!search.length > 0) {
            history.goBack();
            return alert('Telah terjadi kesalahan');
        }

        if (!search.includes('id')) {
            history.goBack();
            return alert('Telah terjadi kesalahan');
        }

        const queryId = search.replace('?id=', '');

        if (isNaN(queryId)) {
            history.goBack();
            return alert('Telah terjadi kesalahan');
        }

        setId(queryId);
        get(
            `/stocks?id=${queryId}`,
            ({ data: { rows } }) => {
                const stock = rows[0];
                setDate(new Date(stock.date));
                setQuantity(stock.quantity);
                setType(stock.type);
                if (stock.customer_id) {
                    setCustomer(stock.customer_id);
                }
                setInfo(stock.info);
                setLoading(false);
            },
            (error) => {
                setLoading(false);
                history.goBack();
                alert(`Telah terjadi kesalahan: ${error && error.message}`);
            }
        );
    }, []);

    const onSubmitHandler = (date, type, quantity, customer_id, info) => {
        setSubmitting(true);
        put(
            `/stocks/${id}`,
            {
                date,
                type,
                quantity,
                info,
                customer_id,
            },
            (success) => {
                setSubmitting(false);
                alert('Transaksi berhasil diedit', 'success');
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
                    stateDate={date}
                    stateQuantity={quantity}
                    stateType={type}
                    stateSelectedCustomer={customer}
                    stateInfo={info}
                    action="Edit"
                />
            ) : (
                <CustomSpinner loading={loading} type="page" />
            )}
        </Fragment>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
    setLoading: (loading) => dispatch(setLoading(loading)),
});

const mapStateToProps = (state) => ({
    loading: state.loading,
    user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditStock);
