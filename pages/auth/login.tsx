import { useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styled from '@emotion/styled';

import { authApi, SigninType } from '../../src/api/auth';
import { ErrorToast } from '../../components/2-compound';
import { useRouter } from 'next/router';
import useUser from '../../src/hooks/useUser';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password has a minimum 6 characters'),
});

const StyledMain = styled.main`
  background-color: black;
  height: 100vh;
  width: 100vw;
  padding: 8rem 0;
`;

const StyledFormContainer = styled.div`
  background-color: white;
  max-width: 400px;
  padding: calc(8px * 5) calc(8px * 3);
  margin: auto;
  border-radius: 5px;
`;

const StyledHeader = styled.header`
  text-align: center;
`;

const StyledTitle = styled.div`
  font-size: 22px;
  margin: 1rem 0;
`;

const Login: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninType>({
    resolver: zodResolver(schema),
  });
  const [showPass, setShowPass] = useState(false);
  const [open, setOpen] = useState(false);
  const { mutateUser } = useUser({
    redirectTo: '/',
    redirectIfFound: true,
  });
  const { replace } = useRouter();

  const onSubmit = async (val: SigninType) => {
    try {
      const { accessToken, ...data } = await authApi.login(val);
      window.localStorage.setItem('accessToken', accessToken as string);
      mutateUser(data);
      replace('/');
    } catch (error) {
      setOpen(true);
      window.localStorage.removeItem('accessToken');
    }
  };

  return (
    <StyledMain>
      <ErrorToast open={open} setOpen={setOpen} message="Invalid email or password" />
      <StyledFormContainer>
        <StyledHeader>
          <Image alt="logo" src="/assets/images/RedLion.svg" layout="intrinsic" width={80} height={80} />
          <StyledTitle>Welcome</StyledTitle>
        </StyledHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            error={errors?.email ? true : false}
            label="Email address"
            variant="outlined"
            fullWidth
            helperText={errors?.email?.message || ''}
            {...register('email')}
          />
          <TextField
            error={errors?.password ? true : false}
            label="Password"
            variant="outlined"
            type={showPass ? 'text' : 'password'}
            fullWidth
            helperText={errors?.password?.message || ''}
            sx={{ mb: '1rem' }}
            {...register('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" size="large" fullWidth type="submit">
            Continue
          </Button>
        </form>
      </StyledFormContainer>
    </StyledMain>
  );
};

export default Login;
