import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import ProductWidgetHeader from './components/product-widget-header';
import ProductWidgetSummary from './components/product-widget-summary';
import ProductWebsiteVisits from './components/product-website-visits';
import ProductNewsUpdate from './components/product-list_prices';
import ProductIndicatorsHeader from './components/product-indicators-header';
import { fCurrency, fPercent } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';
import { Stack, Typography, Avatar, Fab } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import FunctionsIcon from '@mui/icons-material/Functions';

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import NumbersIcon from '@mui/icons-material/Numbers';

import {
  getProductoZalandoAPIAction,
  getSizeProductZalandoAPIAction
} from '../../redux/product/actions'

import {
  getPricesByProductAPIAction
} from '../../redux/prices/actions'

// ----------------------------------------------------------------------

const Product = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const dispatch = useDispatch()

  const [openFilter, setOpenFilter] = useState(false);
  const [productSelected, setProductSelected] = useState({});
  const [pricesProducto, setPricesProducto] = useState({});

  //PRODUCTS
  const productZalando = useSelector(state => state.productsComponent.productZalando)
  const tallaSelect = useSelector(state => state.productsComponent.tallaSelect)
  const listSizesProductsZalando = useSelector(state => state.productsComponent.listSizesProductsZalando)

  const getProductoZalandoAPI = (id) => dispatch(getProductoZalandoAPIAction(id))
  const getSizeProductZalandoAPI = (id) => dispatch(getSizeProductZalandoAPIAction(id))
  
  //PRICES
  const listPricesByProduct = useSelector(state => state.pricesComponent.listPricesByProduct)

  const getPricesByProductAPI = (id, talla) => dispatch(getPricesByProductAPIAction(id, talla))
  
  const [labelGraficos, setLabelGraficos] = useState([]);
  const [dataGraficos, setDataGraficos] = useState([]);
  const [dataMediaGraficos, setDataMediaGraficos] = useState([]);
  const [listPrices, setListPrices] = useState([]);
  
  useEffect(() => {

    getSizeProductZalandoAPI(id);

  }, [])

  useEffect(() => {

    if(listSizesProductsZalando.length != 0){
      getProductoZalandoAPI(id);
      getPricesByProductAPI(id, listSizesProductsZalando[0]);
    }

  }, [listSizesProductsZalando])

  useEffect(() => {

    if(tallaSelect != '' && tallaSelect != undefined && tallaSelect != null){
      getProductoZalandoAPI(id);
      getPricesByProductAPI(id, tallaSelect);
    }

  }, [tallaSelect])

  useEffect(() => {

    if(productZalando != ''){
      if(productZalando != undefined && productZalando != null){
        setProductSelected(productZalando)
      }
      else{
        navigate(`/products`);
      }
    }
  }, [productZalando])

  useEffect(() => {

    if(listPricesByProduct != ''){
      if(listPricesByProduct != undefined && listPricesByProduct != null){
        setPricesProducto(listPricesByProduct)
        setDataChart(listPricesByProduct)
      }
    }
  }, [listPricesByProduct])

  function setDataChart(precios){

    let vectorLabels = []
    let vectorDatas = []
    let vectorMedia = []
    
    let allPrecios = [...precios.vectorPrecios];
    
    allPrecios = allPrecios?.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    for(let registroPrecio in allPrecios){
      vectorLabels.push(fDate(allPrecios[registroPrecio]?.fecha))
      vectorDatas.push(allPrecios[registroPrecio]?.precio)
      vectorMedia.push(precios.precioMedio)
    }

    setLabelGraficos(vectorLabels)
    setDataGraficos(vectorDatas)
    setDataMediaGraficos(vectorMedia)
    setListPrices(precios.vectorPrecios)
    
  }

  const handleOpenFilter = () => {
    // setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    // setOpenFilter(false);
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={6} lg={6}>
          <ProductWidgetHeader
            product={productSelected}
            prices={pricesProducto}
          />
        </Grid>
        <Grid xs={12} md={6} lg={6}>
          <ProductIndicatorsHeader
            product={productSelected}
            prices={pricesProducto}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <ProductWidgetSummary
            title="Precio mas alto"
            total={fCurrency(pricesProducto?.precioMaximo)}
            //color="secondary"
            backgroundColor="#ff6961"
            icon={
              <ArrowCircleUpIcon width={24}/>
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <ProductWidgetSummary
            title="Precio mas bajo"
            total={fCurrency(pricesProducto?.precioMinimo)}
            //color="info"
            backgroundColor="#77dd77"
            icon={
              <ArrowCircleDownIcon width={24}/>
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <ProductWidgetSummary
            title="Precio medio"
            total={fCurrency(pricesProducto?.precioMedio)}
            backgroundColor="#fdfd96"
            icon={
              <FunctionsIcon width={24} />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <ProductWidgetSummary
            title="Registros de precios"
            total={pricesProducto?.numeroRegistros}
            backgroundColor="#84b6f4"
            icon={
              <NumbersIcon width={24}/>
            }
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <ProductWebsiteVisits
            title="Registro Precios"
            subheader="En esta grafica vemos el registro de precios cuando el producto estaba disponible para su compra"
            chart={{
              labels: labelGraficos,
              series: [
                {
                  name: 'Precio',
                  type: 'column',
                  fill: 'solid',
                  data: dataGraficos,
                },
                {
                  name: 'Precio medio',
                  type: 'line',
                  fill: 'solid',
                  data: dataMediaGraficos,
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <ProductNewsUpdate
            title="Listado de precios"
            list={listPrices}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Product;