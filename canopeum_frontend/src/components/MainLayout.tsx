import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { AuthenticationContext } from './context/AuthenticationContext'
import Navbar from './Navbar'
import TermsAndPolicies from '@components/settings/TermsAndPolicies'
import { appRoutes } from '@constants/routes.constant'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import Analytics from '@pages/Analytics'
import AnalyticsSite from '@pages/AnalyticsSite'
import Home from '@pages/Home'
import LoadingPage from '@pages/LoadingPage'
import Login from '@pages/Login'
import MapPage from '@pages/MapPage'
import PostDetailsPage from '@pages/PostDetailsPage'
import Register from '@pages/Register'
import SiteSocialPage from '@pages/SiteSocialPage'
import UserManagement from '@pages/UserManagement'
import Utilities from '@pages/Utilities'

const NavbarLayout = () => (
  <div className='d-flex flex-column vh-100'>
    <Navbar />
    {/* TODO: Can we do better than hardcode a number relating to the expected header size here? */}
    <div className='' style={{ height: 'calc(100vh - 62px)' }}>
      <Outlet />
    </div>
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
  const { isAuthenticated, isSessionLoaded } = useContext(AuthenticationContext)

  if (!isSessionLoaded) {
    return <LoadingPage />
  }

  return (
    isAuthenticated
      ? <Outlet />
      : <Navigate to={appRoutes.login} />
  )
}

const MainLayout = () => {
  const { initAuth } = useContext(AuthenticationContext)
  const { t: translate } = useTranslation()
  const { getErrorMessage } = useErrorHandling()

  // Try authenticating user on app start if token was saved in storage
  useEffect(() => {
    const runInitAuth = async () => initAuth()

    runInitAuth().catch((error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        translate('auth.user-token-not-found'),
      )
      console.error(errorMessage)
    })
  }, [])

  return (
    <Routes>
      <Route element={<NotAuthenticatedRoutes />}>
        <Route element={<Login />} path='/login' />
        <Route element={<Register />} path='/register' />
      </Route>

      <Route element={<NavbarLayout />}>
        <Route element={<AuthenticatedRoutes />}>
          <Route element={<Home />} path='/home' />
          <Route element={<Analytics />} path='/sites' />
          <Route element={<AnalyticsSite />} path='/sites/:siteId' />
          <Route element={<UserManagement />} path='/user-management/*' />
          <Route element={<Utilities />} path='/utilities' />
        </Route>

        {/* The following routes are accessible to Visitors without any authentication */}
        <Route element={<TermsAndPolicies />} path='/terms-and-policies' />
        <Route element={<SiteSocialPage />} path='/sites/:siteId/social' />
        <Route element={<PostDetailsPage />} path='/posts/:postId' />
        <Route element={<MapPage />} path='/map' />

        {/* Fallback route */}
        <Route
          element={<Navigate replace to='/map' />}
          path='*'
        />
      </Route>
    </Routes>
  )
}

export default MainLayout
