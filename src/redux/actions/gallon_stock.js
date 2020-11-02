import { FETCH_STOCKS } from '../actionTypes';
import { get } from '../../axios';
import { setLoading, error_handler } from './';

export const fetchStocks = (page, limit, sort, date, type, customer) => (
	dispatch
) => {
	console.log(type);
	dispatch(setLoading(true));
	get(
		`/stocks?limit=${limit || 8}&page=${page || 1}${
			sort ? `&sort=${sort}-desc` : ''
		}${date ? `&date=${date}` : ''}${type ? `&type=${type}` : ''}${
			customer ? `&customer_id=${customer}` : ''
		}`,
		({ data, totalData, totalPage }) => {
			dispatch({
				type: FETCH_STOCKS,
				payload: {
					totalData,
					totalPage,
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
