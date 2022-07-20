import { isEmpty } from 'lodash';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { parseDateToLocal } from '../../../src/util/date';

type Props<ObjectType> = {
  data: ObjectType;
  order: [keyof ObjectType & string, string][];
};

export const MobileCard = <ObjectType,>({ data, order }: Props<ObjectType>) => {
  return (
    <Paper elevation={2} sx={{ p: '1rem 1rem .5rem' }}>
      {order.map((name, idx) => (
        <Stack key={idx} direction="column" mb=".5rem">
          <Typography variant="caption" fontSize="10px" fontWeight={600} textTransform="uppercase">
            {isEmpty(name[1]) ? name[0] : name[1]}
          </Typography>
          <Typography>{parseDateToLocal(data[name[0]] as unknown as string)}</Typography>
        </Stack>
      ))}
    </Paper>
  );
};
