import axios from 'axios'

import {

    GET_PRICES_BY_PRODUCT,
    GET_PRICES_BY_PRODUCT_EXITO,
    GET_PRICES_BY_PRODUCT_ERROR,

} from './types';

const urlPrices = "http://localhost:3100/prices/"

// ************************ GET PRICES BY PRODUCT **********************************************

export function getPricesByProductAPIAction(idProducto, talla) {
    return async (dispatch) => {
      dispatch(getPricesByProductAPI(true));
  
      try {
        let response = await axios({
          method: "GET",
          url: urlPrices + "byProductAndSize/" + idProducto,
          params: {
            'talla': talla
          },
          headers: {},
        });

        dispatch(getPricesByProductAPIActionExito(response.data));
      } catch (error) {
        console.log(error.response);
        dispatch(getPricesByProductAPIActionError(true));
      }
    };
  }

const getPricesByProductAPI = (estado) => ({
    type: GET_PRICES_BY_PRODUCT,
    payload: true

})

const getPricesByProductAPIActionExito = categorias => ({
    type: GET_PRICES_BY_PRODUCT_EXITO,
    payload: categorias

})

const getPricesByProductAPIActionError = estado => ({
  type: GET_PRICES_BY_PRODUCT_ERROR,
  payload: estado
})
