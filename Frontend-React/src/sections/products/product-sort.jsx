import { useState, useEffect } from 'react';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { listClasses } from '@mui/material/List';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'name', label: 'Name ASC' },
  { value: 'nameDESC', label: 'Name DESC' },
  { value: 'bestOffers', label: 'Best Offers' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' },
];

export default function ShopProductSort({ listProductos, setListProductos, tallaSelected }) {

  const [LIST_SORT_OPTIONS, SET_LIST_SORT_OPTIONS] = useState([]);
  const [optionSort, setOptionSort] = useState("Name");
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if(tallaSelected == true){
      let SORT_OPTIONS_COMPLETE = [
        { value: 'name', label: 'Name' },
        { value: 'nameDESC', label: 'Name DESC' },
        { value: 'bestOffers', label: 'Best Offers' },
        { value: 'priceDesc', label: 'Price: High-Low' },
        { value: 'priceAsc', label: 'Price: Low-High' },
      ];
      SET_LIST_SORT_OPTIONS(SORT_OPTIONS_COMPLETE)
    }
    if(tallaSelected == false){
      let SORT_OPTIONS_INCOMPLETE = [
        { value: 'name', label: 'Name' },
        { value: 'nameDESC', label: 'Name DESC' },
      ];
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

    console.log("-setFilters-")
    console.log(listProductos.length)
    console.log(listProductos[0].name)

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

      setListProductos(productosOrdenadosPrecio)
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

      setListProductos(productosOrdenadosPrecio)
    }

    if(optionSelect == "bestOffers"){
      let productosConMejoresDescuentos = listProductos.sort((a, b) => a.porcentaje_cambio - b.porcentaje_cambio);
      setListProductos(productosConMejoresDescuentos)
    }

    if(optionSelect == "priceDesc"){
      let productosPreciosDescendentes = listProductos.sort((a, b) => a.precio_actual_talla - b.precio_actual_talla);
      setListProductos(productosPreciosDescendentes)
    }

    if(optionSelect == "priceAsc"){
      let productosPreciosAscendentes = listProductos.sort((a, b) => b.precio_actual_talla - a.precio_actual_talla);
      setListProductos(productosPreciosAscendentes)
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