import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { GetUsers } from './Users';

const User = () => {
    return (
        <Switch>
            <Route path="/users" component={GetUsers} />
        </Switch>
    );
};

export default connect()(User);
