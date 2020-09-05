import React, { useState, useEffect } from 'react';
import { get } from '../../axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { addAlert } from '../../redux/actions';
import { Table, Cards } from './Sales/index';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import id from 'date-fns/locale/id';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import 'moment/locale/id';
import { intlMessage } from '../../language';
registerLocale('id', id);

const Sales = ({ alert, history, language }) => {
    const [data, setData] = useState([]);
    const [temp, setTemp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [income, setIncome] = useState(0);
    const [spending, setSpending] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [date, setDate] = useState(new Date());

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

    const { sales } = intlMessage(language);

    return (
        <Container fluid>
            <div className="d-md-flex justify-content-between">
                <h1 className="mb-3 page-title">{sales.title} ({sales.today})</h1>
                {/* <ReactDatePicker
                    locale="id"
                    value={
                        date
                            ? moment(date).format('D MMMM yyyy')
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
            </div>
            <Row>
                <Col
                    xs="12"
                    md="4"
                    className="mb-4">
                    <Cards title={sales.cards.income} number={income} color="dark" />
                </Col>
                <Col xs="12" md="4" className="mb-4">
                    <Cards title={sales.cards.spending} number={spending} color="dark" />
                </Col>
                <Col
                    xs="12"
                    md="4"
                    className="mb-4">
                    <Cards title={sales.cards.revenue} number={revenue} />
                </Col>
            </Row>
            <Row>
                <Col xs="12">
                    <Table
                        loading={loading}
                        data={data}
                        temp={temp}
                        language={language}
                        translated={sales.table}
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

const mapStateToProps = (state) => ({
    language: state.language,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sales));
