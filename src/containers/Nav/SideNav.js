import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Nav, NavItem, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setMenuState } from '../../redux/actions/menu';

const SideNav = ({ user, menu, setMenuState }) => {
    const activeLinks = (path) => {
        if (window.location.pathname === path) {
            return 'active';
        } else {
            return '';
        }
    };

    const setMenuClose = () => {
        setMenuState(false);
    };

    return (
        <div className="side-nav">
            <div
                className={`main-menu ${!menu ? 'main-hidden' : ''} shadow`}>
                <div className="scroll">
                    <PerfectScrollbar
                        options={{
                            suppressScrollX: true,
                            wheelPropagation: false,
                            
                        }}>
                        <Nav vertical className="list-unstyled">
                            <NavItem className={activeLinks('/')}>
                                <Link to="/" onClick={setMenuClose}>
                                    <i className="iconsminds-home"></i>
                                    <Label>Dashboard</Label>
                                </Link>
                            </NavItem>
                            <NavItem className={activeLinks('/users')}>
                                <Link to="/users" onClick={setMenuClose}>
                                    <i className="iconsminds-administrator"></i>
                                    <Label>Users</Label>
                                </Link>
                            </NavItem>
                            <NavItem className={activeLinks('/products/get')}>
                                <Link to="/products/get" onClick={setMenuClose}>
                                    <i className="iconsminds-folder"></i>
                                    <Label>Products</Label>
                                </Link>
                            </NavItem>
                            <NavItem
                                className={activeLinks('/transactions/get')}>
                                <Link
                                    to="/transactions/get"
                                    onClick={setMenuClose}>
                                    <i className="iconsminds-cash-register-2"></i>
                                    <Label>Transactions</Label>
                                </Link>
                            </NavItem>
                            <NavItem className={activeLinks('/customers/get')}>
                                <Link
                                    to="/customers/get"
                                    onClick={setMenuClose}>
                                    <i className="iconsminds-male-female"></i>
                                    <Label>Customers</Label>
                                </Link>
                            </NavItem>
                            {user && user.merchant_id === null ? (
                                <NavItem
                                    className={activeLinks('/merchants/get')}>
                                    <Link
                                        to="/merchants/get"
                                        onClick={setMenuClose}>
                                        <i className="iconsminds-shop"></i>
                                        <Label>Merchants</Label>
                                    </Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
