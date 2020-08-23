import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Main } from './Reports';
import NotFound from './NotFound';

const Report = () => {
    return (
        <Switch>
            <Route path="/reports/get" exact component={Main} />
            <Route component={NotFound} />
        </Switch>
    );
};

export default connect()(Report);
