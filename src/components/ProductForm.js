import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addAlert } from '../redux/actions/alert';

const ProductForm = ({
    onSubmit = () => {},
    loading,
    stateName = '',
    statePrice = '',
    stateBuyingPrice = '',
    action,
    alert,
    history,
}) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [buyingPrice, setBuyingPrice] = useState('');

    useEffect(() => {
        setName(stateName);
        setPrice(statePrice);
        setBuyingPrice(stateBuyingPrice);
    }, [stateName, statePrice, stateBuyingPrice]);

    const submitHandler = (e) => {
        e.preventDefault();

        if (!name.length > 0) {
            return alert(`Nama produk perlu diisi`);
        } else if (!price.length > 0) {
            return alert('Harga jual perlu diisi');
        } else if (!buyingPrice.length > 0) {
            return alert('Harga beli perlu diisi');
        }

        onSubmit(name, price * 1, buyingPrice * 1);
    };

    // console.log(loading)

    return (
        <form onSubmit={submitHandler}>
            <div className="form-group">
                <label htmlFor="product-name">Name</label>
                <input
                    type="text"
                    className="form-control mb-2"
                    id="product-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="price">Price</label>
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Rp.</span>
                    </div>
                    <input
                        type="number"
                        className="form-control"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <label htmlFor="buying-price">Buying Price</label>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Rp.</span>
                    </div>
                    <input
                        type="number"
                        className="form-control"
                        id="buying-price"
                        value={buyingPrice}
                        onChange={(e) => setBuyingPrice(e.target.value)}
                    />
                </div>
                <div className="d-flex">
                    <button
                        type="submit"
                        className={`btn btn-primary mr-2 ${
                            loading && 'disabled'
                        }`}
                        disabled={loading}
                    >
                        {action ? action : 'Submit'}
                    </button>
                    <button
                        type="button"
                        className={`btn btn-secondary ${loading && 'disabled'}`}
                        disabled={loading}
                        onClick={() => history.goBack()}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message) => dispatch(addAlert(message)),
});

export default connect(null, mapDispatchToProps)(ProductForm);
