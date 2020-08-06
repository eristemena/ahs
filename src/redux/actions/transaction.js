import { get } from '../../axios';
import { addAlert } from './alert';
import { setLoading } from './loading';
import { TRANSACTION_ADD } from '../actionTypes';

export const getTransactions = (page, sort, date) => (dispatch) => {
    dispatch(setLoading(true))
    get(
        `/transactions?limit=7&page=${page}${sort ? `&sort=${sort}-desc` : ''}${date ? `&date=${date}` : ''}`,
        ({data, page, totalPage, totalData}) => {
            dispatch({
                type: TRANSACTION_ADD,
                payload: {
                    totalPage,
                    totalData,
                    page,
                    data,
                },
            });
            dispatch(setLoading(false))
        },
        (error) => {
            dispatch(addAlert('Telah terjadi kesalahan'));
            dispatch(setLoading(false))
        }
    );
};
