import { get } from '../../axios';
import { setLoading, error_handler } from './';
import { STOCKS_ADD } from '../actionTypes';

export const getStocks = () => (dispatch) => {
    dispatch(setLoading(true))
    get(
        `/products/stocks`,
        ({ data }) => {
            dispatch({
                type: STOCKS_ADD,
                payload: {
                    data,
                },
            });
            dispatch(setLoading(false))
        },
        (error) => {
            dispatch(error_handler(error))
            dispatch(setLoading(false))
        }
    );
};
