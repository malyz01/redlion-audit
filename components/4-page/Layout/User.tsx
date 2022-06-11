import { useState } from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';

import useUser from '../../../src/hooks/useUser';
import { authApi } from '../../../src/api/auth';

const StyledUserContainer = styled.div`
  margin: 0.8rem 2rem;
  flex-grow: 1;
  display: flex;
  align-items: flex-end;
`;

export const UserSection = () => {
  const { user, isLoggedIn, mutateUser } = useUser({ redirectTo: '/auth/login' });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onLogout = async () => {
    mutateUser(await authApi.logout());
  };

  if (!isLoggedIn) return null;

  return (
    <StyledUserContainer>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ fontWeight: '800' }}>
        <Tooltip title="Account settings">
          <IconButton onClick={handleClick} size="small" sx={{ me: 1 }}>
            <Image src="/assets/images/Avatar.svg" width={30} height={30} alt="avatar" />
          </IconButton>
        </Tooltip>
        <div>{`${user?.firstName} ${user?.lastName}`}</div>
      </Stack>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              left: 30,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={onLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </StyledUserContainer>
  );
};
