import 'bootstrap/js/index.umd.js'
import './App.scss'

import muiCustomTheme from '@assets/styles/muiCustomTheme'
import LanguageContextProvider from '@components/context/LanguageContext'
import { ThemeProvider } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'

import AuthenticationContextProvider from './components/context/AuthenticationContext'
import MainLayout from './components/MainLayout'

const App = () => (
  <ThemeProvider theme={muiCustomTheme}>
    <LanguageContextProvider>
      <AuthenticationContextProvider>
        <BrowserRouter>
          <MainLayout />
        </BrowserRouter>
      </AuthenticationContextProvider>
    </LanguageContextProvider>
  </ThemeProvider>
)

export default App
