import React from 'react';
import { connect } from 'react-redux';
import { intlMessage } from '../language';
import PropTypes from 'prop-types';

const TableSearchbar = ({
    searchName = () => {},
    inputOnChange = () => {},
    language,
    className = ''
}) => {
    const { search_placeholder } = intlMessage(language);
    return (
        <div className={`custom-table-searchbar mb-3 ${className}`}>
            <form onSubmit={searchName}>
                <input
                    type="text"
                    className="d-inline"
                    onChange={inputOnChange}
                    placeholder={search_placeholder}
                />
                <i className="simple-icon-magnifier" onClick={searchName}></i>
            </form>
        </div>
    );
};

TableSearchbar.propTypes = {
    searchName: PropTypes.func.isRequired,
    inputOnChange: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    language: state.language,
});

export default connect(mapStateToProps)(TableSearchbar);
