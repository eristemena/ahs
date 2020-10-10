import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { CustomSpinner, InfoTooltip } from './';

const Table = ({
    noDataMessage,
    tableClassName,
    tableHead = [],
    tableBody = [],
    deleteId = true,
    actions,
    loading,
    deleteFunction = () => {},
    setModal = () => {},
}) => {
    const deleteFromTable = (table) => {
        if (deleteId) {
            delete table.id;
        }
        delete table.info
        return table;
    };

    return (
        <div className="custom-table">
            <Card className={tableClassName}>
                <CardBody>
                    <table className={`${tableClassName}-table`}>
                        <thead>
                            <tr className="text-center">
                                {tableHead.map((thead, index) => thead !== null && (
                                    <th key={index}>{thead}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {!loading ? (
                                tableBody && tableBody.length > 0 ? (
                                    tableBody.map((tbody, index) => (
                                        <tr key={index} className="text-center">
                                            {console.log()}
                                            {Object.values(deleteFromTable({...tbody})).map(
                                                (item, index) =>
                                                    item !== null && (
                                                        <td key={index}>
                                                            {item}
                                                        </td>
                                                    )
                                            )}
                                            {actions && (
                                                <td>
                                                    <Link
                                                        to={`${actions.edit}?id=${tbody.id}`}
                                                        className="mr-2">
                                                        <i
                                                            className="simple-icon-note edit-icon"
                                                            title="Edit"></i>
                                                    </Link>
                                                    <i
                                                        className={`simple-icon-close delete-icon ${
                                                            tbody.info
                                                                ? 'mr-2'
                                                                : ''
                                                        }`}
                                                        title="Delete"
                                                        onClick={() => {
                                                            deleteFunction(
                                                                tbody.id
                                                            );
                                                            setModal(true);
                                                        }}></i>
                                                    {tbody.info &&
                                                        actions.info && (
                                                            <Fragment>
                                                                <InfoTooltip
                                                                    info={
                                                                        tbody.info
                                                                    }
                                                                />
                                                            </Fragment>
                                                        )}
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={tableHead.length}
                                            className="text-center">
                                            {noDataMessage}
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
    noDataMessage: PropTypes.string.isRequired,
    tableClassName: PropTypes.string.isRequired,
    tableHead: PropTypes.array.isRequired,
    tableBody: PropTypes.array.isRequired,
    deleteFunction: PropTypes.func,
    actions: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    setModal: PropTypes.func,
};

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
    };
};

export default connect(mapStateToProps)(Table);
