import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { GetStocks } from './Stocks';
import { Cards } from './Reports/Sales/index';
import { Container, Row, Col, CardTitle, Card, CardBody } from 'reactstrap';
import { get, put } from '../axios';
import {
	setLoading,
	addAlert,
	getProductStocks,
	logout,
} from '../redux/actions';
import { CustomSpinner } from '../components';
import moment from 'moment';
import { intlMessage } from '../language';
import { getProducts } from '../redux/actions';
import { errorHandler } from '../utilities';

function Home({
	merchant_id,
	setLoading,
	loading,
	history,
	language,
	alert,
	logout,
}) {
	const [income, setIncome] = useState(0);
	const [spending, setSpending] = useState(0);
	const [revenue, setRevenue] = useState(0);

	useEffect(() => {
		if (merchant_id) {
			setLoading(true);
			get(
				`/transactions/revenue?start_date=${moment().format(
					'YYYY-MM-DD'
				)}&end_date=${moment().format('YYYY-MM-DD')}`,
				({ data }) => {
					setIncome(data.income);
					setSpending(data.spending);
					setRevenue(data.revenue);
					setLoading(false);
				},
				(error) => {
					errorHandler(error, alert, logout);
					setLoading(false);
				}
			);
		}
	}, []);

	const { sales } = intlMessage(language);

	return (
		<Fragment>
			{!loading ? (
				<Container fluid>
					<h1 className="page-title">Home</h1>
					{merchant_id ? (
						<Fragment>
							<Card>
								<div className="custom-button">
									<button
										className="go-to-button"
										onClick={() =>
											history.push('/reports/sales')
										}
										title="Go to page">
										<i className="simple-icon-action-redo"></i>
									</button>
								</div>
								<CardTitle className="p-3 m-0">
									<h3>Sales (Today)</h3>
								</CardTitle>
								<CardBody className="pt-0">
									<Row>
										<Col xs="12" sm="4" className="mb-2">
											<Cards
												title={sales.cards.income}
												number={income}
												color="dark"
											/>
										</Col>
										<Col xs="12" sm="4" className="mb-2">
											<Cards
												title={sales.cards.spending}
												number={spending}
												color="dark"
											/>
										</Col>
										<Col xs="12" sm="4" className="mb-2">
											<Cards
												title={sales.cards.revenue}
												number={revenue}
											/>
										</Col>
									</Row>
								</CardBody>
							</Card>
							<GetStocks
								history={history}
								alert={alert}
								logout={logout}
							/>
						</Fragment>
					) : (
						<h1>Welcome Admin</h1>
					)}
				</Container>
			) : (
				<CustomSpinner type="page" loading={loading} />
			)}
		</Fragment>
	);
}

const mapStateToProps = (state) => ({
	merchant_id: state.user.merchant_id,
	loading: state.loading,
	language: state.language,
	product_stock: state.product_stock,
});

const mapDispatchToProps = (dispatch) => ({
	setLoading: (loading) => dispatch(setLoading(loading)),
	getProducts: () => dispatch(getProducts(1, null, 0)),
	alert: (message) => dispatch(addAlert(message)),
	getProductStocks: () => dispatch(getProductStocks()),
	logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
