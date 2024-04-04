import { redirect, Route, Routes, useLocation } from 'react-router-dom'

import Analytics from '../pages/Analytics'
import AnalyticsSite from '../pages/AnalyticsSite'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Map from '../pages/Map'
import MapSite from '../pages/MapSite'
import UserManagement from '../pages/UserManagement'
import Utilities from '../pages/Utilities'
import Navbar from './Navbar'
import { useContext } from 'react'
import { AuthenticationContext } from './context/AuthenticationContext'

const MainLayout = () => {
  const location = useLocation()
  const { isAuthenticated } = useContext(AuthenticationContext)

  return (
    <>
      {location.pathname !== '/login' && <Navbar />}
      <Routes>
        <Route element={<Home />} path='/home' loader={() => isAuthenticated ? null : redirect('/login')} />
        <Route element={<Home />} path='/' loader={() => isAuthenticated ? null : redirect('/login')} />
        <Route element={<Analytics />} path='/analytics' loader={() => isAuthenticated ? null : redirect('/login')} />
        <Route
          element={<AnalyticsSite />}
          path='/analytics/:siteId'
          loader={() => isAuthenticated ? null : redirect('/login')}
        />
        <Route
          element={<UserManagement />}
          path='/user-management'
          loader={() => isAuthenticated ? null : redirect('/login')}
        />
        <Route element={<Utilities />} path='/utilities' loader={() => isAuthenticated ? null : redirect('/login')} />

        <Route element={<Login />} path='/login' />
        <Route element={<Map />} path='/map' />
        <Route element={<MapSite />} path='/map/:siteId' />
      </Routes>
    </>
  )
}

export default MainLayout
