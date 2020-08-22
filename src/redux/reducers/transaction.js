import {TRANSACTION_ADD, TRANSACTION_REMOVE} from '../actionTypes';

const initialState = {};

export const transaction = (state = initialState, action) => {
    switch (action.type) {
        case TRANSACTION_ADD:
            return action.payload;

        case TRANSACTION_REMOVE:
            return {};

        default:
            return state;
    }
};
