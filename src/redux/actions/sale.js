import { SALES_ADD } from '../actionTypes';
import { addAlert } from './alert';
import { get } from '../../axios';

export const getSales = (week_code = 1, product_id) => (dispatch) => {
    get(
        `/products/sales/${week_code}/${product_id}`,
        ({ data }) => {
            dispatch({
                type: SALES_ADD,
                payload: {
                    data,
                },
            });
        },
        (error) => {
            dispatch(addAlert('Telah terjadi kesalahan'));
        }
    );
};
