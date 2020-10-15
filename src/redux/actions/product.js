import { get } from '../../axios';
import { PRODUCT_GET } from '../actionTypes';
import { setLoading, error_handler } from './';

export const getProducts = (page, name, limit) => (dispatch) => {
    dispatch(setLoading(true));
    get(
        `/products?limit=${limit || 8}&page=${page}${name ? `&name=${name}` : ''}`,
        ({ data, totalPage, totalData, page }) => {
            dispatch({
                type: PRODUCT_GET,
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
