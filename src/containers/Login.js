import React from 'react';
import { LoginForm, RstPwFindEmailForm } from '../components/Forms';
import { login } from '../redux/actions/user';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Card, CardBody, CardTitle, Col } from 'reactstrap';

function Login({ login }) {
    const submitHandler = (email, password) => {
        login(email, password);
    };

    return (
        <Row className="custom-login">
            <Col xs="12" md="10" className="mx-auto my-auto">
                <Card className="custom-login-card shadow-lg p-2 p-md-5">
                    <CardBody>
                        <CardTitle className="text-center">
                            <img
                                className="img-fluid"
                                src="https://vectorlogo4u.com/wp-content/uploads/2019/09/Aqua-Logo-Vector-2019-520x245.png"
                            />
                        </CardTitle>
                        <Switch>
                            <Route path="/" exact component={() => <LoginForm onSubmit={submitHandler} />} />
                            <Route path="/password-reset" exact component={RstPwFindEmailForm} />
                        </Switch>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
}

const mapDispatchToProps = (dispatch) => ({
    login: (email, password) => dispatch(login(email, password)),
});

export default connect(null, mapDispatchToProps)(Login);
