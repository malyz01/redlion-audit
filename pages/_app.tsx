import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { ThemeProvider } from '@mui/material/styles';
import styled from '@emotion/styled';

import { theme } from '../config/materialui';
import { UserProvider } from '../context/user.context';
import { DEVICE_DOWN } from '../constant/breakpoints';
import '../styles/globals.css';

const StyledContainer = styled.main`
  display: flex;

  @media ${DEVICE_DOWN[768]} {
    display: block;
  }
`;

const DynamicNav = dynamic(() => import('../components/4-page/Layout/Nav'), { ssr: false });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <StyledContainer>
          <DynamicNav />
          <Component {...pageProps} />
        </StyledContainer>
      </UserProvider>
    </ThemeProvider>
  );
}

export default MyApp;
