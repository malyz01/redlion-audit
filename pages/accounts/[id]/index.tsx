import { useRouter } from 'next/router';
import { isEmpty, omit } from 'lodash';
import useSWR from 'swr';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import styled from '@emotion/styled';
import Typography from '@mui/material/Typography';
import ArrowLeft from '@mui/icons-material/ArrowLeft';

import { PageLoading, DataHorizontal } from '../../../components/1-common';
import { fetcher } from '../../../src/lib/axios';
import { accountUrl } from '../../../src/http/account';

const { id } = accountUrl;

const StyledMain = styled.main`
  padding: 2rem;
  width: 100%;
`;

const StyledTable = styled.section`
  height: 550px;
`;

const AccountIdPage = () => {
  const { query, replace } = useRouter();
  const { data: response, error } = useSWR(isEmpty(query) ? null : id(query.id as string), fetcher());

  if (!response) return <PageLoading />;

  return (
    <StyledMain>
      <Stack direction="row" alignItems="center" gap={5} mb="1rem">
        <IconButton color="secondary" size="small" onClick={() => replace('/accounts')}>
          <ArrowLeft color="secondary" fontSize="large" />
        </IconButton>
        <Typography variant="h5">{response.data.name}</Typography>
      </Stack>
      <Stack marginBottom="2rem">
        <Stack>
          <DataHorizontal heading="address" value={response.data.address} />
          <DataHorizontal heading="country" value={response.data.country} />
          <DataHorizontal heading="created date" value={response.data.createdAt} />
          <DataHorizontal heading="last modified" value={response.data.updatedAt} />
          <DataHorizontal heading="creator" value={response.data.createdBy} />
        </Stack>
      </Stack>
      <Stack marginBottom="1rem" direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Moderators</Typography>
        <Button variant="contained" sx={{ minWidth: '150px' }}>
          Create
        </Button>
      </Stack>
      <StyledTable>
        <DataGrid
          pageSize={10}
          rows={response.data.moderators}
          hideFooter={true}
          columns={[
            {
              headerName: 'Name',
              field: 'fullname',
              minWidth: 150,
              valueGetter: (params) => params.row.fullname,
            },
            {
              headerName: 'Email',
              field: 'email',
              minWidth: 250,
              valueGetter: (params) => params.row.email,
            },
            {
              headerName: 'Status',
              field: 'userStatus',
              minWidth: 150,
            },
            {
              headerName: 'Access',
              field: 'accessType',
              minWidth: 150,
            },
          ]}
        />
      </StyledTable>
    </StyledMain>
  );
};

export default AccountIdPage;

// for the table, moderators will have a dropdown where it can change the moderator type of the moderator.
