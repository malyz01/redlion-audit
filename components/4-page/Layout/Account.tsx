import { useState, MouseEvent } from 'react';
import useSWR from 'swr';
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

import useUser from '../../../src/hooks/useUser';
import { fetcher } from '../../../src/lib/axios';
import { AccessTypeEnum } from '../../../typings/enum';

type Accounts = {
  id: number;
  name: string;
  accessType: AccessTypeEnum;
};

type PropsAccountList = {
  accountList: Accounts[];
  type: AccessTypeEnum[];
  selectedId: number;
  handleMenuItemClick: (val: string | number) => void;
};

const AccountList = ({ accountList, type, selectedId, handleMenuItemClick }: PropsAccountList) => {
  const list = accountList.filter((account) => type.includes(account.accessType));
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
      {list.map((o, idx) => (
        <MenuItem key={idx} selected={o.id === selectedId} onClick={() => handleMenuItemClick(o.id)}>
          {o.name}
        </MenuItem>
      ))}
    </>
  );
};

export const Account = () => {
  const { data: accounts } = useSWR<Accounts[]>('/accounts', fetcher());
  const { user } = useUser();
  const { pathname, push } = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number>(user?.defaultAccount?.id || 0);
  const open = Boolean(anchorEl);

  const displaySetAsDefault = (id?: number) => {
    if (!!user?.defaultAccount || !id || user?.defaultAccount?.id === id) return 'none';
    return 'inline-flex';
  };

  const handleClickListItem = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (id: number | string) => {
    if (id === 'create') push('/accounts/create');
    if (id !== selectedId && typeof id === 'number') setSelectedId(id);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!accounts) return null;

  return (
    <div>
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
            secondary={accounts.find((o) => o.id === selectedId)?.name}
            primaryTypographyProps={{ sx: { fontSize: '11px', fontWeight: 800 } }}
          />
        </ListItem>
        <Button
          size="small"
          fullWidth
          sx={{ fontSize: '10px', fontWeight: 800, display: displaySetAsDefault(selectedId) }}
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
          onClick={() => handleMenuItemClick('create')}
          sx={{ fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'flex-end', gap: '5px' }}
        >
          <AddCircleIcon fontSize="small" />
          CREATE NEW ACCOUNT
        </MenuItem>

        <AccountList
          accountList={accounts}
          type={[AccessTypeEnum.owner]}
          selectedId={selectedId}
          handleMenuItemClick={handleMenuItemClick}
        />

        <AccountList
          accountList={accounts}
          type={[AccessTypeEnum.admin, AccessTypeEnum.manager]}
          selectedId={selectedId}
          handleMenuItemClick={handleMenuItemClick}
        />
      </Menu>
    </div>
  );
};
