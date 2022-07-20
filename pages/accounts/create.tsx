import { SyntheticEvent } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { ErrorToast } from '../../components/2-compound';
import { CreateAccountType } from '../../src/http/account';
import { useAlert } from '../../src/hooks/useAlert';
import { ACCOUNT_CREATE_TYPE, useNavContext } from '../../src/context/Nav.context';

const schema = z.object({
  name: z.string().min(4, 'name must have a minimum of 4 letters').max(30, 'name must have a maximum of 30 letters'),
  address: z.string().min(6, 'Address has a minimum of 6 characters'),
  country: z.string().min(3, 'Country has a minimum of 6 characters'),
});

export const CreateAccountPage = () => {
  const { actions: accountActions } = useNavContext();
  const { alertProps, actions } = useAlert();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAccountType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    const btnName = (event.nativeEvent as any).submitter?.innerText;

    handleSubmit((val: CreateAccountType) => {
      try {
        accountActions?.createAccount(val, btnName as ACCOUNT_CREATE_TYPE);
      } catch (error) {
        actions.setOpen(true, (error as Error).message);
      }
    })(event);
  };

  return (
    <Stack direction="row" justifyContent="center" flexGrow="1" p="8rem 0">
      <main>
        <ErrorToast {...alertProps} />
        <Typography variant="h5" sx={{ marginBottom: '.8rem' }}>
          CREATE ACCOUNT
        </Typography>
        <form onSubmit={onSubmit}>
          <TextField
            error={errors?.name ? true : false}
            label="Name"
            variant="outlined"
            fullWidth
            helperText={errors?.name?.message || ''}
            {...register('name')}
          />

          <TextField
            error={errors?.name ? true : false}
            label="Address"
            variant="outlined"
            fullWidth
            helperText={errors?.address?.message || ''}
            {...register('address')}
          />

          <TextField
            error={errors?.name ? true : false}
            label="Country"
            variant="outlined"
            fullWidth
            helperText={errors?.country?.message || ''}
            {...register('country')}
          />

          <Stack direction="column" gap="10px" mt="1.5rem">
            <Button variant="contained" size="medium" fullWidth type="button" onClick={() => reset()}>
              Reset
            </Button>

            <Stack direction="row" gap="10px">
              <Button variant="contained" size="medium" fullWidth type="submit">
                {ACCOUNT_CREATE_TYPE.createAsDefault}
              </Button>
              <Button variant="contained" size="medium" fullWidth type="submit">
                {ACCOUNT_CREATE_TYPE.create}
              </Button>
            </Stack>
          </Stack>
        </form>
      </main>
    </Stack>
  );
};

export default CreateAccountPage;
