import { createTheme } from '@mui/material';

import variables from './theme-variables.module.scss'

const muiCustomTheme = createTheme({
  palette: {
    success: {
      light: variables.success,
      main: variables.success,
      dark: variables.success,
      contrastText: variables.success,
    },
  },
});


export default muiCustomTheme
