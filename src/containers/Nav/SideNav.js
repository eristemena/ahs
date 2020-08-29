import React, { useState, useEffect, Fragment } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Nav, NavItem, Label } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setMenuState, setSubMenuState } from '../../redux/actions/';
import { intlMessage } from '../../language';
import { checkAdminMerchant } from '../../utilities';

const SideNav = ({ user, menu, setMenuState, setSubMenuState, history, language }) => {
    const [windowWidth, setWindowWidth] = useState(undefined);
    const [sub, setSub] = useState(null);

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

    const items = {
        reports: [
            {
                name: 'Borrowing',
                icon: 'simple-icon-share-alt',
                to: '/reports/borrowing'
            },
            {
                name: 'Sales',
                icon: 'simple-icon-wallet',
                to: '/reports/sales'
            }
        ]
    }

    const setMenuClose = (e) => {
        e.preventDefault();

        const href = e.currentTarget.getAttribute('href');

        console.log(href)

        if (href !== "#") {
            history.push(href);
            if (windowWidth < 992) {
                setMenuState(false);
            }
            setSub(null)
            setSubMenuState(false)
        } else {
            const id = e.currentTarget.getAttribute('id');
            if (sub === id) {
                setSubMenuState(!menu.sub)
            } else {
                setSubMenuState(true)
            }
            setSub(id)
        }

    };

    const { sidenav } = intlMessage(language);

    return (
        <div className="side-nav">
            <div className={`main-menu ${!menu.menu ? 'main-hidden' : ''} ${menu.sub ? 'sub-open' : ''}`}>
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
                                <a href="/gallons/get" onClick={setMenuClose}>
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
                            
                            {!checkAdminMerchant(user) ? user.merchant_id === null && (
                                <NavItem
                                    className={activeLinks('/merchants/get')}>
                                    <a
                                        href="/merchants/get"
                                        onClick={setMenuClose}>
                                        <i className="iconsminds-shop"></i>
                                        <Label>{sidenav.merchant}</Label>
                                    </a>
                                </NavItem>
                            ) : (
                                <NavItem className={activeLinks('/reports')}>
                                    <a href="#" id="reports" onClick={setMenuClose}>
                                        <i className="iconsminds-file"></i>
                                        <Label>Reporting</Label>
                                    </a>
                                </NavItem>
                            )}
                        </Nav>
                    </PerfectScrollbar>
                </div>
            </div>
            <div className={`sub-menu ${!menu.sub || !menu.menu ? 'hidden' : ''} ${!menu.menu ? 'main-hidden' : 'main-show'}`}>
                <div className="scroll">
                    <PerfectScrollbar
                        options={{
                            suppressScrollX: true,
                            wheelPropagation: false,
                            wheelSpeed: 0.3,
                        }}>
                        <Nav vertical className="list-unstyled">
                            {sub === 'reports' && (
                                <Fragment>
                                    {items.reports.map((item, index) => (
                                        <NavItem key={index} className={activeLinks(item.to)}>
                                            <a href={item.to} onClick={setMenuClose}>
                                                <i className={item.icon}></i>
                                                <Label>{item.name}</Label>
                                            </a>
                                        </NavItem>
                                    ))}
                                </Fragment>
                            )}
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
    setSubMenuState: (sub) => dispatch(setSubMenuState(sub))
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(SideNav)
);
