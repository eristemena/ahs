import React, { Fragment, useEffect, useState } from 'react';
import { Switch, Route, withRouter } from 'react-router';
import { connect } from 'react-redux';
import NotFound from './NotFound';
import Home from './Home';
import User from './User';
import Product from './Product';
import Login from './Login';
import Merchant from './Merchant';
import Transaction from './Transaction';
import Customer from './Customer';
import Alerts from '../components/Alerts';
import Navigation from './Navigation';
import { Row, Col } from 'reactstrap';
import { setMenuState } from '../redux/actions/menu';

const Content = ({ user, menu, history, setMenuState }) => {
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
    }, []);

    const closeMenu = () => {
        if (windowWidth < 992) {
            setMenuState(false);
        }
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
    menu: state.menu,
});

const mapDispatchToProps = (dispatch) => ({
    setMenuState: (menu) => dispatch(setMenuState(menu)),
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Content)
);
