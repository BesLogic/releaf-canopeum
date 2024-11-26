import { createTheme } from '@mui/material'

import variables from './export.module.scss'

const muiCustomTheme = createTheme({
  palette: {
    success: {
      light: variables.success,
      main: variables.success,
      dark: variables.success,
      contrastText: variables.success,
    },
    secondary: {
      light: variables.secondary,
      main: variables.secondary,
      dark: variables.secondary,
      contrastText: variables.secondary,
    },
    background: {
      default: variables.cardBackground,
      paper: variables.cardBackground,
    },
  },
  components: {
    MuiDialogActions: {
      styleOverrides: {
        spacing: {
          justifyContent: 'space-around',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          textAlign: 'center',
        },
      },
    },
  },
})

export default muiCustomTheme
