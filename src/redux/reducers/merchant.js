import {MERCHANT_SET, MERCHANT_REMOVE} from '../actionTypes';

const initialState = {};

export const merchant = (state = initialState, action) => {
    switch (action.type) {
        case MERCHANT_SET: 
            return action.payload;
        
        case MERCHANT_REMOVE: 
            return initialState;
        
        default:
            return state;
    }
}