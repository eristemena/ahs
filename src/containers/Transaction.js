import React, { useEffect } from 'react';
import { addAlert } from '../redux/actions/alert';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import {
	GetTransaction,
	AddTransaction,
	EditTransaction,
} from './Transactions';
import NotFound from './NotFound';

const Transaction = ({ user, alert, history }) => {
	useEffect(() => {
		if (!user) {
			alert('Anda belum login. Silahkan login terlebih dahulu');
			history.push('/');
		} else if (user.group_id !== 1) {
			alert('Login sebagai admin merchant untuk mengakses');
			history.push('/');
		}
	}, []);
	return (
		<Switch>
			<Route path="/transactions/get" exact component={GetTransaction} />
			<Route path="/transactions/add" exact component={AddTransaction} />
			<Route path="/transactions/edit" component={EditTransaction} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
