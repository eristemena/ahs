import { post, get } from '../../axios';
import { addAlert } from './alert';
import { setLoading } from './loading';
import {
    USER_SET,
    USER_REMOVE,
    PRODUCT_REMOVE,
    TRANSACTION_REMOVE,
    STOCKS_REMOVE,
    CUSTOMER_REMOVE,
    SET_MENU_CLOSE,
    LOADING_END,
    SALES_REMOVE
} from '../actionTypes';

export const login = (email, password) => (dispatch) => {
    dispatch(setLoading(true));
    post(
        '/auth/login',
        {
            email,
            password,
        },
        (success) => {
            localStorage.setItem('token', success.token);
            localStorage.setItem('refreshToken', success.refreshToken);

            get(
                '/auth/me',
                ({ data }) => {
                    dispatch({
                        type: USER_SET,
                        payload: {
                            id: data.id,
                            name: data.name,
                            email: data.email,
                            group_id: data.group_id,
                            merchant_id: data.merchant_id,
                        },
                    });
                    dispatch(setLoading(false));
                },
                (error) => {
                    dispatch(addAlert('Telah terjadi kesalahan'));
                    dispatch(setLoading(false));
                }
            );
        },
        (error) => {
            dispatch(addAlert(error ? error.message : error));
            dispatch(setLoading(false));
        }
    );
};

export const logout = () => (dispatch) => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    dispatch({ type: USER_REMOVE });
    dispatch({ type: PRODUCT_REMOVE });
    dispatch({ type: TRANSACTION_REMOVE });
    dispatch({ type: STOCKS_REMOVE });
    dispatch({ type: CUSTOMER_REMOVE });
    dispatch({ type: SET_MENU_CLOSE });
    dispatch({ type: LOADING_END });
    dispatch({ type: SALES_REMOVE });
};
