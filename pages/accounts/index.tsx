import { useRouter } from 'next/router';
import Link from 'next/link';
import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styled from '@emotion/styled';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { PageTableLoading } from '../../components/1-common';
import { ErrorToast } from '../../components/2-compound';
import { AccountPageProvider, useAccountContext } from '../../src/context/Account.context';
import { useAlert } from '../../src/hooks/useAlert';
import { parseDateToLocal } from '../../src/util/date';
import { userSettingApi } from '../../src/http/userSetting';
import { useNavContext } from '../../src/context/Nav.context';

const StyledMain = styled.main`
  height: 100vh;
  width: 100%;
  padding: 2rem;
`;

const StyledTable = styled.section`
  height: 90%;
`;

const Accounts = () => {
  const { push } = useRouter();
  const { data, actions: pageAccountActions } = useAccountContext();
  const { actions: accountActions } = useNavContext();
  const { alertProps, actions: alertActions } = useAlert();

  if (!data) return <PageTableLoading />;

  return (
    <StyledMain>
      <ErrorToast {...alertProps} />
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" py="1.2rem">
        <Typography variant="h5">Accounts</Typography>
        <Button variant="contained" sx={{ minWidth: '150px' }} onClick={() => push('/accounts/create')}>
          Create
        </Button>
      </Stack>
      <StyledTable>
        <DataGrid
          rows={data}
          columns={[
            {
              field: 'sequence',
              headerName: 'View',
              minWidth: 100,
              sortable: true,
              headerAlign: 'center',
              align: 'center',
              renderCell(params) {
                return params.row?.sequence ? (
                  <div>{params.row?.sequence}</div>
                ) : (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        await userSettingApi.updatedSwitchableAccounts(params.row.id);
                        pageAccountActions.mutatePageAccount();
                        accountActions.mutateSwitchableAccount();
                      } catch (error) {
                        alertActions.setOpen(true, (error as Error).message);
                      }
                    }}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                );
              },
            },
            {
              field: 'name',
              headerName: 'Name',
              minWidth: 200,
              sortable: true,
              renderCell(params) {
                return (
                  <Link href={`/accounts/${params.row.id}`}>
                    <a onClick={(e) => e.stopPropagation()}>{params.row.name}</a>
                  </Link>
                );
              },
            },
            { field: 'address', headerName: 'Address', minWidth: 350 },
            { field: 'country', minWidth: 150, headerName: 'Country', headerAlign: 'center', align: 'center' },
            { field: 'accessType', minWidth: 150, headerName: 'Access type', headerAlign: 'center', align: 'center' },
            {
              field: 'createdAt',
              headerName: 'Created date',
              minWidth: 150,
              headerAlign: 'center',
              align: 'center',
              valueGetter(params) {
                return parseDateToLocal(params.row.createdAt);
              },
            },
            {
              field: 'updatedAt',
              headerName: 'Last Modified',
              minWidth: 150,
              headerAlign: 'center',
              align: 'center',
              valueGetter(params) {
                return parseDateToLocal(params.row.updatedAt);
              },
            },
          ]}
          pageSize={20}
          rowsPerPageOptions={[20]}
          onCellDoubleClick={(param, event, details) => console.log(param, event, details)}
        />
      </StyledTable>
    </StyledMain>
  );
};

export default AccountPageProvider(Accounts);
