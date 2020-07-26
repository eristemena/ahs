import React, { useEffect, useState } from 'react';
import { get, put } from '../../axios';
import { addAlert } from '../../redux/actions/alert';
import { withRouter, Link } from 'react-router-dom';
import TransactionForm from '../../components/TransactionForm';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/id';
import { setLoading } from '../../redux/actions/loading';

const EditTransaction = ({ alert, history }) => {
    const [owned, setOwned] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [id, setId] = useState('');
    const [date, setDate] = useState('');
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [info, setInfo] = useState('');
    const [type, setType] = useState('');
    const [customer, setCustomer] = useState('');

    useEffect(() => {
        const search = history.location.search;
        if (!search.length > 0) {
            history.push('/transactions/get');
            return alert('Telah terjadi kesalahan');
        }
        
        if (!search.includes('id')) {
            history.push('/transactions/get');
            return alert('Telah terjadi kesalahan');
        }

        const query = search.replace('?id=', '');

        if (!query.match(/^\d+$/)) {
            history.push('/transactions/get');
            return alert('Telah terjadi kesalahan');
        }

        get(
            `/transactions?id=${query}`,
            ({ data }) => {
                const item = data[0];
                setDate(new Date(item.date));
                setProductId(item.product_id);
                setQuantity(item.quantity * 1);
                setType(item.type);
                if (item.info) {
                    setInfo(item.info);
                }
                setCustomer(item.customer ? `${item.customer.id}` : '');
                setLoading(false);
            },
            (error) => {
                alert('Telah terjadi kesalahan');
                setLoading(false);
            }
        );
    }, []);

    const onSubmitHandler = (
        date,
        product_id,
        type,
        quantity,
        info,
        customer_id
    ) => {
        setSubmitting(true);
        put(
            `/transactions/${history.location.search.replace('?id=', '')}`,
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
                alert('Transaksi berhasil diedit', 'success');
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
            stateProduct={owned}
            loading={submitting}
            action="Edit"
            stateDate={date}
            stateSelected={productId}
            stateQuantity={quantity}
            stateInfo={info}
            stateType={type}
            stateSelectedCustomer={customer}
            onSubmit={onSubmitHandler}
            history={history}
        />
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
    setLoading: (loading) => dispatch(setLoading(loading)),
});

export default connect(null, mapDispatchToProps)(EditTransaction);
