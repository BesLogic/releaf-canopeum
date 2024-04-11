import { useContext } from 'react'
import { redirect, Route, Routes, useLocation } from 'react-router-dom'

import Analytics from '../pages/Analytics'
import AnalyticsSite from '../pages/AnalyticsSite'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Map from '../pages/Map'
import SiteSocialPage from '../pages/SiteSocialPage'
import UserManagement from '../pages/UserManagement'
import Utilities from '../pages/Utilities'
import { AuthenticationContext } from './context/AuthenticationContext'
import Navbar from './Navbar'

const MainLayout = () => {
  const location = useLocation()
  const { isAuthenticated } = useContext(AuthenticationContext)

  return (
    <>
      {location.pathname !== '/login' && <Navbar />}
      <Routes>
        <Route element={<Home />} loader={() => isAuthenticated
          ? null
          : redirect('/login')} path='/home' />
        <Route element={<Home />} loader={() => isAuthenticated
          ? null
          : redirect('/login')} path='/' />
        <Route element={<Analytics />} loader={() => isAuthenticated
          ? null
          : redirect('/login')} path='/analytics' />
        <Route
          element={<AnalyticsSite />}
          loader={() => isAuthenticated
            ? null
            : redirect('/login')}
          path='/analytics/:siteId'
        />
        <Route
          element={<UserManagement />}
          loader={() => isAuthenticated
            ? null
            : redirect('/login')}
          path='/user-management'
        />
        <Route element={<Utilities />} loader={() => isAuthenticated
          ? null
          : redirect('/login')} path='/utilities' />

        <Route element={<Login />} path='/login' />
        <Route element={<Map />} path='/map' />
        <Route element={<SiteSocialPage />} path='/map/:siteId' />
      </Routes>
    </>
  )
}

export default MainLayout
