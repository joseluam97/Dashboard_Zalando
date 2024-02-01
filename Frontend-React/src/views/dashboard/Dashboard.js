import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

// components
import SalesOverview from './components/SalesOverview';
import YearlyBreakup from './components/YearlyBreakup';
import RecentTransactions from './components/RecentTransactions';
import ProductPerformance from './components/ProductPerformance';
import Blog from './components/Blog';
import MonthlyEarnings from './components/MonthlyEarnings';

import Typography from '@mui/material/Typography';
import ProductCard from '../products/components/product-card';

import { getProductosOffertZalandoAPIAction } from '../../redux/product/actions';

const LIST_BRAND_AND_SIZES = [
  { marca: 'adidas Originals', talla: '40 2/3' },
  /*{ marca: 'adidas Performance', talla: '40 2/3' },
  { marca: 'adidas Sportswear', talla: '40 2/3' },
  { marca: 'Nike Performance', talla: '41' },
  { marca: 'Nike SB', talla: '41' },
  { marca: 'Nike Sportswear', talla: '41' },
  { marca: 'Puma', talla: '41' },
  { marca: 'New Balance', talla: '41' },
  { marca: 'Vans', talla: '41' },
  { marca: 'Converse', talla: '41' },
  { marca: 'Jordan', talla: '40.5' },*/
];

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [listProductos, setListProductos] = useState([]);

  const listProductsOffert = useSelector((state) => state.productsComponent.listProductsOffert);

  const getProductosOffertZalandoAPI = (list_brand_sizes) =>
    dispatch(getProductosOffertZalandoAPIAction(list_brand_sizes));

  useEffect(() => {
    getProductosOffertZalandoAPI(LIST_BRAND_AND_SIZES);
  }, []);

  useEffect(() => {
    if (listProductsOffert.length != 0) {
      setListProductos(listProductsOffert);
    }
  }, [listProductsOffert]);

  const handleClick = (product) => {
    // Redirigir a la URL específica del producto
    navigate(`/products/${product._id}`);
  };

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            {listProductos.map((product) => (
              <>
                <Typography variant="h6" sx={{ color: 'text.secondary'}}>
                  {product['brand']}
                </Typography>
                <Grid container direction="row" spacing={3}>
                  {product['list'].map((product) => (
                    <Grid
                      key={product.id}
                      xs={12}
                      sm={6}
                      md={2}
                      onClick={(e) => handleClick(product)}
                    >
                      <ProductCard key={product._id} product={product} />
                    </Grid>
                  ))}
                </Grid>
              </>
            ))}
          </Grid>
          {/*<Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <RecentTransactions />
          </Grid>
          <Grid item xs={12} lg={8}>
            <ProductPerformance />
          </Grid>
          <Grid item xs={12}>
            <Blog />
          </Grid>*/}
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
