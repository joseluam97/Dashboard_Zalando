import {

    GET_PRICES_BY_PRODUCT,
    GET_PRICES_BY_PRODUCT_EXITO,
    GET_PRICES_BY_PRODUCT_ERROR,

} from './types';


// Cada reducer tiene su propio state
const initialState = {
    listPricesByProduct: [],
    error: null,
    loading: false,
}


export default function(state = initialState, action) {

    switch(action.type) {

        // **********GET PRICES BY PRODUCT**********************************/
        case GET_PRICES_BY_PRODUCT:
            return {
                ...state,
                loading: action.payload
            }
        
        case GET_PRICES_BY_PRODUCT_EXITO:
            return {
                ...state,
                loading: false,
                listPricesByProduct: action.payload
            }
        
        case GET_PRICES_BY_PRODUCT_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        default: 
            return state

    }

}