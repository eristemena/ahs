import React, { Fragment, useEffect, useState } from 'react';
import { Switch, Route, withRouter } from 'react-router';
import { connect } from 'react-redux';
import {
	NotFound,
	Home,
	User,
	Product,
	Login,
	Merchant,
	Transaction,
	Customer,
	Alerts,
	Navigation,
	GallonsStocks,
	Report,
} from './index';
import { Row, Col } from 'reactstrap';
import { setMenuState, setSubMenuState } from '../redux/actions/menu';
import 'react-perfect-scrollbar/dist/css/styles.css';

const Content = ({ user, menu, history, setMenuState, setSubMenuState }) => {
	const [windowWidth, setWindowWidth] = useState(undefined);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);

		handleResize();

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		if (!user) {
			history.push('/');
		}
	}, [user]);

	const closeMenu = () => {
		if (windowWidth < 992) {
			setMenuState(false);
		}
		setSubMenuState(false);
	};

	return (
		<div className="main-container">
			<div className="notification-container">
				<Alerts />
			</div>
			{user !== null ? (
				<Fragment>
					<Navigation />
					<main
						onClick={closeMenu}
						className={`${menu ? 'sidenav-open' : ''}`}>
						<div className="container-fluid p-4 content-container">
							<Row>
								<Col className="p-0">
									<Switch>
										<Route
											path="/"
											exact
											component={Home}
										/>
										<Route
											path="/users"
											exact
											component={User}
										/>
										<Route
											path="/products"
											component={Product}
										/>
										<Route
											path="/merchants"
											component={Merchant}
										/>
										<Route
											path="/transactions"
											component={Transaction}
										/>
										<Route
											path="/customers"
											component={Customer}
										/>
										<Route
											path="/gallons"
											component={GallonsStocks}
										/>
										<Route
											path="/reports"
											component={Report}
										/>
										<Route component={NotFound} />
									</Switch>
								</Col>
							</Row>
						</div>
					</main>
				</Fragment>
			) : (
				<Login />
			)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.user,
	menu: state.menu.menu,
});

const mapDispatchToProps = (dispatch) => ({
	setMenuState: (menu) => dispatch(setMenuState(menu)),
	setSubMenuState: (sub) => dispatch(setSubMenuState(sub)),
});

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(Content)
);
