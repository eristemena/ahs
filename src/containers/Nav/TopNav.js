import React, { Fragment, useEffect, useState } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/user';
import { setMenuState } from '../../redux/actions/menu';
import {
    UncontrolledDropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
} from 'reactstrap';
import { MenuIcon } from '../../components/svg';
import 'flag-icon-css/css/flag-icon.css';
import { setLanguage } from '../../redux/actions/language';

function NavBar({
    user,
    logout,
    history,
    menu,
    setMenuState,
    language,
    setLanguage,
}) {
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
        if (windowWidth > 992) {
            setMenuState(true)
        } else {
            setMenuState(false)
        }
    }, [windowWidth > 992])

    const checkLanguage = (lang) => {
        if (lang === 'en') {
            return 'flag-icon-gb';
        } else {
            return 'flag-icon-id';
        }
    };

    const changeLanguage = () => {
        if (language === 'en') {
            setLanguage('id');
        } else {
            setLanguage('en');
        }
    };

    const logoutHandler = (e) => {
        e.preventDefault();

        logout();
        history.push('/'); // redirect to home
    };

    const menuButtonClick = (e) => {
        e.preventDefault();

        if (menu) {
            setMenuState(false);
        } else {
            setMenuState(true);
        }
    };

    return (
        <Fragment>
            {user ? (
                <nav className="navbar fixed-top custom-navbar shadow-sm">
                    <div className="d-flex align-items-center navbar-left">
                        <NavLink
                            to="#"
                            location={{}}
                            className="menu-button d-block"
                            onClick={menuButtonClick}>
                            <MenuIcon />
                        </NavLink>
                    </div>
                    <NavLink className="navbar-logo h-100" to="/">
                        <span className="logo-mobile d-block" />
                    </NavLink>

                    <div className="navbar-right">
                        <div className="user d-inline-block">
                            <UncontrolledDropdown className="dropdown-menu-right">
                                <DropdownToggle
                                    className="nav-profile-picture d-flex align-middle"
                                    color="empty">
                                    <p className="name d-none d-md-inline">
                                        {user.name}
                                    </p>
                                    <i className="iconsminds-male-2 default-profile-picture"></i>
                                </DropdownToggle>
                                <DropdownMenu className="" right>
                                    <DropdownItem onClick={changeLanguage}>
                                        <div className="d-flex justify-content-between">
                                            <span>Language</span>
                                            <span
                                                className={`flag-icon ${checkLanguage(
                                                    language
                                                )}`}></span>
                                        </div>
                                    </DropdownItem>
                                    <DropdownItem onClick={logoutHandler}>
                                        <div className="d-flex justify-content-between">
                                            <span>Log Out</span>
                                            <i
                                                className="simple-icon-logout"
                                                style={{ marginTop: 3 }}></i>
                                        </div>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                    </div>
                </nav>
            ) : null}
        </Fragment>
    );
}

const mapStateToProps = (state) => ({
    user: state.user,
    menu: state.menu,
    language: state.language,
});

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout()),
    setMenuState: (menu) => dispatch(setMenuState(menu)),
    setLanguage: (lang) => dispatch(setLanguage(lang)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));
