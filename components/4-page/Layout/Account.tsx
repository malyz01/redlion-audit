import { useState, MouseEvent } from 'react';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';

import { AccessTypeEnum } from '../../../typings/enum';
import { useNavContext } from '../../../src/context/Nav.context';
import { DefaultAccountType } from '../../../pages/api/user';

type PropsAccountList = {
  type: AccessTypeEnum[];
  handleClose: () => void;
};

const AccountList = ({ type, handleClose }: PropsAccountList) => {
  const { accounts, selected, actions } = useNavContext();
  const list = accounts.filter((account) => type.includes(account.accessType));

  const handleMenuItemClick = (account: DefaultAccountType) => {
    actions?.setSelected!(account);
    handleClose();
  };

  if (isEmpty(list)) return null;

  return (
    <>
      <Divider />
      <Box
        sx={{
          fontSize: '12px',
          fontWeight: 800,
          textAlign: 'center',
          background: 'var(--secondary-dark)',
          color: 'white',
        }}
      >
        {type.includes(AccessTypeEnum.owner) ? 'OWNED' : 'MODERATED'}
      </Box>
      {list.map((account, idx) => (
        <MenuItem key={idx} selected={account.id === selected?.id} onClick={() => handleMenuItemClick(account)}>
          {account.name}
        </MenuItem>
      ))}
    </>
  );
};

export const Account = () => {
  const { isLoggedIn, selected, actions } = useNavContext();
  const { pathname, push } = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClickListItem = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCreateBtnClick = () => {
    push('/accounts/create');
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!isLoggedIn) return null;

  return (
    <main>
      <List
        component="nav"
        aria-label="Device settings"
        sx={{ bgcolor: 'background.paper', padding: 0, borderRadius: '5px' }}
      >
        <ListItem
          button
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label="when device is locked"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickListItem}
        >
          <ListItemText
            primary="ACCOUNT"
            secondary={selected?.name}
            primaryTypographyProps={{ sx: { fontSize: '11px', fontWeight: 800 } }}
          />
        </ListItem>
        <Button
          onClick={() => actions.setDefaultAccount(selected)}
          size="small"
          fullWidth
          sx={{
            fontSize: '10px',
            fontWeight: 800,
            display: !selected || selected?.isDefault ? 'none' : 'inline-flex',
          }}
        >
          Set as default
        </Button>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox',
        }}
      >
        <MenuItem
          disabled={pathname === '/accounts/create'}
          onClick={handleCreateBtnClick}
          sx={{ fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'flex-end', gap: '5px' }}
        >
          <AddCircleIcon fontSize="small" />
          CREATE NEW ACCOUNT
        </MenuItem>

        <AccountList type={[AccessTypeEnum.owner]} handleClose={handleClose} />

        <AccountList type={[AccessTypeEnum.admin, AccessTypeEnum.manager]} handleClose={handleClose} />
      </Menu>
    </main>
  );
};
