import { useState, useEffect } from 'react';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { listClasses } from '@mui/material/List';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const SORT_OPTIONS_COMPLETE = [
  { value: 'name', label: 'Name' },
  { value: 'nameDESC', label: 'Name DESC' },
  { value: 'bestOffers', label: 'Best Offers' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' },
];

const SORT_OPTIONS_INCOMPLETE = [
  { value: 'name', label: 'Name' },
  { value: 'nameDESC', label: 'Name DESC' },
];

export default function ShopProductSort({ listProductos, setArraysProductos, tallaSelected }) {

  const [LIST_SORT_OPTIONS, SET_LIST_SORT_OPTIONS] = useState([]);
  const [optionSort, setOptionSort] = useState("Name");
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if(tallaSelected == true){
      SET_LIST_SORT_OPTIONS(SORT_OPTIONS_COMPLETE)
    }
    if(tallaSelected == false){
      SET_LIST_SORT_OPTIONS(SORT_OPTIONS_INCOMPLETE)
    }
  }, [tallaSelected]);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const setFilters = (optionSelect, label) => {
    setOptionSort(label)

    if(optionSelect == "name"){
      let productosOrdenadosPrecio = listProductos.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
      
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      console.log(productosOrdenadosPrecio[0].name)

      setArraysProductos(productosOrdenadosPrecio)
    }

    if(optionSelect == "nameDESC"){
      let productosOrdenadosPrecio = listProductos.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
      
        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }
        return 0;
      });
      console.log(productosOrdenadosPrecio[0].name)

      setArraysProductos(productosOrdenadosPrecio)
    }

    if(optionSelect == "bestOffers"){
      let productosConMejoresDescuentos = listProductos.sort((a, b) => a.porcentaje_cambio - b.porcentaje_cambio);
      setArraysProductos(productosConMejoresDescuentos)
    }

    if(optionSelect == "priceDesc"){
      let productosPreciosDescendentes = listProductos.sort((a, b) => b.precio_actual_talla - a.precio_actual_talla);
      setArraysProductos(productosPreciosDescendentes)
    }

    if(optionSelect == "priceAsc"){
      let productosPreciosAscendentes = listProductos.sort((a, b) => a.precio_actual_talla - b.precio_actual_talla);
      setArraysProductos(productosPreciosAscendentes)
    }

    setOpen(null);
  };

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={handleOpen}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        Sort By:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {optionSort}
        </Typography>
      </Button>

      <Menu
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              [`& .${listClasses.root}`]: {
                p: 0,
              },
            },
          },
        }}
      >
        {LIST_SORT_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === 'name'}
            onClick={() => setFilters(option.value, option.label)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}