import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { parseDateToLocal } from '../../../src/util/date';

type Props = {
  heading: string;
  value: string;
};

export const DataHorizontal = ({ heading, value }: Props) => {
  return (
    <Stack direction="row" alignItems="center">
      <Typography variant="caption" fontSize="10px" textTransform="uppercase" sx={{ width: '120px' }}>
        {heading}
      </Typography>
      <Box>{parseDateToLocal(value)}</Box>
    </Stack>
  );
};
