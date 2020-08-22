import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { CustomSpinner, InfoTooltip } from './';

const Table = ({
    tableName,
    tableClassName,
    tableHead = [],
    tableBody = {},
    loading,
    deleteFunction = () => {},
}) => {
    const exampleBody = {
        data: [],
        actions: {
            edit: 'edit-link'
        },
    };

    const deleteIdFromTable = (table) => {
        delete table.id;
        return table;
    };
    
    return (
        <div className="custom-table">
            <Card className={tableClassName}>
                <CardBody>
                    <table className={`${tableClassName}-table`}>
                        <thead>
                            <tr className="text-center">
                                {tableHead.map((thead, index) => (
                                    <th key={index}>{thead}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {!loading ? (
                                tableBody.data &&
                                tableBody.data.length > 0 ? (
                                    tableBody.data.map((tbody, index) => (
                                        <tr key={index}>
                                            {Object.values(
                                                deleteIdFromTable(tbody)
                                            ).map((title, index) => console.log(tbody))}
                                            {tableBody.actions && (
                                                <td>
                                                <Link
                                                    to={`${tableBody.actions.edit}?id=${tbody.id}`}
                                                    className="mr-2">
                                                    <i
                                                        className="simple-icon-note edit-icon"
                                                        title="Edit"></i>
                                                </Link>
                                                <i
                                                    className={`simple-icon-close delete-icon ${
                                                        tbody.info ? 'mr-2' : ''
                                                    }`}
                                                    data-toggle="modal"
                                                    data-target="#modal"
                                                    title="Delete"
                                                    onClick={() =>
                                                        deleteFunction(tbody.id)
                                                    }></i>
                                                {tbody.info ? (
                                                    <Fragment>
                                                        <InfoTooltip
                                                            info={tbody.info}
                                                        />
                                                    </Fragment>
                                                ) : null}
                                            </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={tableHead.length}
                                            className="text-center">
                                            Belum ada {tableName}, silahkan
                                            tambahkan {tableName}
                                        </td>
                                    </tr>
                                )
                            ) : (
                                <tr className="align-middle">
                                    <td
                                        colSpan={tableHead.length}
                                        className="text-center">
                                        <CustomSpinner
                                            loading={loading}
                                            type="table"
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CardBody>
            </Card>
        </div>
    );
};

Table.propTypes = {
    tableName: PropTypes.string.isRequired,
    tableClassName: PropTypes.string.isRequired,
    tableHead: PropTypes.array.isRequired,
    tableBody: PropTypes.object.isRequired,
    deleteFunction: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
    };
};

export default connect(mapStateToProps)(Table);
