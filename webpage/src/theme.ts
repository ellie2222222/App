import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#301E67',
    },
    secondary: {
      main: '#5B8FB9',
    },
    background: {
      default: 'rgb(18 18 18)',
      paper: '#B6EADA',
    },
    text: {
      primary: '#B6EADA',
      secondary: '#03001C',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;

/*
#03001C dark
#301E67 blueish purple
#5B8FB9 blueish pink
#B6EADA light cream
 */