import React from 'react';
import {
	UncontrolledDropdown,
	DropdownToggle,
	DropdownItem,
	DropdownMenu,
} from 'reactstrap';

const FilterComponent = ({
	text,
	dropdown,
	onDropdownItemClick = () => {},
	children,
}) => {
	return (
		<div className="d-flex flex-column flex-sm-row mb-2">
			<p
				className="my-auto mr-2 text-center"
				style={{ color: '#808080' }}>
				{text}
			</p>
			{dropdown ? (
				<UncontrolledDropdown>
					<DropdownToggle className="d-flex d-inline justify-content-center justify-content-md-between sorting-button">
						<i className="mr-2">{dropdown.selected}</i>
						<i className="fas fa-chevron-down arrow"></i>
					</DropdownToggle>
					<DropdownMenu className="sort-dropdown">
						{dropdown.items.map((item) => (
							<DropdownItem
								onClick={() => onDropdownItemClick(item.value)}
								key={item.value}>
								{item.text}
							</DropdownItem>
						))}
					</DropdownMenu>
				</UncontrolledDropdown>
			) : (
				<>{children}</>
			)}
		</div>
	);
};

export default FilterComponent;
