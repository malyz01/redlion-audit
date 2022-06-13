import { createTheme } from '@mui/material/styles';
import { red, grey } from '@mui/material/colors';

export const theme = createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        color: 'secondary',
        sx: {
          borderRadius: 0,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiInputLabel: {
      defaultProps: {
        color: 'secondary',
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        color: 'secondary',
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': { backgroundColor: grey[300], color: 'black' },
          '&.Mui-selected:hover': { backgroundColor: grey[300], color: 'black' },
        },
      },
    },
  },

  palette: {
    primary: {
      dark: red[900],
      main: red[500],
      light: red[300],
    },
    secondary: {
      dark: grey[800],
      main: grey[900],
      light: grey[300],
      contrastText: grey[100],
    },
  },
});
