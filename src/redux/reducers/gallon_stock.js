import { FETCH_STOCKS, DELETE_STOCKS } from '../actionTypes';

const initialState = {};

export const gallonStock = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_STOCKS:
            return action.payload;

        case DELETE_STOCKS:
            return initialState;

        default:
            return state;
    }
};
