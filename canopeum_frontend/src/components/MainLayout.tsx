import { Navigate, redirect, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

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
        <Route element={isAuthenticated ? <Home /> : <Navigate to='/login' />} path={'/home'} />
        <Route element={isAuthenticated ? <Home /> : <Navigate to='/login' />} path='/' />
        <Route element={isAuthenticated ? <Analytics /> : <Navigate to='/login' />} path='/analytics' />
        <Route element={isAuthenticated ? <AnalyticsSite /> : <Navigate to='/login' />} path='/analytics/:siteId' />
        <Route element={isAuthenticated ? <UserManagement /> : <Navigate to='/login' />} path='/user-management' />
        <Route element={isAuthenticated ? <Utilities /> : <Navigate to='/login' />} path='/utilities' />

        <Route element={<Login />} path='/login' />
        <Route element={<Map />} path='/map' />
        <Route element={<MapSite />} path='/map/:siteId' />
      </Routes>
    </>
  )
}

export default MainLayout
