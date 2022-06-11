import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const PageLoading = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress size="50px" />
    </Box>
  );
};
