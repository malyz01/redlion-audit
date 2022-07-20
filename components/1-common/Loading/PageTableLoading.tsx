import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export const PageTableLoading = () => {
  return (
    <Box
      sx={{
        height: '90vh',
        width: '80vw',
        padding: '4rem 2rem 0',
      }}
    >
      <Stack direction="row" justifyContent="space-between" mb="1rem">
        <Skeleton animation="wave" variant="rectangular" width="200px" height="35px" />
        <Skeleton animation="wave" variant="rectangular" width="200px" height="35px" />
      </Stack>
      <Skeleton animation="wave" variant="rectangular" width="100%" height={750} />
    </Box>
  );
};
