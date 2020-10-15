import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL || 'https://ahs-merdeka.herokuapp.com/api/v1';

// link: https://ahs-merdeka.herokuapp.com/api/v1

export const get = async (path, success = () => {}, error = () => {}, download_progress) => {
    try {
        let config = {};

        let token = localStorage.getItem('token');

        if (token) {
            config.headers = {
                Authorization: `Bearer ${token}`,
            };
        }

        let resp = await axios.get(`${baseUrl}${path}`, config);

        if (resp.status === 200) {
            success(resp.data);
        } else {
            error(resp.data);
        }
    } catch (err) {
        if (
            err.response &&
            err.response.data &&
            err.response.data.message === 'jwt expired'
        ) {
            // refresh token
            await refreshToken(
                (msg) => {
                    error(msg)
                }
            );

            // re-run
            await get(path, success, error);
        } else {
            error(err.response && err.response.data);
        }
    }
};

export const post = async (
    path,
    payload,
    success = () => {},
    error = () => {}
) => {
    try {
        let resp = await axios.post(`${baseUrl}${path}`, payload);

        if (resp.status === 200) {
            success(resp.data);
        } else {
            error(resp.data);
        }
    } catch (err) {
        error(err.response && err.response.data);
    }
};

export const postWithAuth = async (
    path,
    payload,
    success = () => {},
    error = () => {}
) => {
    try {
        let config = {};

        let token = localStorage.getItem('token');

        if (token) {
            config.headers = {
                Authorization: `Bearer ${token}`,
            };
        }

        let resp = await axios.post(`${baseUrl}${path}`, payload, config);

        if (resp.status === 200) {
            success(resp.data);
        } else {
            error(resp.data);
        }
    } catch (err) {
        console.log(err.response)
        if (
            err.response &&
            err.response.data &&
            err.response.data.message === 'jwt expired'
        ) {
            // refresh token
            await refreshToken(
                (msg) => {
                    error(msg)
                }
            );

            // re-run
            await postWithAuth(path, payload, success, error);
        } else {
            error(err.response && err.response.data);
        }
    }
};

const refreshToken = async (error = () => {}) => {
    let config = {};

    let token = localStorage.getItem('refreshToken');

    if (token) {
        config.headers = {
            Authorization: `Bearer ${token}`,
        };
    }

    try {
        let resp = await axios.post(
            `${baseUrl}/auth/refresh-token`,
            {},
            config
        );

        if (resp.status === 200) {
            localStorage.setItem('token', resp.data.token);
        } else {
            error(resp.data)
        }
    } catch (err) {
        error(err.response && err.response.data)
    }
};

export const put = async (
    path,
    payload,
    success = () => {},
    error = () => {}
) => {
    try {
        let config = {};

        let token = localStorage.getItem('token');

        if (token) {
            config.headers = {
                Authorization: `Bearer ${token}`,
            };
        }

        let resp = await axios.put(`${baseUrl}${path}`, payload, config);

        if (resp.status === 200) {
            success(resp.data);
        } else {
            error(resp.data);
        }
    } catch (err) {
        console.log(err.response)
        if (
            err.response &&
            err.response.data &&
            err.response.data.message === 'jwt expired'
        ) {
            // refresh token
            await refreshToken(
                (msg) => {
                    error(msg)
                }
            );

            // re-run
            await put(path, payload, success, error);
        } else {
            error(err.response && err.response.data);
        }
    }
};

export const del = async (
    path,
    success = () => {},
    error = () => {}
) => {
    try {
        let config = {};

        let token = localStorage.getItem('token');

        if (token) {
            config.headers = {
                Authorization: `Bearer ${token}`,
            };
        }

        let resp = await axios.delete(`${baseUrl}${path}`, config)

        if (resp.status === 200) {
            success(resp.data);
        } else {
            error(resp.data);
        }
    } catch (err) {
        console.log(err.response)
        if (
            err.response &&
            err.response.data &&
            err.response.data.message === 'jwt expired'
        ) {
            // refresh token
            await refreshToken(
                (msg) => {
                    error(msg)
                }
            );

            // re-run
            await del(path, success, error);
        } else {
            error(err.response && err.response.data);
        }
    }
};