import { SALES_ADD, SALES_REMOVE } from '../actionTypes';

const initialState = {};

export const sale = (state = initialState, action) => {
    switch (action.type) {
        case SALES_ADD:
            return action.payload;

        case SALES_REMOVE:
            return initialState;

        default:
            return state;
    }
};
