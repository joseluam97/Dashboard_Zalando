import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ProductWidgetHeader from '../product-widget-header';
import ProductWidgetSummary from '../product-widget-summary';
import ProductWebsiteVisits from '../product-website-visits';
import ProductNewsUpdate from '../product-list_prices';
import { fCurrency, fPercent } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';

import {
  getProductoZalandoAPIAction,
  getSizeProductZalandoAPIAction
} from '../../../redux/product/actions'

import {
  getPricesByProductAPIAction
} from '../../../redux/prices/actions'

// ----------------------------------------------------------------------

export default function ProductView() {
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

    console.log("-tallaSelect-")
    console.log(tallaSelect)

    if(tallaSelect != '' && tallaSelect != undefined && tallaSelect != null){
      getProductoZalandoAPI(id);
      getPricesByProductAPI(id, tallaSelect);
    }

  }, [tallaSelect])

  useEffect(() => {

    console.log("-productZalando-")
    console.log(productZalando)

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
        <Grid xs={12} md={6} lg={12}>
          <ProductWidgetHeader
            product={productSelected}
            prices={pricesProducto}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <ProductWidgetSummary
            title="Precio mas alto"
            total={fCurrency(pricesProducto?.precioMaximo)}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <ProductWidgetSummary
            title="Precio mas bajo"
            total={fCurrency(pricesProducto?.precioMinimo)}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <ProductWidgetSummary
            title="Precio medio"
            total={fCurrency(pricesProducto?.precioMedio)}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <ProductWidgetSummary
            title="Registros de precios"
            total={pricesProducto?.numeroRegistros}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
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
