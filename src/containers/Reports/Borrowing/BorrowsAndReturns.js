import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { get } from '../../../axios';
import { addAlert, logout } from '../../../redux/actions';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { errorHandler } from '../../../utilities';
import 'react-perfect-scrollbar/dist/css/styles.css';

const BorrowsAndReturns = ({ history, alert, language, logout }) => {
    const [data, setData] = useState([]);
    const [temp, setTemp] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        get(
            '/stocks/report',
            ({ data }) => {
                if (data.length > 0) {
                    let placeholder = [];
                    data.transactions.map((item) => {
                        if (item.owed !== 0) {
                            placeholder.push(item);
                        }
                    });
                    setData(placeholder);
                }
                setLoading(false);
            },
            (error) => {
                errorHandler(error, alert, logout);
                setLoading(false);
            }
        );
    }, [temp]);

    return (
        <div className="custom-table">
            <Card className="borrowing">
                <div className="custom-button">
                    <button
                        className={`refresh-button ${loading ? 'spin' : ''}`}
                        disabled={loading}
                        title="Refresh"
                        onClick={() => setTemp(!temp)}>
                        <i className="simple-icon-refresh" />
                    </button>
                </div>
                <CardTitle className="p-3 m-0">
                    <h4 className="m-0">{language.title}</h4>
                </CardTitle>
                <CardBody className="pt-0">
                    <PerfectScrollbar
                        options={{
                            suppressScrollX: true,
                            wheelPropagation: true,
                            wheelSpeed: 0.2,
                        }}>
                        <table className="borrowing-table">
                            <thead>
                                <tr className="text-center">
                                    <th>{language.thead.name}</th>
                                    <th>{language.thead.borrows}</th>
                                    <th>{language.thead.returns}</th>
                                    <th>{language.thead.total}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0 ? (
                                    data.map((item, index) => (
                                        <tr className="text-center" key={index}>
                                            <td>{item.name}</td>
                                            <td>{item.borrows}</td>
                                            <td>{item.returns}</td>
                                            <td>{item.owed}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            Yay! Tidak ada yang ngutang!
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

const mapDispatchToProps = (dispatch) => ({
    alert: (message) => dispatch(addAlert(message)),
    logout: () => dispatch(logout()),
});

export default withRouter(connect(null, mapDispatchToProps)(BorrowsAndReturns));
