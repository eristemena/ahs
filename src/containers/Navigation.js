import React, { Fragment } from 'react';
import { TopNav, SideNav } from './Nav';
import { connect } from 'react-redux';

const Navigation = () => {
	return (
		<Fragment>
			<TopNav />
			<SideNav />
		</Fragment>
	);
};

export default connect()(Navigation);
