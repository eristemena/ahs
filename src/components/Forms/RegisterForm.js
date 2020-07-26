import React, { useState } from "react";
import { addAlert } from '../../redux/actions/alert';
import { connect } from 'react-redux';

function RegisterForm({ onSubmit = () => {}, loading, alert}) {
    const [name, setName] = useState("");
    const [ahs, setAhs] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const submitHandler = (e) => {
        e.preventDefault();

        if (!name.length > 0) {
            alert(`Nama perlu diisi`)
            return;
        } else if (!email.length > 0) {
            alert('Email perlu diisi')
            return;
        } else if (!ahs.length > 0) {
            alert('Nama AHS perlu diisi')
            return;
        } else if (!password.length > 0 || !password2.length > 0) {
            alert('Password perlu diisi')
            return;
        } else if (password !== password2) {
            alert('Password harus sama')
            return;
        }

        onSubmit(name, ahs, email, password);
    };

    return (
        <form onSubmit={submitHandler}>
            <div className="form-group">
                <label htmlFor="name">Nama Lengkap</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="exampleInputEmail1">Alamat Email</label>
                <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="name">Nama AHS</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={ahs}
                    onChange={(e) => setAhs(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input
                    type="password"
                    className="form-control"
                    id="exampleInputPassword1"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="exampleInputPassword2">
                    Ketik Ulang Password
                </label>
                <input
                    type="password"
                    className="form-control"
                    id="exampleInputPassword2"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                />
            </div>
            <button type="submit" className={`btn btn-primary ${loading && "disabled"}`} disabled={loading}>
                Submit
            </button>
        </form>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message) => dispatch(addAlert(message))
})

export default connect(null, mapDispatchToProps)(RegisterForm);
