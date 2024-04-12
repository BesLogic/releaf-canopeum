import { appRoutes } from '@constants/routes.constant'
import { useContext, useEffect, useState } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import useLogin from '../hooks/LoginHook'
import Analytics from '../pages/Analytics'
import AnalyticsSite from '../pages/AnalyticsSite'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Map from '../pages/Map'
import Register from '../pages/Register'
import SiteSocialPage from '../pages/SiteSocialPage'
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
      ? <Navigate to={appRoutes.home} />
      : <Outlet />
  )
}

const AuthenticatedRoutes = () => {
  const { isAuthenticated } = useContext(AuthenticationContext)

  return (
    isAuthenticated
      ? <Outlet />
      : <Navigate to={appRoutes.login} />
  )
}

const MainLayout = () => {
  const { authenticateUser } = useLogin()
  const [sessionStorageChecked, setSessionStorageChecked] = useState(false)

  // Try authenticating user on app start if token was saved in sessionStorage
  useEffect(() => {
    authenticateUser()
    // TODO(NicolasDontigny): This is a temporary workaround, because when loading the app,
    // We first check in sessionStorage if the user is logged in, but the route guards immediately redirect to /login
    setSessionStorageChecked(true)
  }, [authenticateUser])

  return (
    <Routes>
      {sessionStorageChecked && (
        <>
          <Route element={<NotAuthenticatedRoutes />}>
            <Route element={<Login />} path='/login' />
            <Route element={<Register />} path='/register' />
          </Route>

          <Route element={<NavbarLayout />}>
            <Route element={<AuthenticatedRoutes />}>
              <Route element={<Home />} path='/home' />
              <Route element={<Home />} path='/' />
              <Route element={<Analytics />} path='/sites' />
              <Route element={<AnalyticsSite />} path='/sites/:siteId' />
              <Route element={<SiteSocialPage />} path='/sites/:siteId/social' />
              <Route element={<UserManagement />} path='/user-management' />
              <Route element={<Utilities />} path='/utilities' />
            </Route>

            <Route element={<Map />} path='/map' />
          </Route>
        </>
      )}
    </Routes>
  )
}

export default MainLayout
