import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { addAlert } from '../redux/actions/alert';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import id from 'date-fns/locale/id';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import 'moment/locale/id';
import { setLoading } from '../redux/actions/loading';
import { get } from '../axios';
import CustomSpinner from './CustomSpinner'

registerLocale('id', id);

const TransactionForm = ({
    onSubmit = () => {},
    loading,
    stateDate,
    stateSelected = '',
    stateSelectedCustomer = '',
    stateQuantity = 1,
    stateType = 'sell',
    stateInfo = '',
    action,
    alert,
    history,
    customer,
    setLoading,
}) => {
    const [date, setDate] = useState(new Date());
    const [selected, setSelected] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [type, setType] = useState('');
    const [info, setInfo] = useState('');
    const [maxInfo, setMaxInfo] = useState(
        stateInfo.length ? 150 - stateInfo.length : 150
    );
    const [owned, setOwned] = useState([]);
    const [ownedCustomers, setOwnedCustomers] = useState([]);

    useEffect(() => {
        setDate(stateDate);
        setQuantity(stateQuantity);
        setSelected(`${stateSelected}`);
        setType(stateType);
        setInfo(stateInfo);
        setSelectedCustomer(stateSelectedCustomer);
    }, [
        stateDate,
        stateQuantity,
        stateSelected,
        stateType,
        stateInfo,
        stateSelectedCustomer,
    ]);

    useEffect(() => {
        setLoading(true);
        get(
            '/products',
            ({ data }) => {
                if (!data.length > 0) {
                    history.push('/transactions/get');
                    return alert('Anda belum memiliki produk');
                }
                setOwned(data);
                get(
                    `/customers`,
                    ({ data }) => {
                        setOwnedCustomers(data);
                        setLoading(false);
                    },
                    (error) => {
                        history.push('/transactions/get');
                        alert('Telah terjadi kesalahan');
                        setLoading(false);
                    }
                );
            },
            (error) => {
                history.push('/transactions/get');
                alert('Telah terjadi kesalahan');
                setLoading(false);
            }
        );
    }, []);

    const submitHandler = (e) => {
        e.preventDefault();

        let today = moment(date).format('YYYY-MM-DD');

        if (!today.length > 0 || !date) {
            return alert('Tanggal perlu dipilih');
        } else if (!selected.length > 0) {
            return alert('Produk perlu dipilih');
        } else if (!type.length > 0) {
            return alert('Jenis transaksi perlu dipilih');
        }

        if (selectedCustomer !== undefined) {
            if (type === 'sell' && !selectedCustomer.length > 0) {
                return alert('Pelanggan perlu dipilih');
            }
        }

        onSubmit(
            today,
            selected * 1,
            type,
            quantity * 1,
            /\S/.test(info) && info.length > 0 ? info : null,
            selectedCustomer ? selectedCustomer : null
        );
    };

    return (
        <Fragment>
            <CustomSpinner loading={loading} type="page" />
            <form
                onSubmit={submitHandler}
                className={`mt-2 ${loading ? 'd-none' : ''}`}>
                <div className="form-group">
                    <label htmlFor="date" className="d-block">
                        Tanggal:
                    </label>
                    <ReactDatePicker
                        selected={date}
                        locale="id"
                        dateFormat="dd MMMM yyyy"
                        className="form-control"
                        placeholderText="--Pilih tanggal--"
                        disabledKeyboardNavigation
                        maxDate={new Date()}
                        todayButton={`Hari ini (${moment(new Date()).format(
                            'DD MMMM'
                        )})`}
                        onChange={(e) => setDate(e)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="product">Produk:</label>
                    <select
                        id="product"
                        className="form-control"
                        onChange={(e) => {
                            setSelected(e.target.value);
                        }}
                        value={selected}>
                        <option value="" disabled>
                            --Pilih produk--
                        </option>
                        {owned.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Tipe transaksi:</label>
                    <div className="form-check p-0">
                        <div className="form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="type"
                                id="buy"
                                value="buy"
                                checked={type === 'buy'}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setType(e.target.value);
                                        setSelectedCustomer(undefined);
                                    }
                                }}
                            />
                            <label htmlFor="buy" className="form-check-label">
                                Beli
                            </label>
                            <input
                                className="form-check-input ml-3"
                                type="radio"
                                name="type"
                                id="sell"
                                value="sell"
                                checked={type === 'sell'}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setType(e.target.value);
                                        setSelectedCustomer('');
                                    }
                                }}
                            />
                            <label htmlFor="sell" className="form-check-label">
                                Jual
                            </label>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Jumlah barang:</label>
                    <input
                        type="number"
                        className="form-control w-25"
                        id="quantity"
                        min="0"
                        value={`${quantity}`}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </div>
                <div className={`form-group ${type === 'buy' && 'd-none'}`}>
                    <label htmlFor="product">Pelanggan:</label>
                    <select
                        id="product"
                        className="form-control"
                        onChange={(e) => {
                            setSelectedCustomer(`${e.target.value}`);
                        }}
                        value={selectedCustomer}>
                        <option value="" disabled>
                            --Pilih pelanggan--
                        </option>
                        {ownedCustomers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                                {customer.name} (Telepon: {customer.phone})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="info">
                        Info tambahan ({`${maxInfo}`}):
                    </label>
                    <textarea
                        className="form-control mb-4"
                        id="info"
                        rows="2"
                        maxLength="150"
                        value={info}
                        onChange={(e) => {
                            setInfo(e.target.value);
                            setMaxInfo(150 - e.target.value.length);
                        }}
                        placeholder={`--Tambahkan info/catatan khusus untuk transaksi ini (contoh: 'Belum dibayar')-- `}
                    />
                </div>
                <div className="d-flex">
                    <button
                        type="submit"
                        className={`btn btn-primary mr-2 ${
                            loading && 'disabled'
                        }`}
                        disabled={loading}>
                        {action ? action : 'Submit'}
                    </button>
                    <button
                        type="button"
                        className={`btn btn-secondary ${loading && 'disabled'}`}
                        disabled={loading}
                        onClick={() => history.goBack()}>
                        Cancel
                    </button>
                </div>
            </form>
        </Fragment>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message) => dispatch(addAlert(message)),
    setLoading: (loading) => dispatch(setLoading(loading)),
});

const mapStateToProps = (state) => ({
    customer: state.customer,
    loading: state.loading,
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionForm);
