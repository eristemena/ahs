import React, { useState, useEffect } from 'react';
import { get } from '../../axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { addAlert } from '../../redux/actions';
import { Table, Cards } from './Sales/index';
import moment from 'moment';
import 'moment/locale/id';

const Sales = ({ alert, history }) => {
    const [data, setData] = useState([]);
    const [temp, setTemp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [income, setIncome] = useState(0);
    const [spending, setSpending] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [date, setDate] = useState(new Date())

    useEffect(() => {
        setLoading(true);
        get(
            `/transactions/revenue?date=${moment(date).format('YYYY-MM-DD')}`,
            ({ data }) => {
                setData(data.transactions);
                setIncome(data.income);
                setSpending(data.spending);
                setRevenue(data.revenue);
                setLoading(false);
            },
            (error) => {
                history.push('/');
                setLoading(false);
                alert('Telah terjadi kesalahan');
            }
        );
    }, [temp, date]);
    return (
        <Container fluid>
            <h1 className="mb-3 page-title">Report (Today)</h1>
            <Row>
                <Col xs="12" md="4" lg={{size: 3, offset: 1}} className="mb-4">
                    <Cards title="Income" number={income} color="dark" />
                </Col>
                <Col xs="12" md="4" lg="3" className="mb-4">
                    <Cards title="Spending" number={spending} color="dark" />
                </Col>
                <Col xs="12" md="4" lg={{size: 3, offset: -1}} className="mb-4">
                    <Cards title="Revenue" number={revenue} />
                </Col>
            </Row>
            <Row>
                <Col xs="12">
                    <Table
                        loading={loading}
                        data={data}
                        temp={temp}
                        refreshFunc={setTemp}
                    />
                </Col>
            </Row>
        </Container>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message) => dispatch(addAlert(message)),
});

export default withRouter(connect(null, mapDispatchToProps)(Sales));
