import { MERCHANT_SET } from '../actionTypes';
import { get, postWithAuth, post } from '../../axios'
import { addAlert } from "./alert";
import { setLoading } from './loading';

export const getMerchants = (page = 1, name) => (dispatch) => {
    dispatch(setLoading(true))
    get(
        `/merchants?page=${page}${name ? `&name=${name}` : ''}`,
        ({data, page, totalData, totalPage}) => {
            dispatch({
                type: MERCHANT_SET,
                payload: {
                    totalPage,
                    totalData,
                    page,
                    data,
                }
            });
            dispatch(setLoading(false))
        },
        (error) => {
            dispatch(addAlert('Telah terjadi kesalahan'));
            dispatch(setLoading(false))
        }
    )
};