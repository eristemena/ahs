import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { GetStocks, AddStock, EditStock } from './Gallons';
import NotFound from './NotFound';

const GallonStocks = () => {
    return (
        <Switch>
            <Route path="/gallons/get" exact component={GetStocks} />
            <Route path="/gallons/add" component={AddStock} />
            <Route path="/gallons/edit" component={EditStock} />
            <Route component={NotFound} />
        </Switch>
    );
};

export default connect()(GallonStocks);
