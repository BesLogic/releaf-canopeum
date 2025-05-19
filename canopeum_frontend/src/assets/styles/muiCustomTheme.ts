import { createTheme } from '@mui/material'

import variables from './export.module.scss'

const muiCustomTheme = createTheme({
  palette: {
    text: { primary: 'var(--bs-body-color);' },
    success: {
      light: variables.success,
      main: variables.success,
      dark: variables.success,
      contrastText: variables.success,
    },
    primary: {
      light: variables.primary,
      main: variables.primary,
      dark: variables.primary,
      contrastText: variables.primary,
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
    action: {
      hover: variables.primaryFaded,
      focus: variables.primaryFaded,
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        root: {
          wordWrap: 'break-word', // Same as .card
        },
      },
    },
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
    MuiMenu: {
      styleOverrides: {
        paper: { borderRadius: variables.borderRadius },
      },
    },
  },
})

export default muiCustomTheme
