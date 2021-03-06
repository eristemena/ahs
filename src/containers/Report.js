import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Borrowing, Sales, Data } from './Reports';
import NotFound from './NotFound';

const Report = () => {
	return (
		<Switch>
			<Route path="/reports/borrowing" exact component={Borrowing} />
			<Route path="/reports/sales" exact component={Sales} />
			<Route path="/reports/data" exact component={Data} />
			<Route component={NotFound} />
		</Switch>
	);
};

export default connect()(Report);
