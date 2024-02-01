import {

    GET_PRODUCTS_ZALANDO,
    GET_PRODUCTS_ZALANDO_EXITO,
    GET_PRODUCTS_ZALANDO_ERROR,

    GET_PRODUCT_ZALANDO,
    GET_PRODUCT_ZALANDO_EXITO,
    GET_PRODUCT_ZALANDO_ERROR,

    GET_SIZE_PRODUCT_ZALANDO,
    GET_SIZE_PRODUCT_ZALANDO_EXITO,
    GET_SIZE_PRODUCT_ZALANDO_ERROR,

    SET_SIZE_SELECTED,
    SET_SIZE_SELECTED_EXITO,
    SET_SIZE_SELECTED_ERROR,

    GET_ALL_SIZE,
    GET_ALL_SIZE_EXITO,
    GET_ALL_SIZE_ERROR,

    GET_ALL_BRANDS,
    GET_ALL_BRANDS_EXITO,
    GET_ALL_BRANDS_ERROR,

    GET_PRODUCT_OFFERT_ZALANDO,
    GET_PRODUCT_OFFERT_ZALANDO_EXITO,
    GET_PRODUCT_OFFERT_ZALANDO_ERROR,

} from './types';


// Cada reducer tiene su propio state
const initialState = {
    productZalando: '',
    tallaSelect: '',
    listProductsOffert: [],
    listAllBrands: [],
    listAllSizes: [],
    listProductsZalando: [],
    listSizesProductsZalando: [],
    error: null,
    loading: false,
}


export default function(state = initialState, action) {

    switch(action.type) {
        // **********GET PRODUCTS OFFER**********************************/
        case GET_PRODUCT_OFFERT_ZALANDO:
            return {
                ...state,
                loading: action.payload
            }
        
        case GET_PRODUCT_OFFERT_ZALANDO_EXITO:
            return {
                ...state,
                loading: false,
                listProductsOffert: action.payload
            }
        
        case GET_PRODUCT_OFFERT_ZALANDO_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        // **********GET ALL BRANDS**********************************/
        case GET_ALL_BRANDS:
            return {
                ...state,
                loading: action.payload
            }
        
        case GET_ALL_BRANDS_EXITO:
            return {
                ...state,
                loading: false,
                listAllBrands: action.payload
            }
        
        case GET_ALL_BRANDS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        // **********GET ALL SIZES**********************************/
        case GET_ALL_SIZE:
            return {
                ...state,
                loading: action.payload
            }
        
        case GET_ALL_SIZE_EXITO:
            return {
                ...state,
                loading: false,
                listAllSizes: action.payload
            }
        
        case GET_ALL_SIZE_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        // **********SIZE SELECTED**********************************/
        case SET_SIZE_SELECTED:
            return {
                ...state,
                loading: action.payload
            }
        
        case SET_SIZE_SELECTED_EXITO:
            return {
                ...state,
                loading: false,
                tallaSelect: action.payload
            }
        
        case SET_SIZE_SELECTED_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        // **********GET SIZES PRODUCT**********************************/
        case GET_SIZE_PRODUCT_ZALANDO:
            return {
                ...state,
                loading: action.payload
            }
        
        case GET_SIZE_PRODUCT_ZALANDO_EXITO:
            return {
                ...state,
                loading: false,
                listSizesProductsZalando: action.payload
            }
        
        case GET_SIZE_PRODUCT_ZALANDO_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        // **********GET ALL PRODUCTS**********************************/
        case GET_PRODUCTS_ZALANDO:
            return {
                ...state,
                loading: action.payload
            }
        
        case GET_PRODUCTS_ZALANDO_EXITO:
            return {
                ...state,
                loading: false,
                listProductsZalando: action.payload
            }
        
        case GET_PRODUCTS_ZALANDO_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        // **********GET PRODUCT**********************************/
        case GET_PRODUCT_ZALANDO:
            return {
                ...state,
                loading: action.payload
            }
        
        case GET_PRODUCT_ZALANDO_EXITO:
            return {
                ...state,
                loading: false,
                productZalando: action.payload
            }
        
        case GET_PRODUCT_ZALANDO_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            }


        default: 
            return state

    }

}