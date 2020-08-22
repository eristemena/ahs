import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { GetStocks, AddStock, EditStock, AddGallon, EditGallon, GetGallons } from './Gallons';
import NotFound from './NotFound';

const GallonStocks = () => {
    return (
        <Switch>
            <Route
                path="/gallons/stocks/get"
                exact
                component={GetStocks}
            />
            <Route path="/gallons/stocks/add" exact component={AddStock} />
            <Route path="/gallons/stocks/edit" component={EditStock} />
            <Route path="/gallons/get" exact component={GetGallons} />
            <Route path="/gallons/add" exact component={AddGallon} />
            <Route path="/gallons/edit" component={EditGallon} />
            <Route component={NotFound} />
        </Switch>
    );
};

export default connect()(GallonStocks);
