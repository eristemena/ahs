import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { GetCustomers, AddCustomer, EditCustomer } from './Customers';
import NotFound from './NotFound';

const Customer = () => {
    return (
        <Switch>
            <Route path="/customers/get" exact component={GetCustomers} />
            <Route path="/customers/add" component={AddCustomer} />
            <Route path="/customers/edit" component={EditCustomer} />
            <Route component={NotFound} />
        </Switch>
    );
};

export default connect()(Customer);
