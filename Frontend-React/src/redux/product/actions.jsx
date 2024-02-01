import axios from 'axios'

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

} from './types';

const urlProductos = "http://localhost:3100/productos/"

// ************************ GET ALL SIZES **********************************************
export function getAllBrandsAPIAction() {
  return async (dispatch) => {
    dispatch(getAllBrandsAPI(true));

    try {
      let response = await axios({
        method: "GET",
        url: urlProductos + "allBrand",
        headers: {},
      });

      dispatch(getAllBrandsAPIExito(response.data));
    } catch (error) {
      console.log(error.response);
      dispatch(getAllBrandsAPIError(true));
    }
  };
}

const getAllBrandsAPI = (estado) => ({
  type: GET_ALL_BRANDS,
  payload: true

})

const getAllBrandsAPIExito = sizes => ({
  type: GET_ALL_BRANDS_EXITO,
  payload: sizes

})

const getAllBrandsAPIError = estado => ({
  type: GET_ALL_BRANDS_ERROR,
  payload: estado
})

// ************************ GET ALL SIZES **********************************************
export function getAllSizesAPIAction() {
  return async (dispatch) => {
    dispatch(getAllSizesAPI(true));

    try {
      let response = await axios({
        method: "GET",
        url: urlProductos + "allSize",
        headers: {},
      });

      dispatch(getAllSizesAPIExito(response.data));
    } catch (error) {
      console.log(error.response);
      dispatch(getAllSizesAPIError(true));
    }
  };
}

const getAllSizesAPI = (estado) => ({
  type: GET_ALL_SIZE,
  payload: true

})

const getAllSizesAPIExito = sizes => ({
  type: GET_ALL_SIZE_EXITO,
  payload: sizes

})

const getAllSizesAPIError = estado => ({
  type: GET_ALL_SIZE_ERROR,
  payload: estado
})

// ************************ GET ALL PRODUCTS **********************************************
export function getProductosZalandoAPIAction(talla) {
    return async (dispatch) => {
      dispatch(getProductosZalandoAPI(true));
  
      try {
        let response;
        if(talla != ""){
          response = await axios({
            method: "GET",
            url: urlProductos,
            params: {
              'talla': talla
            },
            headers: {},
          });
        }
        else{
          response = await axios({
            method: "GET",
            url: urlProductos,
            headers: {},
          });
        }

        dispatch(getProductosZalandoAPIExito(response.data));
      } catch (error) {
        console.log(error.response);
        dispatch(getProductosZalandoAPIError(true));
      }
    };
  }

const getProductosZalandoAPI = (estado) => ({
    type: GET_PRODUCTS_ZALANDO,
    payload: true

})

const getProductosZalandoAPIExito = categorias => ({
    type: GET_PRODUCTS_ZALANDO_EXITO,
    payload: categorias

})

const getProductosZalandoAPIError = estado => ({
  type: GET_PRODUCTS_ZALANDO_ERROR,
  payload: estado
})

// ************************ GET ONE PRODUCT **********************************************

export function getProductoZalandoAPIAction(idProducto) {
  return async (dispatch) => {
    dispatch(getProductoZalandoAPI(true));

    try {
      const response = await axios({
        method: "GET",
        url: urlProductos + idProducto,
        headers: {},
      });

      dispatch(getProductoZalandoAPIExito(response.data));
    } catch (error) {
      console.log(error.response);
      dispatch(getProductoZalandoAPIError(true));
    }
  };
}

const getProductoZalandoAPI = (estado) => ({
  type: GET_PRODUCT_ZALANDO,
  payload: true

})

const getProductoZalandoAPIExito = categorias => ({
  type: GET_PRODUCT_ZALANDO_EXITO,
  payload: categorias

})

const getProductoZalandoAPIError = estado => ({
  type: GET_PRODUCT_ZALANDO_ERROR,
  payload: estado
})

// ************************ GET SIZE PRODUCT **********************************************

export function getSizeProductZalandoAPIAction(idProducto) {
  return async (dispatch) => {
    dispatch(getSizeProductZalandoAPI(true));

    try {
      const response = await axios({
        method: "GET",
        url: urlProductos + "allSizeByZapato/" + idProducto,
        headers: {},
      });

      dispatch(getSizeProductZalandoAPIExito(response.data));
    } catch (error) {
      console.log(error.response);
      dispatch(getSizeProductZalandoAPIError(true));
    }
  };
}

const getSizeProductZalandoAPI = (estado) => ({
  type: GET_SIZE_PRODUCT_ZALANDO,
  payload: true

})

const getSizeProductZalandoAPIExito = categorias => ({
  type: GET_SIZE_PRODUCT_ZALANDO_EXITO,
  payload: categorias

})

const getSizeProductZalandoAPIError = estado => ({
  type: GET_SIZE_PRODUCT_ZALANDO_ERROR,
  payload: estado
})

// ************************ SET SIZE SELECT **********************************************

export function setSizeSelectedAPIAction(tallaSelected) {
  return async (dispatch) => {
    dispatch(setSizeSelectedAPI(true));

    try {
      dispatch(setSizeSelectedAPIExito(tallaSelected));
    } catch (error) {
      console.log(error.response);
      dispatch(setSizeSelectedAPIError(true));
    }
  };
}

const setSizeSelectedAPI = (estado) => ({
  type: SET_SIZE_SELECTED,
  payload: true

})

const setSizeSelectedAPIExito = talla => ({
  type: SET_SIZE_SELECTED_EXITO,
  payload: talla

})

const setSizeSelectedAPIError = estado => ({
  type: SET_SIZE_SELECTED_ERROR,
  payload: estado
})