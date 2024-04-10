import { useContext, useEffect } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import useLogin from '../hooks/LoginHook'
import Analytics from '../pages/Analytics'
import AnalyticsSite from '../pages/AnalyticsSite'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Map from '../pages/Map'
import MapSite from '../pages/MapSite'
import Register from '../pages/Register'
import UserManagement from '../pages/UserManagement'
import Utilities from '../pages/Utilities'
import { AuthenticationContext } from './context/AuthenticationContext'
import Navbar from './Navbar'

const NavbarLayout = () => (
  <div>
    <Navbar />
    <Outlet />
  </div>
)

const NotAuthenticatedRoutes = () => {
  const { isAuthenticated } = useContext(AuthenticationContext)

  return (
    isAuthenticated
      ? <Navigate to="/" />
      : <Outlet />
  )
}

const AuthenticatedRoutes = () => {
  const { isAuthenticated } = useContext(AuthenticationContext)

  return (
    isAuthenticated
      ? <Outlet />
      : <Navigate to="/login" />
  )
}

const MainLayout = () => {
  const { authenticateUser } = useLogin()

  // Try authenticating user on app start if token was saved in localStorage
  useEffect(() => authenticateUser(), [authenticateUser])

  return (
    <Routes>
      <Route element={<NotAuthenticatedRoutes />}>
        <Route element={<Login />} path='/login' />
        <Route element={<Register />} path='/register' />
      </Route>

      <Route element={<NavbarLayout />}>
        <Route element={<AuthenticatedRoutes />}>
          <Route element={<Home />} path='/home' />
          <Route element={<Home />} path='/' />
          <Route element={<Analytics />} path='/analytics' />
          <Route element={<AnalyticsSite />} path='/analytics/:siteId' />
          <Route element={<UserManagement />} path='/user-management' />
          <Route element={<Utilities />} path='/utilities' />
        </Route>

        <Route element={<Map />} path='/map' />
        <Route element={<MapSite />} path='/map/:siteId' />
      </Route>
    </Routes>
  )
}

export default MainLayout
