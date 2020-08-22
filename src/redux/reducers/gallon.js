import { FETCH_GALLONS, DELETE_GALLONS } from '../actionTypes';

const initialState = {};

export const gallon = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_GALLONS:
            return action.payload;
        case DELETE_GALLONS:
            return initialState;
        default:
            return state;
    }
};
