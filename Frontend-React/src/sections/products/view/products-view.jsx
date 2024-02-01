import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { products } from 'src/_mock/products';

import ProductCard from '../product-card';
import ProductSort from '../product-sort';
import ProductFilters from '../product-filters';
import ProductCartWidget from '../product-cart-widget';
import Checkbox from '@mui/material/Checkbox';
import debounce from 'lodash/debounce';

import { 
  getProductosZalandoAPIAction,
  getAllBrandsAPIAction,
  getAllSizesAPIAction
} from '../../../redux/product/actions';

// ----------------------------------------------------------------------

export default function ProductsView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tallaSelected, setTallaSelected] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [listProductos, setListProductos] = useState([]);

  const listProductsZalando = useSelector((state) => state.productsComponent.listProductsZalando);
  const listAllBrands = useSelector((state) => state.productsComponent.listAllBrands);
  const listAllSizes = useSelector((state) => state.productsComponent.listAllSizes);

  const getProductosZalandoAPI = (talla) => dispatch(getProductosZalandoAPIAction(talla));
  const getAllBrandsAPI = () => dispatch(getAllBrandsAPIAction());
  const getAllSizesAPI = () => dispatch(getAllSizesAPIAction());

  // Crea una versión debounced de la función de manejo de eventos
  const filterListProductByNameAndIdDebounced = debounce((textSearch) => {
    filterListProductByNameAndId(textSearch), 300;
  });

  useEffect(() => {
    getAllBrandsAPI()
    getAllSizesAPI()
    getProductosZalandoAPI("");
  }, []);

  useEffect(() => {
    if (listProductsZalando.length != 0) {
      setListProductos(listProductsZalando);
    }
  }, [listProductsZalando]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleClick = (product) => {
    // Redirigir a la URL específica del producto
    navigate(`/products/${product._id}`);
  };

  const filterListProductByBrand = (marcasSelected) => {
    if (marcasSelected.length === 0) {
      setListProductos(listProductsZalando);
    } else {
      let vectorFiltrado = listProductos.filter((elemento) => {
        return marcasSelected.includes(elemento.brand);
      });
      setListProductos(vectorFiltrado);
    }
  };

  const filterListProductByNameAndId = (textSearch) => {
    if (textSearch != '') {
      let vectorFiltrado = listProductsZalando.filter((elemento) => {
        const lowercaseSearch = textSearch.toLowerCase();
        return (
          elemento.name.toLowerCase().includes(lowercaseSearch) ||
          elemento.id_zalando.toLowerCase().includes(lowercaseSearch)
        );
      });
      setListProductos(vectorFiltrado);
    } else {
      setListProductos(listProductsZalando);
    }
  };

  const filterListProductBySize = (sizeSelected) => {
    if(sizeSelected != "" && sizeSelected != undefined && sizeSelected != undefined){
      getProductosZalandoAPI(sizeSelected);
      setTallaSelected(true);
    }
    else{
      getProductosZalandoAPI("");
      setTallaSelected(false);
    }
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Products
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        sx={{ mb: 5 }}
        justifyContent="space-between"
      >
        <Stack
          direction="row"
          spacing={1}
          flexShrink={0}
          sx={{ my: 1, width: '50%' }}
          justifyContent="flex-start"
        >
          <TextField
            label="Name"
            id="nombre"
            variant="outlined"
            //sx={{ m: 1 }}
            fullWidth
            //onChange={(e) => filterListProductByNameAndId(e.target.value)}
            onChange={(e) => filterListProductByNameAndIdDebounced(e.target.value)}
          />

          <Autocomplete
            id="checkboxes-tags-demo"
            fullWidth
            options={listAllSizes}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            onChange={(event, value) => filterListProductBySize(value)}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox style={{ marginRight: 8 }} checked={selected} />
                {option}
              </li>
            )}
            //style={{ width: 500 }}
            renderInput={(params) => <TextField {...params} label="Talla" placeholder="Talla" />}
          />

          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            fullWidth
            limitTags={2}
            options={listAllBrands}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            onChange={(event, value) => filterListProductByBrand(value)}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox style={{ marginRight: 8 }} checked={selected} />
                {option}
              </li>
            )}
            //style={{ width: 500 }}
            renderInput={(params) => <TextField {...params} label="Marca" placeholder="Marca" />}
          />
        </Stack>
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <ProductFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />

          <ProductSort listProductos={listProductos} setListProductos={setListProductos} tallaSelected={tallaSelected}/>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {listProductos.map((product) => (
          <Grid key={product.id} xs={12} sm={6} md={3} onClick={(e) => handleClick(product)}>
            <ProductCard key={product._id} product={product} />
          </Grid>
        ))}
      </Grid>

      <ProductCartWidget />
    </Container>
  );
}
