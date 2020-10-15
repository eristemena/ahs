import React, { useState, useEffect } from 'react';
import { get } from '../../axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    Label,
    Card,
    CardBody,
} from 'reactstrap';
import { addAlert, logout } from '../../redux/actions';
import { Table, Cards } from './Sales/index';
import { CustomPagination } from '../../components';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import id from 'date-fns/locale/id';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import 'moment/locale/id';
import { intlMessage } from '../../language';
import {errorHandler} from '../../utilities'
registerLocale('id', id);

const Sales = ({ alert, history, language, logout }) => {
    const [data, setData] = useState([]);
    const [temp, setTemp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [income, setIncome] = useState(0);
    const [spending, setSpending] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [paging, setPaging] = useState([]);

    useEffect(() => {
        setLoading(true);
        get(
            `/transactions/revenue?start_date=${moment(startDate).format(
                'YYYY-MM-DD'
            )}&end_date=${moment(endDate).format(
                'YYYY-MM-DD'
            )}&limit=10&page=${page}`,
            ({ data }) => {
                setData(data.transaction.data);
                setIncome(data.income);
                setSpending(data.spending);
                setRevenue(data.revenue);
                setTotalPage(data.transaction.totalPage);
                setPaging(() => {
                    let a = [];
                    for (
                        let i = 1;
                        i <= (data ? data.transaction.totalPage : 1);
                        i++
                    ) {
                        a.push(i);
                    }
                    return a;
                });
                setLoading(false);
            },
            (error) => {
                errorHandler(error, alert, logout)
                history.push('/');
                setLoading(false);
            }
        );
    }, [temp, startDate, endDate, page]);

    const [modal, setModal] = useState(false);

    const { sales } = intlMessage(language);

    const checkIfToday = (start, end) =>
        moment(start).format('YYYY-MM-DD') === moment(end).format('YYYY-MM-DD');

    const [startDateTemp, setStartDateTemp] = useState(new Date());
    const [endDateTemp, setEndDateTemp] = useState(new Date());

    const datePicker = (
        value,
        onChange = () => {},
        customClassName,
        minDate
    ) => (
        <ReactDatePicker
            locale="id"
            value={value ? moment(value).format('D MMMM YYYY') : ''}
            selected={value}
            className={`form-control ${customClassName}`}
            todayButton={
                minDate
                    ? `Hari ini (${moment(new Date()).format('D MMMM')})`
                    : false
            }
            showMonthDropdown
            placeholderText="Pilih hari"
            disabledKeyboardNavigation
            onChange={onChange}
            maxDate={new Date()}
            minDate={minDate}
            popperPlacement="bottom"
            popperModifiers={{
                flip: {
                    enabled: false,
                },
            }}
        />
    );

    const activeNav = (type) => {
        if (loading) {
            return true;
        }
        if (type === 'prev') {
            if (page === 1) {
                return true;
            }
        } else {
            if (totalPage < 1) {
                return true;
            } else if (page === totalPage) {
                return true;
            }
        }
    };

    const activePage = (p) => {
        if (loading) {
            return true;
        }
        if (p === page) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <Container fluid>
            <div className="d-md-flex justify-content-between mb-3">
                <h1 className="page-title">
                    {sales.title} (
                    {checkIfToday(startDate, endDate)
                        ? sales.today
                        : `${moment(startDate).format('D MMM')} - ${moment(
                              endDate
                          ).format('D MMM')}`}
                    )
                </h1>
                <button
                    className="btn btn-primary font-weight-bold"
                    onClick={() => setModal(!modal)}>
                    FILTER BY DATE RANGE
                </button>
            </div>
            <Row className="mb-2">
                <Col xs="12" md="4" className="mb-2">
                    <Cards
                        title={sales.cards.income}
                        number={income}
                        color="dark"
                    />
                </Col>
                <Col xs="12" md="4" className="mb-2">
                    <Cards
                        title={sales.cards.spending}
                        number={spending}
                        color="dark"
                    />
                </Col>
                <Col xs="12" md="4" className="mb-2">
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
                    <CustomPagination
                        currentPage={page}
                        pages={paging}
                        activePage={activePage}
                        setPage={setPage}
                        activeNav={activeNav}
                    />
                </Col>
            </Row>
            <Modal
                isOpen={modal}
                toggle={() => setModal(!modal)}
                backdrop="static"
                wrapClassName="custom-modal right sales-modal">
                <ModalBody>
                    <p>Choose dates:</p>
                    <Card className="mb-2">
                        <CardBody className="p-3">
                            <Label for="startDate">From:</Label>
                            {datePicker(
                                startDateTemp,
                                setStartDateTemp,
                                'mb-2'
                            )}
                            <Label for="startDate">Until:</Label>
                            {datePicker(
                                endDateTemp,
                                setEndDateTemp,
                                'mb-3',
                                startDateTemp
                            )}
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    setStartDate(startDateTemp);
                                    setEndDate(endDateTemp);
                                    setModal(false);
                                }}>
                                Apply filter
                            </button>
                        </CardBody>
                    </Card>
                    <span className="mr-2">Or:</span>
                    <Card>
                        <CardBody className="p-3">
                            <button
                                className="btn btn-primary mr-2 mb-2"
                                onClick={() => {
                                    setStartDate(new Date());
                                    setEndDate(new Date());
                                    setModal(false);
                                }}>
                                Today
                            </button>
                            <button
                                className="btn btn-primary mr-2 mb-2"
                                onClick={() => {
                                    setStartDate(moment().startOf('week'));
                                    setEndDate(new Date());
                                    setModal(false);
                                }}>
                                This week*
                            </button>
                            <button
                                className="btn btn-primary mb-2"
                                onClick={() => {
                                    setStartDate(moment().startOf('month'));
                                    setEndDate(new Date());
                                    setModal(false);
                                }}>
                                This month
                            </button>
                            <div>
                                <small className="text-muted">
                                    *The week starts at Sunday
                                </small>
                            </div>
                        </CardBody>
                    </Card>
                </ModalBody>
                <ModalFooter>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setModal(!modal)}>
                        Cancel
                    </button>
                </ModalFooter>
            </Modal>
        </Container>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message) => dispatch(addAlert(message)),
    logout: () => dispatch(logout())
});

const mapStateToProps = (state) => ({
    language: state.language,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sales));
