import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const PageLoading = () => {
  return (
    <Box sx={{ display: 'flex', height: '95vh', width: '95vw', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
      <CircularProgress size="50px" />
    </Box>
  );
};
