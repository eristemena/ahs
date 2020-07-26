import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Switch, Route } from 'react-router-dom';
import { GetCustomers, AddCustomer, EditCustomer } from './Customers'

const Customer = () => {
    return (
        <Switch>
            <Route path="/customers/get" component={GetCustomers} />
            <Route path="/customers/add" exact component={AddCustomer} />
            <Route path="/customers/edit" component={EditCustomer} />
        </Switch>
    );
};

export default connect()(Customer);
