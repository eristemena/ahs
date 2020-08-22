import { STOCKS_ADD, STOCKS_REMOVE } from '../actionTypes';

const initialState = {};

export const stock = (state = initialState, action) => {
    switch (action.type) {
        case STOCKS_ADD:
            return action.payload;

        case STOCKS_REMOVE:
            return initialState;

        default:
            return state;
    }
};
