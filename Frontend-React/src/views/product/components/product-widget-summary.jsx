import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fShortenNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function ProductWidgetSummary({ title, total, icon, backgroundColor = '#FFFFFF', sx, ...other }) {
  return (
    <Card
      component={Stack}
      spacing={0}
      direction="row"
      sx={{
        backgroundColor: backgroundColor,
        px: 3,
        py: 5,
        borderRadius: 2,
        ...sx,
      }}
      {...other}
    >
      {icon && <Box sx={{ width: 64, height: 64 }}>{icon}</Box>}

      <Stack spacing={0.5}>
        <Typography variant="h4">{total}</Typography>

        <Typography variant="subtitle2" sx={{ color: "#000000" }}>
          {title}
        </Typography>
      </Stack>
    </Card>
  );
}

ProductWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
};
