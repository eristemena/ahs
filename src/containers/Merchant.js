import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import AddMerchant from './Merchants/AddMerchant';
import { addAlert } from '../redux/actions/alert';
import GetMerchants from './Merchants/GetMerchants';

const Merchant = ({ user, history, alert }) => {
    useEffect(() => {
        if (!user) {
            alert('Anda belum login. Silahkan login terlebih dahulu');
            history.push('/');
        } else if (user.merchant_id !== null) {
            alert('Forbidden');
            history.push('/');
        }
    }, []);

    // console.log('test', auth);
    return (
        <Switch>
            <Route path="/merchants/get" component={GetMerchants} />
            <Route path="/merchants/add" exact component={AddMerchant} />
        </Switch>
    );
};

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
    alert: (message) => dispatch(addAlert(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Merchant);
