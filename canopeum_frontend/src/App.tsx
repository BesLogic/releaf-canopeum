import './App.scss'
import 'bootstrap/js/index.umd.js'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Navbar from './components/Navbar'
import Analytics from './pages/Analytics'
import Home from './pages/Home'
import Login from './pages/Login'
import Map from './pages/Map'
import Settings from './pages/Settings'
import Utilities from './pages/Utilities'

const App = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route element={<Home />} path='/home' />
      <Route element={<Home />} path='/' />
      <Route element={<Analytics />} path='/analytics' />
      <Route element={<Map />} path='/map' />
      <Route element={<Settings />} path='/settings' />
      <Route element={<Login />} path='/login' />
      <Route element={<Utilities />} path='/utilities' />
    </Routes>
  </BrowserRouter>
)
export default App
