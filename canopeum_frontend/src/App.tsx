import 'bootstrap/js/index.umd.js'
import './App.scss'

import LanguageContextProvider from '@components/context/LanguageContext'
import { BrowserRouter } from 'react-router-dom'

import AuthenticationContextProvider from './components/context/AuthenticationContext'
import MainLayout from './components/MainLayout'

const App = () => (
  <LanguageContextProvider>
    <AuthenticationContextProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </AuthenticationContextProvider>
  </LanguageContextProvider>
)

export default App
