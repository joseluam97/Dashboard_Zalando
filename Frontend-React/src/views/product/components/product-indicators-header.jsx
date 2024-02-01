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

import { setSizeSelectedAPIAction } from '../../../redux/product/actions';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

import Alert from '../../../components/container/Alert';
import Scrollbar from '../../../components/custom-scroll/Scrollbar';

// ----------------------------------------------------------------------

export default function ProductIndicatorsHeader({ product, prices, sx, ...other }) {
  const dispatch = useDispatch();

  const [listAlerts, setListAlerts] = useState([]);

  /*const [tallaSelected, setTallaSelected] = useState();

  const tallaSelect = useSelector((state) => state.productsComponent.tallaSelect);

  const setSizeSelectedAPI = (talla) => dispatch(setSizeSelectedAPIAction(talla));

  const listSizesProductsZalando = useSelector(
    (state) => state.productsComponent.listSizesProductsZalando,
  );

  useEffect(() => {
    console.log('hola');
  }, []);*/

  useEffect(() => {
    let arrayAlerts = [];

    if (prices?.vectorPrecios?.length > 0) {
      //DIFERENCIA DE FECHA SUPERIOR A 2 DIAS -> NO DISPONIBLE
      let diferenciaEnDias = alertProductIsAvailable(prices.vectorPrecios[0].fecha);

      //SI EL PRODUCTO ESTA DISPONIBLE -> GESTIONAR OTRAS ALERTAS
      if (diferenciaEnDias > 1) {
        arrayAlerts.push({
          title: 'La talla de este producto no esta disponible.',
          description: 'No se registran datos desde hace ' + diferenciaEnDias + ' dias. ',
          type: 'error',
        });
      } else {
        arrayAlerts.push({
          title: 'La talla de este producto esta disponible.',
          description: 'Se ha registrado datos hoy. ',
          type: 'info',
        });

        //ALERTA DE BUENA OPORTUNIDAD DE COMPRA
        arrayAlerts = alertOportunityShop(arrayAlerts, prices.porcentajeCambio);

        //ALERTA DE CUANTOS DIAS ATRAS LLEVA CON EL MISMO PRECIO
        arrayAlerts = alertDaysWithEqualsPrice(arrayAlerts, prices.vectorPrecios);

        //ALERTA DE TENDENCIA DEL PRODUCTO
        //TENDENCIA DEL PRECIO
        arrayAlerts = alertTendencyToDecreaseOrIncrease(arrayAlerts, prices.vectorPrecios);
      }
    }

    setListAlerts(arrayAlerts);
  }, [prices]);

  const alertTendencyToDecreaseOrIncrease = (arrayAlerts, listPrices) => {
    let MIN_PRICES_CHANGES_TO_DISPLAY_ALERT = 2;
    let MIN_DAYS_TO_DISPLAY_ALERT = 10;
    let DAYS_ANALYZED = 30;
    let listPricesLastMonth;
    let stringHaveMoreOneMonth = listPrices.length + ' dias.';

    if (listPrices.length > DAYS_ANALYZED) {
      listPricesLastMonth = listPrices.slice(0, DAYS_ANALYZED);
      stringHaveMoreOneMonth = ' el ultimo mes.';
    } else {
      listPricesLastMonth = listPrices;
    }

    const resultDecrease = listPricesLastMonth.reduce(
      (acumulador, precio, index, array) => {
        if (index > 0 && precio.precio >= array[index - 1].precio) {
          acumulador.cumpleRequisito = true;
          if (precio.precio != array[index - 1].precio) {
            acumulador.cambiosDePrecio += 1;
          }
        } else {
          acumulador.cumpleRequisito = false;
        }

        return acumulador;
      },
      { cumpleRequisito: true, cambiosDePrecio: 0 },
    );

    const resultIncrease = listPricesLastMonth.reduce(
      (acumulador, precio, index, array) => {
        if (index > 0 && precio.precio <= array[index - 1].precio) {
          acumulador.cumpleRequisito = true;
          if (precio.precio != array[index - 1].precio) {
            acumulador.cambiosDePrecio += 1;
          }
        } else {
          acumulador.cumpleRequisito = false;
        }

        return acumulador;
      },
      { cumpleRequisito: true, cambiosDePrecio: 0 },
    );

    if (
      resultDecrease.cumpleRequisito == true &&
      resultDecrease.cambiosDePrecio >= MIN_PRICES_CHANGES_TO_DISPLAY_ALERT &&
      listPrices.length >= MIN_DAYS_TO_DISPLAY_ALERT
    ) {
      arrayAlerts.push({
        title: 'El producto esta en una tendencia de bajada de precio.',
        description:
          'El producto ha registrado un total de ' +
          resultDecrease.cambiosDePrecio +
          ' reducciones de precio en ' +
          stringHaveMoreOneMonth,
        type: 'success',
      });
    } else if (
      resultIncrease.cumpleRequisito == true &&
      resultIncrease.cambiosDePrecio >= MIN_PRICES_CHANGES_TO_DISPLAY_ALERT &&
      listPrices.length >= MIN_DAYS_TO_DISPLAY_ALERT
    ) {
      arrayAlerts.push({
        title: 'El producto esta en una tendencia de subida de precio.',
        description:
          'El producto ha registrado un total de ' +
          resultIncrease.cambiosDePrecio +
          ' aumentos de precio en ' +
          stringHaveMoreOneMonth,
        type: 'warning',
      });
    } else if (resultDecrease.cambiosDePrecio >= MIN_PRICES_CHANGES_TO_DISPLAY_ALERT) {
      arrayAlerts.push({
        title: 'El producto tiene una tendencia de precios irregular.',
        description:
          'El producto ha registrado un total de ' +
          resultDecrease.cambiosDePrecio +
          ' cambios de precio en ' +
          stringHaveMoreOneMonth,
        type: 'info',
      });
    }

    return arrayAlerts;
  };

  const alertDaysWithEqualsPrice = (arrayAlerts, listPrices) => {
    let DAYS_WITH_SAME_PRICES_TO_NOTIFY = 10;

    const resultado = listPrices.reduce(
      (acumulador, precio, index, array) => {
        if (index > 0) {
          if (precio.precio == array[0].precio) {
            acumulador.repeticiones += 1;
          } else {
            // Si se encuentra un precio diferente, se detiene la búsqueda
            acumulador.ultimoPrecioDiferente = array[0].precio;
          }
        }

        return acumulador;
      },
      { repeticiones: 1, ultimoPrecioDiferente: null },
    );

    if (resultado.repeticiones >= DAYS_WITH_SAME_PRICES_TO_NOTIFY) {
      arrayAlerts.push({
        title: 'El producto ha registrado el mismo precio durante varios dias consecutivos.',
        description: 'El precio esta estable desde hace ' + resultado.repeticiones + ' dias.',
        type: 'warning',
      });
    }

    return arrayAlerts;
  };

  const alertProductIsAvailable = (dateLastRegister) => {
    let fechaUltimoPrecio = new Date(dateLastRegister);
    let fechaHoy = new Date();

    // Calcula la diferencia en milisegundos
    const diferenciaEnMilisegundos = fechaHoy - fechaUltimoPrecio;

    // Convierte la diferencia a días
    const diferenciaEnDias = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));

    return diferenciaEnDias;
  };

  const alertOportunityShop = (arrayAlerts, porcentajeOferta) => {
    if (porcentajeOferta > 0) {
      arrayAlerts.push({
        title: 'El producto tiene un precio superior al precio medio.',
        description:
          'El producto tiene el precio un ' +
          fPercent(porcentajeOferta) +
          ' superior al precio habitual.',
        type: 'error',
      });
    } else if (porcentajeOferta == 0) {
      arrayAlerts.push({
        title: 'El producto tiene el precio habitual.',
        description: '',
        type: 'warning',
      });
    } else if (porcentajeOferta < 0 && porcentajeOferta > -10) {
      arrayAlerts.push({
        title: 'El producto tiene un precio inferior al precio medio.',
        description: 'El descuento es de un ' + fPercent(porcentajeOferta) + '.',
        type: 'info',
      });
    } else if (porcentajeOferta <= -10) {
      arrayAlerts.push({
        title: 'El producto esta en oferta.',
        description: 'El descuento es de un ' + fPercent(porcentajeOferta) + '.',
        type: 'success',
      });
    }

    return arrayAlerts;
  };

  return (
    <Card sx={{ maxHeight: '300px', overflowY: 'auto' }}>
      <Stack spacing={0}>
        {listAlerts?.map((alerta, index) => (
          <Alert
            key={index}
            title={alerta.title}
            description={alerta.description}
            type={alerta.type}
          />
        ))}
      </Stack>
    </Card>
  );
}

ProductIndicatorsHeader.propTypes = {
  sx: PropTypes.object,
  name: PropTypes.object,
  prices: PropTypes.object,
};
