import React, { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Nav, NavItem, Label } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setMenuState } from '../../redux/actions/menu';
import { intlMessage } from '../../language';

const SideNav = ({ user, menu, setMenuState, history, language }) => {
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
        if (path === '/') {
            if (history.location.pathname === '/') {
                return 'active';
            } else {
                return '';
            }
        } else if (history.location.pathname.includes(path)) {
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

    const {sidenav} = intlMessage(language)

    return (
        <div className="side-nav">
            <div className={`main-menu ${!menu ? 'main-hidden' : ''}`}>
                <div className="scroll">
                    <PerfectScrollbar
                        options={{
                            suppressScrollX: true,
                            wheelPropagation: false,
                            wheelSpeed: 0.3,
                        }}>
                        <Nav vertical className="list-unstyled">
                            <NavItem className={`${activeLinks('/')}`}>
                                <a href="/" onClick={setMenuClose}>
                                    <i className="iconsminds-home"></i>
                                    <Label>{sidenav.dashboard}</Label>
                                </a>
                            </NavItem>
                            <NavItem className={activeLinks('/users')}>
                                <a href="/users" onClick={setMenuClose}>
                                    <i className="iconsminds-administrator"></i>
                                    <Label>{sidenav.users}</Label>
                                </a>
                            </NavItem>
                            <NavItem className={activeLinks('/products')}>
                                <a href="/products/get" onClick={setMenuClose}>
                                    <i className="iconsminds-drop"></i>
                                    <Label>{sidenav.products}</Label>
                                </a>
                            </NavItem>
                            <NavItem className={activeLinks('/transactions')}>
                                <a
                                    href="/transactions/get"
                                    onClick={setMenuClose}>
                                    <i className="iconsminds-cash-register-2"></i>
                                    <Label>{sidenav.transactions}</Label>
                                </a>
                            </NavItem>
                            <NavItem className={activeLinks('/gallons')}>
                                <a href="/gallons/stocks/get" onClick={setMenuClose}>
                                    <i className="iconsminds-folder"></i>
                                    <Label>Galon</Label>
                                </a>
                            </NavItem>
                            <NavItem className={activeLinks('/customers')}>
                                <a href="/customers/get" onClick={setMenuClose}>
                                    <i className="iconsminds-male-female"></i>
                                    <Label>{sidenav.customers}</Label>
                                </a>
                            </NavItem>
                            <NavItem className={activeLinks('/reports')}>
                                <a href="/reports/get" onClick={setMenuClose}>
                                    <i className="iconsminds-file"></i>
                                    <Label>Reporting</Label>
                                </a>
                            </NavItem>
                            {user && user.merchant_id === null ? (
                                <NavItem
                                    className={activeLinks('/merchants/get')}>
                                    <a
                                        href="/merchants/get"
                                        onClick={setMenuClose}>
                                        <i className="iconsminds-shop"></i>
                                        <Label>{sidenav.merchant}</Label>
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
    language: state.language,
});

const mapDispatchToProps = (dispatch) => ({
    setMenuState: (menu) => dispatch(setMenuState(menu)),
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(SideNav)
);
