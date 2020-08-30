import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle } from 'reactstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { formatPrice } from '../../../utilities';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import id from 'date-fns/locale/id';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import 'moment/locale/id';
registerLocale('id', id);

const Table = ({ loading, temp, refreshFunc = () => {}, data = [], date, setDate = () => {} }) => {
    return (
        <div className="custom-table">
            <Card className="sales">
                <div className="custom-button">
                    <button
                        className={`refresh-button ${loading ? 'spin' : ''}`}
                        disabled={loading}
                        title="Refresh"
                        onClick={() => refreshFunc(!temp)}>
                        <i className="simple-icon-refresh" />
                    </button>
                </div>
                <CardTitle className="p-3 m-0">
                    <h4 className="m-0">Transaction History</h4>
                </CardTitle>
                <CardBody className="pt-0">
                    {/* <ReactDatePicker
                        locale="id"
                        value={
                            date
                                ? moment(date).format('DD MMMM yyyy')
                                : ''
                        }
                        selected={date}
                        className="form-control"
                        wrapperClassName="transaction-table-datepicker"
                        todayButton={`Hari ini (${moment(new Date()).format(
                            'DD MMMM'
                        )})`}
                        placeholderText="Pilih hari"
                        disabledKeyboardNavigation
                        onChange={setDate}
                        maxDate={new Date()}
                        popperPlacement="bottom"
                        popperModifiers={{
                            flip: {
                                enabled: false,
                            },
                        }}
                    /> */}
                    <PerfectScrollbar
                        options={{
                            suppressScrollX: true,
                            wheelPropagation: true,
                            wheelSpeed: 0.2,
                        }}>
                        <table className="sales-table">
                            <thead>
                                <tr className="text-center">
                                    <th>Product Name</th>
                                    <th>Type</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Ammount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0 ? (
                                    data.map((item, index) => (
                                        <tr className="text-center" key={index}>
                                            <td>{item.product.name}</td>
                                            <td>
                                                {item.type === 'sell'
                                                    ? 'Jual'
                                                    : 'Beli'}
                                            </td>
                                            <td>{item.quantity}</td>
                                            <td>
                                                Rp.{' '}
                                                {item.type === 'buy'
                                                    ? formatPrice(
                                                          item.buying_price
                                                      )
                                                    : formatPrice(item.price)}
                                            </td>
                                            <td
                                                className={`text-${
                                                    item.type === 'buy'
                                                        ? 'danger'
                                                        : 'success'
                                                } font-weight-bold`}>
                                                {item.type === 'buy'
                                                    ? `- Rp. ${formatPrice(
                                                          item.buying_price *
                                                              item.quantity
                                                      )}`
                                                    : `+ Rp. ${formatPrice(
                                                          item.price *
                                                              item.quantity
                                                      )}`}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center position-relative">
                                            Tidak ada transaksi hari ini,
                                            silahkan{' '}
                                            <Link
                                                to="/transactions/add"
                                                className="stretched-link">
                                                tambah transaksi.
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </PerfectScrollbar>
                </CardBody>
            </Card>
        </div>
    );
};

Table.propTypes = {
    loading: PropTypes.bool.isRequired,
    temp: PropTypes.bool.isRequired,
    refreshFunc: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
};

export default Table;
