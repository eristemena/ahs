import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { GetUsers } from './Users';
import NotFound from './NotFound';

const User = () => {
	return (
		<Switch>
			<Route path="/users" component={GetUsers} />
			<Route component={NotFound} />
		</Switch>
	);
};

export default connect()(User);
