import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import ProductCard from './components/product-card';
import ProductSort from './components/product-sort';
import Checkbox from '@mui/material/Checkbox';
import debounce from 'lodash/debounce';
import TablePagination from '@mui/material/TablePagination';

import Slider from '@mui/material/Slider';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import {
  getProductosZalandoAPIAction,
  getAllBrandsAPIAction,
  getAllSizesAPIAction,
  setSizeSelectedAPIAction
} from '../../redux/product/actions';

// ----------------------------------------------------------------------

const Products = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const [searchName, setSearchName] = useState('');

  const [precioMasBajo, setPrecioMasBajo] = useState(0);
  const [precioMasAlto, setPrecioMasAlto] = useState(0);
  const [tallaSelected, setTallaSelected] = useState(false);
  const [listProductos, setListProductos] = useState([]);
  const [paginatedProducts, setPaginatedProducts] = useState([]);

  const listProductsZalando = useSelector((state) => state.productsComponent.listProductsZalando);
  const listAllBrands = useSelector((state) => state.productsComponent.listAllBrands);
  const listAllSizes = useSelector((state) => state.productsComponent.listAllSizes);

  const getProductosZalandoAPI = (talla) => dispatch(getProductosZalandoAPIAction(talla));
  const getAllBrandsAPI = () => dispatch(getAllBrandsAPIAction());
  const getAllSizesAPI = () => dispatch(getAllSizesAPIAction());
  const setSizeSelectedAPI = (talla) => dispatch(setSizeSelectedAPIAction(talla));

  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  //const paginatedProducts = listProductos.slice(startIndex, endIndex);

  //Getion de paginas
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangePageSize = (event) => {
    setPageSize(event.target.value);
    setPage(0); // Al cambiar el tamaño de la página, volvemos a la primera página
  };

  // Crea una versión debounced de la función de manejo de eventos
  const filterListProductByNameAndIdDebounced = debounce((textSearch) => {
    filterListProductByNameAndId(textSearch);
  }, 300);

  useEffect(() => {
    getAllBrandsAPI();
    getAllSizesAPI();
    getProductosZalandoAPI('');
  }, []);

  useEffect(() => {
    setArraysProductos(listProductos);
  }, [page, pageSize]);

  const setArraysProductos = (listProductos) => {
    let listSlice = listProductos.slice(startIndex, endIndex);
    setListProductos(listProductos);
    setPaginatedProducts(listSlice);
  };

  useEffect(() => {
    if (listProductsZalando.length != 0) {
      setArraysProductos(listProductsZalando);

      let precioMinimo = 0;
      let precioMaximo = 0;
      if (
        listProductsZalando[0].precio_actual_talla != '' &&
        listProductsZalando[0].precio_actual_talla != null &&
        listProductsZalando[0].precio_actual_talla != undefined
      ) {
        let preciosNumericos = [
          ...listProductsZalando.map((producto) => producto.precio_actual_talla),
        ];
        precioMaximo = Math.max.apply(null, preciosNumericos);
        precioMinimo = Math.min.apply(null, preciosNumericos);
      }

      setPrecioMasBajo(precioMinimo);
      setPrecioMasAlto(precioMaximo);

      setPrecioMinimoImput(precioMinimo);
      setPrecioMaximoImput(precioMaximo);

      setValueSlider([precioMinimo, precioMaximo]);
    }
  }, [listProductsZalando]);

  const handleClick = (product) => {
    // Redirigir a la URL específica del producto
    navigate(`/products/${product._id}`);
  };

  const filtrarPorPrecio = () => {
    let vectorFiltrado = listProductsZalando.filter((elemento) => {
      return (
        elemento.precio_actual_talla >= precioMinimoImput &&
        elemento.precio_actual_talla <= precioMaximoImput
      );
    });
    setArraysProductos(vectorFiltrado);

    setOpenPopper(false);
  };

  const cancelarFiltroPrecio = () => {
    setArraysProductos(listProductsZalando);

    setPrecioMinimoImput(precioMasBajo);
    setPrecioMaximoImput(precioMasAlto);

    setOpenPopper(false);
  };

  const filterListProductByBrand = (marcasSelected) => {
    if (marcasSelected.length === 0) {
      setArraysProductos(listProductsZalando);
    } else {
      let vectorFiltrado = listProductos.filter((elemento) => {
        return marcasSelected.includes(elemento.brand);
      });
      setArraysProductos(vectorFiltrado);
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
      setArraysProductos(vectorFiltrado);
    } else {
      setArraysProductos(listProductsZalando);
    }
  };

  const filterListProductBySize = (sizeSelected) => {
    setSearchName('');
    if (sizeSelected != '' && sizeSelected != undefined && sizeSelected != undefined) {
      getProductosZalandoAPI(sizeSelected);
      setTallaSelected(true);
      setSizeSelectedAPI(sizeSelected)
    } else {
      getProductosZalandoAPI('');
      setTallaSelected(false);
      setSizeSelectedAPI("")
    }
  };

  //SLIDER
  const [valueSlider, setValueSlider] = useState([]);

  const handleChangeSlider = (event, newValue) => {
    setValueSlider(newValue);

    setPrecioMinimoImput(newValue[0]);
    setPrecioMaximoImput(newValue[1]);
  };

  function valuetext(value) {
    return `${value} €`;
  }

  //POPPER
  const [anchorElPopper, setAnchorElPopper] = useState(null);
  const [openPopper, setOpenPopper] = useState(false);

  const handleClickPopper = (event) => {
    setAnchorElPopper(event.currentTarget);
    setOpenPopper((previousOpen) => !previousOpen);
  };

  //Filter prices
  const [precioMinimoImput, setPrecioMinimoImput] = useState(0);
  const [precioMaximoImput, setPrecioMaximoImput] = useState(0);

  const blurPrecioMinimo = () => {
    if (precioMinimoImput < precioMasBajo) {
      setPrecioMinimoImput(precioMasBajo);
      setValueSlider([precioMasBajo, valueSlider[1]]);
    } else {
      setValueSlider([precioMinimoImput, valueSlider[1]]);
    }
  };

  const blurPrecioMaximo = () => {
    if (precioMaximoImput > precioMasAlto) {
      setPrecioMaximoImput(precioMasAlto);
      setValueSlider([precioMasAlto, valueSlider[1]]);
    } else {
      setValueSlider([precioMinimoImput, valueSlider[1]]);
    }
  };

  return (
    <Container>
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
          sx={{ my: 1, width: '80%' }}
          justifyContent="flex-start"
        >
          <TextField
            label="Name"
            value={searchName}
            id="nombre"
            variant="outlined"
            fullWidth
            onChange={(e) => {
              setSearchName(e.target.value);
              filterListProductByNameAndIdDebounced(e.target.value);
            }}
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
            renderInput={(params) => <TextField {...params} label="Marca" placeholder="Marca" />}
          />
          
          <Button fullWidth color="success" variant="outlined" onClick={handleClickPopper} endIcon={<KeyboardArrowDownIcon />}>PRECIO</Button>

          <Popper
            // Note: The following zIndex style is specifically for documentation purposes and may not be necessary in your application.
            sx={{ border: 1, p: 0, bgcolor: 'background.paper', zIndex: 1200, minWidth: '25%' }}
            open={openPopper}
            anchorEl={anchorElPopper}
            placement={'bottom'}
            transition
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                  <Typography sx={{ p: 2 }}></Typography>

                  <Stack
                    direction="row"
                    alignItems="center"
                    flexWrap="wrap-reverse"
                    sx={{ marginTop: 1 }}
                    justifyContent="space-between"
                  >
                    <TextField
                      label="Minimo"
                      type="number"
                      value={precioMinimoImput}
                      id="nombre"
                      variant="outlined"
                      sx={{ marginLeft: 5, width: '40%' }}
                      onChange={(e) => {
                        setPrecioMinimoImput(e.target.value);
                      }}
                      onBlur={blurPrecioMinimo}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">€</InputAdornment>,
                      }}
                    />

                    <TextField
                      label="Maximo"
                      type="number"
                      value={precioMaximoImput}
                      id="nombre"
                      variant="outlined"
                      sx={{ marginRight: 5, width: '40%' }}
                      onChange={(e) => {
                        setPrecioMaximoImput(e.target.value);
                      }}
                      onBlur={blurPrecioMaximo}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">€</InputAdornment>,
                      }}
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    alignItems="center"
                    flexWrap="wrap-reverse"
                    sx={{ marginTop: 5 }}
                    justifyContent="center"
                  >
                    <Slider
                      sx={{ width: '80%' }}
                      getAriaLabel={() => ''}
                      value={valueSlider}
                      onChange={handleChangeSlider}
                      getAriaValueText={valuetext}
                      min={precioMasBajo}
                      max={precioMasAlto}
                      color="secondary"
                      step={1}
                      valueLabelDisplay="on"
                    />
                  </Stack>

                  <Typography sx={{ p: 2 }}></Typography>

                  <Stack
                    direction="row"
                    alignItems="center"
                    flexWrap="wrap-reverse"
                    sx={{ marginTop: 1 }}
                    justifyContent="space-between"
                  >
                    <Button
                      onClick={cancelarFiltroPrecio}
                      sx={{ width: '50%' }}
                      variant="contained"
                      color="error"
                    >
                      Cancelar
                    </Button>

                    <Button
                      onClick={filtrarPorPrecio}
                      sx={{ width: '50%' }}
                      variant="contained"
                      color="success"
                    >
                      Aplicar
                    </Button>
                  </Stack>
                </Paper>
              </Fade>
            )}
          </Popper>
        </Stack>
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <ProductSort
            listProductos={listProductos}
            setArraysProductos={setArraysProductos}
            tallaSelected={tallaSelected}
          />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {paginatedProducts.map((product) => (
          <Grid key={product.id} xs={12} sm={6} md={3} onClick={(e) => handleClick(product)}>
            <ProductCard key={product._id} product={product} />
          </Grid>
        ))}
      </Grid>
      <Stack direction="row" flexShrink={0} sx={{ my: 4, width: '100%' }} justifyContent="flex-end">
        <TablePagination
          component="div"
          count={listProductos.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleChangePageSize}
          rowsPerPageOptions={[20, 40, 60, 80, 100]}
        />
      </Stack>
    </Container>
  );
};

export default Products;
