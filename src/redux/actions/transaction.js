import { get } from '../../axios';
import { setLoading, error_handler } from './';
import { TRANSACTION_ADD } from '../actionTypes';

export const getTransactions = (
	page,
	sort,
	date,
	limit,
	type,
	product_id,
	group_id,
	customer_id
) => (dispatch) => {
	dispatch(setLoading(true));
	get(
		`/transactions?limit=${limit}&page=${page}${
			sort ? `&sort=${sort}-desc` : ''
		}${date !== null ? `&start_date=${date}&end_date=${date}` : ''}${
			type ? `&type=${type}` : ''
		}${product_id ? `&product_id=${product_id}` : ''}${
			group_id ? `&group_id=${group_id}` : ''
		}${customer_id ? `&customer_id=${customer_id}` : ''}`,
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
			dispatch(error_handler(error));
			dispatch(setLoading(false));
		}
	);
};
