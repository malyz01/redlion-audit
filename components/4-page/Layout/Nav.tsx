import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import Slide from '@mui/material/Slide';
import Paper from '@mui/material/Paper';

import { hasNoNav } from './utils';
import { DEVICE_DOWN } from '../../../src/constant/breakpoints';
import { Logo } from './Logo';
import { Account } from './Account';
import { UserSection } from './User';
import useUser from '../../../src/hooks/useUser';

enum LinkItem {
  dashboard = 'Dashboard',
  account = 'Accounts',
  expenses = 'Expenses',
  escrows = 'Escrows',
  loans = 'Loans',
}

const isSelected = (currentPath: string, linkname: LinkItem) => {
  const link = linkname === LinkItem.dashboard ? '' : linkname.toLowerCase();
  const [, path] = currentPath.split('/');
  return path === link;
};

const StyledNavMenuContainer = styled.section`
  transition: all 0.3s ease;
  min-width: 320px;
  height: 100vh;
  background-color: var(--primary-extra-light);

  @media ${DEVICE_DOWN[768]} {
    display: none;
  }
`;

const StyledNavMenuMobileContainer = styled.section`
  display: none;

  @media ${DEVICE_DOWN[768]} {
    display: block;
  }
`;

const StyledNavItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 2rem 0 5rem;
`;

const StyledItem = styled.div`
  margin: 0.8rem 2rem;
`;

const StyledLinkItem = styled.div<{ selected?: boolean }>`
  transition: all 0.2s ease;
  cursor: pointer;

  ${({ selected }) =>
    selected &&
    `
    font-weight: 900;
  `}
`;

const NavItems = () => {
  const { push, pathname } = useRouter();

  const onLinkClick = (redirectTo: LinkItem) => () => {
    let redirect = redirectTo === LinkItem.dashboard ? '/' : `/${redirectTo.toLowerCase()}`;
    if (pathname === redirect) return;
    push(redirect);
  };

  return (
    <StyledNavItemsContainer>
      <StyledItem>
        <Logo />
      </StyledItem>
      <StyledItem>
        <Account />
      </StyledItem>
      <StyledItem>
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <DashboardIcon color={isSelected(pathname, LinkItem.dashboard) ? 'secondary' : 'disabled'} />
          <StyledLinkItem onClick={onLinkClick(LinkItem.dashboard)} selected={isSelected(pathname, LinkItem.dashboard)}>
            {LinkItem.dashboard}
          </StyledLinkItem>
        </Stack>
      </StyledItem>
      <StyledItem>
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <AccountBalanceWalletIcon color={isSelected(pathname, LinkItem.account) ? 'secondary' : 'disabled'} />
          <StyledLinkItem onClick={onLinkClick(LinkItem.account)} selected={isSelected(pathname, LinkItem.account)}>
            {LinkItem.account}
          </StyledLinkItem>
        </Stack>
      </StyledItem>
      <StyledItem>
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <CurrencyExchangeIcon color={isSelected(pathname, LinkItem.expenses) ? 'secondary' : 'disabled'} />
          <StyledLinkItem onClick={onLinkClick(LinkItem.expenses)} selected={isSelected(pathname, LinkItem.expenses)}>
            {LinkItem.expenses}
          </StyledLinkItem>
        </Stack>
      </StyledItem>
      <StyledItem>
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <PriceCheckIcon color={isSelected(pathname, LinkItem.escrows) ? 'secondary' : 'disabled'} />
          <StyledLinkItem onClick={onLinkClick(LinkItem.escrows)} selected={isSelected(pathname, LinkItem.escrows)}>
            {LinkItem.escrows}
          </StyledLinkItem>
        </Stack>
      </StyledItem>
      <StyledItem>
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <CreditScoreIcon color={isSelected(pathname, LinkItem.loans) ? 'secondary' : 'disabled'} />
          <StyledLinkItem onClick={onLinkClick(LinkItem.loans)} selected={isSelected(pathname, LinkItem.loans)}>
            {LinkItem.loans}
          </StyledLinkItem>
        </Stack>
      </StyledItem>

      <UserSection />
    </StyledNavItemsContainer>
  );
};

const Nav = () => {
  const { pathname } = useRouter();
  const { isLoggedIn } = useUser({ redirectTo: '/auth/login' });
  const hideNav = !isLoggedIn || hasNoNav(pathname);

  return (
    <Slide in={!hideNav} direction="right">
      <Paper>
        <StyledNavMenuContainer>
          <NavItems />
        </StyledNavMenuContainer>
        <StyledNavMenuMobileContainer>
          <Button variant="contained">Test</Button>
        </StyledNavMenuMobileContainer>
      </Paper>
    </Slide>
  );
};

export default Nav;
