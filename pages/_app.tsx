import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ThemeProvider } from '@mui/material/styles';
import styled from '@emotion/styled';

import { theme } from '../src/lib/mui';
import { DEVICE_DOWN } from '../src/constant/breakpoints';
import { NavProvider } from '../src/context/Nav.context';
import Nav from '../components/4-page/Layout/Nav';
import '../styles/globals.css';

const StyledContainer = styled.main`
  display: flex;

  @media ${DEVICE_DOWN[768]} {
    display: block;
  }
`;

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  return (
    <ThemeProvider theme={theme}>
      <StyledContainer>
        {pathname === '/auth/login' ? (
          <Component {...pageProps} />
        ) : (
          <NavProvider>
            <Nav />
            <Component {...pageProps} />
          </NavProvider>
        )}
      </StyledContainer>
    </ThemeProvider>
  );
}

export default MyApp;
