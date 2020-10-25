import { MERCHANT_SET } from '../actionTypes';
import { get } from '../../axios';
import { setLoading, error_handler} from './';

export const getMerchants = (page = 1, name) => (dispatch) => {
    dispatch(setLoading(true));
    get(
        `/merchants?page=${page}${name ? `&name=${name}` : ''}`,
        ({ data, page, totalData, totalPage }) => {
            dispatch({
                type: MERCHANT_SET,
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
