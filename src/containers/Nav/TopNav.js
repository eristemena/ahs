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
import { intlMessage } from '../../language';

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
			setMenuState(true);
		} else {
			setMenuState(false);
		}
	}, [windowWidth > 992]);

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

	const intlText = intlMessage(language);

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
						<UncontrolledDropdown>
							<DropdownToggle
								className="btn language-button"
								color="empty">
								<span>{language.toUpperCase()}</span>
							</DropdownToggle>
							<DropdownMenu className="topnav-dropdown">
								<DropdownItem onClick={() => setLanguage('en')}>
									<div className="d-flex justify-content-between">
										<span>
											{intlText.topnav.language.english}
										</span>
										<span className="flag-icon flag-icon-gb"></span>
									</div>
								</DropdownItem>
								<DropdownItem onClick={() => setLanguage('id')}>
									<div className="d-flex justify-content-between">
										<span>
											{intlText.topnav.language.indonesia}
										</span>
										<span className="flag-icon flag-icon-id"></span>
									</div>
								</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
					</div>
					<NavLink className="navbar-logo h-100" to="/">
						<span className="logo-mobile" />
					</NavLink>
					<div className="navbar-right d-flex">
						<div className="user d-inline-block">
							<UncontrolledDropdown className="dropdown-menu-right">
								<DropdownToggle
									className="nav-profile-picture d-flex align-middle"
									color="empty">
									<p className="name d-none d-sm-inline">
										{user.name}
									</p>
									<i className="iconsminds-male-2 default-profile-picture"></i>
								</DropdownToggle>
								<DropdownMenu className="topnav-dropdown" right>
									<DropdownItem onClick={logoutHandler}>
										<div className="d-flex justify-content-between">
											<span>
												{intlText.topnav.logout}
											</span>
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
	menu: state.menu.menu,
	language: state.language,
});

const mapDispatchToProps = (dispatch) => ({
	logout: () => dispatch(logout()),
	setMenuState: (menu) => dispatch(setMenuState(menu)),
	setLanguage: (lang) => dispatch(setLanguage(lang)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));
