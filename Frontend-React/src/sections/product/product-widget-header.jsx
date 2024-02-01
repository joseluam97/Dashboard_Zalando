import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Button } from '@mui/material';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { fCurrency, fPercent } from 'src/utils/format-number';

import {
  setSizeSelectedAPIAction
} from '../../redux/product/actions'

// ----------------------------------------------------------------------

export default function ProductWidgetHeader({ product, prices, sx, ...other }) {
  const dispatch = useDispatch()

  const [tallaSelected, setTallaSelected] = useState();
  
  const setSizeSelectedAPI = (talla) => dispatch(setSizeSelectedAPIAction(talla))

  const listSizesProductsZalando = useSelector(
    (state) => state.productsComponent.listSizesProductsZalando
  );

  useEffect(() => {

    if(tallaSelected != "" && tallaSelected != undefined && tallaSelected != null){
      setSizeSelectedAPI(tallaSelected)
    }

  }, [tallaSelected])

  useEffect(() => {

    if(listSizesProductsZalando.length != 0){
      setTallaSelected(listSizesProductsZalando[0]);
    }

  }, [listSizesProductsZalando])

  return (
    <Card spacing={-5} component={Stack}>
      <Stack
        spacing={3}
        direction="row"
        sx={{
          px: 3,
          py: 5,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          ...sx,
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center', // Ajustado a 'center' para centrar verticalmente
          }}
        >
          <img alt="icon" src={product?.imagen} />
        </Box>

        <Stack spacing={0.5}>
          <Typography variant="h4">{product?.name}</Typography>

          <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
            <b>Marca: </b>
            {product?.brand}
          </Typography>

          <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
            <b>Identificador Zalando: </b>
            {product?.id_zalando}
          </Typography>

          <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
            <b>Color: </b>
            {product?.color}
          </Typography>

          <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
            <b>Precio Actual: </b>
            {fCurrency(prices?.precioActual)}
          </Typography>

          <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
            <b>Diferencia con respecto a precio medio: </b>
            {fPercent(prices?.porcentajeCambio)}
          </Typography>

          <div>
            <Autocomplete
              id="tags-outlined"
              spacing={3}
              value={tallaSelected != undefined ? tallaSelected : ''}
              inputValue={tallaSelected != null ? tallaSelected : ''}
              options={listSizesProductsZalando}
              getOptionLabel={(option) => (option != null ? option : '')}
              onChange={(event, value) => setTallaSelected(value)}
              sx={{ m: 1, width: 300 }}
              size="small"
              renderInput={(params) => <TextField {...params} label="Talla" />}
            />
          </div>
        </Stack>
      </Stack>

      <CardActions>
        <Button size="small">Visita Zalando</Button>
      </CardActions>
    </Card>
  );
}

ProductWidgetHeader.propTypes = {
  sx: PropTypes.object,
  name: PropTypes.object,
  prices: PropTypes.object,
};
