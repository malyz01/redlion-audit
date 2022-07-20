import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const PageLoading = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '90vh',
        width: '80vw',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        gap: '10px',
        fontWeight: 700,
      }}
    >
      Loading <CircularProgress size="25px" />
    </Box>
  );
};
