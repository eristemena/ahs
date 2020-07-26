import { get } from "../../axios";
import { addAlert } from "./alert";
import { PRODUCT_GET } from '../actionTypes';
import { setLoading } from './loading';

export const getProducts = (page, name = '') => (dispatch) => {
    dispatch(setLoading(true))
    get(
        `/products?limit=7&page=${page}${name.length > 0 ? `&name=${name}` : ''}`,
         ({ data, totalPage, totalData, page }) => {
            dispatch({
                type: PRODUCT_GET,
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
            dispatch(addAlert("Telah terjadi kesalahan"));
            dispatch(setLoading(false))
        }
    );
};