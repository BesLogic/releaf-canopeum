import 'bootstrap/js/index.umd.js'
import './App.scss'

import { ThemeProvider } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'

import AuthenticationContextProvider from './components/context/AuthenticationContext'
import MainLayout from './components/MainLayout'
import muiCustomTheme from '@assets/styles/muiCustomTheme'
import LanguageContextProvider from '@components/context/LanguageContext'
import SnackbarContextProvider from '@components/context/SnackbarContext'

console.info({ VITE_BUILD_DATE })
// const { VITE_BUILD_DATE, BUILD_DATE } = import.meta.env
console.info({ VITE_BUILD_DATE })
const App = () => (
  <ThemeProvider theme={muiCustomTheme}>
    <LanguageContextProvider>
      <AuthenticationContextProvider>
        <SnackbarContextProvider>
          <BrowserRouter>
            <MainLayout />
          </BrowserRouter>
        </SnackbarContextProvider>
      </AuthenticationContextProvider>
    </LanguageContextProvider>
  </ThemeProvider>
)

export default App
