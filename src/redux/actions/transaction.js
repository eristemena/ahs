import { get } from '../../axios';
import { setLoading, error_handler } from './';
import { TRANSACTION_ADD } from '../actionTypes';

export const getTransactions = (page, sort, date, limit) => (dispatch) => {
    dispatch(setLoading(true));
    get(
        `/transactions?limit=${limit}&page=${page}${sort ? `&sort=${sort}-desc` : ''}${
            date !== null ? `&start_date=${date}&end_date=${date}` : ''
        }`,
        ({ data, page, totalPage, totalData }) => {
            dispatch({
                type: TRANSACTION_ADD,
                payload: {
                    totalPage,
                    totalData,
                    page,
                    data,
                },
            });
            dispatch(setLoading(false));
        },
        (error) => {
            dispatch(error_handler(error))
            dispatch(setLoading(false));
        }
    );
};
