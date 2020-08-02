import React, { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Nav, NavItem, Label, NavLink } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setMenuState } from '../../redux/actions/menu';

const SideNav = ({ user, menu, setMenuState, history }) => {
    const [windowWidth, setWindowWidth] = useState(undefined);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const activeLinks = (path) => {
        if (history.location.pathname === path) {
            return 'active';
        } else {
            return '';
        }
    };

    const setMenuClose = (e) => {
        e.preventDefault();

        history.push(e.currentTarget.getAttribute('href'));

        if (windowWidth < 992) {
            setMenuState(false);
        }
    };

    return (
        <div className="side-nav">
            <div className={`main-menu ${!menu ? 'main-hidden' : ''} shadow`}>
                <div className="scroll">
                    <PerfectScrollbar
                        options={{
                            suppressScrollX: true,
                            wheelPropagation: false,
                        }}>
                        <Nav vertical className="list-unstyled">
                            <NavItem className={`${activeLinks('/')}`}>
                                <a href="/" onClick={setMenuClose}>
                                    <i className="iconsminds-home"></i>
                                    <Label>Dashboard</Label>
                                </a>
                            </NavItem>
                            <NavItem className={activeLinks('/users')}>
                                <a href="/users" onClick={setMenuClose}>
                                    <i className="iconsminds-administrator"></i>
                                    <Label>Users</Label>
                                </a>
                            </NavItem>
                            <NavItem className={activeLinks('/products/get')}>
                                <a href="/products/get" onClick={setMenuClose}>
                                    <i className="iconsminds-folder"></i>
                                    <Label>Products</Label>
                                </a>
                            </NavItem>
                            <NavItem
                                className={activeLinks('/transactions/get')}>
                                <a
                                    href="/transactions/get"
                                    onClick={setMenuClose}>
                                    <i className="iconsminds-cash-register-2"></i>
                                    <Label>Transactions</Label>
                                </a>
                            </NavItem>
                            <NavItem className={activeLinks('/customers/get')}>
                                <a
                                    href="/customers/get"
                                    onClick={setMenuClose}>
                                    <i className="iconsminds-male-female"></i>
                                    <Label>Customers</Label>
                                </a>
                            </NavItem>
                            {user && user.merchant_id === null ? (
                                <NavItem
                                    className={activeLinks('/merchants/get')}>
                                    <a
                                        href="/merchants/get"
                                        onClick={setMenuClose}>
                                        <i className="iconsminds-shop"></i>
                                        <Label>Merchants</Label>
                                    </a>
                                </NavItem>
                            ) : null}
                        </Nav>
                    </PerfectScrollbar>
                </div>
            </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SideNav));
