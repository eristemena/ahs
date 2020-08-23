import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { addAlert } from '../redux/actions/alert';
import { GetProducts, AddProduct, EditProduct } from './Products';
import NotFound from './NotFound';

const Product = ({ history, user, alert }) => {
    const [me, setMe] = useState({});

    useEffect(() => {
        if (user) {
            setMe(user);
        } else {
            history.push('/');
            alert('Anda belum login. Silahkan login terlebih dahulu');
        }
    }, []);

    return (
        <Switch>
            <Route path="/products/get" component={GetProducts} />
            <Route path="/products/add" component={AddProduct} />
            <Route path="/products/edit" component={EditProduct} />
            <Route component={NotFound} />
        </Switch>
    );
};

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
    alert: (message) => dispatch(addAlert(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Product);
