import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import {fCurrency} from 'src/utils/format-number';
import { fDateTime, fToNow, fTimestamp, fDate } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ProductNewsUpdate({ title, subheader, list, ...other }) {

  const NUM_PRECIOS_VISIBLES = 10
  const estadosBotonVerTodo = {
    VISIBLE: 'VISIBLE',
    VERMENOS: 'VERMENOS',
    NA: 'NA',
  }

  const [listPrices, setListPrices] = useState([]);
  const [estadoBoton, setEstadoBoton] = useState();

  useEffect(() => {

    if(list?.length != 0){
      if(list?.length > NUM_PRECIOS_VISIBLES){
        setListPrices(list.slice(0,NUM_PRECIOS_VISIBLES))
        setEstadoBoton(estadosBotonVerTodo.VISIBLE)
      }
      else{
        setListPrices(list)
        setEstadoBoton(estadosBotonVerTodo.NA)
      }
    }

  }, [list])

  const viewAll = () => {
    // setOpenFilter(false);
    if(estadoBoton == estadosBotonVerTodo.VISIBLE){
      setListPrices(list)
      setEstadoBoton(estadosBotonVerTodo.VERMENOS)
    }
    else{
      setListPrices(list.slice(0,NUM_PRECIOS_VISIBLES))
      setEstadoBoton(estadosBotonVerTodo.VISIBLE)
    }
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {listPrices?.map((news) => (
            <>
              <Stack direction="row" alignItems="center" spacing={2}>

                <Box sx={{ minWidth: 240, flexGrow: 1 }}>
                  <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
                    {fDateTime(news.fecha)}
                  </Link>

                  <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                    {fCurrency(news.precio)}
                  </Typography>
                </Box>

                <Typography
                  variant="caption"
                  sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}
                >
                  {fToNow(news.fecha)}
                </Typography>
              </Stack>
            </>
          ))}
        </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, textAlign: 'right', display: estadoBoton == estadosBotonVerTodo.NA ? 'none' : 'block'}}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
          onClick={e => viewAll()}
        >
          {estadoBoton == estadosBotonVerTodo.VISIBLE ? 'Ver todo' : 'Ver menos'}
        </Button>
      </Box>
    </Card>
  );
}

ProductNewsUpdate.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};
