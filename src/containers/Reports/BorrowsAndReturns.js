import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Card, CardBody } from 'reactstrap';
import { get } from '../../axios';
import { addAlert } from '../../redux/actions';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { TableSearchbar } from '../../components';

const BorrowsAndReturns = ({ history, alert }) => {
    const [data, setData] = useState([]);
    const [temp, setTemp] = useState(0);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        setLoading(true);
        get(
            '/stocks/report',
            ({ data }) => {
                setData(data);
                setLoading(false);
            },
            (error) => {
                history.goBack();
                setLoading(false);
                alert('Telah terjadi kesalahan');
            }
        );
    }, [temp]);

    return (
        <div className="custom-table">
            <Card className="borrowing">
                <CardBody>
                    <PerfectScrollbar>
                        <table className="borrowing-table">
                            <thead>
                                <tr className="text-center">
                                    <th>Name</th>
                                    <th>Borrows</th>
                                    <th>Returns</th>
                                    <th>Total</th>
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
                                    <tr></tr>
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
});

export default connect(null, mapDispatchToProps)(BorrowsAndReturns);
